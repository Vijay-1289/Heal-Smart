import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';

const NavigationContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  height: 100vh;
  width: 60px;
  background-color: #2c3e50;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
  z-index: 1000;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  margin-bottom: 20px;
`;

const MenuItem = styled.div`
  color: white;
  padding: 10px;
  cursor: pointer;
  width: 100%;
  text-align: center;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #34495e;
  }
`;

const MenuIcon = styled.span`
  font-size: 20px;
  margin-right: 10px;
`;

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleConsultDoctor = () => {
    navigate('/consult-doctor');
  };

  const handleNearbyHospitals = () => {
    navigate('/nearby-hospitals');
  };

  const handleAINurse = () => {
    navigate('/ai-nurse');
  };

  const handleGoogleLogin = (credentialResponse) => {
    console.log(credentialResponse);
    // Handle Google login logic here
  };

  return (
    <NavigationContainer>
      <MenuButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <MenuIcon>⋮</MenuIcon>
      </MenuButton>
      
      {isMenuOpen && (
        <>
          <MenuItem onClick={handleConsultDoctor}>
            <MenuIcon>👨‍⚕️</MenuIcon>
            Consult Doctor
          </MenuItem>
          
          <MenuItem onClick={handleNearbyHospitals}>
            <MenuIcon>🏥</MenuIcon>
            Nearby Hospitals
          </MenuItem>
          
          <MenuItem>
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => {
                console.log('Login Failed');
              }}
              clientId="246049626035-uhst0uqgq7p7nt84f6idr1171nif77b8.apps.googleusercontent.com"
            />
          </MenuItem>
          
          <MenuItem onClick={handleAINurse}>
            <MenuIcon>🤖</MenuIcon>
            AI Nurse
          </MenuItem>
        </>
      )}
    </NavigationContainer>
  );
};

export default Navigation; 