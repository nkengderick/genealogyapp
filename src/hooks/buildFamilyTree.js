const buildFamilyTree = (members) => {
  const memberMap = new Map();
  members.forEach(member => memberMap.set(member.id, { ...member, children: [] }));

  const rootMembers = [];

  memberMap.forEach(member => {
    if (member.fatherId && memberMap.has(member.fatherId)) {
      const father = memberMap.get(member.fatherId);
      father.children.push(member);
      if (father.spouseId && memberMap.has(father.spouseId) ) {
        memberMap.get(father.spouseId).children.push(member);
      }
    } else if (member.motherId && memberMap.has(member.motherId)) {
      const mother = memberMap.get(member.motherId);
      mother.children.push(member);
      if (mother.spouseId && memberMap.has(mother.spouseId)) {
        memberMap.get(mother.spouseId).children.push(member);
      }
    } else {
      if (member.gender === 'Male' && !memberMap.get(member.spouseId).fatherId && !memberMap.get(member.spouseId).motherId) {
        rootMembers.push(member);
      }
    }

    // Set spouse information
    if (member.spouseId && memberMap.has(member.spouseId)) {
      member.spouse = memberMap.get(member.spouseId);
    }
  });

  return rootMembers;
};

export default buildFamilyTree;
