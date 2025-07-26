require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getSignedUrl, getCurrentAgentInfo } = require('./elevenlabs-client');
const { processConversationFeedback } = require('./feedback-loop');

const app = express();
const PORT = process.env.PORT || 3001;

const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require(path.resolve(__dirname, './Firebase/elevenlabs-hackathon-b13ce-firebase-adminsdk-fbsvc-b58339da70.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Middleware
app.use(cors());
app.use(express.json());

// Global state
let agentState = {
    status: 'ready', // ready, processing
    version: '1.0',
    description: 'Initial agent configuration',
    conversationsCompleted: 0,
    fullPrompt: null // Store the evolved prompt
};

// Routes

app.post('/api/appointments', async (req, res) => {
  try {
    const data = req.body;
    console.log("appointment: ", req.body)

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Missing appointment data' });
    }

    // check if appointment time is already booked

    // Query for existing appointment
    const existingSnapshot = await db.collection('Appointments')
      .where('doctorId', '==', data.doctorId)
      .where('date', '==', data.date)
      .where('time', '==', data.time)
      .get();

    if (!existingSnapshot.empty) {
        console.log("Appointment time already booked: ", data.date, data.time)
        return res.status(409).json({ error: 'Appointment time already booked' });
    }

    //add appointment
    const appointmentRef = await db.collection('Appointments').add({
      ...data,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ id: appointmentRef.id, message: 'Appointment created successfully' });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
});

// Test Firebase connection
// app.get('/api/test-firebase', async (req, res) => {
//   try {
//     await db.collection('Test').doc('ConnectionCheck').set({
//       status: 'connected',
//       timestamp: new Date().toISOString(),
//     });
//     res.status(200).send('✅ Firebase connection successful.');
//   } catch (error) {
//     console.error('❌ Firebase connection failed:', error);
//     res.status(500).send('❌ Firebase connection failed.');
//   }
// });


/**
 * GET /api/get-signed-url
 * Returns a signed URL for starting a conversation with the current agent
 */
app.get('/api/get-signed-url', async (req, res) => {
    try {
        const signedUrl = await getSignedUrl();
        res.json({ signedUrl });
    } catch (error) {
        console.error('Error getting signed URL:', error);
        res.status(500).json({ 
            error: 'Failed to generate signed URL',
            message: error.message 
        });
    }
});

/**
 * POST /api/conversation-ended
 * Triggered when a conversation ends, starts the feedback loop processing
 * Accepts optional current prompt to improve upon
 */
app.post('/api/conversation-ended', async (req, res) => {
    try {
        console.log('📞 Conversation ended, starting feedback loop...');
        const { currentPrompt } = req.body;
        
        // Set agent to processing state
        agentState.status = 'processing';
        agentState.description = 'Analyzing conversation and improving...';
        agentState.fullPrompt = null; // Clear previous prompt during processing
        
        // Acknowledge the request immediately
        res.json({ 
            message: 'Feedback loop started',
            status: agentState.status 
        });

        // Start feedback loop processing in background
        processConversationFeedback(currentPrompt)
            .then((result) => {
                // Update agent state with new version and full prompt
                agentState.status = 'ready';
                agentState.version = result.version;
                agentState.description = result.description;
                agentState.conversationsCompleted++;
                agentState.fullPrompt = result.fullPrompt; // Store the complete evolved prompt
                
                console.log(`✅ Agent updated to version ${result.version}`);
                console.log(`📝 New prompt ready (${result.fullPrompt.length} characters)`);
            })
            .catch((error) => {
                console.error('❌ Feedback loop failed:', error);
                // Reset to ready state even if processing failed
                agentState.status = 'ready';
                agentState.description = 'Processing failed, using previous version';
                agentState.fullPrompt = currentPrompt; // Fallback to current prompt
            });

    } catch (error) {
        console.error('Error starting feedback loop:', error);
        agentState.status = 'ready';
        res.status(500).json({ 
            error: 'Failed to start feedback loop',
            message: error.message 
        });
    }
});

/**
 * GET /api/agent-status
 * Returns the current agent status, version info, and evolved prompt
 */
app.get('/api/agent-status', async (req, res) => {
    try {
        res.json({
            status: agentState.status,
            version: agentState.version,
            description: agentState.description,
            conversationsCompleted: agentState.conversationsCompleted,
            fullPrompt: agentState.fullPrompt // Include the evolved prompt
        });
    } catch (error) {
        console.error('Error getting agent status:', error);
        res.status(500).json({ 
            error: 'Failed to get agent status',
            message: error.message 
        });
    }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        agentStatus: agentState.status
    });
});

/**
 * GET /api/current-prompt
 * Debug endpoint to see the current base agent prompt
 */
app.get('/api/current-prompt', async (req, res) => {
    try {
        const agentInfo = await getCurrentAgentInfo();
        const basePrompt = agentInfo.conversation_config?.agent?.prompt?.prompt || "No prompt found";
        
        res.json({
            basePrompt: basePrompt,
            evolvedPrompt: agentState.fullPrompt,
            promptLength: {
                base: basePrompt.length,
                evolved: agentState.fullPrompt ? agentState.fullPrompt.length : 0
            }
        });
    } catch (error) {
        console.error('Error getting current prompt:', error);
        res.status(500).json({ 
            error: 'Failed to get current prompt',
            message: error.message 
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found',
        availableEndpoints: [
            'GET /api/get-signed-url',
            'POST /api/conversation-ended',
            'GET /api/agent-status',
            'GET /api/current-prompt',
            'GET /api/health'
        ]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 ElevenLabs Self-Improving Agent Backend running on http://localhost:${PORT}`);
    console.log(`📝 Available endpoints:`);
    console.log(`   GET  /api/get-signed-url - Get signed URL for conversation`);
    console.log(`   POST /api/conversation-ended - Trigger feedback loop`);
    console.log(`   GET  /api/agent-status - Get current agent status and evolved prompt`);
    console.log(`   GET  /api/current-prompt - Debug endpoint to view prompts`);
    console.log(`   GET  /api/health - Health check`);
    
    // Validate environment variables
    if (!process.env.ELEVENLABS_API_KEY) {
        console.warn('⚠️  WARNING: ELEVENLABS_API_KEY not found in environment variables');
    }
    if (!process.env.ELEVENLABS_AGENT_ID) {
        console.warn('⚠️  WARNING: ELEVENLABS_AGENT_ID not found in environment variables');
    }
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('👋 Shutting down gracefully...');
    process.exit(0);
});