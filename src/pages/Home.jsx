import React, { useState, useEffect } from "react";
import { Button, Container, Typography, AppBar, Toolbar, Box, Grid, Paper, Avatar } from "@mui/material";
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import buildFamilyTree from "../hooks/buildFamilyTree";

const Background = styled('div')({
  backgroundImage: `url('/bgfamily.avif')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  height: '100vh',
  width: '100%',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: -1,
  opacity: 0.7,
});

const Home = () => {
  const [families, setFamilies] = useState([]);
  
  useEffect(() => {
    const fetchFamilies = async () => {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const MemberList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const familiesList = buildFamilyTree(MemberList)
      setFamilies(familiesList);
    };
    fetchFamilies();
  }, []);

  return (
    <Box>
      <Background />
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <Typography 
            variant="h6" 
            style={{ 
              flexGrow: 1,
              background: 'linear-gradient(80deg, #007bff, #4caf50, #800080)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              MozBackgroundClip: 'text',
            }}
          >
            Genealogy App
          </Typography>
          <Button color="inherit" href="/login">Login</Button>
          <Button color="inherit" href="/register">Register</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Box sx={{ textAlign: 'center', color: 'white', mt: 8 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to the Genealogy App
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom>
            Track your family lineage for generations to come.
          </Typography>
        </Box>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center', color: 'white' }}>
            Families
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {families.map(family => (
              <Grid item key={family.id} xs={12} sm={6} md={4}>
                <Paper elevation={3} sx={{ p: 2, textAlign: 'center', display: 'flex', gap: 3 }}>
                  <Avatar src={family.avatar} />
                  <Typography variant="h6">{family.name}</Typography>
                </Paper>
                <Button variant="contained" color="primary" href="/register" sx={{ mt: 3 }}>
                  Get Started
                </Button>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container >
    </Box >
  );
};

export default Home;
