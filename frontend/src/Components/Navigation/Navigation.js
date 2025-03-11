import React from 'react'
import styled from 'styled-components'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaHome, FaStethoscope, FaHospital, FaRobot, FaSignOutAlt, FaBrain } from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';

function Navigation() {
    const navigate = useNavigate();
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const menuItems = [
        {
            id: 1,
            title: 'Dashboard',
            icon: <FaHome className="nav-icon" />,
            link: '/dashboard'
        },
        {
            id: 2,
            title: 'AI Nurse',
            icon: <MdHealthAndSafety className="nav-icon" />,
            link: '/ainurse'
        },
        {
            id: 3,
            title: 'Mind Bot',
            icon: <FaBrain className="nav-icon" />,
            link: '/mindbot'
        },
        {
            id: 4,
            title: 'Consult Doctor',
            icon: <FaStethoscope className="nav-icon" />,
            link: '/consult-doctor'
        },
        {
            id: 5,
            title: 'Nearby Hospitals',
            icon: <FaHospital className="nav-icon" />,
            link: '/nearby-hospitals'
        }
    ];

    return (
        <NavigationStyled>
            <div className="user-con">
                <div className="logo">
                    <NavLink to="/dashboard">
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
                {menuItems.map(item => (
                    <li key={item.id}>
                        <NavLink to={item.link} activeClassName="active">
                            {item.icon}
                            <span>{item.title}</span>
                        </NavLink>
                    </li>
                ))}
                <li>
                    <button onClick={handleLogout} className="logout-btn">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </li>
            </ul>
        </NavigationStyled>
    )
}

const NavigationStyled = styled.nav`
    padding: 2rem 1.5rem;
    width: 300px;
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

    .user-con {
        min-height: 100px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid rgba(147, 51, 234, 0.1);
        
        .logo {
            a {
                text-decoration: none;
                color: rgba(34, 34, 96, 1);
            }
            h2 {
                font-size: 1.8rem;
            }
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 12px;

            img {
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

    .nav-items {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;

        li {
            display: grid;
            grid-template-columns: 40px auto;
            align-items: center;
            margin: 0.6rem 0;
            font-weight: 500;
            cursor: pointer;
            transition: all .4s ease-in-out;
            color: rgba(34, 34, 96, .6);
            padding: 0.8rem 1rem;
            border-radius: 12px;
            
            &:hover {
                background: rgba(147, 51, 234, 0.05);
                color: #9333ea;
            }

            a, .logout-btn {
                display: flex;
                align-items: center;
                gap: 1rem;
                color: inherit;
                text-decoration: none;
                font-size: 1rem;
                
                svg {
                    font-size: 1.4rem;
                }
            }

            .logout-btn {
                width: 100%;
                background: none;
                border: none;
                cursor: pointer;
                color: #dc2626;
                padding: 0;

                &:hover {
                    color: #dc2626;
                }
            }
        }

        .active {
            background: rgba(147, 51, 234, 0.1);
            color: #9333ea;
        }
    }

    @media (max-width: 768px) {
        width: 250px;
        padding: 1rem;

        .user-con {
            .logo h2 {
                font-size: 1.5rem;
            }
        }
    }
`;

export default Navigation;