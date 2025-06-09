// frontend/src/components/ShareLinks.jsx
import React, { useState } from 'react';
import { Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';

function ShareLinks() {
  const [link] = useState('https://wedhaven.com/invite/sapna-weds-alok');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Share Wedding Details</Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Share this link with your guests so they can view wedding details and RSVP online.
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField value={link} fullWidth InputProps={{ readOnly: true }} sx={{ mr: 2 }} />
        <Button variant="contained" onClick={handleCopy}>Copy Link</Button>
      </Box>
      {copied && <Alert severity="success">Link copied to clipboard!</Alert>}
    </Paper>
  );
}

export default ShareLinks;
