import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaHospital, FaRobot } from 'react-icons/fa';

function PatientDashboard() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/');
        } else {
            setUser(JSON.parse(userData));
        }
    }, [navigate]);

    const services = [
        {
            id: 1,
            title: 'Mind Bot',
            description: 'Your AI Companion for Mental Wellness',
            icon: <FaStethoscope />,
            link: '/mindbot',
            color: '#9333ea'
        },
        {
            id: 2,
            title: 'Consult Doctor',
            description: 'Connect with Healthcare Professionals',
            icon: <FaRobot />,
            link: '/consult-doctor',
            color: '#2563eb'
        },
        {
            id: 3,
            title: 'Nearby Hospitals',
            description: 'Find Medical Facilities Near You',
            icon: <FaHospital />,
            link: '/nearby-hospitals',
            color: '#16a34a'
        }
    ];

    return (
        <DashboardStyled>
            <div className="dashboard-container">
                <div className="welcome-section">
                    <div className="user-info">
                        {user && (
                            <>
                                <img src={user.picture} alt={user.name} />
                                <div className="text">
                                    <h1>Welcome back, {user.name}!</h1>
                                    <p>How can we help you today?</p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="services-grid">
                    {services.map(service => (
                        <div 
                            key={service.id} 
                            className="service-card"
                            onClick={() => navigate(service.link)}
                            style={{ '--card-color': service.color }}
                        >
                            <div className="icon-wrapper">
                                {service.icon}
                            </div>
                            <h2>{service.title}</h2>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    min-height: 100vh;
    background: #f3f4f6;
    padding: 2rem;

    .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .welcome-section {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        margin-bottom: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        .user-info {
            display: flex;
            align-items: center;
            gap: 1.5rem;

            img {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                object-fit: cover;
            }

            .text {
                h1 {
                    margin: 0;
                    font-size: 2rem;
                    color: #1f2937;
                }

                p {
                    margin: 0.5rem 0 0;
                    color: #6b7280;
                    font-size: 1.1rem;
                }
            }
        }
    }

    .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;

        .service-card {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

                .icon-wrapper {
                    background: var(--card-color);
                    color: white;
                }
            }

            .icon-wrapper {
                width: 64px;
                height: 64px;
                margin: 0 auto 1.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f3f4f6;
                border-radius: 16px;
                transition: all 0.3s ease;
                color: var(--card-color);

                svg {
                    font-size: 1.8rem;
                }
            }

            h2 {
                margin: 0 0 1rem;
                color: #1f2937;
                font-size: 1.5rem;
            }

            p {
                margin: 0;
                color: #6b7280;
                font-size: 1rem;
                line-height: 1.5;
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .welcome-section {
            padding: 1.5rem;

            .user-info {
                flex-direction: column;
                text-align: center;
                gap: 1rem;

                .text h1 {
                    font-size: 1.5rem;
                }
            }
        }

        .services-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
        }
    }
`;

export default PatientDashboard; 