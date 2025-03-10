import React, { useState } from 'react';
import styled from 'styled-components';
import { useAppointments } from '../../context/AppointmentContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function BookingForm({ doctorDetails, selectedTime, selectedDate, onClose }) {
  const { addAppointment } = useAppointments();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    symptoms: '',
    age: '',
    gender: 'select'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.name || !formData.phone || !formData.email || !formData.symptoms || !formData.age || formData.gender === 'select') {
      toast.error('Please fill in all fields');
      return;
    }

    // Create appointment object
    const appointment = {
      patientDetails: formData,
      doctorDetails: {
        name: doctorDetails.name,
        specialisation: doctorDetails.specialisation,
        hospital: doctorDetails.hospital,
        imageUri: doctorDetails.imageUri,
        consultationFee: doctorDetails.consultationFee
      },
      appointmentTime: selectedTime.time,
      appointmentDate: selectedDate.toISOString(),
      symptoms: formData.symptoms
    };

    // Add appointment
    addAppointment(appointment);
    
    // Show confirmation popup
    setShowConfirmation(true);
  };

  const handleConfirmationClose = () => {
    // Close the form
    onClose();
    // Navigate to appointments page
    navigate('/my-appointments');
    // Show success message
    toast.success('Appointment booked successfully!');
  };

  if (showConfirmation) {
    return (
      <FormStyled>
        <div className="overlay" onClick={handleConfirmationClose}></div>
        <div className="confirmation-container">
          <div className="success-icon">✓</div>
          <h2>Appointment Confirmed!</h2>
          <div className="confirmation-details">
            <p><strong>Patient Name:</strong> {formData.name}</p>
            <p><strong>Doctor:</strong> {doctorDetails.name}</p>
            <p><strong>Specialization:</strong> {doctorDetails.specialisation}</p>
            <p><strong>Hospital:</strong> {doctorDetails.hospital}</p>
            <p><strong>Date:</strong> {selectedDate.toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><strong>Time:</strong> {selectedTime.time}</p>
            <p><strong>Consultation Fee:</strong> {doctorDetails.consultationFee}</p>
          </div>
          <button className="view-appointments-btn" onClick={handleConfirmationClose}>
            View My Appointments
          </button>
        </div>
      </FormStyled>
    );
  }

  return (
    <FormStyled>
      <div className="overlay" onClick={onClose}></div>
      <div className="form-container">
        <h2>Book Appointment</h2>
        <div className="appointment-info">
          <p><strong>Doctor:</strong> {doctorDetails.name}</p>
          <p><strong>Date:</strong> {selectedDate.toLocaleDateString('en-IN', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}</p>
          <p><strong>Time:</strong> {selectedTime.time}</p>
          <p><strong>Fee:</strong> {doctorDetails.consultationFee}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                min="0"
                max="120"
              />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="select">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Symptoms/Reason for Visit</label>
            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              placeholder="Describe your symptoms or reason for visit"
              rows="4"
            ></textarea>
          </div>

          <div className="button-group">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="submit-btn">
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
    </FormStyled>
  );
}

const FormStyled = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
  }

  .form-container, .confirmation-container {
    position: relative;
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);

    &::-webkit-scrollbar {
      width: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.05);
      border-radius: 10px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(147, 51, 234, 0.2);
      border-radius: 10px;

      &:hover {
        background: rgba(147, 51, 234, 0.4);
      }
    }
  }

  .confirmation-container {
    text-align: center;
    padding: 3rem 2rem;

    .success-icon {
      width: 80px;
      height: 80px;
      background: #4CAF50;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 2rem;
      color: white;
      font-size: 40px;
      animation: scaleIn 0.3s ease-out;
    }

    h2 {
      color: #333;
      margin-bottom: 2rem;
      font-size: 1.8rem;
    }

    .confirmation-details {
      text-align: left;
      background: #f8f9fa;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-bottom: 2rem;

      p {
        margin: 0.75rem 0;
        color: #666;

        strong {
          color: #333;
          margin-right: 0.5rem;
        }
      }
    }

    .view-appointments-btn {
      background: #2196f3;
      color: white;
      border: none;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      font-size: 1.1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #1976d2;
        transform: translateY(-2px);
      }
    }
  }

  .form-container {
    h2 {
      color: #333;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .appointment-info {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;

      p {
        margin: 0.5rem 0;
        color: #666;

        strong {
          color: #333;
          margin-right: 0.5rem;
        }
      }
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;
      }

      input, select, textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ddd;
        border-radius: 0.5rem;
        font-size: 1rem;
        color: #333;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #2196f3;
          box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
        }
      }

      textarea {
        resize: vertical;
        min-height: 100px;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .button-group {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;

      button {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 0.5rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;

        &.cancel-btn {
          background: #f44336;
          color: white;

          &:hover {
            background: #d32f2f;
          }
        }

        &.submit-btn {
          background: #2196f3;
          color: white;

          &:hover {
            background: #1976d2;
          }
        }
      }
    }
  }

  @keyframes scaleIn {
    from {
      transform: scale(0);
    }
    to {
      transform: scale(1);
    }
  }

  @media (max-width: 768px) {
    .form-container, .confirmation-container {
      padding: 1.5rem;
      width: 95%;

      .form-row {
        grid-template-columns: 1fr;
      }
    }
  }
`;

export default BookingForm; 