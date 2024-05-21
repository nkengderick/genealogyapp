import React, { useState } from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    IconButton,
    Grid,
    FormControl,
    Select,
    MenuItem,
    Box,
    TextField,
    Tooltip,
    Typography,
    Card,
    CardContent,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Paper,
    Chip,
    Divider,
} from '@mui/material';
import {
    ExpandMore,
    Edit,
    Mail,
    LocationOn,
    Phone,
    Cake,
    Male,
    Female,
    WbSunny,
    Brightness3,
} from '@mui/icons-material';

const FamilyMemberList = ({ familyMembers, handleToggle, handleAvatarChange, assignParentOrSpouse }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredMembers = familyMembers?.filter(member => {
        const searchLower = searchQuery.toLowerCase();
        return (
            member.name.toLowerCase().includes(searchLower) ||
            member.placeOfBirth.toLowerCase().includes(searchLower) ||
            member.placeOfResidence.toLowerCase().includes(searchLower)
        );
    });

    const members = filteredMembers?.length > 0 ? filteredMembers : familyMembers

    return (
        <>
            <TextField
                label="Search Family Members"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <List>
                {members?.map((member) => (
                    <Card key={member.id} variant="outlined" sx={{ mb: 2 }}>
                        <Accordion>
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <ListItem button onClick={() => handleToggle(member.id)}>
                                    <ListItemAvatar>
                                        <Avatar alt={member.name} src={member.avatarURL || 'https://source.unsplash.com/1600x900/?profile,face,avatar'} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={member.name}
                                        secondary={`Born: ${member.dateOfBirth} in ${member.placeOfBirth}`}
                                    />
                                </ListItem>
                            </AccordionSummary>
                            <AccordionDetails>
                                <CardContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Paper elevation={3} sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                                <Typography variant='h4' gutterBottom>
                                                    {member.name}
                                                </Typography>
                                                <Box
                                                    sx={{
                                                        position: 'relative',
                                                        width: '100px',
                                                        height: '100px',
                                                        '&:hover .overlay': {
                                                            opacity: 1,
                                                        },
                                                        '&:hover .avatar': {
                                                            filter: 'blur(2px)',
                                                        },
                                                    }}
                                                >
                                                    <Avatar
                                                        alt={member.name}
                                                        src={member.avatarURL}
                                                        sx={{ width: 100, height: 100 }}
                                                        className="avatar"
                                                    />
                                                    <Box
                                                        className="overlay"
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 0,
                                                            left: 0,
                                                            width: '100%',
                                                            height: '100%',
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            borderRadius: '50%',
                                                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                                            color: '#fff',
                                                            opacity: 0,
                                                            transition: 'opacity 0.3s',
                                                        }}
                                                    >
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                            id={`upload-button-${member.id}`}
                                                            onChange={(e) => handleAvatarChange(member.id, e)}
                                                        />
                                                        <label htmlFor={`upload-button-${member.id}`}>
                                                            <Tooltip title="Change Avatar">
                                                                <IconButton component="span" sx={{ color: '#fff' }}>
                                                                    <Edit />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </label>
                                                    </Box>
                                                </Box>
                                                <Divider />
                                                <div>
                                                    <Typography variant="body1" gutterBottom>
                                                        <Mail /> {member.email}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <LocationOn /> {member.placeOfResidence}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <Phone /> {member.phoneNumber}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        {member.gender === 'Male' ? <Male /> : <Female />} {member.gender}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <Cake /> {member.maritalStatus}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <Edit /> {member.occupation}
                                                    </Typography>
                                                </div>
                                                <Divider />
                                                {member.dateOfDeath ?
                                                    (
                                                        <Typography variant="body1" gutterBottom>
                                                            <WbSunny sx={{ mr: 1 }} /> Sunrise: {member.dateOfBirth}
                                                            <br />
                                                            <Brightness3 sx={{ mr: 1 }} /> Sunset: {member.dateOfDeath}
                                                        </Typography>
                                                    ) :
                                                    (
                                                        <Box display='flex' gap={2}>
                                                            <Chip
                                                                label="Email"
                                                                component="a"
                                                                avatar={<Mail sx={{ borderRadius: "50%" }} />}
                                                                href={`mailto://${member.email}`}
                                                                variant="contained"
                                                                color="primary"
                                                                clickable
                                                            />
                                                            <Chip
                                                                label='Contact'
                                                                avatar={<Phone sx={{ borderRadius: "50%" }} />}
                                                                component="a"
                                                                href={`tel:${member.phoneNumber}`}
                                                                variant="outlined"
                                                                color="primary"
                                                                clickable
                                                            />
                                                        </Box>
                                                    )
                                                }
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12} md={6}>

                                            <FormControl fullWidth>
                                                <SelectAndEdit
                                                    label="Father"
                                                    value={member.fatherId || ''}
                                                    onChange={(e) => assignParentOrSpouse(member.id, 'fatherId', e.target.value)}
                                                    members={members}
                                                    dateOfBirth={member.dateOfBirth}
                                                    gender="Male"
                                                />
                                            </FormControl>
                                            <FormControl fullWidth>
                                                <SelectAndEdit
                                                    label="Mother"
                                                    value={member.motherId || ''}
                                                    onChange={(e) => assignParentOrSpouse(member.id, 'motherId', e.target.value)}
                                                    members={members}
                                                    dateOfBirth={member.dateOfBirth}
                                                    gender="Female"
                                                />
                                            </FormControl>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', mb: 2 }}>
                                                <Typography variant="body1" gutterBottom>
                                                    Spouse:
                                                </Typography>
                                                <FormControl fullWidth>
                                                    <Select
                                                        value={member.spouseId || ''}
                                                        onChange={(e) => assignParentOrSpouse(member.id, 'spouseId', e.target.value)}
                                                        displayEmpty
                                                        inputProps={{ 'aria-label': 'Spouse' }}
                                                    >
                                                        <MenuItem value="">{member.maritalStatus === 'Married' ? 'Select Spouse' : 'Add Spouse'}</MenuItem>
                                                        {members
                                                            .filter(m => m.id !== member.id && m.gender !== member.gender)
                                                            .map(spouse => (
                                                                <MenuItem key={spouse.id} value={spouse.id}>{spouse.name}</MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Children:</strong>
                                            </Typography>
                                            <List>
                                                {members
                                                    .filter(child => child.fatherId === member.id || child.motherId === member.id)
                                                    .map(child => (
                                                        <ListItem key={child.id}>
                                                            <ListItemText primary={child.name} />
                                                        </ListItem>
                                                    ))}
                                            </List>
                                            <FamilyMemberList
                                                familyMembers={members.filter(child => child.fatherId === member.id || child.motherId === member.id)}
                                                handleToggle={handleToggle}
                                                handleAvatarChange={handleAvatarChange}
                                                assignParentOrSpouse={assignParentOrSpouse}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </AccordionDetails>
                        </Accordion>
                    </Card>
                ))}
            </List>
        </>
    );
};

// Custom component to render Select with Edit icon
const SelectAndEdit = ({ label, value, onChange, members, gender, dateOfBirth, excludeIds = [] }) => {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="body1" gutterBottom>
                {label}:
            </Typography>
            <Select
                value={value}
                onChange={onChange}
                displayEmpty
                fullWidth
                inputProps={{ 'aria-label': label }}
            >
                <MenuItem value="">Select {label}</MenuItem>
                {!label.includes('spouse') && members
                    .filter(m => m.gender === gender && !excludeIds.includes(m.id) && (m.maritalStatus !== 'Single') && new Date(m.dateOfBirth) < new Date(dateOfBirth))
                    .map(person => (
                        <MenuItem key={person.id} value={person.id}>{person.name}</MenuItem>
                    ))}
                {label.includes('spouse') && members
                    .filter(m => m.gender === gender && !excludeIds.includes(m.id))
                    .map(person => (
                        <MenuItem key={person.id} value={person.id}>{person.name}</MenuItem>
                    ))}
            </Select>
        </Box>
    );
};

export default FamilyMemberList;
