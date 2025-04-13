import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaClock, FaHospital, FaUserMd, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useAppointments } from '../../context/AppointmentContext';
import { toast } from 'react-toastify';

function PatientDashboard() {
  const navigate = useNavigate();
  const { appointments, cancelAppointment, completeAppointment } = useAppointments();
  const [patientData, setPatientData] = useState(null);
  const [onlineDoctors] = useState([
    {
      id: 1,
      name: 'Dr. Smith',
      specialisation: 'Cardiologist',
      experience: '15 years',
      status: 'Online',
      imageUrl: 'https://placekitten.com/100/100' // placeholder image
    },
    {
      id: 2,
      name: 'Dr. Johnson',
      specialisation: 'Neurologist',
      experience: '10 years',
      status: 'Offline',
      imageUrl: 'https://placekitten.com/101/101'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData || JSON.parse(userData).userType !== 'patient') {
      navigate('/login');
      return;
    }
    setPatientData(JSON.parse(userData));
  }, [navigate]);

  useEffect(() => {
    console.log('Current appointments:', appointments);
  }, [appointments]);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    localStorage.removeItem('userType');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return '#2196f3';
      case 'completed':
        return '#4caf50';
      case 'cancelled':
        return '#f44336';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return <FaSpinner className="spinning" />;
      case 'completed':
        return <FaCheckCircle />;
      case 'cancelled':
        return <FaTimesCircle />;
      default:
        return null;
    }
  };

  // Sort appointments by date
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(a.appointmentDate) - new Date(b.appointmentDate)
  );

  // Group appointments by status
  const upcomingAppointments = sortedAppointments.filter(
    app => new Date(app.appointmentDate) > new Date() && app.status === 'Upcoming'
  );

  const completedAppointments = sortedAppointments.filter(
    app => app.status === 'Completed'
  );

  const cancelledAppointments = sortedAppointments.filter(
    app => app.status === 'Cancelled'
  );

  const formatDateTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }) + ' at ' + date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCancelAppointment = (id) => {
    cancelAppointment(id);
    setSelectedAppointment(null);
    toast.success('Appointment cancelled successfully');
  };

  const handleCompleteAppointment = (id) => {
    completeAppointment(id);
    setSelectedAppointment(null);
    toast.success('Appointment marked as completed');
  };

  const renderAppointments = () => {
    let appointmentsToShow = [];
    
    switch(filter) {
      case 'upcoming':
        appointmentsToShow = upcomingAppointments;
        break;
      case 'completed':
        appointmentsToShow = completedAppointments;
        break;
      case 'cancelled':
        appointmentsToShow = cancelledAppointments;
        break;
      default:
        appointmentsToShow = sortedAppointments;
    }

    if (appointmentsToShow.length === 0) {
      return (
        <div className="no-appointments">
          <p>No {filter !== 'all' ? filter : ''} appointments found</p>
        </div>
      );
    }

    return appointmentsToShow.map((appointment, index) => (
      <div 
        key={appointment.id || index} 
        className={`appointment-card ${appointment.status.toLowerCase()} ${selectedAppointment?.id === appointment.id ? 'selected' : ''}`}
        onClick={() => handleAppointmentClick(appointment)}
      >
        <div className="appointment-header">
          <div className="status">
            {appointment.status === 'Upcoming' && <FaSpinner className="spinning" />}
            {appointment.status === 'Completed' && <FaCheckCircle className="completed" />}
            {appointment.status === 'Cancelled' && <FaTimesCircle className="cancelled" />}
            <span>{appointment.status}</span>
          </div>
          <div className="date">
            <FaCalendarAlt />
            <span>{formatDateTime(appointment.appointmentDate)}</span>
          </div>
        </div>

        <div className="doctor-info">
          <img 
            src={appointment.doctorDetails.imageUri} 
            alt={appointment.doctorDetails.name}
            className="doctor-image"
          />
          <div>
            <h4>{appointment.doctorDetails.name}</h4>
            <p className="specialization">{appointment.doctorDetails.specialisation}</p>
            <p className="hospital">{appointment.doctorDetails.hospital}</p>
          </div>
        </div>

        <div className="appointment-details">
          <p><strong>Time:</strong> {appointment.appointmentTime}</p>
          <p><strong>Fee:</strong> {appointment.doctorDetails.consultationFee}</p>
          <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
        </div>

        {appointment.status === 'Upcoming' && (
          <div className="action-buttons">
            <button 
              className="cancel-btn"
              onClick={(e) => {
                e.stopPropagation();
                handleCancelAppointment(appointment.id);
              }}
            >
              Cancel Appointment
            </button>
          </div>
        )}
      </div>
    ));
  };

  if (!patientData) return null;

  return (
    <DashboardStyled>
      <header>
        <div className="user-info">
          <h1>Welcome, {patientData.name}</h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <section className="online-doctors-section">
          <h2>Available Doctors</h2>
          <div className="doctors-list">
            {onlineDoctors.map(doctor => (
              <div key={doctor.id} className="doctor-card">
                <img src={doctor.imageUrl} alt={doctor.name} className="doctor-image" />
                <div className="doctor-info">
                  <h3>{doctor.name}</h3>
                  <p className="specialisation">{doctor.specialisation}</p>
                  <p className="experience">{doctor.experience}</p>
                  <span className={`status ${doctor.status.toLowerCase()}`}>
                    {doctor.status}
                  </span>
                </div>
                <button 
                  className="book-btn"
                  disabled={doctor.status === 'Offline'}
                  onClick={() => navigate(`/book-appointment/${doctor.id}`)}
                >
                  Book Appointment
                </button>
              </div>
            ))}
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

  .online-doctors-section {
    margin-bottom: 2rem;

    h2 {
      color: #2d3748;
      margin-bottom: 1rem;
    }
  }

  .doctors-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .doctor-card {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .doctor-image {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      margin-bottom: 1rem;
    }

    .doctor-info {
      margin-bottom: 1rem;

      h3 {
        margin: 0 0 0.5rem;
        color: #2d3748;
      }

      .specialisation {
        color: #4a5568;
        margin: 0 0 0.25rem;
      }

      .experience {
        color: #718096;
        font-size: 0.875rem;
        margin: 0 0 0.5rem;
      }

      .status {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;

        &.online {
          background: #f0fff4;
          color: #38a169;
        }

        &.offline {
          background: #fff5f5;
          color: #e53e3e;
        }
      }
    }

    .book-btn {
      width: 100%;
      padding: 0.75rem;
      background: #9333ea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover:not(:disabled) {
        background: #7e22ce;
      }

      &:disabled {
        background: #e2e8f0;
        cursor: not-allowed;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .doctor-card {
      padding: 1rem;
    }
  }
`;

export default PatientDashboard; 