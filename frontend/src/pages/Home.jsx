import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Header from '../components/Header';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3005/events');
        console.log(response)
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

const handleClick = (eventId) => {
  navigate(`/event/${eventId}`);
}

  return (
    <>
      <Header />
      <div style={{ display: 'flex', height: '100vh' }}>
        <div style={{ flex: 0.1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CalendarMonthIcon style={{ fontSize: 80, color: '#ccc' }} />
        </div>
        <div style={{ flex: 0.9, padding: '20px', overflowY: 'auto' }}>
          {events.map((event) => (
            <Card onClick={() => handleClick(event.id)} key={event.id} sx={{ maxWidth: 600, marginBottom: '20px' }}>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">R</Avatar>}
                title={event.title}
                subheader={event.eventdate}
              />
              <CardMedia
                component="img"
                height="194"
                image={event.image}
                alt={event.title}
              />
              <CardContent>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{event.description}</Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
