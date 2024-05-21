import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Typography,
  Grid,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles'; 

const FamilyTable = ({ members }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const findMemberById = (id) => members.find((member) => member.id === id);

  return (
    <TableContainer component={Paper}>
      {isMobile ? (
        <Grid container spacing={2} padding={2}>
          {members.map((member) => (
            <Grid item xs={12} key={member.id}>
              <Paper style={{ padding: '16px' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <Avatar
                      alt={member.name}
                      src={member.avatarURL || 'https://source.unsplash.com/1600x900/?profile,face,avatar'}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">{member.name}</Typography>
                    <Typography variant="body2">DOB: {member.dateOfBirth ? new Date(member.dateOfBirth).toDateString() : 'N/A'}</Typography>
                    <Typography variant="body2">DOD: {member.dateOfDeath ? new Date(member.dateOfDeath).toDateString() : 'N/A'}</Typography>
                    <Typography variant="body2">Email: {member.email || 'N/A'}</Typography>
                    <Typography variant="body2">Phone: {member.phoneNumber || 'N/A'}</Typography>
                    <Typography variant="body2">Occupation: {member.occupation || 'N/A'}</Typography>
                    <Typography variant="body2">POB: {member.placeOfBirth || 'N/A'}</Typography>
                    <Typography variant="body2">POR: {member.placeOfResidence || 'N/A'}</Typography>
                    <Typography variant="body2">Marital Status: {member.maritalStatus || 'N/A'}</Typography>
                    <Typography variant="body2">Father: {findMemberById(member.fatherId)?.name || 'N/A'}</Typography>
                    <Typography variant="body2">Mother: {findMemberById(member.motherId)?.name || 'N/A'}</Typography>
                    <Typography variant="body2">Spouse: {findMemberById(member.spouseId)?.name || 'N/A'}</Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Date of Death</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Place of Birth</TableCell>
              <TableCell>Place of Residence</TableCell>
              <TableCell>Marital Status</TableCell>
              <TableCell>Father</TableCell>
              <TableCell>Mother</TableCell>
              <TableCell>Spouse</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell>
                  <Avatar alt={member.name} src={member.avatarURL || 'https://source.unsplash.com/1600x900/?profile,face,avatar'} />
                </TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.dateOfBirth ? new Date(member.dateOfBirth).toDateString() : 'N/A'}</TableCell>
                <TableCell>{member.dateOfDeath ? new Date(member.dateOfDeath).toDateString() : 'N/A'}</TableCell>
                <TableCell>{member.email || 'N/A'}</TableCell>
                <TableCell>{member.phoneNumber || 'N/A'}</TableCell>
                <TableCell>{member.occupation || 'N/A'}</TableCell>
                <TableCell>{member.placeOfBirth || 'N/A'}</TableCell>
                <TableCell>{member.placeOfResidence || 'N/A'}</TableCell>
                <TableCell>{member.maritalStatus || 'N/A'}</TableCell>
                <TableCell>{findMemberById(member.fatherId)?.name || 'N/A'}</TableCell>
                <TableCell>{findMemberById(member.motherId)?.name || 'N/A'}</TableCell>
                <TableCell>{findMemberById(member.spouseId)?.name || 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default FamilyTable;
