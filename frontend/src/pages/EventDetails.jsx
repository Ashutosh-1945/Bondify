import React, { useState } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router'
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Card } from '@mui/material';
import axios from 'axios';
import {Avatar} from '@mui/material';
function EventDetails() {
    const email = localStorage.getItem('email');
    const { id } = useParams(); // Retrieve event ID from URL
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setRegistered] = useState(false);
    const [participants, setParticipants] = useState([]);

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const response = await axios.get(`http://localhost:3005/event/${id}`);
            console.log(response.data)
            setLoading(false);
            setEvent(response.data);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        };
    
        fetchEvents();
    }, [id]);

    useEffect(() => {
      const checkRegistration = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/check-registration/${id}?email=${email}`);
          setRegistered(response.data.isRegistered);
        } catch (error) {
          console.error('Error checking registration:', error);
        }
      };
  
      checkRegistration();
    }, [id, email]);

    useEffect(() => {
      const fetchParticipants = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/participants/${id}`);
          console.log(response.data)
          setParticipants(response.data);
        } catch (error) {
          console.error('Error fetching participants:', error);
        }
      };
  
      fetchParticipants();
    }, [id]);

    const handleAttend = async () => {
      if(event.registration === 'open'){
        console.log(email)
        try{
          const registration = await axios.post(`http://localhost:3005/attend/${id}`, {
            email
          }, {withCredentials: true});

          if(registration.data.success == true){
            setRegistered(true);
          }
        } catch(error){
          console.log(error);
        }
      }
      else{
        console.log("Not free");
      }
    }

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!event) {
    return <div>Event not found</div>;
  }

  const getInitials = (name) => {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div>
      <Header />

      {/* Event Title and Description */}
      <Typography variant="h4" sx={{ mt: 3, mb: 1 }}>{event.title}</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>{event.description}</Typography>

      {/* Participants Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, padding: 2 }}>
        {participants.map((participant) => (
          <Box key={participant.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: '#3f51b5', width: 56, height: 56 }}>{getInitials(participant.username)}</Avatar>
            <Typography variant="caption" sx={{ marginTop: 1 }}>{participant.username}</Typography>
          </Box>
        ))}
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#f0f0f0',
          borderTop: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <Typography>{event.title}</Typography>
        <Box>
          <Button variant="contained" color="primary" sx={{ mr: 2 }}>
            Share
          </Button>
          <Button
            onClick={handleAttend}
            variant="outlined"
            color={isRegistered ? 'success' : 'error'}
            disabled={isRegistered}
          >
            {isRegistered ? 'Registered' : 'Register'}
          </Button>
        </Box>
      </Box>
    </div>
  );
}

export default EventDetails;