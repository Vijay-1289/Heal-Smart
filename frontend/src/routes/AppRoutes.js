import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Home from '../Components/Home/Home';
import Login from '../Components/Auth/Login';
import Register from '../Components/Auth/Register';
import PatientDashboard from '../Components/Dashboard/PatientDashboard';
import DoctorDashboard from '../Components/Dashboard/DoctorDashboard';
import Medicine from '../Components/Medicine/Medicine';
import AINurse from '../Components/AINurse/AINurse';
import MindBot from '../Components/MindBot/MindBot';
import MentalWellness from '../Components/MentalWellness/MentalWellness';
import ConsultDoctor from '../Components/ConsultDoctor/ConsultDoctor';
import DoctorDetails from '../Components/DoctorDetails/DoctorDetails';
import NearbyHospitals from '../Components/NearbyHospitals/NearbyHospitals';
import Navbar from '../Components/Navbar/Navbar';
import styled from 'styled-components';

const AppContainer = styled.div`
  padding-top: 4rem;
  min-height: 100vh;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding-top: 3.5rem;
  }
`;

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <AppContainer>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        <Route path="/medicine" element={
          <ProtectedRoute>
            <Medicine />
          </ProtectedRoute>
        } />
        <Route path="/ainurse" element={
          <ProtectedRoute>
            <AINurse />
          </ProtectedRoute>
        } />
        <Route path="/mindbot" element={
          <ProtectedRoute>
            <MindBot />
          </ProtectedRoute>
        } />
        <Route path="/mental-wellness" element={
          <ProtectedRoute>
            <MentalWellness />
          </ProtectedRoute>
        } />
        <Route path="/consult-doctor" element={
          <ProtectedRoute>
            <ConsultDoctor />
          </ProtectedRoute>
        } />
        <Route path="/doctor-details" element={
          <ProtectedRoute>
            <DoctorDetails />
          </ProtectedRoute>
        } />
        <Route path="/nearby-hospitals" element={
          <ProtectedRoute>
            <NearbyHospitals />
          </ProtectedRoute>
        } />
        <Route path="/doctor-dashboard" element={
          <ProtectedRoute>
            <DoctorDashboard />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppContainer>
  );
};

export default AppRoutes; 