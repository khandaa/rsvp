// frontend/src/components/Logistics.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function Logistics() {
  const [logistics, setLogistics] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', status: '', notes: '' });

  useEffect(() => {
    fetchLogistics();
  }, []);

  const fetchLogistics = async () => {
    const data = await apiRequest('/logistics/');
    setLogistics(data);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => { setOpen(false); setForm({ name: '', type: '', status: '', notes: '' }); };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await apiRequest('/logistics/', 'POST', form);
    fetchLogistics();
    handleClose();
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Logistics</Typography>
      <Button variant="contained" onClick={handleOpen}>Add Logistics</Button>
      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logistics.map(item => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Logistics</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField name="name" label="Name" fullWidth required value={form.name} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField name="type" label="Type" fullWidth required value={form.type} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField name="status" label="Status" fullWidth value={form.status} onChange={handleChange} sx={{ mb: 2 }} />
            <TextField name="notes" label="Notes" fullWidth value={form.notes} onChange={handleChange} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}

export default Logistics;
