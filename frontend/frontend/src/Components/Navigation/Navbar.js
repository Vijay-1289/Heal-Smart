import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

function Navbar() {
    return (
        <NavbarStyled>
            <nav className="navbar">
                <ul className="nav-items">
                    <li>
                        <NavLink to="/dashboard" activeClassName="active">
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/mindbot" activeClassName="active">
                            Mind Bot
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/ainurse" activeClassName="active">
                            AI Nurse
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/doctor-consultation" activeClassName="active">
                            Doctor Consultation
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/nearby-hospitals" activeClassName="active">
                            Nearby Hospitals
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </NavbarStyled>
    );
}

const NavbarStyled = styled.div`
    .navbar {
        background: #ffffff;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        padding: 1rem 2rem;
    }

    .nav-items {
        display: flex;
        justify-content: center;
        list-style: none;
        margin: 0;
        padding: 0;
        gap: 2rem;
    }

    .nav-items li a {
        color: #2d3748;
        text-decoration: none;
        font-weight: 500;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
            background: #f7fafc;
            color: #4a5568;
        }

        &.active {
            background: #9333ea;
            color: white;
        }
    }

    @media (max-width: 768px) {
        .nav-items {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
        }
    }
`;

export default Navbar; 