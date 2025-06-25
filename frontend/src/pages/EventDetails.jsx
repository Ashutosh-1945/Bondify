import React, { useState } from 'react'
import Header from '../components/Header'
import { useParams } from 'react-router'
import { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LabelIcon from '@mui/icons-material/Label';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ReactMarkdown from 'react-markdown';
import LinkIcon from '@mui/icons-material/Link';
import { Card, Paper } from '@mui/material';
import axios from 'axios';
import {Avatar} from '@mui/material';
function EventDetails() {
    const email = localStorage.getItem('email');
    const [userId, setUserId] = useState(); 
    const { id } = useParams(); // Retrieve event ID from URL
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setRegistered] = useState(false);
    const [isRequested, setRequested] = useState(false);
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
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/userId/${email}`);
          console.log(response.data)
          setUserId(response.data)
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
      const checkRequested = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/check-requested/${id}?email=${email}`);
          setRequested(response.data.isRequested);
        } catch (error) {
          console.error('Error checking Request:', error);
        }
      };
  
      checkRequested();
    }, [id, email]);

    useEffect(() => {
      const fetchParticipants = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/participants/${id}`);
          if (response.data.message === 'No participants found') {
            console.log(response.data.message);
            setParticipants([]);
          }
          else{
            setParticipants(response.data);
            console.log(response.data)
          }


        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.log('No participants');
            setParticipants([]); // Set an empty array if no participants
          } else {
            console.error('Error fetching participants:', error);
          }
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
        try{
          const closedEvent = await axios.post('http://localhost:3005/send-request', { 
            email, id 
          })
          console.log(closedEvent)
        }catch(err){
          console.log(err)
        }
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

  function formatPrettyDate(isoString) {
    const date = new Date(isoString);
  
    function getOrdinal(n) {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return s[(v - 20) % 10] || s[v] || s[0];
    }
  
    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();
  
    return `${day}${getOrdinal(day)} ${month} ${year}`;
  }

  return (
    <div>
      <Header />
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb:4 }}>
        <Box sx={{ width: '60%' }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{event.title}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Avatar sx={{ bgcolor: '#fb8c00', width: 40, height: 40 }}>
          {getInitials(event.username)}</Avatar>
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Hosted By:</Typography>
              <Typography variant="body2">{event.username}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ backgroundColor: '#fff7ed', paddingY: 4, display: 'flex', justifyContent: 'center', width: '100vw', minHeight: '100vh' }}>
        {/* Left Section */}
        <Box sx={{ width: '45%', padding: 3 }}>
          <img src={event.titleimageurl} alt={event.title} style={{ width: '100%', height: '325px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px', border: '2px solid #ccc' }} />
          <Box sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.8  }}>
          <ReactMarkdown>{event.description}</ReactMarkdown>
        </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Attendees ({participants.length})</Typography>
            <Box sx={{ display: 'flex', paddingY: 2, gap: 2, my: 2, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none'} }}>
              {participants.length > 0 && participants.map((participant) => (
                <Paper key={participant.participant_id} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3, minWidth: '120px' }}>
                  <Avatar sx={{ bgcolor: '#fb8c00', width: 56, height: 56 }}>
                    {getInitials(participant.username)}
                  </Avatar>
                  <Typography variant="caption" sx={{ marginTop: 1 }}>
                    {participant.userId === userId ? `${participant.username} (host)` : participant.username}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Photos({event.otherimageurls && event.otherimageurls.length})</Typography>
            <Box sx={{ display: 'flex', paddingY: 2, gap: 2, flexWrap: 'nowrap', overflowX: 'auto', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none'} }}>
              {event.otherimageurls && event.otherimageurls.length > 0 ? (
                event.otherimageurls.map((photo, index) => (
                  <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '120px' }}>
                    <img src={photo} alt="other images" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px', border: '2px solid #ccc' }} />
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'gray' }}>No photos available</Typography> // You can display a message if no photos
              )}
            </Box>
          </Box>

        </Box>
        

        {/* Right Section */}
        <Box sx={{ width: '20%', paddingY: 3, paddingX: 3 }}>
          <Paper sx={{  padding: 2, mb: 2 }}>
            <Box sx={{paddingY:1 }} display="flex" alignItems="center">
              <CalendarMonthIcon sx={{ fontSize: 30, color: "gray", mr: 1 }} />
              <Typography variant="body2">{formatPrettyDate(event.eventdate)}</Typography>
            </Box>
            <Box sx={{paddingY:1 }} display="flex" alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 30, color: "gray", mr: 1 }} />
              <Typography variant="body2">{event.fromtime}  -  {event.totime}</Typography>
            </Box>
            {event.eventtype === "online" ? 
            <Box display="flex" alignItems="center">
              <LinkIcon sx={{ fontSize: 30, color: "gray", mr: 1 }} />
              <Typography variant="body2"></Typography>
            </Box>:
              <Box display="flex" alignItems="center">
              <LinkIcon sx={{ fontSize: 30, color: "gray", mr: 1 }} />
              <Typography variant="body2">{event.place}</Typography>
            </Box>}
            <Box sx={{paddingY:1 }} display="flex" alignItems="center">
              <LabelIcon sx={{ fontSize: 30, color: "gray", mr: 1 }} />
              <Typography variant="body2">{event.category}</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(255, 255, 255, 1)', 
          borderTop: '1px solid #ccc',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <Typography>{event.title}</Typography>
        <Box>
        <Button
          variant="contained"
          sx={{ 
            backgroundColor: "#f57c00", 
            color: "#fff", 
            mr: 2,
            "&:hover": {
              backgroundColor: "#ef6c00"
            }
          }}
        >
          Share
        </Button>

        <Button
          onClick={handleAttend}
          variant={isRegistered ? 'contained' : 'outlined'}
          color={isRegistered ? 'success' : isRequested ? 'warning' : 'error'}
          disabled={isRegistered || isRequested}
        >
          {isRegistered ? 'Registered' : isRequested ? 'Requested' : 'Register'}
        </Button>

        </Box>
      </Box>
    </div>
  );
}

export default EventDetails;