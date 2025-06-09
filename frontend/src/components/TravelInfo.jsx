// frontend/src/components/TravelInfo.jsx
import React, { useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';

const initialTravel = [
  { id: 1, guest: 'Ravi Kumar', type: 'Air', details: 'Flight AI123, 2 July, 10:00AM' },
];

function TravelInfo() {
  const [travel, setTravel] = useState(initialTravel);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ guest: '', type: 'Local', details: '' });
  const [editIdx, setEditIdx] = useState(-1);

  const handleOpen = (idx = -1) => {
    setEditIdx(idx);
    if (idx >= 0) setForm(travel[idx]);
    else setForm({ guest: '', type: 'Local', details: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editIdx >= 0) {
      setTravel(travel.map((t, i) => (i === editIdx ? { ...form, id: t.id } : t)));
    } else {
      setTravel([...travel, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };
  const handleDelete = idx => setTravel(travel.filter((_, i) => i !== idx));

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Travel Info</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Add Travel Info</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Guest</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Details</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {travel.map((t, idx) => (
            <TableRow key={t.id}>
              <TableCell>{t.guest}</TableCell>
              <TableCell>{t.type}</TableCell>
              <TableCell>{t.details}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpen(idx)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(idx)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIdx >= 0 ? 'Edit Travel Info' : 'Add Travel Info'}</DialogTitle>
        <DialogContent>
          <TextField label="Guest" name="guest" value={form.guest} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <Select label="Type" name="type" value={form.type} onChange={handleChange} fullWidth>
            <MenuItem value="Local">Local</MenuItem>
            <MenuItem value="Air">Air</MenuItem>
            <MenuItem value="Train">Train</MenuItem>
            <MenuItem value="Car">Car</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
          <TextField label="Details" name="details" value={form.details} onChange={handleChange} fullWidth sx={{ mt: 2 }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default TravelInfo;
