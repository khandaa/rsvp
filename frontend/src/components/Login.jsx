// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { Box, TextField, Button, Typography, Paper, CircularProgress, Alert, Link, Stack, Snackbar } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { apiRequest } from '../api';  // Still needed for password reset
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const { login, register, loading, error, setError } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isLogin) {
        // Use AuthContext login method
        await login(formData.email, formData.password);
        // Navigate to home page on successful login
        // (AuthContext will handle token storage)
        navigate('/');
      } else {
        // Use AuthContext register method
        const userData = { 
          username: formData.username, 
          email: formData.email, 
          password: formData.password, 
          phone: formData.phone 
        };
        await register(userData);
        
        // Show success message and switch to login
        alert('Registration successful! Please login.');
        setIsLogin(true);
        // Clear form except email
        setFormData({
          ...formData,
          username: '',
          password: '',
          phone: ''
        });
        setError(null);
      }
    } catch (err) {
      // Error handling is done by AuthContext, but we can add UI-specific handling here
      console.error('Authentication error:', err);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Please enter your email address first');
      return;
    }

    try {
      await apiRequest('/api/users/reset-password-request', 'POST', { email: formData.email });
      setError(null);
      // Show success message
      alert('If your email is registered, you will receive a password reset link.');
    } catch (err) {
      setError(err.message || 'Failed to process request');
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '80vh' 
    }}>
      <Paper 
        elevation={3} 
        sx={{ 
          padding: 4, 
          width: '100%', 
          maxWidth: 400,
          borderRadius: 2
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary" gutterBottom>
            RSVP Me
          </Typography>
          <Typography variant="h5">
            {isLogin ? 'Sign In' : 'Create Account'}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            {!isLogin && (
              <>
                <TextField
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  required
                />
                <TextField
                  label="Phone (optional)"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                />
              </>
            )}
            <TextField
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              required
            />
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={<LoginIcon />}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : (isLogin ? 'Login' : 'Register')}
            </Button>
          </Stack>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          {isLogin && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              <Link 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleForgotPassword();
                }}
                color="primary"
                underline="hover"
              >
                Forgot password?
              </Link>
            </Typography>
          )}
          <Typography variant="body2">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <Link 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                toggleMode();
              }}
              color="primary"
              underline="hover"
            >
              {isLogin ? 'Create one' : 'Sign in'}
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default Login;
