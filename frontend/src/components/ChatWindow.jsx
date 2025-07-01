import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import axios from 'axios';

const ChatWindow = ({ chat, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const email = localStorage.getItem('email');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!chat) return;
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3005/api/messages/${chat.event_id}`);
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      const response = await axios.post(`http://localhost:3005/api/Send_Message`, {
        email: email,
        chatId: chat.event_id,
        content: newMessage.trim()
      });
      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
        color: '#333',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: '16px 24px',
          backgroundColor: '#ffffff',
          borderBottom: '2px solid #FF5722',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="700"
          color="#FF5722"
          noWrap
        >
          {chat?.group_name || 'Chats'}
        </Typography>
      </Box>

      {/* Messages */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          padding: '16px 24px',
        }}
      >
        {messages
          .filter(msg => msg.content?.trim())
          .map((msg, index) => {
            const isOwn = msg.sender_email === email;
            const prevSender = index > 0 ? messages[index - 1].sender_email : null;
            const showUsername = !isOwn && msg.sender_email !== prevSender;

            return (
              <Box
                key={msg.id}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isOwn ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  ml: isOwn ? 'auto' : 0,
                  mr: isOwn ? 0 : 'auto',
                }}
              >
                {showUsername && (
                  <Typography
                    variant="caption"
                    sx={{ color: '#666', fontWeight: 600, mb: 0.5 }}
                  >
                    {msg.users?.username ?? 'Unknown'}
                  </Typography>
                )}

                <Paper
                  elevation={3}
                  sx={{
                    padding: '12px 20px',
                    backgroundColor: isOwn ? '#FF5722' : '#ffffff',
                    color: isOwn ? '#fff' : '#333',
                    borderRadius: isOwn
                      ? '20px 20px 4px 20px'
                      : '20px 20px 20px 4px',
                    border: isOwn ? 'none' : '1px solid #ddd',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input area */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          alignItems: 'center',
          padding: '16px 24px',
          borderTop: '2px solid #FF5722',
          backgroundColor: '#ffffff',
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
          size="medium"
          sx={{
            backgroundColor: '#fafafa',
            borderRadius: '25px',
            input: { color: '#333' },
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#FF5722',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#FF5722',
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={sendMessage}
          disabled={!newMessage.trim()}
          sx={{
            borderRadius: '25px',
            padding: '10px 24px',
            backgroundColor: '#FF5722',
            fontWeight: 600,
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#e64a19',
              boxShadow: '0 4px 10px rgba(255, 87, 34, 0.4)',
            },
          }}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default ChatWindow;
