import React from "react";
import styled from "styled-components";
import bg from "./img/bg.png";
import { MainLayout } from "./styles/Layouts";
import Navigation from "./Components/Navigation/Navigation";
import Home from "./Components/Home/Home";
import MentalWellness from "./Components/MentalWellness/MentalWellness";
import ConsultDoctor from "./Components/ConsultDoctor/ConsultDoctor";
import NearbyHospitals from './Components/NearbyHospitals/NearbyHospitals';
import DoctorDashboard from './Components/DoctorDashboard/DoctorDashboard';
import DoctorDetails from './Components/DoctorDetails/DoctorDetails';
import AINurse from './Components/AINurse/AINurse';
import Login from './Components/Auth/Login';
import MindBot from './Components/MindBot/MindBot';
import PatientDashboard from './Components/Dashboard/PatientDashboard';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ContextProvider from './context/Context';
import 'react-toastify/dist/ReactToastify.css';
import "./index.css";
import './emailjs';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle } from './styles/GlobalStyle';
import theme from './styles/theme';
import { AuthProvider, useAuth } from './context/Context';
import Register from './Components/Auth/Register';
import Dashboard from './Components/Dashboard/Dashboard';
import Medicine from './Components/Medicine/Medicine';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const AppContainer = styled.div`
  padding-top: 4rem; // Add padding to account for fixed navbar
  min-height: 100vh;
  background: #f8f9fa;

  @media (max-width: 768px) {
    padding-top: 3.5rem;
  }
`;

function App() {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <AuthProvider>
                    <GlobalStyle />
                    <AppRoutes />
                    <ToastContainer
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                    />
                </AuthProvider>
            </ThemeProvider>
        </Router>
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
