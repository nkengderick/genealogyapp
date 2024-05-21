import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Avatar, CssBaseline, Grid, Link, Paper, InputAdornment, IconButton } from "@mui/material";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Email, Lock, LockOutlined, Visibility, VisibilityOff } from '@mui/icons-material';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [members, setMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(membersList);
    };

    fetchMembers();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const member = members.find(member => member.email === email);
      if (!member) {
        setError("You must belong to the family to sign up.");
        return;
      }
      localStorage.setItem('user-user', JSON.stringify(member));
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component='main' maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2, backgroundColor: '#f0f0f0' }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight='bolder' 
          gutterBottom
          textAlign='center'
          sx={{
            color: '#4caf50',
            mb: 4
          }}
        >
          Genealogy App
        </Typography>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Avatar sx={{ m: 1, bgcolor: '#4caf50' }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h4" component="h1" fontWeight='bolder' gutterBottom>
            Sign Up Now
          </Typography>
          <Box component='form' onSubmit={handleRegister} sx={{ mt: 1, display: 'flex', flexDirection: 'column', rowGap: 2, width: '100%', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                )
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3, mb: 2, width: '50%' }}
            >
              Sign Up
            </Button>
            <Grid container>
              <Grid item>
                Already have an account?
                <Link href="/login" variant="body2" color='#4caf50'>
                  {" Sign In"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      {error && <Typography color="error" mt={2} textAlign="center">{error}</Typography>}
    </Container>
  );
};

export default Register;
