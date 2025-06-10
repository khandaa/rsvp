// frontend/src/components/Dashboard.jsx
import React from 'react';
import { Box, Drawer, Toolbar, Typography, IconButton, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import GroupIcon from '@mui/icons-material/Group';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ChatIcon from '@mui/icons-material/Chat';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import LogoutIcon from '@mui/icons-material/Logout';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import BarChartIcon from '@mui/icons-material/BarChart';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const drawerWidth = 260;

const menuTree = [
  {
    text: 'Wedding Dashboard',
    icon: <DashboardIcon color="primary" />, section: 'dashboard',
  },
  {
    text: 'Wedding Details',
    icon: <EventIcon color="secondary" />, section: 'details',
    children: [
      { text: 'Edit Details', icon: <ListAltIcon color="secondary" />, section: 'editDetails' },
      { text: 'Share Links', icon: <ListAltIcon color="secondary" />, section: 'shareLinks' },
    ]
  },
  {
    text: 'Schedule/Events',
    icon: <EventIcon color="info" />, section: 'events',
  },
  {
    text: 'Guests',
    icon: <PeopleIcon color="success" />, section: null,
    children: [
      { text: 'Guest List', icon: <GroupIcon color="success" />, section: 'guests' },
      { text: 'Groups', icon: <GroupIcon color="success" />, section: 'groups' },
      { text: 'RSVP Status', icon: <ListAltIcon color="success" />, section: 'rsvp' },
      { text: 'Co-Hosts', icon: <GroupIcon color="success" />, section: 'cohosts' },
    ]
  },
  {
    text: 'Logistics',
    icon: <DirectionsCarIcon color="warning" />, section: null,
    children: [
      { text: 'Travel Info', icon: <FlightIcon color="warning" />, section: 'travel' },
      { text: 'Stay Arrangements', icon: <HotelIcon color="warning" />, section: 'stay' },
      { text: 'Pick & Drop', icon: <DirectionsCarIcon color="warning" />, section: 'pickdrop' },
    ]
  },
  {
    text: 'Notifications',
    icon: <NotificationsIcon color="error" />, section: null,
    children: [
      { text: 'Notify Guests', icon: <NotificationsIcon color="error" />, section: 'notify' },
      { text: 'Run Chatbot', icon: <ChatIcon color="error" />, section: 'chatbot' },
    ]
  },
  {
    text: 'Guest Activity',
    icon: <BarChartIcon color="info" />, section: 'activity',
  },
  {
    text: 'WhatsApp',
    icon: <WhatsAppIcon sx={{ color: '#25D366' }} />, section: 'whatsapp',
  },
];

function SidebarMenu({ menu, section, onSectionChange }) {
  const [open, setOpen] = React.useState({});

  const handleClick = (idx) => {
    setOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <List>
      {menu.map((item, idx) => (
        <React.Fragment key={item.text}>
          <ListItem
            button
            selected={section === item.section}
            onClick={() => {
              if (item.children) handleClick(idx);
              else if (item.section) onSectionChange(item.section);
            }}
            sx={{ pl: item.children ? 2 : 1, fontWeight: section === item.section ? 'bold' : 'normal', fontSize: 16 }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
            {item.children ? (open[idx] ? <ExpandLess /> : <ExpandMore />) : null}
          </ListItem>
          {item.children && (
            <Collapse in={open[idx]} timeout="auto" unmountOnExit>
              <SidebarMenu menu={item.children} section={section} onSectionChange={onSectionChange} />
            </Collapse>
          )}
        </React.Fragment>
      ))}
    </List>
  );
}

function Dashboard({ children, onSectionChange, section }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap fontWeight={700} color="primary">RSVP Me</Typography>
      </Toolbar>
      <Divider />
      <SidebarMenu menu={menuTree} section={section} onSectionChange={onSectionChange} />
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon><LogoutIcon color="action" /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, bgcolor: '#f8f9fa' }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}

export default Dashboard;
