// frontend/src/components/Groups.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

function Groups() {
  const [groups, setGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editGroup, setEditGroup] = useState(null);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const data = await apiRequest('/groups/');
      setGroups(data);
    } catch (error) {
      // handle error
    }
  };

  const handleEdit = (group) => {
    setEditGroup(group);
    setOpenForm(true);
  };

  const handleDelete = async (groupId) => {
    await apiRequest(`/groups/${groupId}`, 'DELETE');
    fetchGroups();
  };

  const handleAdd = () => {
    setEditGroup(null);
    setOpenForm(true);
  };

  const handleFormClose = () => {
    setOpenForm(false);
    setEditGroup(null);
  };

  const handleFormSave = async (form) => {
    if (editGroup) {
      await apiRequest(`/groups/${editGroup.id}`, 'PUT', form);
    } else {
      await apiRequest('/groups/', 'POST', form);
    }
    fetchGroups();
    handleFormClose();
  };

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      (g.description && g.description.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Groups</Typography>
      <Button variant="contained" sx={{ mr: 1 }} onClick={handleAdd}>Add Group</Button>
      <TextField
        label="Search groups"
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
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGroups.map(group => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => handleEdit(group)} sx={{ mr: 1 }}>Edit</Button>
                  <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(group.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openForm} onClose={handleFormClose}>
        <DialogTitle>{editGroup ? 'Edit Group' : 'Add Group'}</DialogTitle>
        <form onSubmit={e => { e.preventDefault(); handleFormSave({
          name: e.target.name.value,
          description: e.target.description.value
        }); }}>
          <DialogContent>
            <TextField name="name" label="Name" fullWidth required defaultValue={editGroup?.name || ''} sx={{ mb: 2 }} />
            <TextField name="description" label="Description" fullWidth defaultValue={editGroup?.description || ''} />
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

export default Groups;
