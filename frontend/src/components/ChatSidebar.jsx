import React, { useState, useEffect } from 'react';
import { Box, Avatar, Typography } from '@mui/material';
import axios from 'axios';

const ChatSidebar = ({ onSelectChat }) => {
  const email = localStorage.getItem('email');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`http://localhost:3005/api/groups/${email}`);
        setGroups(res.data);
      } catch (err) {
        console.error('Failed to load group chats:', err);
      }
    };

    fetchGroups();
  }, [email]);

  const handleGroupSelect = (group) => {
    setSelectedGroup(group);
    onSelectChat(group);
  };

  return (
    <Box
      sx={{
        width: 360,
        borderRight: '2px solid #FF5722',
        height: '100vh',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          padding: '16px 24px',
          backgroundColor: '#FF5722',
          borderBottom: '2px solid #e64a19',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
          userSelect: 'none',
        }}
      >
        <Typography
          variant="h6"
          fontWeight="700"
          color="white"
          noWrap
        >
          Chats
        </Typography>
      </Box>

      {/* Group chat list */}
      {groups.map(group => {
        const isSelected = selectedGroup?.event_id === group.event_id;
        return (
          <Box
            key={group.event_id}
            onClick={() => handleGroupSelect(group)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: '12px 24px',
              cursor: 'pointer',
              backgroundColor: isSelected ? '#ffe9e0' : 'transparent',
              border : isSelected ? '1px solid #e64a19' : 'transparent',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: isSelected ? '#ffd6c7' : '#fff1e9',
              },
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#FF5722',
                color: '#fff',
                fontWeight: '700',
              }}
            >
              {group.group_name[0].toUpperCase()}
            </Avatar>
            <Typography
              sx={{
                color: isSelected ? '#d84315' : '#1a1a1a',
                fontWeight: isSelected ? 600 : 400,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              noWrap
            >
              {group.group_name}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ChatSidebar;
