import React, { useState } from 'react';
import { Avatar, Box, Typography, Grid, Button, Collapse, ListItem, ListItemAvatar, ListItemText, List, Divider, Card, CardActions, Select, FormControl, MenuItem, Modal, Paper, Fade, Backdrop } from '@mui/material';
import buildFamilyTree from '../../hooks/buildFamilyTree';
import styled from '@emotion/styled/macro';
import { Email, Phone, Work } from '@mui/icons-material';
import AddMember from './AddMember';

const FamilyTreeNode = ({ member }) => {

  const [open, setOpen] = useState({});
  const [showAddSpouse, setShowAddSpouse] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);

  const me = localStorage.getItem('member-user')

  const handleToggle = (id) => {
    setOpen(prevOpen => ({ ...prevOpen, [id]: !prevOpen[id] }));
  };

  const HorizontalLine = styled('div')({
    borderTop: '2px solid #000',
    width: '50px',
    margin: '0 auto',
  });

  const VerticalLine = styled('div')({
    borderLeft: '2px solid #000',
    height: '40px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-1px)',
  });

  const handleCloseModal = () => {
    setShowAddChild(false);
    setShowAddSpouse(false);
  };

  return (
    <Box sx={{ textAlign: 'center', margin: '0 20px' }}>
      <Paper elevation={3} sx={{ padding: '20px', maxWidth: 300 }}>
        <Avatar alt={member.name} src={member.avatarURL || 'https://source.unsplash.com/1600x900/?profile,face,avatar'} sx={{ width: 80, height: 80, margin: '0 auto' }} />
        <Typography variant="body1">{member.name}</Typography>
        <Typography variant="body2">{new Date(member.dateOfBirth).toDateString()}</Typography>
        <Button variant='outlined' onClick={() => handleToggle(member.id)}>View More</Button>
        {/**children */}
        <Collapse in={open && open[member.id]} timeout='auto' unmountOnExit>
          <Card sx={{ marginTop: 10 }}>
            <List>
              {member.spouse && (
                <ListItem>
                  <ListItemAvatar>
                    <Avatar alt={member.name} src={member.spouse?.avatarURL || "https://source.unsplash.com/1600x900/?profile,face,avatar"} />
                  </ListItemAvatar>
                  <ListItemText primary='Married To' secondary={member.spouse.name} />
                </ListItem>
              )}
              <Divider variant='middle' />
              <ListItem>
                <ListItemAvatar>
                  <Phone />
                </ListItemAvatar>
                <ListItemText primary='Contact' secondary={member.phoneNumber} />
              </ListItem>
              <Divider variant='middle' />
              <ListItem>
                <ListItemAvatar>
                  <Email />
                </ListItemAvatar>
                <ListItemText primary='Email' secondary={member.email} />
              </ListItem>
              <Divider variant='middle' />
              <ListItem>
                <ListItemAvatar>
                  <Work />
                </ListItemAvatar>
                <ListItemText primary='Occupation' secondary={member.occupation} />
              </ListItem>
              <Divider variant='middle' />
              {member.dateOfDeath && (
                <>
                  <ListItem>
                    <ListItemText primary='Date of Death' secondary={new Date(member.dateOfDeath).toDateString()} />
                  </ListItem>
                  <Divider variant='middle' />
                </>
              )}
            </List>
            <CardActions>
              {member.maritalStatus !== 'Married' && <Button size="small" onClick={() => setShowAddSpouse(true)} sx={{ color: '#3f51b5', '&:hover': { backgroundColor: '#3f51b5', color: '#fff' } }}>Add Spouse</Button>}
              <Button size="small" onClick={() => setShowAddChild(true)} sx={{ color: '#3f51b5', '&:hover': { backgroundColor: '#3f51b5', color: '#fff' } }}>Add a Child</Button>
            </CardActions>
          </Card>
        </Collapse>
      </Paper>
      {member.children.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          {member.children.map(child => (
            <FamilyTreeNode key={child.id} member={child} />
          ))}
        </Box>
      )}

      {/* Modal for adding spouse or child */}
      <Modal
        open={showAddChild || showAddSpouse}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          onClick: () => { setShowAddChild(false); setShowAddSpouse(false) }
        }}
      >
        <Fade in={showAddChild || showAddSpouse}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Box
              sx={{
                p: 4,
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                maxWidth: 600,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <AddMember parent={member} spouse={member} handleClose={handleCloseModal} />
              <Button onClick={handleCloseModal} sx={{ marginTop: 2 }}>Cancel</Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

const FamilyTree = ({ members, handleToggle, handleAvatarChange, assignParentOrSpouse }) => {
  const tree = buildFamilyTree(members);
  return (
    <Box sx={{ textAlign: 'center' }}>
      {tree.map(rootMember => (
        <FamilyTreeNode
          key={rootMember.id}
          member={rootMember}
          handleAvatarChange={handleAvatarChange}
          handleToggle={handleToggle}
          assignParentOrSpouse={assignParentOrSpouse}
        />
      ))}
    </Box>
  );
};

export default FamilyTree;
