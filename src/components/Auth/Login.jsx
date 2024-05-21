import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Avatar, CssBaseline, Grid, Link, Paper } from "@mui/material";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { LockOutlined } from '@mui/icons-material';
import { auth, db } from '../../utils/firebase';
import { collection, getDocs } from 'firebase/firestore';
//import importMembers from '../../utils/members';

const Login = () => {
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const member = members.find(member => member.email === email);
      if (!member) {
        setError("You must belong to the family to sign up.");
        return;
      }
      localStorage.setItem('user-user', JSON.stringify(member));
      await signInWithEmailAndPassword(auth, email, password);
      //importMembers()
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component='main' maxWidth="sm">
      <CssBaseline />
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 2 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight='bolder' 
          gutterBottom
          textAlign='center'
          sx={{
            background: 'linear-gradient(80deg, #007bff, #4caf50, #800080)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            MozBackgroundClip: 'text',
          }}
        >
          Genealogy App
        </Typography>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Typography variant="h4" component="h1" fontWeight='bolder' gutterBottom>
            Welcome Back
          </Typography>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
          </Avatar>
          <Typography variant="h5" component="h1" color='primary' gutterBottom>
            Sign In to Continue
          </Typography>
          <Box component='form' onSubmit={handleLogin} sx={{ mt: 1, display: 'flex', flexDirection: 'column', rowGap: 2, width: '100%', alignItems: 'center' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type='password'
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 3, mb: 2, width: '50%' }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                Don't have an account?
                <Link href="/register" variant="body2" color='secondary'>
                  {" Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Paper>
      {error && <Typography color="error">{error}</Typography>}
    </Container>
  );
};

export default Login;
