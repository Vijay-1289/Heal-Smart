import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function PatientDashboard({ user }) {
    const [healthHistory, setHealthHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHealthHistory();
    }, []);

    const fetchHealthHistory = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${user.email}/health`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            setHealthHistory(data.healthHistory || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching health history:', error);
            setLoading(false);
        }
    };

    return (
        <DashboardStyled>
            <div className="dashboard-header">
                <div className="user-info">
                    <img src={user.picture} alt={user.name} className="profile-pic" />
                    <div className="user-details">
                        <h2>{user.name}</h2>
                        <p>{user.email}</p>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="health-summary">
                    <h3>Health Summary</h3>
                    <div className="summary-cards">
                        <div className="summary-card">
                            <h4>Recent Conditions</h4>
                            <p>{healthHistory.length} conditions recorded</p>
                        </div>
                        <div className="summary-card">
                            <h4>Last Consultation</h4>
                            <p>{healthHistory[0]?.date ? new Date(healthHistory[0].date).toLocaleDateString() : 'No consultations yet'}</p>
                        </div>
                    </div>
                </div>

                <div className="health-history">
                    <h3>Health History</h3>
                    {loading ? (
                        <p>Loading health history...</p>
                    ) : healthHistory.length > 0 ? (
                        <div className="history-list">
                            {healthHistory.map((record, index) => (
                                <div key={index} className="history-item">
                                    <div className="history-header">
                                        <h4>{record.condition}</h4>
                                        <span>{new Date(record.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="measures">
                                        <h5>Control Measures:</h5>
                                        <ul>
                                            {record.measures.map((measure, i) => (
                                                <li key={i}>{measure}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="prevention">
                                        <h5>Prevention Tips:</h5>
                                        <ul>
                                            {record.prevention.map((tip, i) => (
                                                <li key={i}>{tip}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No health history available</p>
                    )}
                </div>
            </div>
        </DashboardStyled>
    );
}

const DashboardStyled = styled.div`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;

    .dashboard-header {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        margin-bottom: 2rem;

        .user-info {
            display: flex;
            align-items: center;
            gap: 1.5rem;

            .profile-pic {
                width: 80px;
                height: 80px;
                border-radius: 50%;
            }

            .user-details {
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
    }

    .dashboard-content {
        display: grid;
        gap: 2rem;

        .health-summary {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);

            h3 {
                margin: 0 0 1.5rem;
                color: #2d3748;
            }

            .summary-cards {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;

                .summary-card {
                    background: #f7fafc;
                    padding: 1.5rem;
                    border-radius: 8px;

                    h4 {
                        margin: 0 0 0.5rem;
                        color: #4a5568;
                    }

                    p {
                        margin: 0;
                        color: #718096;
                    }
                }
            }
        }

        .health-history {
            background: white;
            padding: 2rem;
            border-radius: 12px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);

            h3 {
                margin: 0 0 1.5rem;
                color: #2d3748;
            }

            .history-list {
                display: grid;
                gap: 1.5rem;

                .history-item {
                    background: #f7fafc;
                    padding: 1.5rem;
                    border-radius: 8px;

                    .history-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 1rem;

                        h4 {
                            margin: 0;
                            color: #4a5568;
                            text-transform: capitalize;
                        }

                        span {
                            color: #718096;
                            font-size: 0.9rem;
                        }
                    }

                    .measures, .prevention {
                        margin-top: 1rem;

                        h5 {
                            margin: 0 0 0.5rem;
                            color: #4a5568;
                        }

                        ul {
                            margin: 0;
                            padding-left: 1.5rem;
                            color: #718096;

                            li {
                                margin-bottom: 0.25rem;
                            }
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .dashboard-header {
            padding: 1.5rem;
        }

        .dashboard-content {
            gap: 1rem;

            .health-summary, .health-history {
                padding: 1.5rem;
            }
        }
    }
`;

export default PatientDashboard; 