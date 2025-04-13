import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const NavbarContainer = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    z-index: 1000;
`;

const NavContent = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Logo = styled(Link)`
    font-size: 1.5rem;
    font-weight: bold;
    color: #4CAF50;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    @media (max-width: 768px) {
        font-size: 1.2rem;
    }
`;

const MenuButton = styled.button`
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    color: #4CAF50;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1001;

    @media (max-width: 768px) {
        display: block;
    }
`;

const NavLinks = styled.div`
    display: flex;
    gap: 2rem;
    align-items: center;

    @media (max-width: 768px) {
        position: fixed;
        top: 0;
        right: ${({ isOpen }) => (isOpen ? '0' : '-100%')};
        height: 100vh;
        width: 70%;
        max-width: 300px;
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(10px);
        flex-direction: column;
        padding: 5rem 2rem;
        transition: right 0.3s ease-in-out;
        box-shadow: ${({ isOpen }) => (isOpen ? '-5px 0 15px rgba(0, 0, 0, 0.1)' : 'none')};
    }
`;

const NavLink = styled(Link)`
    color: #333;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background: #4CAF50;
        color: white;
    }

    @media (max-width: 768px) {
        width: 100%;
        text-align: center;
        padding: 1rem;
    }
`;

const LogoutButton = styled.button`
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        background: #c82333;
    }

    @media (max-width: 768px) {
        width: 100%;
        padding: 1rem;
    }
`;

const Overlay = styled.div`
    display: none;
    @media (max-width: 768px) {
        display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }
`;

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <>
            <NavbarContainer>
                <NavContent>
                    <Logo to="/">Heal Smart</Logo>
                    <MenuButton onClick={toggleMenu}>
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </MenuButton>
                    <NavLinks isOpen={isOpen}>
                        <NavLink to="/dashboard" onClick={closeMenu}>Dashboard</NavLink>
                        <NavLink to="/ainurse" onClick={closeMenu}>AI Nurse</NavLink>
                        <NavLink to="/mindbot" onClick={closeMenu}>MindBot</NavLink>
                        <NavLink to="/medicine" onClick={closeMenu}>Medicine</NavLink>
                        {user && <LogoutButton onClick={handleLogout}>Logout</LogoutButton>}
                    </NavLinks>
                </NavContent>
            </NavbarContainer>
            <Overlay isOpen={isOpen} onClick={closeMenu} />
        </>
    );
};

export default Navbar; 