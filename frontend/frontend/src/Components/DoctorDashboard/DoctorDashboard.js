import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'John Doe',
      date: '2024-03-10',
      time: '10:00 AM',
      reason: 'Regular checkup',
      status: 'Upcoming'
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      date: '2024-03-10',
      time: '11:00 AM',
      reason: 'Follow-up',
      status: 'Upcoming'
    }
  ]);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData || JSON.parse(userData).userType !== 'doctor') {
      navigate('/login');
      return;
    }
    setDoctorData(JSON.parse(userData));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const handleStatusChange = (appointmentId, newStatus) => {
    setAppointments(appointments.map(apt => 
      apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    ));
  };

  if (!doctorData) return null;

  return (
    <DashboardStyled>
      <header>
        <div className="user-info">
          <h1>Welcome, {doctorData.name}</h1>
          <p>{doctorData.specialisation}</p>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <section className="appointments-section">
          <h2>Today's Appointments</h2>
          <div className="appointments-list">
            {appointments.map(appointment => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{appointment.patientName}</h3>
                  <span className={`status ${appointment.status.toLowerCase()}`}>
                    {appointment.status}
                  </span>
                </div>
                <div className="appointment-details">
                  <p><strong>Date:</strong> {appointment.date}</p>
                  <p><strong>Time:</strong> {appointment.time}</p>
                  <p><strong>Reason:</strong> {appointment.reason}</p>
                </div>
                <div className="appointment-actions">
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <button className="view-details-btn">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="stats-section">
          <div className="stat-card">
            <h3>Total Appointments</h3>
            <p className="stat-number">{appointments.length}</p>
          </div>
          <div className="stat-card">
            <h3>Completed</h3>
            <p className="stat-number">
              {appointments.filter(apt => apt.status === 'Completed').length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Upcoming</h3>
            <p className="stat-number">
              {appointments.filter(apt => apt.status === 'Upcoming').length}
            </p>
          </div>
        </section>
      </main>
    </DashboardStyled>
  );
}

const DashboardStyled = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;

    .user-info {
      h1 {
        color: #2d3748;
        margin: 0;
      }

      p {
        color: #4a5568;
        margin: 0.5rem 0 0;
      }
    }

    .logout-btn {
      padding: 0.5rem 1rem;
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      color: #4a5568;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #e2e8f0;
      }
    }
  }

  .appointments-section {
    margin-bottom: 2rem;

    h2 {
      color: #2d3748;
      margin-bottom: 1rem;
    }
  }

  .appointments-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .appointment-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .appointment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;

      h3 {
        margin: 0;
        color: #2d3748;
      }

      .status {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;

        &.upcoming {
          background: #ebf8ff;
          color: #3182ce;
        }

        &.completed {
          background: #f0fff4;
          color: #38a169;
        }

        &.cancelled {
          background: #fff5f5;
          color: #e53e3e;
        }
      }
    }

    .appointment-details {
      margin-bottom: 1rem;

      p {
        margin: 0.5rem 0;
        color: #4a5568;

        strong {
          color: #2d3748;
        }
      }
    }

    .appointment-actions {
      display: flex;
      gap: 1rem;

      select {
        padding: 0.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        background: white;
        color: #4a5568;
      }

      .view-details-btn {
        padding: 0.5rem 1rem;
        background: #9333ea;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background: #7e22ce;
        }
      }
    }
  }

  .stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;

    .stat-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      text-align: center;

      h3 {
        color: #4a5568;
        margin: 0 0 0.5rem;
        font-size: 1rem;
      }

      .stat-number {
        color: #2d3748;
        font-size: 2rem;
        font-weight: bold;
        margin: 0;
      }
    }
  }
`;

export default DoctorDashboard; 