// frontend/src/components/GuestBulkImport.jsx
import React from 'react';
import Papa from 'papaparse';
import { apiRequest } from '../api/index';
import { Paper, Typography, Button, Input, Alert, Link } from '@mui/material';

function GuestBulkImport() {
  const [status, setStatus] = React.useState('');

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        try {
          await apiRequest('/guests/import', 'POST', results.data);
          setStatus('Guests imported successfully');
        } catch {
          setStatus('Failed to import guests');
        }
      },
    });
  };

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Bulk Import Guests</Typography>
      <Input type="file" inputProps={{ accept: '.csv' }} onChange={handleFile} />
      <Link href={require('../sample-guests.csv')} download sx={{ ml: 2 }}>
        Download Sample CSV
      </Link>
      {status && <Alert sx={{ mt: 2 }} severity="info">{status}</Alert>}
    </Paper>
  );
}

export default GuestBulkImport;
