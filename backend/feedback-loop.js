const { 
    waitForLatestConversation, 
    getConversationDetails, 
    getCurrentAgentInfo 
} = require('./elevenlabs-client');

// Simple version counter (in production, you'd use a database)
let versionCounter = 1;

/**
 * Analyze sentiment of user messages to determine emotional state
 * @param {Array} userMessages - Array of user message objects
 * @returns {Object} Sentiment analysis results
 */
function analyzePatientSentiment(userMessages) {
    if (!userMessages || userMessages.length === 0) {
        return { primaryEmotion: 'neutral', urgency: 'low', confidence: 0.5 };
    }

    // Keywords for different emotional states
    const emotionKeywords = {
        anxious: ['worried', 'concerned', 'nervous', 'anxious', 'stress', 'urgent', 'emergency', 'pain', 'hurts'],
        frustrated: ['frustrated', 'annoyed', 'upset', 'difficult', 'problem', 'issue', 'trouble', 'complicated'],
        calm: ['okay', 'fine', 'good', 'sure', 'alright', 'comfortable', 'relaxed'],
        urgent: ['asap', 'soon', 'quick', 'fast', 'immediate', 'emergency', 'urgent', 'critical']
    };

    let emotionScores = { anxious: 0, frustrated: 0, calm: 0, urgent: 0 };
    let totalWords = 0;

    userMessages.forEach(msg => {
        const words = msg.message.toLowerCase().split(/\s+/);
        totalWords += words.length;

        Object.keys(emotionKeywords).forEach(emotion => {
            emotionKeywords[emotion].forEach(keyword => {
                if (words.some(word => word.includes(keyword))) {
                    emotionScores[emotion]++;
                }
            });
        });
    });

    // Normalize scores
    const normalizedScores = {};
    Object.keys(emotionScores).forEach(emotion => {
        normalizedScores[emotion] = totalWords > 0 ? emotionScores[emotion] / totalWords : 0;
    });

    // Determine primary emotion
    const primaryEmotion = Object.keys(normalizedScores).reduce((a, b) => 
        normalizedScores[a] > normalizedScores[b] ? a : b
    );

    // Determine urgency level
    const urgency = normalizedScores.urgent > 0.1 ? 'high' : 
                   normalizedScores.anxious > 0.05 ? 'medium' : 'low';

    // Calculate confidence in analysis
    const maxScore = Math.max(...Object.values(normalizedScores));
    const confidence = Math.min(maxScore * 10, 1.0); // Scale and cap at 1.0

    return {
        primaryEmotion,
        urgency,
        confidence,
        scores: normalizedScores
    };
}

/**
 * Analyze appointment type from conversation messages
 * @param {Array} userMessages - Array of user message objects
 * @returns {Object} Appointment type analysis results
 */
function analyzeAppointmentType(userMessages) {
    if (!userMessages || userMessages.length === 0) {
        return { primaryType: 'general', confidence: 0.5, specializations: [] };
    }

    // Keywords for different appointment types
    const appointmentKeywords = {
        checkup: ['checkup', 'physical', 'exam', 'annual', 'routine', 'preventive', 'screening'],
        consultation: ['consultation', 'consult', 'discuss', 'talk', 'meet', 'appointment'],
        emergency: ['emergency', 'urgent', 'pain', 'hurts', 'severe', 'critical', 'immediate'],
        followup: ['follow up', 'follow-up', 'followup', 'recheck', 'revisit', 'return'],
        specialist: ['specialist', 'cardiologist', 'dermatologist', 'orthopedic', 'neurologist', 'psychiatrist'],
        procedure: ['procedure', 'surgery', 'operation', 'test', 'scan', 'x-ray', 'mri', 'blood work'],
        prescription: ['prescription', 'medication', 'medicine', 'refill', 'dosage', 'side effects'],
        vaccination: ['vaccine', 'vaccination', 'shot', 'immunization', 'flu shot', 'covid']
    };

    let typeScores = {};
    let totalWords = 0;

    // Initialize scores
    Object.keys(appointmentKeywords).forEach(type => {
        typeScores[type] = 0;
    });

    userMessages.forEach(msg => {
        const words = msg.message.toLowerCase().split(/\s+/);
        totalWords += words.length;

        Object.keys(appointmentKeywords).forEach(type => {
            appointmentKeywords[type].forEach(keyword => {
                if (words.some(word => word.includes(keyword))) {
                    typeScores[type]++;
                }
            });
        });
    });

    // Normalize scores
    const normalizedScores = {};
    Object.keys(typeScores).forEach(type => {
        normalizedScores[type] = totalWords > 0 ? typeScores[type] / totalWords : 0;
    });

    // Determine primary appointment type
    const primaryType = Object.keys(normalizedScores).reduce((a, b) => 
        normalizedScores[a] > normalizedScores[b] ? a : b
    );

    // Calculate confidence
    const maxScore = Math.max(...Object.values(normalizedScores));
    const confidence = Math.min(maxScore * 15, 1.0); // Scale and cap at 1.0

    // Get specializations (types with scores > 0.01)
    const specializations = Object.keys(normalizedScores)
        .filter(type => normalizedScores[type] > 0.01)
        .sort((a, b) => normalizedScores[b] - normalizedScores[a]);

    return {
        primaryType,
        confidence,
        specializations,
        scores: normalizedScores
    };
}

/**
 * Generate tone adjustment instructions based on sentiment analysis
 * @param {Object} sentiment - Sentiment analysis results
 * @returns {string} Tone adjustment instructions
 */
function generateToneAdjustment(sentiment) {
    const { primaryEmotion, urgency, confidence } = sentiment;
    
    let toneInstructions = '';
    
    switch (primaryEmotion) {
        case 'anxious':
            toneInstructions = `
TONE ADJUSTMENT: Patient shows anxiety - prioritize reassurance and clarity.
- Lead with empathy: "I understand this can be stressful..."
- Provide extra reassurance about appointment availability
- Use calming language and avoid medical jargon
- Offer to explain procedures in detail if needed`;
            break;
            
        case 'frustrated':
            toneInstructions = `
TONE ADJUSTMENT: Patient shows frustration - focus on problem-solving and efficiency.
- Acknowledge their concerns directly: "I can see this has been challenging..."
- Prioritize quick, clear solutions
- Offer alternative options when possible
- Keep responses concise and action-oriented`;
            break;
            
        case 'urgent':
            toneInstructions = `
TONE ADJUSTMENT: Patient shows urgency - emphasize speed and availability.
- Prioritize immediate solutions: "Let me help you right away..."
- Highlight same-day or next-day availability
- Be extra responsive and efficient
- Offer to expedite the process where possible`;
            break;
            
        default: // calm or neutral
            toneInstructions = `
TONE ADJUSTMENT: Patient appears calm - maintain professional, friendly approach.
- Continue with warm, professional tone
- Provide comprehensive information
- Take time to ensure all needs are met`;
    }

    // Add urgency-specific instructions
    if (urgency === 'high') {
        toneInstructions += `
URGENCY HANDLING: High urgency detected - prioritize immediate assistance.
- Offer earliest available appointments
- Provide clear next steps
- Be extra responsive to time-sensitive requests`;
    }

    return toneInstructions;
}

/**
 * Generate appointment-specific guidance based on detected type
 * @param {Object} appointmentAnalysis - Appointment type analysis results
 * @returns {string} Appointment-specific guidance
 */
function generateAppointmentGuidance(appointmentAnalysis) {
    const { primaryType, confidence, specializations } = appointmentAnalysis;
    
    let guidance = '';
    
    switch (primaryType) {
        case 'emergency':
            guidance = `
APPOINTMENT SPECIALIZATION: Emergency care detected - prioritize immediate assistance.
- Emphasize urgent care availability and wait times
- Provide clear instructions for emergency protocols
- Offer same-day or walk-in options when possible
- Be extra responsive to time-sensitive requests
- Guide patients to appropriate emergency services if needed`;
            break;
            
        case 'checkup':
            guidance = `
APPOINTMENT SPECIALIZATION: Routine checkup detected - focus on preventive care.
- Highlight comprehensive health assessments
- Mention preparation requirements (fasting, etc.)
- Discuss follow-up scheduling for annual visits
- Provide information about preventive screenings
- Offer wellness and lifestyle recommendations`;
            break;
            
        case 'specialist':
            guidance = `
APPOINTMENT SPECIALIZATION: Specialist consultation detected - provide detailed guidance.
- Explain referral process if needed
- Provide specialist-specific preparation instructions
- Mention typical consultation duration and format
- Offer information about specialist credentials
- Discuss insurance and coverage considerations`;
            break;
            
        case 'procedure':
            guidance = `
APPOINTMENT SPECIALIZATION: Medical procedure detected - emphasize preparation and safety.
- Provide detailed pre-procedure instructions
- Mention fasting, medication, and clothing requirements
- Discuss post-procedure care and recovery
- Explain procedure duration and facility information
- Address patient concerns about safety and comfort`;
            break;
            
        case 'followup':
            guidance = `
APPOINTMENT SPECIALIZATION: Follow-up appointment detected - maintain continuity of care.
- Reference previous visit details when possible
- Discuss progress since last appointment
- Mention any test results or updates
- Provide specific follow-up recommendations
- Ensure appropriate timing for follow-up care`;
            break;
            
        case 'prescription':
            guidance = `
APPOINTMENT SPECIALIZATION: Prescription/medication detected - focus on medication management.
- Discuss medication refill processes
- Provide information about dosage and timing
- Mention potential side effects and monitoring
- Offer pharmacy and insurance guidance
- Address medication-related concerns`;
            break;
            
        default: // consultation or general
            guidance = `
APPOINTMENT SPECIALIZATION: General consultation detected - provide comprehensive support.
- Offer flexible scheduling options
- Provide general preparation guidelines
- Discuss typical consultation format
- Address common patient questions
- Ensure clear communication about next steps`;
    }

    // Add multi-specialization guidance if multiple types detected
    if (specializations.length > 1) {
        guidance += `
MULTI-SPECIALIZATION: Multiple appointment types detected (${specializations.join(', ')}).
- Adapt approach based on primary concern
- Provide comprehensive guidance covering all detected needs
- Ensure coordination between different appointment types
- Offer integrated scheduling when possible`;
    }

    return guidance;
}

/**
 * Generate improved system prompt based on conversation
 * HACKERS: CUSTOMIZE THIS FUNCTION FOR YOUR HACKATHON PROJECT
 * @param {string} currentPrompt - Current system prompt
 * @param {Array} transcript - Conversation transcript array
 * @param {Object} conversationData - Full conversation data from ElevenLabs
 * @returns {string} Improved system prompt
 */
function generateImprovedPrompt(currentPrompt, transcript, conversationData) {
    // Remove any existing version tracking, tone adjustments, and appointment guidance
    let newPrompt = currentPrompt.replace(/\[Version \d+.*?\]/g, '').trim();
    newPrompt = newPrompt.replace(/TONE ADJUSTMENT:.*?(?=\n\n|$)/gs, '').trim();
    newPrompt = newPrompt.replace(/URGENCY HANDLING:.*?(?=\n\n|$)/gs, '').trim();
    newPrompt = newPrompt.replace(/APPOINTMENT SPECIALIZATION:.*?(?=\n\n|$)/gs, '').trim();
    newPrompt = newPrompt.replace(/MULTI-SPECIALIZATION:.*?(?=\n\n|$)/gs, '').trim();
    
    // Extract user messages for analysis
    const userMessages = transcript.filter(msg => msg.role === 'user');
    const agentMessages = transcript.filter(msg => msg.role === 'agent');
    const duration = conversationData.metadata?.call_duration_secs || 0;
    
    // Step 1: Analyze patient sentiment (PRESERVING STEP 1)
    const sentiment = analyzePatientSentiment(userMessages);
    console.log(`🎭 Sentiment Analysis: ${sentiment.primaryEmotion} (${sentiment.urgency} urgency, ${Math.round(sentiment.confidence * 100)}% confidence)`);
    
    // Step 2: Analyze appointment type (NEW STEP 2)
    const appointmentAnalysis = analyzeAppointmentType(userMessages);
    console.log(`🏥 Appointment Analysis: ${appointmentAnalysis.primaryType} (${Math.round(appointmentAnalysis.confidence * 100)}% confidence, specializations: ${appointmentAnalysis.specializations.join(', ')})`);
    
    // Step 3: Generate tone adjustment instructions (STEP 1)
    const toneAdjustment = generateToneAdjustment(sentiment);
    
    // Step 4: Generate appointment guidance (STEP 2)
    const appointmentGuidance = generateAppointmentGuidance(appointmentAnalysis);
    
    // Step 5: Combine all enhancements
    newPrompt += `\n\n${toneAdjustment}`;
    newPrompt += `\n\n${appointmentGuidance}`;
    
    // Step 6: Add version tracking with comprehensive insights
    newPrompt += `\n\n[Version ${versionCounter + 1}] - Enhanced with sentiment analysis and appointment specialization:
- Conversation duration: ${duration} seconds
- User messages: ${userMessages.length}
- Agent messages: ${agentMessages.length}
- Patient emotion: ${sentiment.primaryEmotion} (${sentiment.urgency} urgency)
- Sentiment confidence: ${Math.round(sentiment.confidence * 100)}%
- Appointment type: ${appointmentAnalysis.primaryType}
- Appointment confidence: ${Math.round(appointmentAnalysis.confidence * 100)}%
- Specializations: ${appointmentAnalysis.specializations.join(', ')}
- Last conversation ID: ${conversationData.conversation_id}`;
    
    return newPrompt;
}

/**
 * Main feedback loop processing function
 * This is called when a conversation ends
 * @param {string|null} currentPrompt - The current prompt to improve (if any)
 * @returns {Promise<Object>} Result with new version info and full prompt
 */
async function processConversationFeedback(currentPrompt = null) {
    try {
        console.log('🔄 Starting feedback loop processing...');
        
        // Step 1: Wait for and get the latest conversation
        const conversation = await waitForLatestConversation();
        if (!conversation) {
            throw new Error('No conversation found to analyze');
        }
        
        console.log(`📞 Found conversation: ${conversation.conversation_id}`);
        
        // Step 2: Get detailed conversation data
        const conversationDetails = await getConversationDetails(conversation.conversation_id);
        // Step 3: Get current agent prompt if not provided
        if (!currentPrompt) {
            const currentAgent = await getCurrentAgentInfo();
            currentPrompt = currentAgent.conversation_config?.agent?.prompt?.prompt || "You are a helpful assistant.";
        }
        
        // Step 4: Extract conversation transcript
        const transcript = conversationDetails.transcript || [];
        console.log(transcript)
        const userMessages = transcript.filter(msg => msg.role === 'user');
        const agentMessages = transcript.filter(msg => msg.role === 'agent');
        
        console.log(`🔧 Conversation analyzed - ${transcript.length} messages, ${userMessages.length} user, ${agentMessages.length} agent`);
        
        // Step 5: Generate improved prompt (THIS IS WHERE HACKERS CUSTOMIZE)
        const improvedPrompt = generateImprovedPrompt(currentPrompt, transcript, conversationDetails);
        
        // Step 6: Increment version and return result
        versionCounter++;
        const result = {
            version: `${versionCounter}.0`,
            description: `Enhanced based on conversation analysis`,
            conversationAnalyzed: conversation.conversation_id,
            timestamp: new Date().toISOString(),
            fullPrompt: improvedPrompt  // Return the complete new prompt
        };
        
        console.log('✅ Feedback loop completed successfully');
        console.log(`📞 Analyzed conversation: ${conversation.conversation_id}`);
        console.log(`🔄 Generated new prompt version ${result.version}`);
        console.log(`📝 New prompt length: ${improvedPrompt.length} characters`);
        
        return result;
        
    } catch (error) {
        console.error('❌ Feedback loop failed:', error);
        throw error;
    }
}

module.exports = {
    processConversationFeedback,
    generateImprovedPrompt
};