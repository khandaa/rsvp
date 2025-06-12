// frontend/src/components/GuestList.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { 
  Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, 
  TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Select, FormControl, InputLabel, Box
} from '@mui/material';
import * as XLSX from 'xlsx';

function GuestList({ onEditGuest }) {
  const [guests, setGuests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editGuest, setEditGuest] = useState(null);
  const [groupFilter, setGroupFilter] = useState('all');
  const [groupMap, setGroupMap] = useState({});

  useEffect(() => {
    fetchGuests();
    fetchGroups();
  }, []);

  const fetchGuests = async () => {
    try {
      const data = await apiRequest('/guests/');
      setGuests(data);
    } catch (error) {
      console.error("Error fetching guests:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const data = await apiRequest('/groups/');
      setGroups(data);
      
      // Create a mapping of group ids to group names
      const mapping = {};
      data.forEach(group => {
        mapping[group.id] = group.name;
      });
      setGroupMap(mapping);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const getGroupName = (groupId) => {
    return groupId && groupMap[groupId] ? groupMap[groupId] : 'No Group';
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
    // Prepare data with group names instead of ids for export
    const exportData = filteredGuests.map(guest => ({
      ...guest,
      group: getGroupName(guest.group_id)
    }));
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guests');
    XLSX.writeFile(wb, 'guests.xlsx');
  };

  // Filter guests by search term and selected group
  const filteredGuests = guests.filter(
    (g) => {
      // First apply group filter if not "all"
      if (groupFilter !== 'all' && g.group_id != groupFilter) {
        return false;
      }
      
      // Then apply text search
      return g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.email.toLowerCase().includes(search.toLowerCase()) ||
        (g.phone && g.phone.toLowerCase().includes(search.toLowerCase())) ||
        (getGroupName(g.group_id).toLowerCase().includes(search.toLowerCase())) ||
        (g.rsvp_status && g.rsvp_status.toLowerCase().includes(search.toLowerCase()));
    }
  );

  // Group guests by their group
  const guestsByGroup = () => {
    const grouped = {};
    
    // Initialize with "No Group" category
    grouped["No Group"] = [];
    
    // Initialize with all available groups
    groups.forEach(group => {
      grouped[group.name] = [];
    });
    
    // Sort guests into their groups
    filteredGuests.forEach(guest => {
      const groupName = getGroupName(guest.group_id);
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(guest);
    });
    
    return grouped;
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Guest List</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button variant="contained" onClick={handleAdd}>Add Guest</Button>
        <Button variant="outlined" href={require('../sample-guests.csv')} download>Download Sample CSV</Button>
        <Button variant="outlined" onClick={handleExport}>Export to Excel</Button>
        
        <FormControl sx={{ minWidth: 150, mr: 1 }}>
          <InputLabel>Filter by Group</InputLabel>
          <Select
            value={groupFilter}
            label="Filter by Group"
            onChange={(e) => setGroupFilter(e.target.value)}
            size="small"
          >
            <MenuItem value="all">All Groups</MenuItem>
            {groups.map(group => (
              <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
            ))}
            <MenuItem value={null}>No Group</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Search guests"
          variant="outlined"
          size="small"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </Box>
      
      {groupFilter === 'all' && search === '' ? (
        // Grouped view when no filters are active
        Object.entries(guestsByGroup()).map(([groupName, groupGuests]) => 
          groupGuests.length > 0 && (
            <Box key={groupName} sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mt: 2, mb: 1, borderBottom: '1px solid #ccc', pb: 1 }}>
                {groupName} ({groupGuests.length})
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Phone</TableCell>
                      <TableCell>RSVP Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupGuests.map(guest => (
                      <TableRow key={guest.id}>
                        <TableCell>{guest.name}</TableCell>
                        <TableCell>{guest.email}</TableCell>
                        <TableCell>{guest.phone}</TableCell>
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
            </Box>
          )
        )
      ) : (
        // Filtered view
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
                  <TableCell>{getGroupName(guest.group_id)}</TableCell>
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
      )}
      
      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>{editGuest ? 'Edit Guest' : 'Add Guest'}</DialogTitle>
        <form onSubmit={e => { 
          e.preventDefault(); 
          handleFormSave({
            name: e.target.name.value,
            email: e.target.email.value,
            phone: e.target.phone.value,
            group_id: e.target.group_id.value || null,
          }); 
        }}>
          <DialogContent>
            <TextField name="name" label="Name" fullWidth required defaultValue={editGuest?.name || ''} sx={{ mb: 2 }} />
            <TextField name="email" label="Email" fullWidth required defaultValue={editGuest?.email || ''} sx={{ mb: 2 }} />
            <TextField name="phone" label="Phone" fullWidth defaultValue={editGuest?.phone || ''} sx={{ mb: 2 }} />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Group</InputLabel>
              <Select
                name="group_id"
                label="Group"
                defaultValue={editGuest?.group_id || ''}
              >
                <MenuItem value="">No Group</MenuItem>
                {groups.map(group => (
                  <MenuItem key={group.id} value={group.id}>{group.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
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
