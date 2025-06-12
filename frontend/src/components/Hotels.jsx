// frontend/src/components/Hotels.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Box
} from '@mui/material';

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editHotel, setEditHotel] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      // Try to fetch from API
      const data = await apiRequest('/hotels/');
      setHotels(data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      // If API endpoint doesn't exist yet, use local storage as fallback
      const localHotels = localStorage.getItem('hotels');
      if (localHotels) {
        setHotels(JSON.parse(localHotels));
      }
    }
  };

  const handleEdit = (hotel) => {
    setEditHotel(hotel);
    setOpenForm(true);
  };

  const handleDelete = async (hotelId) => {
    try {
      await apiRequest(`/hotels/${hotelId}`, 'DELETE');
      fetchHotels();
    } catch (error) {
      console.error("Error deleting hotel:", error);
      // Fallback to local storage
      const updatedHotels = hotels.filter(hotel => hotel.id !== hotelId);
      setHotels(updatedHotels);
      localStorage.setItem('hotels', JSON.stringify(updatedHotels));
    }
  };

  const handleAdd = () => {
    setEditHotel(null);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditHotel(null);
  };

  const handleFormSave = async (form) => {
    try {
      if (editHotel) {
        await apiRequest(`/hotels/${editHotel.id}`, 'PUT', form);
      } else {
        await apiRequest('/hotels/', 'POST', form);
      }
      fetchHotels();
    } catch (error) {
      console.error("Error saving hotel:", error);
      // Fallback to local storage
      let updatedHotels;
      if (editHotel) {
        updatedHotels = hotels.map(h => h.id === editHotel.id ? { ...form, id: editHotel.id } : h);
      } else {
        const newId = hotels.length > 0 ? Math.max(...hotels.map(h => h.id)) + 1 : 1;
        updatedHotels = [...hotels, { ...form, id: newId }];
      }
      setHotels(updatedHotels);
      localStorage.setItem('hotels', JSON.stringify(updatedHotels));
    }
    handleFormClose();
  };

  const filteredHotels = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      (h.address && h.address.toLowerCase().includes(search.toLowerCase())) ||
      (h.contact_info && h.contact_info.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Hotels</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button variant="contained" onClick={handleAdd}>Add Hotel</Button>
        <TextField
          label="Search hotels"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Contact Info</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHotels.map(hotel => (
              <TableRow key={hotel.id}>
                <TableCell>{hotel.name}</TableCell>
                <TableCell>{hotel.address}</TableCell>
                <TableCell>{hotel.contact_info}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(hotel)} sx={{ mr: 1 }}>Edit</Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(hotel.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>{editHotel ? 'Edit Hotel' : 'Add Hotel'}</DialogTitle>
        <form onSubmit={e => { 
          e.preventDefault(); 
          handleFormSave({
            name: e.target.name.value,
            address: e.target.address.value,
            contact_info: e.target.contact_info.value
          }); 
        }}>
          <DialogContent>
            <TextField name="name" label="Name" fullWidth required defaultValue={editHotel?.name || ''} sx={{ mb: 2 }} />
            <TextField name="address" label="Address" fullWidth defaultValue={editHotel?.address || ''} sx={{ mb: 2 }} />
            <TextField name="contact_info" label="Contact Info" fullWidth defaultValue={editHotel?.contact_info || ''} />
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

export default Hotels;
