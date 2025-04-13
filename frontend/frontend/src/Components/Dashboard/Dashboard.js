import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaHeartbeat, FaTint, FaThermometerHalf, FaWeight, FaWalking } from 'react-icons/fa';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const DashboardStyled = styled.div`
    padding: 2rem;
    background: #f8f9fa;
    min-height: 100vh;

    .dashboard-container {
        max-width: 1200px;
        margin: 0 auto;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 2rem;
        margin-bottom: 2rem;
    }

    .metric-card {
        background: white;
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
        gap: 1rem;

        .icon {
            font-size: 2rem;
            color: #4CAF50;
        }

        .info {
            flex: 1;

            h3 {
                margin: 0;
                color: #333;
                font-size: 1rem;
            }

            .value {
                font-size: 1.5rem;
                font-weight: bold;
                color: #4CAF50;
                margin: 0.5rem 0;
            }

            .status {
                font-size: 0.9rem;
                color: #666;
            }
        }
    }

    .chart-container {
        background: white;
        border-radius: 15px;
        padding: 1.5rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        margin-bottom: 2rem;

        h2 {
            margin-bottom: 1rem;
            color: #333;
        }
    }
`;

const mockMetrics = {
    heartRate: {
        value: 72,
        unit: 'bpm',
        status: 'Normal',
        trend: 'stable'
    },
    bloodPressure: {
        systolic: 120,
        diastolic: 80,
        unit: 'mmHg',
        status: 'Normal',
        trend: 'stable'
    },
    temperature: {
        value: 98.6,
        unit: '°F',
        status: 'Normal',
        trend: 'stable'
    },
    weight: {
        value: 70,
        unit: 'kg',
        status: 'Healthy',
        trend: 'stable'
    },
    steps: {
        value: 8500,
        unit: 'steps',
        status: 'Good',
        trend: 'increasing'
    }
};

const mockChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
        {
            label: 'Heart Rate',
            data: [75, 72, 70, 73, 71, 72, 72],
            borderColor: '#4CAF50',
            tension: 0.4
        }
    ]
};

const chartOptions = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Weekly Heart Rate Trend'
        }
    }
};

function Dashboard() {
    const [metrics, setMetrics] = useState(mockMetrics);
    const [chartData, setChartData] = useState(mockChartData);

    useEffect(() => {
        // Simulate real-time updates
        const interval = setInterval(() => {
            setMetrics(prev => ({
                ...prev,
                heartRate: {
                    ...prev.heartRate,
                    value: Math.floor(Math.random() * 10) + 65 // Random value between 65-75
                }
            }));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <DashboardStyled>
            <div className="dashboard-container">
                <h1>Health Dashboard</h1>
                <div className="metrics-grid">
                    <div className="metric-card">
                        <FaHeartbeat className="icon" />
                        <div className="info">
                            <h3>Heart Rate</h3>
                            <div className="value">{metrics.heartRate.value} {metrics.heartRate.unit}</div>
                            <div className="status">{metrics.heartRate.status}</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <FaTint className="icon" />
                        <div className="info">
                            <h3>Blood Pressure</h3>
                            <div className="value">{metrics.bloodPressure.systolic}/{metrics.bloodPressure.diastolic} {metrics.bloodPressure.unit}</div>
                            <div className="status">{metrics.bloodPressure.status}</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <FaThermometerHalf className="icon" />
                        <div className="info">
                            <h3>Temperature</h3>
                            <div className="value">{metrics.temperature.value} {metrics.temperature.unit}</div>
                            <div className="status">{metrics.temperature.status}</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <FaWeight className="icon" />
                        <div className="info">
                            <h3>Weight</h3>
                            <div className="value">{metrics.weight.value} {metrics.weight.unit}</div>
                            <div className="status">{metrics.weight.status}</div>
                        </div>
                    </div>
                    <div className="metric-card">
                        <FaWalking className="icon" />
                        <div className="info">
                            <h3>Steps Today</h3>
                            <div className="value">{metrics.steps.value} {metrics.steps.unit}</div>
                            <div className="status">{metrics.steps.status}</div>
                        </div>
                    </div>
                </div>
                <div className="chart-container">
                    <h2>Health Trends</h2>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </DashboardStyled>
    );
}

export default Dashboard; 