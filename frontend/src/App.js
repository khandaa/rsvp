import React from 'react';
import Dashboard from './components/Dashboard';
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
import PickDrop from './components/PickDrop';
import GuestActivity from './components/GuestActivity';
import { Container } from '@mui/material';

function App() {
  const [section, setSection] = React.useState('dashboard');

  let content;
  switch (section) {
    case 'dashboard':
      content = <DashboardWidgets />;
      break;
    case 'details':
      content = <WeddingDetails />;
      break;
    case 'editDetails':
      content = <WeddingDetails />;
      break;
    case 'shareLinks':
      content = <ShareLinks />;
      break;
    case 'events':
      content = <Events />;
      break;
    case 'guests':
      content = <><GuestList /><GuestForm open={false} /><GuestBulkImport /></>;
      break;
    case 'groups':
      content = <Groups />;
      break;
    case 'rsvp':
      content = <RsvpDashboard />;
      break;
    case 'cohosts':
      content = <CoHosts />;
      break;
    case 'travel':
      content = <TravelInfo />;
      break;
    case 'stay':
      content = <StayArrangements />;
      break;
    case 'pickdrop':
      content = <PickDrop />;
      break;
    case 'notify':
      content = <Notifications />;
      break;
    case 'chatbot':
      content = <Chatbot />;
      break;
    case 'activity':
      content = <GuestActivity />;
      break;
    case 'whatsapp':
      content = <WhatsAppMessaging />;
      break;
    default:
      content = <DashboardWidgets />;
  }

  return (
    <Dashboard section={section} onSectionChange={setSection}>
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {content}
      </Container>
    </Dashboard>
  );
}

export default App;
