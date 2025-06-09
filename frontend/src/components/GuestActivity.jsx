// frontend/src/components/GuestActivity.jsx
import React, { useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const initialActivity = [
  { id: 1, guest: 'Ravi Kumar', action: 'RSVP Confirmed', date: '2025-06-01 10:30' },
  { id: 2, guest: 'Priya Singh', action: 'Sent Message', date: '2025-06-02 15:20' },
  { id: 3, guest: 'Ravi Kumar', action: 'Sent Message', date: '2025-06-03 11:10' },
  { id: 4, guest: 'Priya Singh', action: 'RSVP Confirmed', date: '2025-06-04 09:40' }
];

function getStats(activity) {
  const stats = {};
  activity.forEach(a => {
    stats[a.action] = (stats[a.action] || 0) + 1;
  });
  return Object.entries(stats).map(([action, count]) => ({ action, count }));
}

function GuestActivity() {
  const [activity] = useState(initialActivity);
  const stats = getStats(activity);

  return (
    <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Guest Activity</Typography>
      <Box sx={{ height: 300, my: 3 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="action" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#1976d2" name="Activity Count" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Guest</TableCell>
            <TableCell>Action</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {activity.map((a) => (
            <TableRow key={a.id}>
              <TableCell>{a.guest}</TableCell>
              <TableCell>{a.action}</TableCell>
              <TableCell>{a.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default GuestActivity;
