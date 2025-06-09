// frontend/src/components/RsvpDashboard.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import * as XLSX from 'xlsx';

function RsvpDashboard() {
  const [rsvps, setRsvps] = useState([]);

  useEffect(() => {
    fetchRsvps();
  }, []);

  const fetchRsvps = async () => {
    try {
      const data = await apiRequest('/rsvp/summary');
      setRsvps(data);
    } catch (error) {
      // handle error
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(rsvps);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'RSVPs');
    XLSX.writeFile(wb, 'rsvps.xlsx');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>RSVP Dashboard</Typography>
      <Button variant="outlined" onClick={handleExport}>Export to Excel</Button>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Status</TableCell>
              <TableCell>Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rsvps.map(rsvp => (
              <TableRow key={rsvp.status}>
                <TableCell>{rsvp.status}</TableCell>
                <TableCell>{rsvp.count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default RsvpDashboard;
