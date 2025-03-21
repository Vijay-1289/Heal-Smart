import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar, FaCalendar, FaClock, FaRupeeSign, FaMapMarkerAlt, FaUserMd } from "react-icons/fa";
import DoctorDetails from "../DoctorDetails/DoctorDetails";
import { FilterContext } from "../../context/FilterContext";
import { doctorImages, doctorGender } from "../../utils/doctorImages";
import { useNavigate } from 'react-router-dom';
import { useAppointments } from '../../context/AppointmentContext';

// Mock data for doctors
const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Ramesh Babu',
    specialisation: 'Cardiologist',
    experience: '25 years of experience',
    address: 'Ramesh Hospitals, Gunadala, Vijayawada',
    hospital: 'Ramesh Hospitals',
    timings: '9:00 AM - 5:00 PM',
    education: 'MD, DM Cardiology',
    languages: ['Telugu', 'English', 'Hindi'],
    consultationFee: '₹800',
    nextAvailable: 'Today',
    imageUri: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"
  },
  {
    id: '2',
    name: 'Dr. Srinivas Kumar',
    specialisation: 'Neurologist',
    experience: '20 years of experience',
    address: 'Andhra Hospitals, Governorpet, Vijayawada',
    hospital: 'Andhra Hospitals',
    timings: '10:00 AM - 6:00 PM',
    education: 'MD, DM Neurology',
    languages: ['Telugu', 'English'],
    consultationFee: '₹700',
    nextAvailable: 'Tomorrow',
    imageUri: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg"
  },
  {
    id: '3',
    name: 'Dr. Lakshmi Prasad',
    specialisation: 'Pediatrician',
    experience: '15 years of experience',
    address: 'Andhra Hospitals, Governorpet, Vijayawada',
    hospital: 'Andhra Hospitals',
    timings: '9:30 AM - 4:30 PM',
    education: 'MD Pediatrics',
    languages: ['Telugu', 'English', 'Hindi'],
    consultationFee: '₹600',
    nextAvailable: 'Today',
    imageUri: "https://img.freepik.com/free-photo/doctor-with-white-robe-stethoscope_144627-43687.jpg"
  },
  {
    id: '4',
    name: 'Dr. Ravi Shankar',
    specialisation: 'Orthopedic Surgeon',
    experience: '18 years of experience',
    address: 'Kamineni Hospitals, Poranki, Vijayawada',
    hospital: 'Kamineni Hospitals',
    timings: '11:00 AM - 7:00 PM',
    education: 'MS Orthopedics',
    languages: ['Telugu', 'English'],
    consultationFee: '₹750',
    nextAvailable: 'Today',
    imageUri: "https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg"
  },
  {
    id: '5',
    name: 'Dr. Padmavathi',
    specialisation: 'Gynecologist',
    experience: '16 years of experience',
    address: 'Lotus Hospitals, Chuttugunta, Vijayawada',
    hospital: 'Lotus Hospitals',
    timings: '10:00 AM - 6:00 PM',
    education: 'MD, DGO',
    languages: ['Telugu', 'English'],
    consultationFee: '₹600',
    nextAvailable: 'Tomorrow',
    imageUri: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"
  },
  {
    id: '6',
    name: 'Dr. Krishna Murthy',
    specialisation: 'General Medicine',
    experience: '22 years of experience',
    address: 'Eluru Government Hospital, Eluru',
    hospital: 'Eluru Government Hospital',
    timings: '9:00 AM - 4:00 PM',
    education: 'MD General Medicine',
    languages: ['Telugu', 'English'],
    consultationFee: '₹300',
    nextAvailable: 'Today',
    imageUri: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"
  },
  {
    id: '7',
    name: 'Dr. Suresh Kumar',
    specialisation: 'Pulmonologist',
    experience: '14 years of experience',
    address: 'ASRAM Medical College Hospital, Eluru',
    hospital: 'ASRAM Medical College Hospital',
    timings: '10:30 AM - 5:30 PM',
    education: 'MD Pulmonology',
    languages: ['Telugu', 'English', 'Hindi'],
    consultationFee: '₹500',
    nextAvailable: 'Today',
    imageUri: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"
  },
  {
    id: '8',
    name: 'Dr. Venkata Rao',
    specialisation: 'Cardiologist',
    experience: '20 years of experience',
    address: 'Medicover Hospitals, MG Road, Vijayawada',
    hospital: 'Medicover Hospitals',
    timings: '9:00 AM - 5:00 PM',
    education: 'MD, DM Cardiology',
    languages: ['Telugu', 'English'],
    consultationFee: '₹800',
    nextAvailable: 'Tomorrow',
    imageUri: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"
  },
  {
    id: '9',
    name: 'Dr. Priya Reddy',
    specialisation: 'Dermatologist',
    experience: '12 years of experience',
    address: 'Sunrise Hospitals, Eluru Road, Vijayawada',
    hospital: 'Sunrise Hospitals',
    timings: '11:00 AM - 7:00 PM',
    education: 'MD Dermatology',
    languages: ['Telugu', 'English', 'Hindi'],
    consultationFee: '₹600',
    nextAvailable: 'Today',
    imageUri: "https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg"
  },
  {
    id: '10',
    name: 'Dr. Rajesh Kumar',
    specialisation: 'Gastroenterologist',
    experience: '16 years of experience',
    address: 'Kamineni Hospitals, Poranki, Vijayawada',
    hospital: 'Kamineni Hospitals',
    timings: '10:00 AM - 6:00 PM',
    education: 'MD, DM Gastroenterology',
    languages: ['Telugu', 'English'],
    consultationFee: '₹700',
    nextAvailable: 'Today',
    imageUri: "https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg"
  }
];

function ConsultDoctor() {
  const { doctorSpec, setDoctorSpec } = useContext(FilterContext);
  const [doctors, setDoctors] = useState([]);
  const [filteredItems, setFilteredItems] = useState(doctors);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [DoctorDet, setDoctorDet] = useState([]);
  const navigate = useNavigate();
  const { addAppointment } = useAppointments();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    symptoms: ''
  });

  useEffect(() => {
    // Set mock data instead of fetching from Firebase
    const fetchedData = mockDoctors.map(doc => {
      const gender = doctorGender[doc.name] || 'male';
      const specialisationImages = doctorImages[gender];
      const imageUri = specialisationImages[doc.specialisation] || specialisationImages.default;
      return {
        ...doc,
        imageUri
      };
    });
    setDoctors(fetchedData);
  }, []);

  const notify = (item) => {
    setDoctorDet(item);
    setShowDoctorDetails(true);
  };

  const filters = [
    "All Specializations",
    "Cardiologist",
    "Neurologist",
    "Pediatrician",
    "Orthopedic Surgeon",
    "Gynecologist",
    "General Medicine",
    "Pulmonologist",
    "Dermatologist",
    "Gastroenterologist"
  ];

  const handleFilterChange = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const filterItems = () => {
    if (selectedDoctor) {
      setFilteredItems(
        doctors.filter((doctor) => doctor.specialisation === selectedDoctor)
      );
    } else {
      setFilteredItems(doctors);
    }
  };

  useEffect(() => {
    filterItems();
  }, [selectedDoctor, doctors]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBookAppointment = (e) => {
    e.preventDefault();
    
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time for the appointment');
      return;
    }

    if (!formData.name || !formData.phone || !formData.email || !formData.symptoms) {
      toast.error('Please fill in all fields');
      return;
    }

    const appointment = {
      doctorDetails: selectedDoctor,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      patientDetails: formData
    };

    addAppointment(appointment);
    toast.success('Appointment booked successfully!');
    navigate('/dashboard');
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <>
      {!showDoctorDetails ? (
        <DashboardStyled>
          <div className="heading">
            <h2>Consult Doctor</h2>
            <p>Find and book appointments with doctors in Vijayawada & Eluru</p>
          </div>
          <InnerLayout>
            <div className="filter-section">
              <select
                value={selectedDoctor}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Specializations</option>
                {filters.map((filter, idx) => (
                  <option key={`filter-${idx}`} value={filter}>
                    {filter}
                  </option>
                ))}
              </select>
            </div>

            <div className="doctors-grid">
              {filteredItems.map((doctor, idx) => (
                <div key={`doctor-${idx}`} className="doctor-card">
                  <div className="doctor-image">
                    <img src={doctor.imageUri} alt={doctor.name} />
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="specialization">{doctor.specialisation}</p>
                    <p className="education">{doctor.education}</p>
                    <p className="experience">{doctor.experience}</p>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={`star-${i}`}
                          className={i < Math.floor(Math.random() * 2 + 4) ? "star-filled" : "star-empty"}
                        />
                      ))}
                    </div>
                    <p className="hospital">{doctor.hospital}</p>
                    <p className="address">{doctor.address}</p>
                    <p className="timings">{doctor.timings}</p>
                    <div className="additional-info">
                      <p className="languages">Languages: {doctor.languages.join(', ')}</p>
                      <p className="fee">Consultation Fee: {doctor.consultationFee}</p>
                      <p className="availability">Next Available: {doctor.nextAvailable}</p>
                    </div>
                    <button
                      onClick={() => notify(doctor)}
                      className="book-button"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </InnerLayout>
          <ToastContainer />
        </DashboardStyled>
      ) : (
        <DoctorDetails DoctorDet={DoctorDet} />
      )}

      {showBookingForm && selectedDoctor && (
        <div className="booking-overlay">
          <div className="booking-form">
            <h2>Book Appointment with {selectedDoctor.name}</h2>
            <form onSubmit={handleBookAppointment}>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Symptoms:</label>
                <textarea
                  name="symptoms"
                  value={formData.symptoms}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Select Date:</label>
                <input
                  type="date"
                  min={getTomorrowDate()}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Select Time:</label>
                <select
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  required
                >
                  <option value="">Select a time slot</option>
                  {selectedDoctor.availableSlots.map((slot, index) => (
                    <option key={index} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="submit">Confirm Booking</button>
                <button 
                  type="button" 
                  className="cancel"
                  onClick={() => setShowBookingForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

const DashboardStyled = styled.div`
    height: 100vh;
    overflow-y: auto;
    padding: 1rem 0;

    /* Customize scrollbar for the main container */
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

    .heading {
        position: sticky;
        top: 0;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        z-index: 10;
        padding: 1rem 0;
        margin-bottom: 1rem;
        text-align: center;

        h2 {
            font-size: 29px;
            color: darkviolet;
            font-weight: 605;
            margin: 0;
            padding: 1rem 1.5rem;
        }

        p {
            color: #666;
            font-size: 1.1rem;
            margin: 0;
        }
    }

    .filter-section {
        position: sticky;
        top: 80px;
        background: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(8px);
        z-index: 9;
        padding: 1rem;
        margin-bottom: 2rem;
        
        .filter-select {
            padding: 0.8rem 1.5rem;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 1rem;
            color: #333;
            background-color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
            max-width: 300px;

            &:focus {
                outline: none;
                border-color: darkviolet;
            }

            &:hover {
                border-color: darkviolet;
            }
        }
    }

    .doctors-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 2rem;
        padding: 2rem 0;
    }

    .doctor-card {
        background: white;
        border-radius: 1rem;
        padding: 1.5rem;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        
        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .doctor-image {
            width: 80px;
            height: 80px;
            margin: 0 auto 1rem;
            border-radius: 50%;
            background: #f5f5f5;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;

            img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                padding: 1rem;
            }
        }

        .doctor-info {
            text-align: center;

            h3 {
                color: #333;
                margin-bottom: 0.5rem;
                font-size: 1.2rem;
            }

            .specialization {
                color: #2196f3;
                font-weight: 500;
                margin-bottom: 0.5rem;
            }

            .education {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .experience {
                color: #4caf50;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .hospital {
                color: #333;
                font-weight: 500;
                margin-bottom: 0.25rem;
            }

            .address {
                color: #666;
                font-size: 0.9rem;
                margin-bottom: 0.5rem;
            }

            .timings {
                color: #ff9800;
                font-size: 0.9rem;
                margin-bottom: 1rem;
            }

            .additional-info {
                background: #f5f5f5;
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;

                p {
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                    
                    &:last-child {
                        margin-bottom: 0;
                    }
                }

                .languages {
                    color: #666;
                }

                .fee {
                    color: #e91e63;
                    font-weight: 500;
                }

                .availability {
                    color: #4caf50;
                    font-weight: 500;
                }
            }

            .book-button {
                background: #2196f3;
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.3s ease;

                &:hover {
                    background: #1976d2;
                }
            }
        }
    }

    @media (max-width: 768px) {
        .doctors-grid {
            grid-template-columns: 1fr;
            padding: 0.5rem;
        }

        .filter-section {
            padding: 1rem 0.5rem;
            
            .filter-select {
                max-width: 100%;
            }
        }
    }

    .booking-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .booking-form {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow-y: auto;

        h2 {
            color: #1f2937;
            margin-bottom: 1.5rem;
        }

        .form-group {
            margin-bottom: 1rem;

            label {
                display: block;
                margin-bottom: 0.5rem;
                color: #4b5563;
            }

            input, select, textarea {
                width: 100%;
                padding: 0.75rem;
                border: 1px solid #e5e7eb;
                border-radius: 6px;
                font-size: 1rem;

                &:focus {
                    outline: none;
                    border-color: #9333ea;
                }
            }

            textarea {
                height: 100px;
                resize: vertical;
            }
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;

            button {
                flex: 1;
                padding: 0.75rem;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 1rem;
                transition: background-color 0.2s;

                &[type="submit"] {
                    background: #9333ea;
                    color: white;

                    &:hover {
                        background: #7e22ce;
                    }
                }

                &.cancel {
                    background: #ef4444;
                    color: white;

                    &:hover {
                        background: #dc2626;
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        padding: 1rem;

        .doctors-grid {
            grid-template-columns: 1fr;
        }

        .booking-form {
            width: 95%;
            padding: 1.5rem;
        }
    }
`;

export default ConsultDoctor;
