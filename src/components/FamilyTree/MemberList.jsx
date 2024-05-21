import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import useImgbb from '../../hooks/useImgBB';
import FamilyTree from './FamilyTree';
import FamilyMemberList from './FamilyList';
import FamilyTable from './FamilyTable';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState({});
  const [tabIndex, setTabIndex] = useState(0);
  const { imageUrl, uploadImage } = useImgbb();

  useEffect(() => {
    const fetchMembers = async () => {
      const querySnapshot = await getDocs(collection(db, 'members'));
      const membersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort members by date of birth
      membersList.sort((a, b) => new Date(a.dateOfBirth) - new Date(b.dateOfBirth));
      console.log(membersList)
      setMembers(membersList);
    };

    fetchMembers();
  }, []);

  const handleToggle = (id) => {
    setOpen(prevOpen => ({ ...prevOpen, [id]: !prevOpen[id] }));
  };

  const assignParentOrSpouse = async (memberId, field, value) => {
    try {
      await updateDoc(doc(db, 'members', memberId), {
        [field]: value,
      });
      // Automatically assign other parent if selecting a parent
      if (field === 'fatherId' || field === 'motherId') {
        // Get the member being updated
        const member = members.find(m => m.id === memberId);
        const father = members.find(m => m.id === value);
        // If the selected member is a father, automatically assign the spouse as the mother
        if (field === 'fatherId' && !member.motherId) {
          await updateDoc(doc(db, 'members', memberId), {
            motherId: father && father.spouseId,
          });
        }
      }
      // If the field is 'spouseId', update the spouse's spouseId to the current member's id
      if (field === 'spouseId') {
        await updateDoc(doc(db, 'members', value), {
          maritalStatus: 'Married',
          [field]: memberId,
        });
        await updateDoc(doc(db, 'members', memberId), {
          maritalStatus: 'Married',
        });
      }
      alert(`${field} assigned successfully`);
    } catch (error) {
      console.error(`Error assigning ${field}:`, error);
      alert(`Failed to assign ${field}`);
    }
  };

  useEffect(() => {
    if (imageUrl) {
      const updateAvatar = async (memberId) => {
        try {
          await updateDoc(doc(db, 'members', memberId), {
            avatarURL: imageUrl,
          });
          setMembers(members.map(m => (m.id === memberId ? { ...m, avatarURL: imageUrl } : m)));
          alert("Avatar updated successfully");
        } catch (error) {
          console.error("Error updating avatar:", error);
          alert("Failed to update avatar");
        }
      };
      updateAvatar(open.uploadingMemberId);
    }
  }, [imageUrl]);

  const handleAvatarChange = (memberId, event) => {
    const file = event.target.files[0];
    if (file) {
      uploadImage(file);
      setOpen({ ...open, uploadingMemberId: memberId });
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  return (
    <Container maxWidth="md">
      <Tabs value={tabIndex} onChange={handleTabChange}>
        <Tab label="List View" />
        <Tab label="Tree View" />
        <Tab label="Table View" />
      </Tabs>
      {tabIndex === 0 && (
        <FamilyMemberList
          open={open}
          familyMembers={members}
          assignParentOrSpouse={assignParentOrSpouse}
          handleAvatarChange={handleAvatarChange}
          handleToggle={handleToggle}
        />
      )}
      {tabIndex === 1 && (
        <FamilyTree
          open={open}
          members={members}
          assignParentOrSpouse={assignParentOrSpouse}
          handleAvatarChange={handleAvatarChange}
          handleToggle={handleToggle}
        />
      )}
      {tabIndex === 2 && (
        <FamilyTable
          open={open}
          members={members}
          assignParentOrSpouse={assignParentOrSpouse}
          handleAvatarChange={handleAvatarChange}
          handleToggle={handleToggle}
        />
      )}
    </Container>
  );
};

export default MemberList;
