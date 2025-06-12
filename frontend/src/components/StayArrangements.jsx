// frontend/src/components/StayArrangements.jsx
import React, { useState, useEffect } from 'react';
import { apiRequest } from '../api/index';
import { 
  Paper, Typography, Table, TableHead, TableBody, TableRow, TableCell, Button, 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Box,
  FormControl, InputLabel, Select, MenuItem, CircularProgress, Chip
} from '@mui/material';

function StayArrangements() {
  const [stayArrangements, setStayArrangements] = useState([]);
  const [guests, setGuests] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ 
    guest_id: '', 
    hotel_id: '', 
    room_id: '', 
    details: '' 
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  // Filter rooms when hotel changes
  useEffect(() => {
    if (form.hotel_id) {
      setFilteredRooms(rooms.filter(room => room.hotel_id === form.hotel_id));
    } else {
      setFilteredRooms([]);
    }
  }, [form.hotel_id, rooms]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStayArrangements(),
        fetchGuests(),
        fetchHotels(),
        fetchRooms()
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStayArrangements = async () => {
    try {
      // Try to fetch from API
      const data = await apiRequest('/stay-arrangements/');
      setStayArrangements(data);
    } catch (error) {
      console.error("Error fetching stay arrangements:", error);
      // If API endpoint doesn't exist yet, use local storage as fallback
      const localData = localStorage.getItem('stayArrangements');
      if (localData) {
        setStayArrangements(JSON.parse(localData));
      } else {
        // Initialize with sample data
        const initialData = [
          { id: 1, guest_id: 1, hotel_id: 1, room_id: 1, details: 'Check-in 2 July, 2PM' },
        ];
        setStayArrangements(initialData);
        localStorage.setItem('stayArrangements', JSON.stringify(initialData));
      }
    }
  };

  const fetchGuests = async () => {
    try {
      const data = await apiRequest('/guests/');
      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
      const localData = localStorage.getItem('guests');
      if (localData) {
        setGuests(JSON.parse(localData));
      } else {
        setGuests([]);
      }
    }
  };

  const fetchHotels = async () => {
    try {
      const data = await apiRequest('/hotels/');
      setHotels(data);
    } catch (error) {
      console.error("Error fetching hotels:", error);
      const localData = localStorage.getItem('hotels');
      if (localData) {
        setHotels(JSON.parse(localData));
      } else {
        setHotels([]);
      }
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await apiRequest('/rooms/');
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      const localData = localStorage.getItem('rooms');
      if (localData) {
        setRooms(JSON.parse(localData));
      } else {
        setRooms([]);
      }
    }
  };

  const getGuestName = (guestId) => {
    const guest = guests.find(g => g.id === guestId);
    return guest ? guest.name : 'Unknown Guest';
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.room_number : 'Unknown Room';
  };

  const handleOpen = (id = null) => {
    if (id) {
      const arrangement = stayArrangements.find(s => s.id === id);
      if (arrangement) {
        setForm({
          guest_id: arrangement.guest_id,
          hotel_id: arrangement.hotel_id,
          room_id: arrangement.room_id,
          details: arrangement.details || ''
        });
        setEditId(id);
      }
    } else {
      setForm({ guest_id: '', hotel_id: '', room_id: '', details: '' });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      // Reset room_id when hotel changes
      if (name === 'hotel_id') {
        return { ...prev, [name]: value, room_id: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSave = async () => {
    try {
      // Validate form
      if (!form.guest_id || !form.hotel_id || !form.room_id) {
        alert('Guest, Hotel, and Room fields are required!');
        return;
      }

      // Convert string IDs to numbers if needed
      const formData = {
        guest_id: typeof form.guest_id === 'string' ? parseInt(form.guest_id, 10) : form.guest_id,
        hotel_id: typeof form.hotel_id === 'string' ? parseInt(form.hotel_id, 10) : form.hotel_id,
        room_id: typeof form.room_id === 'string' ? parseInt(form.room_id, 10) : form.room_id,
        details: form.details
      };

      if (editId) {
        // Update existing
        await apiRequest(`/stay-arrangements/${editId}`, 'PUT', formData);
      } else {
        // Create new
        await apiRequest('/stay-arrangements/', 'POST', formData);
      }
      await fetchStayArrangements();
    } catch (error) {
      console.error("Error saving stay arrangement:", error);
      // Fallback to local storage
      let updatedArrangements;

      if (editId) {
        updatedArrangements = stayArrangements.map(item => 
          item.id === editId ? { ...form, id: editId } : item
        );
      } else {
        const newId = stayArrangements.length > 0 
          ? Math.max(...stayArrangements.map(item => item.id)) + 1 
          : 1;
        updatedArrangements = [...stayArrangements, { ...form, id: newId }];
      }
      
      setStayArrangements(updatedArrangements);
      localStorage.setItem('stayArrangements', JSON.stringify(updatedArrangements));
    } finally {
      handleClose();
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/stay-arrangements/${id}`, 'DELETE');
      await fetchStayArrangements();
    } catch (error) {
      console.error("Error deleting stay arrangement:", error);
      // Fallback to local storage
      const updatedArrangements = stayArrangements.filter(item => item.id !== id);
      setStayArrangements(updatedArrangements);
      localStorage.setItem('stayArrangements', JSON.stringify(updatedArrangements));
    }
  };

  return (
    <Paper sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Stay Arrangements</Typography>
        <Box>
          <Button variant="contained" onClick={() => handleOpen()} sx={{ mr: 2 }}>
            Add Stay Arrangement
          </Button>
          <Button variant="outlined" onClick={() => fetchData()} startIcon={loading && <CircularProgress size={20} />} disabled={loading}>
            Refresh
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Chip label={`${guests.length} Guests Available`} color="primary" variant="outlined" />
        <Chip label={`${hotels.length} Hotels Available`} color="secondary" variant="outlined" />
        <Chip label={`${rooms.length} Rooms Available`} color="info" variant="outlined" />
      </Box>

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
          {stayArrangements.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                No stay arrangements found. Add your first one!
              </TableCell>
            </TableRow>
          ) : stayArrangements.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{getGuestName(item.guest_id)}</TableCell>
              <TableCell>{getHotelName(item.hotel_id)}</TableCell>
              <TableCell>{getRoomInfo(item.room_id)}</TableCell>
              <TableCell>{item.details}</TableCell>
              <TableCell>
                <Button size="small" onClick={() => handleOpen(item.id)} sx={{ mr: 1 }}>Edit</Button>
                <Button size="small" color="error" onClick={() => handleDelete(item.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editId ? 'Edit Stay Arrangement' : 'Add Stay Arrangement'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }} required>
            <InputLabel>Guest</InputLabel>
            <Select
              name="guest_id"
              value={form.guest_id}
              label="Guest"
              onChange={handleChange}
            >
              {guests.length === 0 ? (
                <MenuItem disabled>No guests available</MenuItem>
              ) : guests.map((guest) => (
                <MenuItem key={guest.id} value={guest.id}>{guest.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} required>
            <InputLabel>Hotel</InputLabel>
            <Select
              name="hotel_id"
              value={form.hotel_id}
              label="Hotel"
              onChange={handleChange}
            >
              {hotels.length === 0 ? (
                <MenuItem disabled>No hotels available</MenuItem>
              ) : hotels.map((hotel) => (
                <MenuItem key={hotel.id} value={hotel.id}>{hotel.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }} required disabled={!form.hotel_id}>
            <InputLabel>Room</InputLabel>
            <Select
              name="room_id"
              value={form.room_id}
              label="Room"
              onChange={handleChange}
              disabled={!form.hotel_id}
            >
              {form.hotel_id ? (
                filteredRooms.length === 0 ? (
                  <MenuItem disabled>No rooms available for selected hotel</MenuItem>
                ) : filteredRooms.map((room) => (
                  <MenuItem key={room.id} value={room.id}>
                    {room.room_number} - {room.type || 'Standard'} ({room.capacity || 1} persons)
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>Select a hotel first</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField 
            label="Details" 
            name="details" 
            value={form.details} 
            onChange={(e) => setForm({...form, details: e.target.value})} 
            fullWidth 
            multiline
            rows={3}
            placeholder="Check-in/check-out dates, special requests, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default StayArrangements;
