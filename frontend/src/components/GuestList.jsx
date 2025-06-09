// frontend/src/components/GuestList.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import * as XLSX from 'xlsx';

function GuestList({ onEditGuest }) {
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editGuest, setEditGuest] = useState(null);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const data = await apiRequest('/guests/');
      setGuests(data);
    } catch (error) {
      // handle error
    }
  };

  const handleEdit = (guest) => {
    setEditGuest(guest);
    setOpenForm(true);
  };

  const handleDelete = async (guestId) => {
    await apiRequest(`/guests/${guestId}`, 'DELETE');
    fetchGuests();
  };

  const handleAdd = () => {
    setEditGuest(null);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditGuest(null);
  };

  const handleFormSave = async (form) => {
    if (editGuest) {
      await apiRequest(`/guests/${editGuest.id}`, 'PUT', form);
    } else {
      await apiRequest('/guests/', 'POST', form);
    }
    fetchGuests();
    handleFormClose();
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(guests);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guests');
    XLSX.writeFile(wb, 'guests.xlsx');
  };

  const filteredGuests = guests.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.email.toLowerCase().includes(search.toLowerCase()) ||
      (g.phone && g.phone.toLowerCase().includes(search.toLowerCase())) ||
      (g.group_id && String(g.group_id).toLowerCase().includes(search.toLowerCase())) ||
      (g.rsvp_status && g.rsvp_status.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Guest List</Typography>
      <Button variant="contained" sx={{ mr: 1 }} onClick={handleAdd}>Add Guest</Button>
      <Button variant="outlined" sx={{ mr: 1 }} href={require('../sample-guests.csv')} download>Download Sample CSV</Button>
      <Button variant="outlined" onClick={handleExport}>Export to Excel</Button>
      <TextField
        label="Search guests"
        variant="outlined"
        size="small"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2, ml: 2 }}
      />
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>RSVP Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGuests.map(guest => (
              <TableRow key={guest.id}>
                <TableCell>{guest.name}</TableCell>
                <TableCell>{guest.email}</TableCell>
                <TableCell>{guest.phone}</TableCell>
                <TableCell>{guest.group_id}</TableCell>
                <TableCell>{guest.rsvp_status}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(guest)} sx={{ mr: 1 }}>Edit</Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(guest.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>{editGuest ? 'Edit Guest' : 'Add Guest'}</DialogTitle>
        <form onSubmit={e => { e.preventDefault(); handleFormSave({
          name: e.target.name.value,
          email: e.target.email.value,
          phone: e.target.phone.value,
          group_id: e.target.group_id.value,
        }); }}>
          <DialogContent>
            <TextField name="name" label="Name" fullWidth required defaultValue={editGuest?.name || ''} sx={{ mb: 2 }} />
            <TextField name="email" label="Email" fullWidth required defaultValue={editGuest?.email || ''} sx={{ mb: 2 }} />
            <TextField name="phone" label="Phone" fullWidth defaultValue={editGuest?.phone || ''} sx={{ mb: 2 }} />
            <TextField name="group_id" label="Group ID" fullWidth defaultValue={editGuest?.group_id || ''} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleFormClose}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Paper>
  );
}

export default GuestList;
