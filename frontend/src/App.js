import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Navigation from './Components/Navigation/Navigation';
import ConsultDoctor from './Components/ConsultDoctor/ConsultDoctor';
import NearbyHospitals from './Components/NearbyHospitals/NearbyHospitals';
import AINurse from './Components/AINurse/AINurse';

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  margin-left: 60px;
  padding: 20px;
`;

function App() {
  return (
    <AppContainer>
      <Navigation />
      <MainContent>
        <Routes>
          <Route path="/" element={<h1>Welcome to Heal-Smart</h1>} />
          <Route path="/consult-doctor" element={<ConsultDoctor />} />
          <Route path="/nearby-hospitals" element={<NearbyHospitals />} />
          <Route path="/ai-nurse" element={<AINurse />} />
        </Routes>
      </MainContent>
    </AppContainer>
  );
}

export default App; 