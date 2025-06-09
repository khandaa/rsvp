// frontend/src/components/WeddingDetails.jsx
import React, { useState, useEffect } from 'react';
import { Paper, Typography, TextField, Button, Box } from '@mui/material';

const initialDetails = {
  title: 'sapna weds alok',
  date: 'Thursday, July 3, 2025',
  venue: '',
  coupleNames: 'Sapna & Alok',
};

function WeddingDetails() {
  const [details, setDetails] = useState(initialDetails);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    // TODO: Fetch from backend if needed
  }, []);

  const handleChange = e => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // TODO: Save to backend
    setEditMode(false);
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Wedding Details</Typography>
      {editMode ? (
        <Box>
          <TextField label="Title" name="title" fullWidth sx={{ mb: 2 }} value={details.title} onChange={handleChange} />
          <TextField label="Date" name="date" fullWidth sx={{ mb: 2 }} value={details.date} onChange={handleChange} />
          <TextField label="Venue" name="venue" fullWidth sx={{ mb: 2 }} value={details.venue} onChange={handleChange} />
          <TextField label="Couple Names" name="coupleNames" fullWidth sx={{ mb: 2 }} value={details.coupleNames} onChange={handleChange} />
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </Box>
      ) : (
        <Box>
          <Typography variant="subtitle1"><b>Title:</b> {details.title}</Typography>
          <Typography variant="subtitle1"><b>Date:</b> {details.date}</Typography>
          <Typography variant="subtitle1"><b>Venue:</b> {details.venue || 'Not set'}</Typography>
          <Typography variant="subtitle1" sx={{ mb: 2 }}><b>Couple:</b> {details.coupleNames}</Typography>
          <Button variant="outlined" onClick={() => setEditMode(true)}>Edit Details</Button>
        </Box>
      )}
    </Paper>
  );
}

export default WeddingDetails;
