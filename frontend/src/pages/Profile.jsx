import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Avatar, Typography, Divider, Paper } from '@mui/material';
import Header from '../components/Header';
import axios from 'axios';

const Profile = () => {
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    city: '',
    gender: '',
    email: '',
    username: '',
    profilePhoto: ''
  });

  const [hostingEvents, setHostingEvents] = useState([]);
  const [participatingEvents, setParticipatingEvents] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get(`http://localhost:3005/event_host_participate/${email}`);
          console.log(response.data);
          setHostingEvents(response.data.eventHosting);
          const exclusiveEvents = response.data.eventParticipating.filter(event => 
            !response.data.eventHosting.some(hostEvent => hostEvent.id === event.event_id)
          );
          console.log(exclusiveEvents)
          setParticipatingEvents(exclusiveEvents);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      const email = localStorage.getItem('email');
      if (email) {
        try {
          const response = await axios.get(`http://localhost:3005/profile/${email}`);
          const profileData = response.data.info.profile;
          console.log(response)
          setUser((prevState) => ({
            ...prevState,
            ...response.data.info,
            ...profileData,
          }));
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };
    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const photoURL = URL.createObjectURL(file);
      setUser((prevState) => ({ ...prevState, profilePhoto: photoURL }));
    }
  };

  const handleUpdate = async () => {
    const email = localStorage.getItem('email');
    if (email) {
      try {
        const formData = new FormData();
        formData.append('email', email);
        formData.append('firstName', user.firstName);
        formData.append('lastName', user.lastName);
        formData.append('city', user.city);
        formData.append('gender', user.gender);
        if (selectedFile) {
          formData.append('profilePhoto', selectedFile);
        }

        formData.forEach((value, key) => {
            console.log(`${key}:`, value);
        });

        const response = await axios.post('http://localhost:3005/set_profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error setting profile data:', error);
        alert('Failed to update profile');
      }
    }
  };

  return (
    <Box>
      <Header />
      <Box display="flex" gap={4} p={4}>
        {/* Left Section - User Details */}
        <Paper sx={{ width: '30%', p: 4 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <label htmlFor="profile-photo-upload">
              <Avatar src={user.profileImage} sx={{ width: 120, height: 120, cursor: 'pointer' }}>
                {!user.profilePhoto && user.username?.charAt(0).toUpperCase()}
              </Avatar>
            </label>
            <input
              id="profile-photo-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handlePhotoUpload}
            />
          </Box>

          <TextField label="First Name" name="firstName" value={user.firstName} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Last Name" name="lastName" value={user.lastName} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="City" name="city" value={user.city} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Gender" name="gender" value={user.gender} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Email" value={user.email} fullWidth margin="normal" disabled />
          <TextField label="Username" value={user.username} fullWidth margin="normal" disabled />

          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpdate}>Update Details</Button>
        </Paper>
        {/* Right Section - Events */}
        <Box sx={{ flex: 1, overflowX: 'hidden', mt:3 }}>
          <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>Event Hosting</Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, whiteSpace: 'nowrap' }}>
            {hostingEvents.map(event => (
              <Paper key={event.id} sx={{ p: 2, minWidth: 250 }}>
                <img src={event.titleimageurl} alt={event.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>{event.title}</Typography>
                <Typography>{event.date}</Typography>
                <Typography>{event.cost ? `₹${event.cost}` : 'Free'}</Typography>
                <Typography>{event.eventType}</Typography>
              </Paper>
            ))}
          </Box>

          <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>Event Participating</Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2, whiteSpace: 'nowrap' }}>
            {participatingEvents.map(event => (
              <Paper key={event.event_id} sx={{ p: 2, minWidth: 250 }}>
                <img src={event.titleimageurl} alt={event.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                <Typography variant="h6" sx={{ mt: 1 }}>{event.title}</Typography>
                <Typography>{event.date}</Typography>
                <Typography>{event.cost ? `₹${event.cost}` : 'Free'}</Typography>
                <Typography>{event.eventType}</Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Profile;
