import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, Paper, ListItemAvatar, Avatar, IconButton } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { addDoc, getDocs, collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../utils/firebase';

const Chatroom = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const me = JSON.parse(localStorage.getItem('user-user'));
    const [members, setMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = async () => {
            const querySnapshot = await getDocs(collection(db, 'members'));
            const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort members by date of birth
            membersList.sort((a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth));
            setMembers(membersList);
        };

        fetchMembers();
    }, []);

    // Function to send a message
    const sendMessage = async () => {
        try {
            // Add the new message to Firestore
            await addDoc(collection(db, 'messages'), {
                author: me.name,
                message: newMessage,
                timestamp: new Date().toISOString(),
            });
            // Clear the input field after sending the message
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    // useEffect to listen for new messages from Firestore
    useEffect(() => {
        const q = query(collection(db, 'messages'), orderBy('timestamp'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newMessages = [];
            querySnapshot.forEach((doc) => {
                newMessages.push(doc.data());
            });
            setMessages(newMessages);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <Box
            component={Paper}
            elevation={3}
            p={3}
            mt={4}
            mb={4}
            sx={{
                borderRadius: 2,
                backgroundImage: `url('https://source.unsplash.com/1600x900/?nature,water')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Typography variant="h4" align="center" mb={2} color="primary">
                Family Chatroom
            </Typography>
            <List sx={{ maxHeight: '50vh', overflowY: 'auto', width: "100%" }}>
                {messages.map((message, index) => {
                    const isAuthor = message.author === me.name;
                    const member = members.find(m => m.name === message.author);
                    const avatarURL = member?.avatarURL || `https://source.unsplash.com/1600x900/?profile,face,avatar`;
                    return (
                        <Box display='flex' justifyContent={isAuthor ? 'flex-end' : 'flex-start'}>
                            <ListItem
                                key={index}
                                sx={{
                                    borderRadius: 1,
                                    backgroundColor: isAuthor ? '#d1e7dd' : '#f0f0f0',
                                    marginBottom: 1,
                                    maxWidth: 350,
                                    alignSelf: isAuthor ? 'end' : 'start',
                                    //display: 'flex',
                                    //flexDirection: isAuthor ? 'row-reverse' : 'row',
                                    p: 2,
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar src={avatarURL} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={message.message}
                                    secondary={isAuthor ? 'You ' + new Date(message.timestamp).toLocaleString() : message.author + " " + new Date(message.timestamp).toLocaleString()}
                                />
                            </ListItem>
                        </Box>
                    )
                })}
            </List>
            <Box mt={2} display="flex" alignItems="center">
                <TextField
                    label="Type your message"
                    variant="outlined"
                    fullWidth
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ mr: 1 }}
                    InputProps={{
                        endAdornment: (
                            <IconButton
                                color="primary"
                                onClick={sendMessage}
                                disabled={!newMessage.trim()}
                            >
                                <SendIcon />
                            </IconButton>
                        ),
                    }}
                />
            </Box>
        </Box>
    );
};

export default Chatroom;
