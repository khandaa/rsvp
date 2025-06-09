// frontend/src/components/WhatsAppMessaging.jsx
import React, { useState } from 'react';
import { apiRequest } from '../api/index';
import { Paper, Typography, TextField, Button, Alert } from '@mui/material';

function WhatsAppMessaging() {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSend = async () => {
    setStatus('');
    try {
      const res = await apiRequest('/whatsapp/send', 'POST', { recipient, message });
      setStatus(res.message);
    } catch (e) {
      setStatus('Failed to send message');
    }
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>WhatsApp Messaging</Typography>
      <TextField
        label="Recipient WhatsApp Number"
        fullWidth
        value={recipient}
        onChange={e => setRecipient(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="Message"
        fullWidth
        value={message}
        onChange={e => setMessage(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleSend}>Send WhatsApp Message</Button>
      {status && <Alert severity="info" sx={{ mt: 2 }}>{status}</Alert>}
    </Paper>
  );
}

export default WhatsAppMessaging;
