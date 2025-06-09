// frontend/src/components/PickDrop.jsx
import React, { useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';

const initialPickDrop = [
  { id: 1, guest: 'Ravi Kumar', type: 'Pickup', details: '2 July, 9AM, Airport' },
];

function PickDrop() {
  const [pickdrop, setPickDrop] = useState(initialPickDrop);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ guest: '', type: 'Pickup', details: '' });
  const [editIdx, setEditIdx] = useState(-1);

  const handleOpen = (idx = -1) => {
    setEditIdx(idx);
    if (idx >= 0) setForm(pickdrop[idx]);
    else setForm({ guest: '', type: 'Pickup', details: '' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editIdx >= 0) {
      setPickDrop(pickdrop.map((p, i) => (i === editIdx ? { ...form, id: p.id } : p)));
    } else {
      setPickDrop([...pickdrop, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };
  const handleDelete = idx => setPickDrop(pickdrop.filter((_, i) => i !== idx));

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Pick & Drop</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Add Pick/Drop</Button>
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
          {pickdrop.map((p, idx) => (
            <TableRow key={p.id}>
              <TableCell>{p.guest}</TableCell>
              <TableCell>{p.type}</TableCell>
              <TableCell>{p.details}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpen(idx)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(idx)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIdx >= 0 ? 'Edit Pick/Drop' : 'Add Pick/Drop'}</DialogTitle>
        <DialogContent>
          <TextField label="Guest" name="guest" value={form.guest} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Type" name="type" value={form.type} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
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

export default PickDrop;
