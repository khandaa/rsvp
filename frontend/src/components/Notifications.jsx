// frontend/src/components/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [form, setForm] = useState({ type: 'email', recipient: '', group: '', message: '', scheduled_time: '' });
  const [bulkMode, setBulkMode] = useState(false);
  const [recipients, setRecipients] = useState('');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const data = await apiRequest('/notifications/');
    setNotifications(data);
  };

  const handleOpen = (bulk = false) => {
    setBulkMode(bulk);
    setOpenForm(true);
  };
  const handleClose = () => {
    setOpenForm(false);
    setForm({ type: 'email', recipient: '', group: '', message: '', scheduled_time: '' });
    setRecipients('');
  };
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleBulkRecipients = e => {
    setRecipients(e.target.value);
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (bulkMode) {
      await apiRequest('/notifications/send/bulk', 'POST', { ...form, recipients: recipients.split(',').map(r => r.trim()) });
    } else {
      await apiRequest('/notifications/send', 'POST', form);
    }
    fetchNotifications();
    handleClose();
  };
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Notifications</Typography>
      <Button variant="contained" sx={{ mr: 1 }} onClick={() => handleOpen(false)}>Send Notification</Button>
      <Button variant="outlined" onClick={() => handleOpen(true)}>Bulk Notification</Button>
      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Type</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Message</TableCell>
              <TableCell>Scheduled Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {notifications.map((n, idx) => (
              <TableRow key={idx}>
                <TableCell>{n.type}</TableCell>
                <TableCell>{n.recipient}</TableCell>
                <TableCell>{n.group}</TableCell>
                <TableCell>{n.message}</TableCell>
                <TableCell>{n.scheduled_time}</TableCell>
                <TableCell>{n.status}</TableCell>
                <TableCell>{n.created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleClose}>
        <DialogTitle>{bulkMode ? 'Send Bulk Notification' : 'Send Notification'}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select name="type" value={form.type} onChange={handleChange} label="Type">
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="sms">SMS</MenuItem>
                <MenuItem value="whatsapp">WhatsApp</MenuItem>
              </Select>
            </FormControl>
            {bulkMode ? (
              <TextField label="Recipients (comma separated)" fullWidth sx={{ mb: 2 }} value={recipients} onChange={handleBulkRecipients} />
            ) : (
              <TextField label="Recipient" name="recipient" fullWidth sx={{ mb: 2 }} value={form.recipient} onChange={handleChange} />
            )}
            <TextField label="Group (optional)" name="group" fullWidth sx={{ mb: 2 }} value={form.group} onChange={handleChange} />
            <TextField label="Message" name="message" fullWidth sx={{ mb: 2 }} value={form.message} onChange={handleChange} />
            <TextField label="Scheduled Time (ISO)" name="scheduled_time" fullWidth sx={{ mb: 2 }} value={form.scheduled_time} onChange={handleChange} helperText="e.g., 2025-06-09T23:30:00" />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Send</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}

export default Notifications;
