import React, { useState } from 'react';
import { Box, Grid, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AddMemberIcon from '@mui/icons-material/PersonAdd';
import ViewMembersIcon from '@mui/icons-material/Group';
import AddFamilyIcon from '@mui/icons-material/FamilyRestroom'
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { useNavigate } from 'react-router-dom';
import MemberList from '../components/FamilyTree/MemberList';
import AddMember from '../components/FamilyTree/AddMember';
import Chatroom from '../components/Chat/Chat';
import { Chat } from '@mui/icons-material';

const Dashboard = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("Welcome");
  const [selectedItem, setSelectedItem] = useState("All Members");

  const me = JSON.parse(localStorage.getItem('user-user'))

  const handleLogout = () => {
    signOut(auth);
    navigate('/login');
    localStorage.removeItem('user-user')
  };

  const handleTitleChange = (newTitle, item) => {
    setTitle(newTitle);
    setSelectedItem(item)
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "Add Member":
        return <AddMember />;
      case "All Members":
        return <MemberList />;
      case "Add Family":
        return <AddMember />;
      case "Chatroom":
        return <Chatroom />;
      default:
        return <MemberList />;
    }
  };

  return (
    <>
    {/* Header */}
    <Box 
        sx={{ 
          position: 'fixed', 
          width: '100%', 
          background: 'linear-gradient(90deg, rgba(33,150,243,1) 0%, rgba(3,169,244,1) 50%, rgba(0,188,212,1) 100%)', 
          zIndex: 1000, 
          top: 0, 
          left: 0, 
          padding: '16px 0', 
          color: '#fff',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Welcome {me?.name}, Manage your Family
        </Typography>
        <Typography variant="h6" align="center">
          {title}
        </Typography>
      </Box>

      
      {/* Sidebar and content */}
      <Grid container spacing={2} style={{ marginTop: '120px' }}>
      
        {/* Sidebar */}
        <Grid item xs={4}>
          <Drawer anchor='left' variant='permanent' PaperProps={{ style: { marginTop: '120px' } }}>
            <List>
              <ListItem button onClick={() => handleTitleChange("Loging out")} selected={selectedItem === "Logout"}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" onClick={handleLogout} />
              </ListItem>
              <ListItem button onClick={() => handleTitleChange("Add a New Family Member", "Add Member")} selected={selectedItem === "Add Member"}>
                <ListItemIcon>
                  <AddMemberIcon />
                </ListItemIcon>
                <ListItemText primary="Add Member" />
              </ListItem>
              <ListItem button onClick={() => handleTitleChange("Add a New Family", "Add Family")} selected={selectedItem === "Add Member"}>
                <ListItemIcon>
                  <AddFamilyIcon />
                </ListItemIcon>
                <ListItemText primary="Add Family" />
              </ListItem>
              <ListItem button onClick={() => handleTitleChange("All Members Of Doe's Family", "All Members")} selected={selectedItem === "All Members"}>
                <ListItemIcon>
                  <ViewMembersIcon />
                </ListItemIcon>
                <ListItemText primary="All Members"/>
              </ListItem>
              <ListItem button onClick={() => handleTitleChange("Family Chatroom", "Chatroom")} selected={selectedItem === "Chatroom"}>
                <ListItemIcon>
                  <Chat />
                </ListItemIcon>
                <ListItemText primary="Chatroom"/>
              </ListItem>
            </List>
          </Drawer>
        </Grid>

        {/* Content */}
        <Grid item xs={8}>
          {renderContent()}
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
