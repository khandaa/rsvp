// frontend/src/components/StayArrangements.jsx
import React, { useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const initialStay = [
  { id: 1, guest: 'Ravi Kumar', hotel: 'Grand Palace', room: '101', details: 'Check-in 2 July, 2PM' },
];

function StayArrangements() {
  const [stay, setStay] = useState(initialStay);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ guest: '', hotel: '', room: '', details: '' });
  const [editIdx, setEditIdx] = useState(-1);

  const handleOpen = (idx = -1) => {
    setEditIdx(idx);
    if (idx >= 0) setForm(stay[idx]);
    else setForm({ guest: '', hotel: '', room: '', details: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editIdx >= 0) {
      setStay(stay.map((s, i) => (i === editIdx ? { ...form, id: s.id } : s)));
    } else {
      setStay([...stay, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };
  const handleDelete = idx => setStay(stay.filter((_, i) => i !== idx));

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Stay Arrangements</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Add Stay Arrangement</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Guest</TableCell>
            <TableCell>Hotel</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {stay.map((s, idx) => (
            <TableRow key={s.id}>
              <TableCell>{s.guest}</TableCell>
              <TableCell>{s.hotel}</TableCell>
              <TableCell>{s.room}</TableCell>
              <TableCell>{s.details}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpen(idx)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(idx)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIdx >= 0 ? 'Edit Stay Arrangement' : 'Add Stay Arrangement'}</DialogTitle>
        <DialogContent>
          <TextField label="Guest" name="guest" value={form.guest} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Hotel" name="hotel" value={form.hotel} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Room" name="room" value={form.room} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Details" name="details" value={form.details} onChange={handleChange} fullWidth />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default StayArrangements;
