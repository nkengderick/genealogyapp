import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const FamiliesPage = ({ onFamilyClick }) => {
  const [families, setFamilies] = useState([]);

  useEffect(() => {
    const fetchFamilies = async () => {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const members = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const familyHeads = members.filter(member => member.gender === 'Male' && member.maritalStatus !== 'Single');
      setFamilies(familyHeads);
    };

    fetchFamilies();
  }, []);

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Families
      </Typography>
      <List>
        {families.map((family) => (
          <ListItem key={family.id} button onClick={() => onFamilyClick(family)}>
            <ListItemText primary={`${family.name.split(' ')[0]}'s Family`} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default FamiliesPage;
