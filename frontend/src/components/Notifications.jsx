// frontend/src/components/Notifications.jsx
import React, { useEffect, useState, useContext } from 'react';
import { apiRequest } from '../api/index';
import {
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, 
  MenuItem, Select, InputLabel, FormControl, Box, Chip, Divider, IconButton, Alert,
  Tooltip, OutlinedInput, CircularProgress, Autocomplete, Grid, FormHelperText, Switch, FormControlLabel
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SmsIcon from '@mui/icons-material/Sms';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import { AuthContext } from '../context/AuthContext';

function Notifications({ eventId }) {
  const { currentUser } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({ 
    type: 'whatsapp', // Default to WhatsApp
    recipients: [],
    groups: [],
    message: '', 
    scheduled_time: '',
    eventId: eventId
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  // For dropdowns
  const [guests, setGuests] = useState([]);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchNotifications();
    fetchGuests();
    fetchGroups();
  }, [eventId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const endpoint = eventId ? `/notifications/?event_id=${eventId}` : '/notifications/';
      const data = await apiRequest(endpoint);
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchGuests = async () => {
    try {
      const endpoint = eventId ? `/guests/?event_id=${eventId}` : '/guests/';
      const data = await apiRequest(endpoint);
      setGuests(data || []);
    } catch (err) {
      console.error('Error fetching guests:', err);
    }
  };
  
  const fetchGroups = async () => {
    try {
      const endpoint = eventId ? `/groups/?event_id=${eventId}` : '/groups/';
      const data = await apiRequest(endpoint);
      setGroups(data || []);
    } catch (err) {
      console.error('Error fetching groups:', err);
    }
  };

  const handleOpen = () => {
    // Reset form with eventId and default to WhatsApp
    setForm({
      type: 'whatsapp',
      recipients: [],
      groups: [],
      message: '',
      scheduled_time: '',
      eventId: eventId
    });
    setError(null);
    setSuccess(false);
    setOpenForm(true);
  };
  
  const handleClose = () => {
    setOpenForm(false);
  };
  
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  
  const handleGuestSelection = (event, newValue) => {
    setForm({ ...form, recipients: newValue });
  };
  
  const handleGroupSelection = (event, newValue) => {
    setForm({ ...form, groups: newValue });
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      // Prepare data for submission
      const payload = {
        type: form.type,
        message: form.message,
        scheduled_time: form.scheduled_time || null,
        eventId: eventId,
        recipientIds: form.recipients.map(guest => guest.id),
        groupIds: form.groups.map(group => group.id)
      };
      
      await apiRequest('/notifications/send', 'POST', payload);
      setSuccess(true);
      fetchNotifications();
      // Close after a delay to show success message
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err) {
      console.error('Error sending notifications:', err);
      setError('Failed to send notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Notifications</Typography>
        <Button 
          variant="contained" 
          color="primary"
          startIcon={<SendIcon />}
          onClick={handleOpen}
        >
          Send Notification
        </Button>
      </Box>
      
      {error && !openForm && (
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
      )}
      
      {loading && !openForm && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {!loading && notifications.length === 0 ? (
        <Paper elevation={0} sx={{ p: 4, textAlign: 'center', bgcolor: '#f9fafe', borderRadius: 2, my: 2 }}>
          <WhatsAppIcon sx={{ fontSize: 60, color: '#25D366', mb: 2, opacity: 0.7 }} />
          <Typography variant="h6" gutterBottom>No Notifications Yet</Typography>
          <Typography variant="body1" color="textSecondary">
            Send your first notification to guests or groups
          </Typography>
        </Paper>
      ) : (
        <TableContainer sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Recipients</TableCell>
                <TableCell>Groups</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Sent/Scheduled</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((n, idx) => (
                <TableRow key={idx} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                  <TableCell>
                    {n.type === 'whatsapp' && <WhatsAppIcon color="success" />}
                    {n.type === 'email' && <EmailIcon color="primary" />}
                    {n.type === 'sms' && <SmsIcon color="secondary" />}
                  </TableCell>
                  <TableCell>{n.recipient_count || 0} recipients</TableCell>
                  <TableCell>{n.group_count || 0} groups</TableCell>
                  <TableCell>
                    <Tooltip title={n.message}>
                      <Typography noWrap sx={{ maxWidth: 200 }}>
                        {n.message}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{n.scheduled_time || n.sent_at}</TableCell>
                  <TableCell>
                    <Chip 
                      label={n.status} 
                      color={n.status === 'sent' ? 'success' : n.status === 'failed' ? 'error' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={openForm} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SendIcon color="primary" /> 
          Send Notification
        </DialogTitle>
        
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mb: 3 }}>Notification sent successfully!</Alert>}
            
            <Grid container spacing={3}>
              {/* Channel Selection */}
              <Grid item xs={12}>
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafa', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>Notification Channel</Typography>
                  <FormControl component="fieldset">
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Button
                        variant={form.type === 'whatsapp' ? 'contained' : 'outlined'}
                        onClick={() => setForm({...form, type: 'whatsapp'})}
                        startIcon={<WhatsAppIcon />}
                        color={form.type === 'whatsapp' ? 'success' : 'inherit'}
                      >
                        WhatsApp
                      </Button>
                      <Button
                        variant={form.type === 'email' ? 'contained' : 'outlined'}
                        onClick={() => setForm({...form, type: 'email'})}
                        startIcon={<EmailIcon />}
                        color={form.type === 'email' ? 'primary' : 'inherit'}
                      >
                        Email
                      </Button>
                      <Button
                        variant={form.type === 'sms' ? 'contained' : 'outlined'}
                        onClick={() => setForm({...form, type: 'sms'})}
                        startIcon={<SmsIcon />}
                        color={form.type === 'sms' ? 'secondary' : 'inherit'}
                      >
                        SMS
                      </Button>
                    </Box>
                  </FormControl>
                </Paper>
              </Grid>
              
              {/* Recipients */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon fontSize="small" color="primary" /> Recipients
                </Typography>
                <Autocomplete
                  multiple
                  options={guests}
                  value={form.recipients}
                  onChange={handleGuestSelection}
                  getOptionLabel={(option) => `${option.name} (${option.email || option.phone || 'No contact'})`}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">{option.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {option.email || option.phone || 'No contact info'}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        size="small"
                        {...getTagProps({ index })}
                        icon={<PersonIcon fontSize="small" />}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select individual guests"
                      helperText={`${form.recipients.length} guests selected`}
                    />
                  )}
                />
              </Grid>
              
              {/* Groups */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupIcon fontSize="small" color="primary" /> Groups
                </Typography>
                <Autocomplete
                  multiple
                  options={groups}
                  value={form.groups}
                  onChange={handleGroupSelection}
                  getOptionLabel={(option) => `${option.name} (${option.guests_count || 0} guests)`}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant="body2">{option.name}</Typography>
                        <Typography variant="caption" color="textSecondary">
                          {option.guests_count || 0} guests
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        size="small"
                        {...getTagProps({ index })}
                        icon={<GroupIcon fontSize="small" />}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Select guest groups"
                      helperText={`${form.groups.length} groups selected`}
                    />
                  )}
                />
              </Grid>
              
              {/* Message */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>Message</Typography>
                <TextField
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder={`Type your message here... Use placeholders like [NAME] for personalization.`}
                  variant="outlined"
                />
                <FormHelperText>
                  This message will be sent to {form.recipients.length} guests and {form.groups.length} groups.
                </FormHelperText>
              </Grid>
              
              {/* Scheduled Time */}
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={!!form.scheduled_time} 
                      onChange={(e) => setForm({ ...form, scheduled_time: e.target.checked ? new Date().toISOString().slice(0, 16) : '' })}
                    />
                  }
                  label="Schedule for later"
                />
                {form.scheduled_time && (
                  <TextField
                    name="scheduled_time"
                    type="datetime-local"
                    fullWidth
                    value={form.scheduled_time}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{
                      min: new Date().toISOString().slice(0, 16)
                    }}
                  />
                )}
              </Grid>
              
              <Grid item xs={12} sm={6} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Recipients: {form.recipients.length} guests + groups containing additional recipients
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button 
              variant="contained" 
              type="submit" 
              disabled={loading || (!form.recipients.length && !form.groups.length) || !form.message} 
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              color="primary"
            >
              {loading ? 'Sending...' : 'Send Notification'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}

export default Notifications;
