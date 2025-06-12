// frontend/src/components/Rooms.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Box,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editRoom, setEditRoom] = useState(null);

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const fetchRooms = async () => {
    try {
      // Try to fetch from API
      const data = await apiRequest('/rooms/');
      setRooms(data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
      // If API endpoint doesn't exist yet, use local storage as fallback
      const localRooms = localStorage.getItem('rooms');
      if (localRooms) {
        setRooms(JSON.parse(localRooms));
      }
    }
  };

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
      } else {
        setHotels([]);
      }
    }
  };

  const getHotelName = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.name : 'Unknown Hotel';
  };

  const handleEdit = (room) => {
    setEditRoom(room);
    setOpenForm(true);
  };

  const handleDelete = async (roomId) => {
    try {
      await apiRequest(`/rooms/${roomId}`, 'DELETE');
      fetchRooms();
    } catch (error) {
      console.error("Error deleting room:", error);
      // Fallback to local storage
      const updatedRooms = rooms.filter(room => room.id !== roomId);
      setRooms(updatedRooms);
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    }
  };

  const handleAdd = () => {
    setEditRoom(null);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditRoom(null);
  };

  const handleFormSave = async (form) => {
    try {
      if (editRoom) {
        await apiRequest(`/rooms/${editRoom.id}`, 'PUT', form);
      } else {
        await apiRequest('/rooms/', 'POST', form);
      }
      fetchRooms();
    } catch (error) {
      console.error("Error saving room:", error);
      // Fallback to local storage
      let updatedRooms;
      if (editRoom) {
        updatedRooms = rooms.map(r => r.id === editRoom.id ? { ...form, id: editRoom.id } : r);
      } else {
        const newId = rooms.length > 0 ? Math.max(...rooms.map(r => r.id)) + 1 : 1;
        updatedRooms = [...rooms, { ...form, id: newId }];
      }
      setRooms(updatedRooms);
      localStorage.setItem('rooms', JSON.stringify(updatedRooms));
    }
    handleFormClose();
  };

  const filteredRooms = rooms.filter(
    (r) =>
      r.room_number.toLowerCase().includes(search.toLowerCase()) ||
      getHotelName(r.hotel_id).toLowerCase().includes(search.toLowerCase()) ||
      (r.type && r.type.toLowerCase().includes(search.toLowerCase())) ||
      (r.capacity && String(r.capacity).includes(search))
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Rooms</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button variant="contained" onClick={handleAdd}>Add Room</Button>
        <TextField
          label="Search rooms"
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
              <TableCell>Room Number</TableCell>
              <TableCell>Hotel</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Capacity</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRooms.map(room => (
              <TableRow key={room.id}>
                <TableCell>{room.room_number}</TableCell>
                <TableCell>{getHotelName(room.hotel_id)}</TableCell>
                <TableCell>{room.type}</TableCell>
                <TableCell>{room.capacity}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(room)} sx={{ mr: 1 }}>Edit</Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(room.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>{editRoom ? 'Edit Room' : 'Add Room'}</DialogTitle>
        <form onSubmit={e => { 
          e.preventDefault(); 
          handleFormSave({
            room_number: e.target.room_number.value,
            hotel_id: parseInt(e.target.hotel_id.value, 10),
            type: e.target.type.value,
            capacity: parseInt(e.target.capacity.value, 10) || 1
          }); 
        }}>
          <DialogContent>
            <TextField name="room_number" label="Room Number" fullWidth required 
              defaultValue={editRoom?.room_number || ''} sx={{ mb: 2 }} />
            
            <FormControl fullWidth sx={{ mb: 2 }} required>
              <InputLabel>Hotel</InputLabel>
              <Select
                name="hotel_id"
                label="Hotel"
                defaultValue={editRoom?.hotel_id || ''}
              >
                {hotels.map(hotel => (
                  <MenuItem key={hotel.id} value={hotel.id}>{hotel.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField name="type" label="Room Type" fullWidth 
              defaultValue={editRoom?.type || ''} sx={{ mb: 2 }} />
              
            <TextField name="capacity" label="Capacity" type="number" fullWidth 
              defaultValue={editRoom?.capacity || 1} inputProps={{ min: 1 }} />
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

export default Rooms;
