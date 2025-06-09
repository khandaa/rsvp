// frontend/src/components/DashboardWidgets.jsx
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Chip, Divider, Button } from '@mui/material';
import { apiRequest } from '../api/index';

function DashboardWidgets() {
  const [rsvp, setRsvp] = useState({ total: 0, confirmed: 0, families: 0 });
  const [logistics, setLogistics] = useState({ local: 0, air: 0, train: 0, car: 0, other: 0 });

  useEffect(() => {
    // Fetch RSVP summary
    apiRequest('/rsvp/summary').then(data => {
      let confirmed = 0, families = 0;
      let total = data.reduce((acc, item) => {
        if (item.status === 'confirmed') confirmed = item.count;
        if (item.status === 'family') families = item.count;
        return acc + item.count;
      }, 0);
      setRsvp({ total, confirmed, families });
    });
    // Fetch logistics summary (placeholder logic)
    apiRequest('/logistics/').then(data => {
      let summary = { local: 0, air: 0, train: 0, car: 0, other: 0 };
      data.forEach(item => {
        if (item.type && summary[item.type.toLowerCase()] !== undefined) {
          summary[item.type.toLowerCase()]++;
        } else {
          summary.other++;
        }
      });
      setLogistics(summary);
    });
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={8}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h5" gutterBottom>Wedding Dashboard</Typography>
          <Typography variant="subtitle1" gutterBottom>An overview of your wedding</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">RSVP Overview</Typography>
              <Box sx={{ display: 'flex', gap: 3, mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2">Total Guests</Typography>
                  <Typography variant="h4">{rsvp.total}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Confirmed Guests</Typography>
                  <Typography variant="h4">{rsvp.confirmed}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Confirmed Families</Typography>
                  <Typography variant="h4">{rsvp.families}</Typography>
                </Box>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip label="Wedding" color="primary" />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6">Logistics Overview</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                <Box><Chip label="Local" sx={{ mr: 1, bgcolor: '#1976d2', color: '#fff' }} /> {logistics.local}</Box>
                <Box><Chip label="Air" sx={{ mr: 1, bgcolor: '#e53935', color: '#fff' }} /> {logistics.air}</Box>
                <Box><Chip label="Train" sx={{ mr: 1, bgcolor: '#fbc02d', color: '#fff' }} /> {logistics.train}</Box>
                <Box><Chip label="Car" sx={{ mr: 1, bgcolor: '#43a047', color: '#fff' }} /> {logistics.car}</Box>
                <Box><Chip label="Other" sx={{ mr: 1, bgcolor: '#757575', color: '#fff' }} /> {logistics.other}</Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>Quick Actions</Typography>
          <Button variant="text" sx={{ mb: 1, textTransform: 'none' }}>Update pick and drop details</Button>
          <Button variant="text" sx={{ mb: 1, textTransform: 'none' }}>Update stay details</Button>
          <Button variant="text" sx={{ mb: 1, textTransform: 'none' }}>Share schedule with guests</Button>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default DashboardWidgets;
