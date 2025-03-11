import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from 'react-chartjs-2';

function PatientDashboard() {
    const [user, setUser] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [healthMetrics, setHealthMetrics] = useState({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Health Score',
                data: [65, 70, 68, 72, 75, 73],
                borderColor: '#9333ea',
                tension: 0.4
            }
        ]
    });
    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            navigate('/');
        }
        
        // Mock appointments data
        setAppointments([
            {
                id: 1,
                doctor: "Dr. Sarah Johnson",
                date: "2024-02-20",
                time: "10:00 AM",
                status: "Upcoming"
            },
            {
                id: 2,
                doctor: "Dr. Michael Chen",
                date: "2024-02-15",
                time: "2:30 PM",
                status: "Completed"
            }
        ]);
    }, [navigate]);

    return (
        <DashboardStyled>
            <div className="dashboard-container">
                <div className="user-profile">
                    {user && (
                        <>
                            <img src={user.picture} alt={user.name} className="profile-image" />
                            <div className="user-info">
                                <h2>{user.name}</h2>
                                <p>{user.email}</p>
                            </div>
                        </>
                    )}
                </div>

                <div className="dashboard-grid">
                    <div className="appointments-section">
                        <h3>Your Appointments</h3>
                        <div className="appointments-list">
                            {appointments.map(appointment => (
                                <div key={appointment.id} className="appointment-card">
                                    <div className="appointment-header">
                                        <h4>{appointment.doctor}</h4>
                                        <span className={`status ${appointment.status.toLowerCase()}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                    <div className="appointment-details">
                                        <p>Date: {appointment.date}</p>
                                        <p>Time: {appointment.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="health-metrics">
                        <h3>Health Metrics</h3>
                        <div className="chart-container">
                            <Line data={healthMetrics} options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Monthly Health Score'
                                    }
                                }
                            }} />
                        </div>
                    </div>

                    <div className="quick-actions">
                        <h3>Quick Actions</h3>
                        <div className="action-buttons">
                            <button onClick={() => navigate('/doctor-consultation')}>
                                Book Appointment
                            </button>
                            <button onClick={() => navigate('/ainurse')}>
                                Consult AI Nurse
                            </button>
                            <button onClick={() => navigate('/mindbot')}>
                                Chat with Mind Bot
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    .dashboard-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    .user-profile {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin-bottom: 2rem;
        padding: 1.5rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);

        .profile-image {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            object-fit: cover;
        }

        .user-info {
            h2 {
                margin: 0;
                color: #2d3748;
            }

            p {
                margin: 0.5rem 0 0;
                color: #718096;
            }
        }
    }

    .dashboard-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
    }

    .appointments-section, .health-metrics, .quick-actions {
        background: white;
        padding: 1.5rem;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);

        h3 {
            margin: 0 0 1.5rem;
            color: #2d3748;
        }
    }

    .appointment-card {
        background: #f7fafc;
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;

        .appointment-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.5rem;

            h4 {
                margin: 0;
                color: #2d3748;
            }

            .status {
                padding: 0.25rem 0.75rem;
                border-radius: 999px;
                font-size: 0.875rem;

                &.upcoming {
                    background: #9333ea;
                    color: white;
                }

                &.completed {
                    background: #10b981;
                    color: white;
                }
            }
        }

        .appointment-details {
            p {
                margin: 0.25rem 0;
                color: #718096;
            }
        }
    }

    .chart-container {
        height: 300px;
    }

    .action-buttons {
        display: grid;
        gap: 1rem;

        button {
            padding: 1rem;
            border: none;
            border-radius: 8px;
            background: #9333ea;
            color: white;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;

            &:hover {
                background: #7e22ce;
            }
        }
    }

    @media (max-width: 768px) {
        .dashboard-container {
            padding: 1rem;
        }

        .dashboard-grid {
            grid-template-columns: 1fr;
        }
    }
`;

export default PatientDashboard; 