// src/components/UserDashboard.jsx
import React, { useState, useEffect, useContext } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Alert
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import HotelIcon from '@mui/icons-material/Hotel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { apiRequest } from '../api';
import { AuthContext } from '../context/AuthContext';

function UserDashboard({ onEventSelect, onLogout }) {
  const { currentUser, logout } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const loadEvents = async () => {
      try {
        // In a real app, this would fetch events associated with the logged-in user
        // For now, we'll fetch all events
        const eventsData = await apiRequest('/api/events');
        
        // Get stats for each event
        const eventsWithStats = await Promise.all(
          eventsData.map(async (event) => {
            try {
              // These would typically be filtered by event ID in a real API
              const guestsPromise = apiRequest('/api/guests');
              const groupsPromise = apiRequest('/api/groups');
              const hotelsPromise = apiRequest('/api/hotels');
              
              const [guests, groups, hotels] = await Promise.all([
                guestsPromise, groupsPromise, hotelsPromise
              ]);
              
              return {
                ...event,
                stats: {
                  guests: guests.length,
                  groups: groups.length,
                  hotels: hotels.length
                }
              };
            } catch (err) {
              console.error("Error fetching stats for event", event.id, err);
              return {
                ...event,
                stats: {
                  guests: '?',
                  groups: '?',
                  hotels: '?'
                }
              };
            }
          })
        );
        
        setEvents(eventsWithStats);
        
        // Calculate overall stats
        const totalStats = eventsWithStats.reduce((acc, event) => {
          return {
            guests: acc.guests + (typeof event.stats.guests === 'number' ? event.stats.guests : 0),
            groups: acc.groups + (typeof event.stats.groups === 'number' ? event.stats.groups : 0),
            hotels: acc.hotels + (typeof event.stats.hotels === 'number' ? event.stats.hotels : 0)
          };
        }, { guests: 0, groups: 0, hotels: 0 });
        
        setStats(totalStats);
      } catch (err) {
        console.error("Error fetching events", err);
        setError("Failed to load events. Please try again later.");
        
        // Fallback to localStorage if API fails
        const fallbackEvents = JSON.parse(localStorage.getItem('events') || '[]');
        if (fallbackEvents.length > 0) {
          setEvents(fallbackEvents);
        }
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: '#f8f9fa', borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Welcome, {currentUser?.username || 'Guest'}!
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccountCircleIcon color="primary" />
              <Typography variant="body1" color="textSecondary">
                {currentUser?.email}
              </Typography>
              {currentUser?.role && (
                <Chip 
                  label={currentUser.role.toUpperCase()} 
                  color={currentUser.role === 'admin' ? 'error' : 'primary'}
                  size="small"
                  sx={{ ml: 1 }}
                />
              )}
            </Box>
          </Box>
          <Button
            variant="outlined"
            startIcon={<ExitToAppIcon />}
            onClick={() => {
              logout();
              if (onLogout) onLogout();
            }}
            color="primary"
          >
            Logout
          </Button>
        </Box>
      </Paper>
      
      <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>Your Event Statistics</Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#f0f7ff' }}>
              <EventIcon color="primary" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{events.length}</Typography>
              <Typography variant="body1">Events</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#fff4e5' }}>
              <PersonIcon color="warning" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.guests || 0}</Typography>
              <Typography variant="body1">Guests</Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={3} sx={{ p: 2, textAlign: 'center', bgcolor: '#e8f5e9' }}>
              <GroupIcon color="success" sx={{ fontSize: 40 }} />
              <Typography variant="h5">{stats.groups || 0}</Typography>
              <Typography variant="body1">Groups</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Typography variant="h5" gutterBottom sx={{ mt: 4, mb: 2 }}>
        Your Marriage Events
      </Typography>

      {events.length === 0 ? (
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2, bgcolor: '#f9fafe' }}>
          <EventIcon sx={{ fontSize: 60, color: '#3f51b5', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            You don't have any events yet
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Create your first marriage event to start managing guests, RSVPs, and logistics
          </Typography>
          <Button 
            variant="contained" 
            size="large"
            startIcon={<EventIcon />}
            onClick={() => {
              // Open event creation dialog or navigate to event creation page
              alert('Event creation will be implemented in the next update!');
            }}
            sx={{ px: 4, py: 1 }}
          >
            Create New Event
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {events.map((event) => (
            <Grid item xs={12} md={6} key={event.id}>
              <Card elevation={3} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {event.name}
                  </Typography>
                  <Typography color="textSecondary" variant="body2" gutterBottom>
                    {new Date(event.date || event.start_time).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    {event.location || 'No location specified'}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      icon={<PersonIcon />} 
                      label={`${event.stats?.guests || 0} Guests`} 
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                    <Chip 
                      icon={<GroupIcon />} 
                      label={`${event.stats?.groups || 0} Groups`} 
                      size="small"
                      color="success"
                      variant="outlined"
                    />
                    <Chip 
                      icon={<HotelIcon />} 
                      label={`${event.stats?.hotels || 0} Hotels`} 
                      size="small"
                      color="warning"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => onEventSelect(event.id)}
                  >
                    Manage Event
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}

export default UserDashboard;
