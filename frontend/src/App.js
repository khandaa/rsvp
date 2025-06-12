import './App.css';
import React, { useState, useContext, useEffect } from 'react';
import { Container, Box, CircularProgress, Typography, Alert } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';

// Component imports
import GuestList from './components/GuestList';
import GuestForm from './components/GuestForm';
import GuestBulkImport from './components/GuestBulkImport';
import Groups from './components/Groups';
import RsvpDashboard from './components/RsvpDashboard';
import Events from './components/Events';
import Logistics from './components/Logistics';
import Notifications from './components/Notifications';
import Chatbot from './components/Chatbot';
import WhatsAppMessaging from './components/WhatsAppMessaging';
import DashboardWidgets from './components/DashboardWidgets';
import WeddingDetails from './components/WeddingDetails';
import ShareLinks from './components/ShareLinks';
import CoHosts from './components/CoHosts';
import TravelInfo from './components/TravelInfo';
import StayArrangements from './components/StayArrangements';
import Hotels from './components/Hotels';
import Rooms from './components/Rooms';
import PickDrop from './components/PickDrop';
import GuestActivity from './components/GuestActivity';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';

// Auth context
import { AuthProvider, AuthContext } from './context/AuthContext';

// Main app wrapper component with auth provider
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

// Component that handles routing based on auth state
function AppRoutes() {
  const { currentUser, loading, error } = useContext(AuthContext);
  const [activeEvent, setActiveEvent] = useState(null);
  
  // If still checking auth state, show loading
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" />} />
      
      {/* Protected routes */}
      <Route path="/" element={currentUser ? <MainApp /> : <Navigate to="/login" />} />
      <Route path="*" element={<Navigate to={currentUser ? "/" : "/login"} />} />
    </Routes>
  );
}

// Component for the main application after login
function MainApp() {
  const { currentUser, logout } = useContext(AuthContext);
  const [section, setSection] = useState('dashboard');
  const [selectedEventId, setSelectedEventId] = useState(null);
  
  // Function to handle event selection from UserDashboard
  const handleEventSelect = (eventId) => {
    setSelectedEventId(eventId);
    setSection('dashboard'); // Show dashboard for selected event
  };

  // Check if we're showing the user dashboard or an event dashboard
  if (!selectedEventId) {
    return (
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <UserDashboard 
          user={currentUser} 
          onEventSelect={handleEventSelect} 
          onLogout={logout}
        />
      </Container>
    );
  }
  
  // If an event is selected, show the event-specific dashboard
  let content;
  switch (section) {
    case 'dashboard':
      content = <DashboardWidgets eventId={selectedEventId} />;
      break;
    case 'details':
      content = <WeddingDetails eventId={selectedEventId} />;
      break;
    case 'editDetails':
      content = <WeddingDetails eventId={selectedEventId} />;
      break;
    case 'shareLinks':
      content = <ShareLinks eventId={selectedEventId} />;
      break;
    case 'events':
      content = <Events eventId={selectedEventId} />;
      break;
    case 'guests':
      content = (
        <>
          <GuestList eventId={selectedEventId} />
          <GuestForm open={false} eventId={selectedEventId} />
          <GuestBulkImport eventId={selectedEventId} />
        </>
      );
      break;
    case 'groups':
      content = <Groups eventId={selectedEventId} />;
      break;
    case 'rsvp':
      content = <RsvpDashboard eventId={selectedEventId} />;
      break;
    case 'cohosts':
      content = <CoHosts eventId={selectedEventId} />;
      break;
    case 'travel':
      content = <TravelInfo eventId={selectedEventId} />;
      break;
    case 'stay':
      content = <StayArrangements eventId={selectedEventId} />;
      break;
    case 'hotels':
      content = <Hotels eventId={selectedEventId} />;
      break;
    case 'rooms':
      content = <Rooms eventId={selectedEventId} />;
      break;
    case 'pickdrop':
      content = <PickDrop eventId={selectedEventId} />;
      break;
    case 'notify':
      content = <Notifications eventId={selectedEventId} />;
      break;
    case 'chatbot':
      content = <Chatbot eventId={selectedEventId} />;
      break;
    case 'activity':
      content = <GuestActivity eventId={selectedEventId} />;
      break;
    case 'whatsapp':
      content = <WhatsAppMessaging eventId={selectedEventId} />;
      break;
    case 'back':
      // Go back to user dashboard
      setSelectedEventId(null);
      return null;
    default:
      content = <DashboardWidgets eventId={selectedEventId} />;
  }

  const handleBackToEvents = () => {
    setSelectedEventId(null);
  };

  return (
    <Dashboard 
      section={section} 
      onSectionChange={setSection} 
      eventId={selectedEventId}
      onBackToEvents={handleBackToEvents}
    >
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {content}
      </Container>
    </Dashboard>
  );
}

export default App;
