import React, { useState, useEffect, useMemo } from "react";
import styled from "styled-components";
import { InnerLayout } from "../../styles/Layouts";
import BookingForm from "../BookingForm/BookingForm";

function DoctorDetails({ DoctorDet }) {
  const [selectedTime, setSelectedTime] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Generate a persistent availability pattern for the next 7 days
  const slotAvailabilityPattern = useMemo(() => {
    const pattern = {};
    const days = [];
    
    // Get next 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date.toDateString());
    }

    // Create random but persistent availability for each time slot for each day
    days.forEach(day => {
      pattern[day] = new Array(48).fill(null).map(() => Math.random() > 0.3);
    });

    return pattern;
  }, []); // Empty dependency array means this will be created once and persist

  // Function to check if a time is past current time
  const isPastTime = (timeStr, date) => {
    const now = new Date();
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':');
    let hour = parseInt(hours);
    
    // Convert to 24-hour format
    if (period === 'PM' && hour !== 12) hour += 12;
    if (period === 'AM' && hour === 12) hour = 0;

    const slotTime = new Date(date);
    slotTime.setHours(hour, parseInt(minutes), 0);

    return now > slotTime;
  };

  // Function to get next 7 days
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  useEffect(() => {
    setLoading(true);
    // Parse doctor's timings and generate available slots
    if (DoctorDet.timings) {
      const [startTime, endTime] = DoctorDet.timings.split(' - ').map(time => {
        const [hours, minutes] = time.replace(/[AP]M/, '').trim().split(':');
        let hour = parseInt(hours);
        if (time.includes('PM') && hour !== 12) hour += 12;
        if (time.includes('AM') && hour === 12) hour = 0;
        return { hour, minutes: parseInt(minutes) };
      });

      // Generate 30-minute slots between start and end time
      const slots = [];
      let currentHour = startTime.hour;
      let currentMinutes = startTime.minutes;
      let slotIndex = 0;

      while (
        currentHour < endTime.hour || 
        (currentHour === endTime.hour && currentMinutes < endTime.minutes)
      ) {
        const timeString = `${currentHour % 12 || 12}:${currentMinutes.toString().padStart(2, '0')} ${currentHour >= 12 ? 'PM' : 'AM'}`;
        
        // Check if the slot is past current time for today's date
        const isPast = selectedDate.toDateString() === new Date().toDateString() && 
                      isPastTime(timeString, selectedDate);

        // Use the pre-generated availability pattern for this day and slot
        const isAvailable = slotAvailabilityPattern[selectedDate.toDateString()][slotIndex];

        slots.push({
          id: slots.length + 1,
          time: timeString,
          available: !isPast && isAvailable
        });

        // Increment by 30 minutes
        currentMinutes += 30;
        if (currentMinutes >= 60) {
          currentHour += Math.floor(currentMinutes / 60);
          currentMinutes %= 60;
        }
        slotIndex++;
      }

      setTimeSlots(slots);
      setLoading(false);
    }
  }, [DoctorDet.timings, selectedDate, slotAvailabilityPattern]);

  const handleBookNow = (time) => {
    setSelectedTime(time);
    setShowBookingForm(true);
  };

  const handleCloseForm = () => {
    setShowBookingForm(false);
    setSelectedTime(null);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  return (
    <MentStyled>
      <InnerLayout className="main">
        <div className="doctor-card">
          <img
            src={DoctorDet.imageUri}
            alt={DoctorDet.name}
          />
          <h5>{DoctorDet.name}</h5>
          <span className="specialization">{DoctorDet.specialisation}</span>
          <p className="experience">{DoctorDet.experience}</p>
          <p className="education">{DoctorDet.education}</p>
          <p className="hospital">{DoctorDet.hospital}</p>
          <p className="address">{DoctorDet.address}</p>
          <p className="timings">Working Hours: {DoctorDet.timings}</p>
          <div className="additional-info">
            <p>Languages: {DoctorDet.languages.join(', ')}</p>
            <p>Consultation Fee: {DoctorDet.consultationFee}</p>
          </div>
        </div>

        <div className="slots-container">
          <h3>Available Time Slots</h3>
          
          <div className="date-selector">
            {getNextDays().map((date, index) => (
              <button
                key={index}
                className={`date-button ${selectedDate.toDateString() === date.toDateString() ? 'active' : ''}`}
                onClick={() => handleDateSelect(date)}
              >
                <span className="day">{formatDate(date)}</span>
                {index === 0 && <span className="today-tag">Today</span>}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading available slots...</div>
          ) : (
            <div className="time-slots">
              {timeSlots.map((slot) => (
                <div key={slot.id} className={`slot ${!slot.available ? 'unavailable' : ''}`}>
                  <span className="time">{slot.time}</span>
                  {slot.available ? (
                    <button
                      onClick={() => handleBookNow(slot)}
                      className="book-button"
                    >
                      Book Now
                    </button>
                  ) : (
                    <span className="status">Not Available</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {showBookingForm && (
          <BookingForm
            doctorDetails={DoctorDet}
            selectedTime={selectedTime}
            selectedDate={selectedDate}
            onClose={handleCloseForm}
          />
        )}
      </InnerLayout>
    </MentStyled>
  );
}

const MentStyled = styled.div`
  height: 100vh;
  overflow-y: auto;
  background: #f8f9fa;

  /* Customize scrollbar */
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

  .main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .doctor-card {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    text-align: center;
    max-width: 600px;
    margin: 0 auto;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -1rem;
      left: 50%;
      transform: translateX(-50%);
      width: 50px;
      height: 4px;
      background: linear-gradient(to right, #2196f3, #e91e63);
      border-radius: 2px;
    }

    img {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      margin: 0 auto 1rem;
      object-fit: cover;
      border: 3px solid #f5f5f5;
      padding: 3px;
      background: white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    h5 {
      font-size: 1.5rem;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .specialization {
      color: #2196f3;
      font-size: 1.1rem;
      font-weight: 500;
      display: block;
      margin-bottom: 1rem;
    }

    .experience {
      color: #4caf50;
      margin-bottom: 0.5rem;
    }

    .education {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .hospital {
      color: #333;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .address {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .timings {
      color: #ff9800;
      font-weight: 500;
      margin-bottom: 1rem;
      padding: 0.5rem;
      background: #fff3e0;
      border-radius: 0.5rem;
      display: inline-block;
    }

    .additional-info {
      background: #f5f5f5;
      padding: 1rem;
      border-radius: 0.5rem;
      margin-top: 1rem;

      p {
        margin-bottom: 0.5rem;
        &:last-child {
          margin-bottom: 0;
          color: #e91e63;
          font-weight: 500;
        }
      }
    }
  }

  .slots-container {
    background: white;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    max-width: 800px;
    margin: 0 auto;

    h3 {
      color: #333;
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .date-selector {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 1rem;
      margin-bottom: 2rem;
      position: relative;

      &::-webkit-scrollbar {
        height: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.05);
        border-radius: 10px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(147, 51, 234, 0.2);
        border-radius: 10px;
      }

      .date-button {
        padding: 0.75rem 1.25rem;
        border: 1px solid #e0e0e0;
        border-radius: 0.5rem;
        background: white;
        cursor: pointer;
        transition: all 0.3s ease;
        min-width: 120px;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;

        .day {
          font-weight: 500;
          color: #333;
        }

        .today-tag {
          font-size: 0.75rem;
          color: #2196f3;
          font-weight: 500;
        }

        &:hover {
          border-color: #2196f3;
          transform: translateY(-2px);
        }

        &.active {
          background: #2196f3;
          border-color: #2196f3;
          color: white;

          .day, .today-tag {
            color: white;
          }
        }
      }
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #666;
      font-style: italic;
    }

    .time-slots {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 1rem;
      
      .slot {
        background: #f8f9fa;
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        transition: all 0.3s ease;
        border: 1px solid #eee;

        &:hover:not(.unavailable) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        &.unavailable {
          opacity: 0.7;
          background: #f5f5f5;
          cursor: not-allowed;
        }

        .time {
          display: block;
          color: #333;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        .status {
          color: #f44336;
          font-size: 0.9rem;
          display: block;
          padding: 0.5rem;
          background: #ffebee;
          border-radius: 0.25rem;
        }

        .book-button {
          background: #2196f3;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 0.25rem;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          font-weight: 500;

          &:hover {
            background: #1976d2;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    .main {
      padding: 1rem;
    }

    .doctor-card {
      padding: 1.5rem;
    }

    .slots-container {
      padding: 1.5rem;

      .date-selector {
        .date-button {
          min-width: 100px;
          padding: 0.5rem 1rem;
        }
      }

      .time-slots {
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      }
    }
  }
`;

export default DoctorDetails;
