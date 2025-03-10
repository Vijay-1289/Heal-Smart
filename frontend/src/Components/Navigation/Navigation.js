import React from 'react'
import styled from 'styled-components'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaHome, FaStethoscope, FaBrain, FaHospital, FaHeartbeat, FaRobot, FaUserMd, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import { RiMentalHealthFill } from 'react-icons/ri';
import avatar from '../../img/avatar.png';

function Navigation() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        {
            id: 1,
            title: 'Home',
            icon: <FaHome className="nav-icon home" />,
            link: '/'
        },
        {
            id: 2,
            title: 'Symptom Analysis',
            icon: <FaHeartbeat className="nav-icon symptoms" />,
            link: '/symptom-analysis'
        },
        {
            id: 3,
            title: 'Mental Wellness',
            icon: <RiMentalHealthFill className="nav-icon mental" />,
            link: '/mental-wellness'
        },
        {
            id: 4,
            title: 'Consult Doctor',
            icon: <FaStethoscope className="nav-icon consult" />,
            link: '/consult-doctor'
        },
        {
            id: 5,
            title: 'Nearby Hospitals',
            icon: <FaHospital className="nav-icon hospital" />,
            link: '/nearby-hospitals'
        },
        {
            id: 6,
            title: 'AI Nurse',
            icon: <FaRobot className="nav-icon ai-nurse" />,
            link: '/ai-nurse'
        }
    ];

    return (
        <NavigationStyled>
            <div className="user-con">
                <div className="logo">
                    <NavLink to="/">
                        <h2>Health Smart</h2>
                    </NavLink>
                </div>
                {user && (
                    <div className="user-info">
                        <img src={user.picture} alt={user.name} />
                        <span>{user.name}</span>
                    </div>
                )}
            </div>
            <ul className="nav-items">
                {!token ? (
                    <li>
                        <NavLink to="/login">
                            <FaSignInAlt />
                            <span>Login</span>
                        </NavLink>
                    </li>
                ) : (
                    <>
                        <li>
                            <NavLink to="/dashboard">
                                <FaBrain />
                                <span>Dashboard</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/ai-nurse">
                                <FaRobot />
                                <span>AI Nurse</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/symptom-analysis">
                                <FaBrain />
                                <span>Symptom Analysis</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/consult-doctor">
                                <FaUserMd />
                                <span>Consult Doctor</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/nearby-hospitals">
                                <FaHospital />
                                <span>Nearby Hospitals</span>
                            </NavLink>
                        </li>
                        <li>
                            <button onClick={handleLogout} className="logout-btn">
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </NavigationStyled>
    )
}

const NavigationStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 374px;
    height: 100vh;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #FFFFFF;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    position: sticky;
    top: 0;
    overflow: hidden;

    .user-con{
        min-height: 100px;
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid rgba(147, 51, 234, 0.1);
        
        .logo {
            a {
                text-decoration: none;
                color: rgba(34, 34, 96, 1);
            }
            h2{
                font-size: 1.8rem;
            }
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 12px;

            img{
                width: 40px;
                height: 40px;
                border-radius: 50%;
                object-fit: cover;
            }

            span {
                font-size: 1rem;
                color: rgba(34, 34, 96, 0.9);
            }
        }
    }

    .nav-items{
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding-right: 1rem;
        margin-right: -1rem;

        &::-webkit-scrollbar {
            width: 6px;
            border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
            background: rgba(147, 51, 234, 0.2);
            border-radius: 10px;
            
            &:hover {
                background: rgba(147, 51, 234, 0.4);
            }
        }

        &::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 10px;
        }

        li{
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: .8rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: rgba(34, 34, 96, .6);
            padding: 0.8rem 1rem;
            border-radius: 12px;
            
            &:hover {
                background: rgba(147, 51, 234, 0.05);
                transform: translateX(5px);
            }

            a, .logout-btn {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                color: inherit;
                text-decoration: none;
                
                .nav-icon {
                    font-size: 1.5rem;
                    transition: all .4s ease-in-out;

                    &.home { color: #4CAF50; }
                    &.symptoms { color: #F44336; }
                    &.mental { color: #2196F3; }
                    &.consult { color: #9C27B0; }
                    &.hospital { color: #FF9800; }
                    &.ai-nurse { color: #00BCD4; }
                }

                span {
                    font-size: 1rem;
                    font-weight: 500;
                }
            }

            .logout-btn {
                color: #dc2626;

                &:hover {
                    background: rgba(220, 38, 38, 0.1);
                    color: #dc2626;
                }
            }
        }
    }

    .active{
        background: rgba(147, 51, 234, 0.1);
        color: #9333ea !important;

        .nav-icon {
            color: #9333ea !important;
        }

        &::before{
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 4px;
            height: 100%;
            background: #9333ea;
            border-radius: 0 10px 10px 0;
        }
    }
`;

export default Navigation;