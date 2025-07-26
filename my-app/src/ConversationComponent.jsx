import React, { useState, useEffect, useRef } from 'react';
import { Conversation } from '@elevenlabs/client';
import "./Agent.css"

export default function ConversationComponent() {
  const [currentState, setCurrentState] = useState('ready'); // ready, connecting, connected, processing
  const [completedConversations, setCompletedConversations] = useState(0);
  const [evolvedPrompt, setEvolvedPrompt] = useState(null);
  const [versionInfo, setVersionInfo] = useState('');
  const [conversationInstance, setConversationInstance] = useState(null);
  const [agentMode, setAgentMode] = useState('Ready');

  const buttonRef = useRef();

  useEffect(() => {
    loadInitialStatus();
  }, []);

  const getSignedUrl = async () => {
    const response = await fetch('http://localhost:3001/api/get-signed-url');
    if (!response.ok) throw new Error('Failed to get signed URL');
    const data = await response.json();
    return data.signedUrl;
  };

  const startConversation = async () => {
    try {
      setCurrentState('connecting');

      await navigator.mediaDevices.getUserMedia({ audio: true });
      const signedUrl = await getSignedUrl();

      const config = {
        signedUrl,
        onConnect: () => {
          setCurrentState('connected');
        },
        onDisconnect: () => {
          handleConversationEnd();
        },
        onError: (err) => {
          console.error('Conversation error:', err);
          setCurrentState('ready');
        },
        onModeChange: (mode) => {
          setAgentMode(mode.mode === 'speaking' ? 'Speaking' : 'Listening');
        },
      };

      if (evolvedPrompt) {
        config.overrides = {
          agent: {
            prompt: { prompt: evolvedPrompt },
          },
        };
      }

      const convo = await Conversation.startSession(config);
      setConversationInstance(convo);
    } catch (err) {
      console.error('Start conversation failed:', err);
      setCurrentState('ready');
      alert('Check microphone permissions and try again.');
    }
  };

  const endConversation = async () => {
    if (conversationInstance) {
      await conversationInstance.endSession();
      setConversationInstance(null);
    }
  };

  const handleConversationEnd = async () => {
    setCurrentState('processing');

    try {
      const body = evolvedPrompt ? { currentPrompt: evolvedPrompt } : {};

      const response = await fetch('http://localhost:3001/api/conversation-ended', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Notify backend failed');

      await pollForAgentReady();
    } catch (err) {
      console.error('Conversation end error:', err);
      setCurrentState('ready');
    }
  };

  const pollForAgentReady = async () => {
    let attempts = 0;

    const poll = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/agent-status');
        const data = await res.json();

        if (data.status === 'ready') {
          setCompletedConversations(prev => prev + 1);
          setVersionInfo(`Version ${data.version} - ${data.description}`);

          if (data.fullPrompt) {
            setEvolvedPrompt(data.fullPrompt);
          }

          setCurrentState('ready');
        } else if (attempts++ < 30) {
          setTimeout(poll, 1000);
        } else {
          throw new Error('Timeout waiting for agent');
        }
      } catch (err) {
        console.error('Polling error:', err);
        setCurrentState('ready');
      }
    };

    poll();
  };

  const loadInitialStatus = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/agent-status');
      const data = await res.json();
      setVersionInfo(`Version ${data.version} - ${data.description}`);
      if (data.fullPrompt) {
        setEvolvedPrompt(data.fullPrompt);
      }
    } catch (err) {
      console.error('Initial load failed:', err);
    }
  };

  const handleClick = async () => {
    if (currentState === 'ready') {
      await startConversation();
    } else if (currentState === 'connected') {
      await endConversation();
    }
  };

  return (
    <div className="conversation-wrapper">
      <h2>Voice Agent</h2>
      <div className="status">
        <p>Status: <strong>{currentState}</strong></p>
        <p>Agent Mode: <strong>{agentMode}</strong></p>
        <p>{versionInfo}</p>
        <p>Conversations completed: {completedConversations}</p>
      </div>
      <button ref={buttonRef} onClick={handleClick} disabled={currentState === 'connecting' || currentState === 'processing'}>
        {currentState === 'ready' && 'Start Conversation'}
        {currentState === 'connected' && 'End Conversation'}
        {(currentState === 'connecting' || currentState === 'processing') && 'Please wait...'}
      </button>
    </div>
  );
}
