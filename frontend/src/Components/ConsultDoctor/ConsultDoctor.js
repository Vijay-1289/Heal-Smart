import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaStar, FaMapMarkerAlt, FaClock, FaRupeeSign, FaLanguage } from "react-icons/fa";
import DoctorDetails from "../DoctorDetails/DoctorDetails";
import { FilterContext } from "../../context/FilterContext";
import { doctorImages, doctorGender } from "../../utils/doctorImages";
import { useNavigate } from 'react-router-dom';

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
    imageUrl: 'https://example.com/doctor1.jpg'
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
    imageUrl: 'https://example.com/doctor2.jpg'
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
    nextAvailable: 'Today'
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
    nextAvailable: 'Today'
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
    nextAvailable: 'Tomorrow'
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
    nextAvailable: 'Today'
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
    nextAvailable: 'Today'
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
    nextAvailable: 'Tomorrow'
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
    nextAvailable: 'Today'
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
    nextAvailable: 'Today'
  }
];

function ConsultDoctor() {
  const { doctorSpec, setDoctorSpec } = useContext(FilterContext);
  const [doctors, setDoctors] = useState(mockDoctors);
  const [filteredItems, setFilteredItems] = useState(doctors);
  const [selectedDoctor, setSelectedDoctor] = useState(doctorSpec);
  const [showDoctorDetails, setShowDoctorDetails] = useState(false);
  const [DoctorDet, setDoctorDet] = useState([]);
  const navigate = useNavigate();

  const specializations = [
    'All Specializations',
    'Cardiologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic',
    'Gynecologist',
    'Dermatologist'
  ];

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

  const handleSpecializationChange = (e) => {
    const specialization = e.target.value;
    setSelectedDoctor(specialization);
    
    if (specialization === 'All Specializations' || !specialization) {
      setDoctors(mockDoctors);
    } else {
      const filtered = mockDoctors.filter(doctor => 
        doctor.specialisation === specialization
      );
      setDoctors(filtered);
    }
  };

  const handleBookAppointment = (doctor) => {
    // Navigate to booking page with doctor details
    navigate(`/book-appointment/${doctor.id}`, { state: { doctor } });
  };

  return (
    <>
      {!showDoctorDetails ? (
        <ConsultDoctorStyled>
          <div className="container">
            <header>
              <h1>Find & Book Appointment with Doctors</h1>
              <p>Book appointments with the best doctors near you</p>
            </header>

            <div className="filter-section">
              <select 
                value={selectedDoctor}
                onChange={handleSpecializationChange}
                className="specialization-select"
              >
                <option value="">Select Specialization</option>
                {specializations.map((spec, index) => (
                  <option key={index} value={spec}>{spec}</option>
                ))}
              </select>
            </div>

            <div className="doctors-list">
              {doctors.map(doctor => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-info">
                    <div className="doctor-header">
                      <div className="doctor-image">
                        <img src={doctor.imageUri} alt={doctor.name} />
                      </div>
                      <div className="doctor-details">
                        <h2>{doctor.name}</h2>
                        <p className="specialization">{doctor.specialisation}</p>
                        <p className="experience">{doctor.experience}</p>
                        <div className="rating">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < 4 ? 'star-filled' : 'star-empty'} />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="practice-details">
                      <div className="detail">
                        <FaMapMarkerAlt />
                        <span>{doctor.address}</span>
                      </div>
                      <div className="detail">
                        <FaClock />
                        <span>{doctor.timings}</span>
                      </div>
                      <div className="detail">
                        <FaLanguage />
                        <span>{doctor.languages.join(', ')}</span>
                      </div>
                      <div className="detail">
                        <FaRupeeSign />
                        <span>Consultation Fee: {doctor.consultationFee}</span>
                      </div>
                    </div>

                    <div className="booking-section">
                      <div className="availability">
                        <span className="next-available">Next Available: {doctor.nextAvailable}</span>
                      </div>
                      <button 
                        className="book-button"
                        onClick={() => handleBookAppointment(doctor)}
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ToastContainer />
        </ConsultDoctorStyled>
      ) : (
        <DoctorDetails DoctorDet={DoctorDet} />
      )}
    </>
  );
}

const ConsultDoctorStyled = styled.div`
  padding: 2rem;
  background: #f3f4f6;
  min-height: 100vh;

  .container {
    max-width: 1200px;
    margin: 0 auto;
  }

  header {
    text-align: center;
    margin-bottom: 2rem;

    h1 {
      color: #1f2937;
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: #6b7280;
      font-size: 1.1rem;
    }
  }

  .filter-section {
    margin-bottom: 2rem;

    .specialization-select {
      width: 100%;
      max-width: 300px;
      padding: 0.75rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      color: #1f2937;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #9333ea;
        box-shadow: 0 0 0 2px rgba(147, 51, 234, 0.1);
      }
    }
  }

  .doctors-list {
    display: grid;
    gap: 2rem;

    .doctor-card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease;

      &:hover {
        transform: translateY(-4px);
      }

      .doctor-header {
        display: flex;
        gap: 1.5rem;
        margin-bottom: 1.5rem;

        .doctor-image {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        .doctor-details {
          h2 {
            color: #1f2937;
            font-size: 1.25rem;
            margin-bottom: 0.5rem;
          }

          .specialization {
            color: #2563eb;
            font-weight: 500;
            margin-bottom: 0.25rem;
          }

          .experience {
            color: #059669;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
          }

          .rating {
            display: flex;
            gap: 0.25rem;

            .star-filled {
              color: #fbbf24;
            }

            .star-empty {
              color: #e5e7eb;
            }
          }
        }
      }

      .practice-details {
        display: grid;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .detail {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #4b5563;
          font-size: 0.875rem;

          svg {
            color: #6b7280;
          }
        }
      }

      .booking-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1rem;
        border-top: 1px solid #e5e7eb;

        .availability {
          .next-available {
            color: #059669;
            font-weight: 500;
          }
        }

        .book-button {
          background: #9333ea;
          color: white;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.3s ease;

          &:hover {
            background: #7e22ce;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1rem;

    header {
      h1 {
        font-size: 1.5rem;
      }
    }

    .doctor-card {
      .doctor-header {
        flex-direction: column;
        text-align: center;

        .doctor-image {
          margin: 0 auto;
        }
      }

      .booking-section {
        flex-direction: column;
        gap: 1rem;
        text-align: center;

        .book-button {
          width: 100%;
        }
      }
    }
  }
`;

export default ConsultDoctor;
