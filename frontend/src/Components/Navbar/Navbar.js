import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/Context';

const NavbarStyled = styled.nav`
    background: ${({ theme }) => theme.colors.primary};
    padding: 1rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

    .navbar-container {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        color: white;
        font-size: 1.5rem;
        font-weight: bold;
        text-decoration: none;
    }

    .nav-links {
        display: flex;
        gap: 2rem;
        align-items: center;

        @media (max-width: 768px) {
            display: none;
        }

        a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s;

            &:hover {
                color: ${({ theme }) => theme.colors.secondary};
            }
        }
    }

    .mobile-menu-btn {
        display: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;

        @media (max-width: 768px) {
            display: block;
        }
    }

    .mobile-menu {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 250px;
        background: white;
        padding: 2rem;
        transform: translateX(100%);
        transition: transform 0.3s;
        display: flex;
        flex-direction: column;
        gap: 1rem;

        &.active {
            transform: translateX(0);
        }

        .close-btn {
            align-self: flex-end;
            color: ${({ theme }) => theme.colors.primary};
            font-size: 1.5rem;
            cursor: pointer;
        }

        a {
            color: ${({ theme }) => theme.colors.primary};
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }
    }

    .user-menu {
        position: relative;
        display: flex;
        align-items: center;
        gap: 1rem;

        .user-icon {
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
        }

        .dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            min-width: 150px;

            button {
                background: none;
                border: none;
                color: ${({ theme }) => theme.colors.primary};
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.5rem;

                &:hover {
                    background: #f5f5f5;
                }
            }
        }
    }
`;

function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <NavbarStyled>
            <div className="navbar-container">
                <Link to="/" className="logo">
                    HealSmart
                </Link>

                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/medicine">Medicine</Link>
                            <Link to="/ai-nurse">AI Nurse</Link>
                            <Link to="/mindbot">MindBot</Link>
                            <div className="user-menu">
                                <FaUser 
                                    className="user-icon" 
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                />
                                {isUserMenuOpen && (
                                    <div className="dropdown">
                                        <button onClick={handleLogout}>
                                            <FaSignOutAlt />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>

                <FaBars 
                    className="mobile-menu-btn" 
                    onClick={() => setIsMobileMenuOpen(true)}
                />
            </div>

            <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                <FaTimes 
                    className="close-btn" 
                    onClick={() => setIsMobileMenuOpen(false)}
                />
                {isAuthenticated ? (
                    <>
                        <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                        <Link to="/medicine" onClick={() => setIsMobileMenuOpen(false)}>Medicine</Link>
                        <Link to="/ai-nurse" onClick={() => setIsMobileMenuOpen(false)}>AI Nurse</Link>
                        <Link to="/mindbot" onClick={() => setIsMobileMenuOpen(false)}>MindBot</Link>
                        <button onClick={() => {
                            handleLogout();
                            setIsMobileMenuOpen(false);
                        }}>
                            <FaSignOutAlt />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
                    </>
                )}
            </div>
        </NavbarStyled>
    );
}

export default Navbar; 