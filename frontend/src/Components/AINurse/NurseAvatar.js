import React from 'react';
import styled from 'styled-components';

const AvatarContainer = styled.div`
  width: 200px;
  height: 200px;
  margin-bottom: 20px;
  position: relative;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 5px solid #3498db;
`;

const NurseAvatar = () => {
  return (
    <AvatarContainer>
      <AvatarImage 
        src={process.env.REACT_APP_NURSE_AVATAR_URL || 'https://raw.githubusercontent.com/did-developer-community/image-library/main/nurse1.jpg'} 
        alt="AI Nurse Avatar"
      />
    </AvatarContainer>
  );
};

export default NurseAvatar; 