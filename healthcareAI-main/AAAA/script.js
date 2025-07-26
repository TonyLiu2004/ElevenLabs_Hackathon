import { Conversation } from '@elevenlabs/client';


// State
let conversation = null;
let currentState = 'ready'; // ready, connecting, connected, processing
let completedConversations = 0;
let evolvedPrompt = null; // Store the evolved system prompt



// Get signed URL from backend
async function getSignedUrl() {
    try {
        // Always use GET - overrides are passed when starting conversation, not when getting signed URL
        console.log('🔧 Requesting signed URL from backend');
        const response = await fetch('http://localhost:3001/api/get-signed-url');
        
        if (!response.ok) {
            throw new Error(`Failed to get signed URL: ${response.statusText}`);
        }
        
        const data = await response.json();
        return data.signedUrl;
    } catch (error) {
        console.error('Error getting signed URL:', error);
        throw error;
    }
}

// Start conversation
export async function startConversation() {
    console.log('🔧 Starting conversation...');
    try {
        currentState = 'connecting';
        

        // Request microphone permission
        await navigator.mediaDevices.getUserMedia({ audio: true });

        // Get signed URL (always the same, overrides come later)
        const signedUrl = await getSignedUrl();

        // Prepare conversation config with overrides if we have evolved prompt
        const conversationConfig = {
            signedUrl,
            overrides: {
                transcript: {
                    mode: 'full'
                },
                agent: evolvedPrompt ? {
                    prompt: {
                        prompt: evolvedPrompt
                    }
                } : undefined
            },
            onConnect: () => {
                currentState = 'connected';
            },
            onDisconnect: () => {
                handleConversationEnd();
            },
            onError: (error) => {
                console.error('Conversation error:', error);
                currentState = 'ready';
            },
            onModeChange: (mode) => {
                // Optional UI updates
            },
            onTranscript: (transcriptEvent) => {
                console.log('📝 Transcript event:', transcriptEvent);
                const { user, agent } = transcriptEvent;
                if (user) console.log(`🧑 You said: ${user.text}`);
                if (agent) console.log(`🤖 Agent said: ${agent.text}`);
            }
        };


        // Start conversation
        conversation = await Conversation.startSession(conversationConfig);
    } catch (error) {
        console.error('Failed to start conversation:', error);
        currentState = 'ready';
        
        alert('Failed to start conversation. Please check your microphone permissions and try again.');
    }
}

// End conversation
async function endConversation() {
    if (conversation) {
        await conversation.endSession();
        conversation = null;
    }
}

// Handle conversation end and trigger feedback loop
async function handleConversationEnd() {
    currentState = 'processing';
    

    try {
        // Notify backend that conversation ended and pass current prompt
        const requestBody = {};
        if (evolvedPrompt) {
            requestBody.currentPrompt = evolvedPrompt;
        }
        
        console.log(`📞 Conversation ended, starting analysis${evolvedPrompt ? ' with current prompt' : ' (first conversation)'}`);
        
        const response = await fetch('http://localhost:3001/api/conversation-ended', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            throw new Error('Failed to notify backend of conversation end');
        }

        // Poll for agent status and new prompt
        await pollForAgentReady();
        
    } catch (error) {
        console.error('Error in feedback loop:', error);
        currentState = 'ready';
        
    }
}



// Initialize UI


// Load initial agent status
async function loadInitialStatus() {
    try {
        const response = await fetch('http://localhost:3001/api/agent-status');
        const data = await response.json();
        
        // Check if we have an evolved prompt from a previous session
        if (data.fullPrompt) {
            evolvedPrompt = data.fullPrompt;
            console.log(`🔄 Restored evolved prompt from previous session (${evolvedPrompt.length} characters)`);
        }
    } catch (error) {
        console.error('Failed to load initial agent status:', error);
    }
}

loadInitialStatus();

// // Debug functions (can be called from browser console)
// window.debugAgent = {
//     showEvolvedPrompt: () => {
//         if (evolvedPrompt) {
//             console.log('Current evolved prompt:');
//             console.log(evolvedPrompt);
//             return evolvedPrompt;
//         } else {
//             console.log('No evolved prompt available yet');
//             return null;
//         }
//     },
//     clearEvolvedPrompt: () => {
//         evolvedPrompt = null;
//         console.log('Evolved prompt cleared');
//     },
//     getPromptStats: () => {
//         return {
//             hasEvolvedPrompt: !!evolvedPrompt,
//             promptLength: evolvedPrompt ? evolvedPrompt.length : 0,
//             conversationsCompleted: completedConversations
//         };
//     }
// };