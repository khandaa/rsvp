// frontend/src/components/Events.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle, Checkbox, FormGroup, FormControlLabel } from '@mui/material';

function Events() {
  const [events, setEvents] = useState([]);
  const [guests, setGuests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [openForm, setOpenForm] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [selectedGuests, setSelectedGuests] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchGuests();
    fetchGroups();
  }, []);

  const fetchEvents = async () => {
    const data = await apiRequest('/events/');
    setEvents(data);
  };
  const fetchGuests = async () => {
    const data = await apiRequest('/guests/');
    setGuests(data);
  };
  const fetchGroups = async () => {
    const data = await apiRequest('/groups/');
    setGroups(data);
  };
  const fetchAssignments = async (eventId) => {
    const data = await apiRequest(`/events/${eventId}/assignments`);
    setAssignments(prev => ({ ...prev, [eventId]: data }));
  };

  const handleEdit = (event) => {
    setEditEvent(event);
    setOpenForm(true);
  };
  const handleDelete = async (eventId) => {
    await apiRequest(`/events/${eventId}`, 'DELETE');
    fetchEvents();
  };
  const handleAdd = () => {
    setEditEvent(null);
    setOpenForm(true);
  };
  const handleFormClose = () => {
    setOpenForm(false);
    setEditEvent(null);
    setSelectedGuests([]);
    setSelectedGroups([]);
  };
  const handleFormSave = async (form) => {
    if (editEvent) {
      await apiRequest(`/events/${editEvent.id}`, 'PUT', form);
    } else {
      await apiRequest('/events/', 'POST', form);
    }
    fetchEvents();
    handleFormClose();
  };
  const handleAssign = async (eventId) => {
    await apiRequest(`/events/${eventId}/assign`, 'POST', {
      guest_ids: selectedGuests,
      group_ids: selectedGroups,
    });
    fetchAssignments(eventId);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Events</Typography>
      <Button variant="contained" sx={{ mr: 1 }} onClick={handleAdd}>Add Event</Button>
      <TableContainer sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Assign Guests/Groups</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map(event => (
              <TableRow key={event.id}>
                <TableCell>{event.name}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>{event.description}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => fetchAssignments(event.id)}>View</Button>
                  <Dialog open={assignments[event.id] !== undefined} onClose={() => setAssignments(prev => { const cp = { ...prev }; delete cp[event.id]; return cp; })}>
                    <DialogTitle>Assign Guests/Groups to {event.name}</DialogTitle>
                    <DialogContent>
                      <Typography variant="subtitle1">Guests</Typography>
                      <FormGroup>
                        {guests.map(g => (
                          <FormControlLabel
                            key={g.id}
                            control={<Checkbox checked={selectedGuests.includes(g.id)} onChange={e => setSelectedGuests(e.target.checked ? [...selectedGuests, g.id] : selectedGuests.filter(id => id !== g.id))} />}
                            label={g.name}
                          />
                        ))}
                      </FormGroup>
                      <Typography variant="subtitle1" sx={{ mt: 2 }}>Groups</Typography>
                      <FormGroup>
                        {groups.map(gr => (
                          <FormControlLabel
                            key={gr.id}
                            control={<Checkbox checked={selectedGroups.includes(gr.id)} onChange={e => setSelectedGroups(e.target.checked ? [...selectedGroups, gr.id] : selectedGroups.filter(id => id !== gr.id))} />}
                            label={gr.name}
                          />
                        ))}
                      </FormGroup>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={() => setAssignments(prev => { const cp = { ...prev }; delete cp[event.id]; return cp; })}>Cancel</Button>
                      <Button variant="contained" onClick={() => handleAssign(event.id)}>Assign</Button>
                    </DialogActions>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(event)} sx={{ mr: 1 }}>Edit</Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(event.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>{editEvent ? 'Edit Event' : 'Add Event'}</DialogTitle>
        <form onSubmit={e => { e.preventDefault(); handleFormSave({
          name: e.target.name.value,
          date: e.target.date.value,
          location: e.target.location.value,
          description: e.target.description.value,
        }); }}>
          <DialogContent>
            <TextField name="name" label="Name" fullWidth required defaultValue={editEvent?.name || ''} sx={{ mb: 2 }} />
            <TextField name="date" label="Date" fullWidth required defaultValue={editEvent?.date || ''} sx={{ mb: 2 }} />
            <TextField name="location" label="Location" fullWidth defaultValue={editEvent?.location || ''} sx={{ mb: 2 }} />
            <TextField name="description" label="Description" fullWidth defaultValue={editEvent?.description || ''} />
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

export default Events;
