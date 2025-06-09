// frontend/src/components/Chatbot.jsx
import React, { useEffect, useState } from 'react';
import { apiRequest } from '../api/index';
import { Paper, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

function Chatbot() {
  const [faq, setFaq] = useState([]);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    const data = await apiRequest('/chatbot/faq');
    setFaq(data);
  };

  const handleAsk = async () => {
    const data = await apiRequest('/chatbot/ask', 'POST', { question });
    setAnswer(data.answer);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Chatbot / FAQ</Typography>
      <Typography variant="subtitle1">Frequently Asked Questions</Typography>
      <List>
        {faq.map((item, idx) => (
          <ListItem key={idx}>
            <ListItemText primary={item.question} secondary={item.answer} />
          </ListItem>
        ))}
      </List>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>Ask a Question</Typography>
      <TextField
        fullWidth
        label="Type your question"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" onClick={handleAsk}>Ask</Button>
      {answer && (
        <Paper sx={{ mt: 2, p: 2 }}>
          <Typography variant="body1"><b>Answer:</b> {answer}</Typography>
        </Paper>
      )}
    </Paper>
  );
}

export default Chatbot;
