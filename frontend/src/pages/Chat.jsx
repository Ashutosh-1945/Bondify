import React, { useState } from 'react';
import ChatSidebar from '../components/chatSidebar';
import ChatWindow from '../components/ChatWindow';
import { Box } from '@mui/material';

const App = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  const handleSelectChat = (chat) => {
    setSelectedChat(chat);
  };

  return (  // ✅ ADD this return statement!
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar should not shrink */}
      <Box sx={{ width: 340, flexShrink: 0 }}>
        <ChatSidebar onSelectChat={handleSelectChat} />
      </Box>

      {/* Chat Window expands to fill remaining space */}
      <Box sx={{ flexGrow: 1 }}>
        {selectedChat && (
          <ChatWindow
            chat={selectedChat}
            onClose={() => setSelectedChat(null)}
          />
        )}
      </Box>
    </Box>
  );
};

export default App;
