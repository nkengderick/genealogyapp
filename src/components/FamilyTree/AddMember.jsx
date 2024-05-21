import React, { useState, useEffect } from 'react';
import { Button, Box, TextField, Container, Typography, MenuItem, Select, FormControl, InputLabel, Stepper, Step, StepLabel } from '@mui/material';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const AddMember = ({ spouse, parent, handleClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [placeOfResidence, setPlaceOfResidence] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('');
  const [occupation, setOccupation] = useState('');
  const [fatherId, setFatherId] = useState(parent && parent.gender === 'Male' ? parent.id : '');
  const [motherId, setMotherId] = useState(parent && parent.gender === 'Female' ? parent.id : '');
  const [spouseId, setSpouseId] = useState(spouse ? spouse.id : '');
  const [error, setError] = useState(null);
  const [availableFathers, setAvailableFathers] = useState([]);
  const [availableMothers, setAvailableMothers] = useState([]);
  const [availableSpouses, setAvailableSpouses] = useState([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const fathers = membersList.filter(member => member.gender === 'Male' && (member.maritalStatus === 'Married' || member.maritalStatus === 'Divorced'));
      const mothers = membersList.filter(member => member.gender === 'Female' && (member.maritalStatus === 'Married' || member.maritalStatus === 'Divorced'));
      const spouses = membersList.filter(member => member.gender !== (parent && parent.gender) && member.maritalStatus === 'Married');

      setAvailableFathers(fathers);
      setAvailableMothers(mothers);
      setAvailableSpouses(spouses);
    };

    fetchMembers();
  }, [parent]);

  const steps = ['Personal Information', 'Additional Information', 'Relationships', 'Review Information'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'members'), {
        name,
        email,
        dateOfBirth,
        placeOfBirth,
        placeOfResidence,
        phoneNumber,
        gender,
        maritalStatus,
        occupation,
        fatherId,
        motherId,
        spouseId,
      });
      (spouse || parent) && handleClose()
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Member
      </Typography>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        {activeStep === 0 && (
          <>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
            />
            <TextField
              label="Place of Birth"
              fullWidth
              margin="normal"
              value={placeOfBirth}
              onChange={(e) => setPlaceOfBirth(e.target.value)}
            />
            <TextField
              label="Place of Residence"
              fullWidth
              margin="normal"
              value={placeOfResidence}
              onChange={(e) => setPlaceOfResidence(e.target.value)}
            />
          </>
        )}
        {activeStep === 1 && (
          <>
            <TextField
              label="Phone Number"
              fullWidth
              margin="normal"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Occupation"
              fullWidth
              margin="normal"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </>
        )}
        {activeStep === 2 && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Father</InputLabel>
              <Select
                value={fatherId}
                onChange={(e) => setFatherId(e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {availableFathers.map(father => (
                  <MenuItem key={father.id} value={father.id}>{father.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Mother</InputLabel>
              <Select
                value={motherId}
                onChange={(e) => setMotherId(e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {availableMothers.map(mother => (
                  <MenuItem key={mother.id} value={mother.id}>{mother.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Marital Status</InputLabel>
              <Select
                value={maritalStatus}
                onChange={(e) => setMaritalStatus(e.target.value)}
              >
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Married">Married</MenuItem>
                <MenuItem value="Divorced">Divorced</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Spouse</InputLabel>
              <Select
                value={spouseId}
                onChange={(e) => setSpouseId(e.target.value)}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {availableSpouses.map(spouse => (
            <MenuItem key={spouse.id} value={spouse.id}>{spouse.name}</MenuItem>
          ))}
              </Select>
            </FormControl>
          </>
        )}
        {activeStep === 3 && (
          <>
            <Typography variant="h6">Review Information</Typography>
            <Typography variant="body1">Name: {name}</Typography>
            <Typography variant="body1">Email: {email}</Typography>
            <Typography variant="body1">Date of Birth: {dateOfBirth}</Typography>
            <Typography variant="body1">Place of Birth: {placeOfBirth}</Typography>
            <Typography variant="body1">Place of Residence: {placeOfResidence}</Typography>
            <Typography variant="body1">Phone Number: {phoneNumber}</Typography>
            <Typography variant="body1">Gender: {gender}</Typography>
            <Typography variant="body1">Marital Status: {maritalStatus}</Typography>
            <Typography variant="body1">Occupation: {occupation}</Typography>
            <Typography variant="body1">Father: {fatherId ? fatherId : 'None'}</Typography>
            <Typography variant="body1">Mother: {motherId ? motherId : 'None'}</Typography>
            <Typography variant="body1">Spouse: {spouseId ? spouseId : 'None'}</Typography>
          </>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} variant="contained">
              Back
            </Button>
          )}
          {activeStep < steps.length - 1 && (
            <Button onClick={handleNext} variant="contained" color="primary">
              Next
            </Button>
          )}
          {activeStep === steps.length - 1 && (
            <Button type="submit" variant="contained" color="primary">
              Add Member
            </Button>
          )}
        </Box>
      </form>
    </Container>
  );
};

export default AddMember;

