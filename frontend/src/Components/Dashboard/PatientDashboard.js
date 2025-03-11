import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaStethoscope, FaHospital, FaRobot, FaBrain } from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';

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
            title: 'AI Nurse',
            description: 'Your Personal Health Assistant',
            icon: <MdHealthAndSafety />,
            link: '/ainurse',
            color: '#9333ea'
        },
        {
            id: 2,
            title: 'Mind Bot',
            description: 'Mental Health Support',
            icon: <FaBrain />,
            link: '/mindbot',
            color: '#2563eb'
        },
        {
            id: 3,
            title: 'Consult Doctor',
            description: 'Connect with Healthcare Professionals',
            icon: <FaStethoscope />,
            link: '/consult-doctor',
            color: '#16a34a'
        },
        {
            id: 4,
            title: 'Nearby Hospitals',
            description: 'Find Medical Facilities Near You',
            icon: <FaHospital />,
            link: '/nearby-hospitals',
            color: '#dc2626'
        }
    ];

    return (
        <DashboardStyled>
            <div className="dashboard-header">
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

            <div className="health-tips">
                <h2>Quick Health Tips</h2>
                <div className="tips-grid">
                    <div className="tip-card">
                        <h3>Stay Hydrated</h3>
                        <p>Drink at least 8 glasses of water daily for optimal health.</p>
                    </div>
                    <div className="tip-card">
                        <h3>Regular Exercise</h3>
                        <p>Aim for 30 minutes of physical activity each day.</p>
                    </div>
                    <div className="tip-card">
                        <h3>Mental Wellness</h3>
                        <p>Take breaks and practice mindfulness for better mental health.</p>
                    </div>
                    <div className="tip-card">
                        <h3>Healthy Diet</h3>
                        <p>Include fruits and vegetables in every meal.</p>
                    </div>
                </div>
            </div>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    min-height: 100vh;
    padding: 2rem;
    background: #f3f4f6;

    .dashboard-header {
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
                border: 3px solid #9333ea;
            }

            .text {
                h1 {
                    margin: 0;
                    font-size: 2rem;
                    color: #1f2937;
                    font-weight: 700;
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
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;

        .service-card {
            background: white;
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;

            &:hover {
                transform: translateY(-5px);
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                border-color: var(--card-color);

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
                font-weight: 600;
            }

            p {
                margin: 0;
                color: #6b7280;
                font-size: 1rem;
                line-height: 1.5;
            }
        }
    }

    .health-tips {
        background: white;
        border-radius: 16px;
        padding: 2rem;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

        h2 {
            margin: 0 0 1.5rem;
            color: #1f2937;
            font-size: 1.5rem;
            font-weight: 600;
        }

        .tips-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;

            .tip-card {
                background: #f8fafc;
                padding: 1.5rem;
                border-radius: 12px;
                border-left: 4px solid #9333ea;

                h3 {
                    margin: 0 0 0.5rem;
                    color: #1f2937;
                    font-size: 1.1rem;
                    font-weight: 600;
                }

                p {
                    margin: 0;
                    color: #6b7280;
                    font-size: 0.9rem;
                    line-height: 1.5;
                }
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .dashboard-header {
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

        .health-tips {
            padding: 1.5rem;

            .tips-grid {
                gap: 1rem;
            }
        }
    }
`;

export default PatientDashboard; 