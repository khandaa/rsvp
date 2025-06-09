// frontend/src/components/CoHosts.jsx
import React, { useState } from 'react';
import { Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem } from '@mui/material';

const initialCoHosts = [
  { id: 1, name: 'Ravi Kumar', email: 'ravi@example.com', permission: 'Full Access' },
];

function CoHosts() {
  const [cohosts, setCoHosts] = useState(initialCoHosts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', permission: 'View Only' });
  const [editIdx, setEditIdx] = useState(-1);

  const handleOpen = (idx = -1) => {
    setEditIdx(idx);
    if (idx >= 0) setForm(cohosts[idx]);
    else setForm({ name: '', email: '', permission: 'View Only' });
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = () => {
    if (editIdx >= 0) {
      setCoHosts(cohosts.map((c, i) => (i === editIdx ? { ...form, id: c.id } : c)));
    } else {
      setCoHosts([...cohosts, { ...form, id: Date.now() }]);
    }
    setOpen(false);
  };
  const handleDelete = idx => setCoHosts(cohosts.filter((_, i) => i !== idx));

  return (
    <Paper sx={{ p: 3, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Co-Hosts</Typography>
      <Button variant="contained" sx={{ mb: 2 }} onClick={() => handleOpen()}>Add Co-Host</Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Permission</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {cohosts.map((c, idx) => (
            <TableRow key={c.id}>
              <TableCell>{c.name}</TableCell>
              <TableCell>{c.email}</TableCell>
              <TableCell>{c.permission}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpen(idx)}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(idx)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editIdx >= 0 ? 'Edit Co-Host' : 'Add Co-Host'}</DialogTitle>
        <DialogContent>
          <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <TextField label="Email" name="email" value={form.email} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
          <Select label="Permission" name="permission" value={form.permission} onChange={handleChange} fullWidth>
            <MenuItem value="Full Access">Full Access</MenuItem>
            <MenuItem value="View Only">View Only</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default CoHosts;
