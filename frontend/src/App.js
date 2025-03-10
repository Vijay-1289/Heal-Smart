import React from "react";
import styled from "styled-components";
import bg from "./img/bg.png";
import { MainLayout } from "./styles/Layouts";
import Navigation from "./Components/Navigation/Navigation";
import Home from "./Components/Home/Home";
import MentalWellness from "./Components/MentalWellness/MentalWellness";
import SymptomAnalysis from "./Components/SymptomAnalysis/SymptomAnalysis";
import ConsultDoctor from "./Components/ConsultDoctor/ConsultDoctor";
import NearbyHospitals from './Components/NearbyHospitals/NearbyHospitals';
import DoctorDashboard from './Components/DoctorDashboard/DoctorDashboard';
import DoctorDetails from './Components/DoctorDetails/DoctorDetails';
import AINurse from './Components/AINurse/AINurse';
import Login from './Components/Auth/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ContextProvider from './context/Context';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import './emailjs';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

function App() {
    return (
        <ContextProvider>
            <AppStyled bg={bg}>
                <MainLayout>
                    <Navigation />
                    <main>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            
                            {/* Protected Routes */}
                            <Route path="/symptom-analysis" element={
                                <ProtectedRoute>
                                    <SymptomAnalysis />
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
                            <Route path="/ai-nurse" element={
                                <ProtectedRoute>
                                    <AINurse />
                                </ProtectedRoute>
                            } />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </main>
                </MainLayout>
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </AppStyled>
        </ContextProvider>
    );
}

const AppStyled = styled.div`
    height: 100vh;
    background-image: url(${props => props.bg});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
`;

export default App;
