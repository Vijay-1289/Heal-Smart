import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const DoctorList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const DoctorCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const DoctorImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
`;

const DoctorName = styled.h2`
  color: #2c3e50;
  margin-bottom: 5px;
`;

const DoctorSpecialty = styled.p`
  color: #7f8c8d;
  margin-bottom: 10px;
`;

const BookButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const ConsultDoctor = () => {
  // This is a placeholder for the actual doctor data
  const doctors = [
    {
      id: 1,
      name: 'Dr. John Smith',
      specialty: 'Cardiologist',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 2,
      name: 'Dr. Sarah Johnson',
      specialty: 'Pediatrician',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 3,
      name: 'Dr. Michael Brown',
      specialty: 'Dermatologist',
      image: 'https://via.placeholder.com/300x200'
    }
  ];

  return (
    <Container>
      <Title>Consult with Our Doctors</Title>
      <DoctorList>
        {doctors.map(doctor => (
          <DoctorCard key={doctor.id}>
            <DoctorImage src={doctor.image} alt={doctor.name} />
            <DoctorName>{doctor.name}</DoctorName>
            <DoctorSpecialty>{doctor.specialty}</DoctorSpecialty>
            <BookButton>Book Appointment</BookButton>
          </DoctorCard>
        ))}
      </DoctorList>
    </Container>
  );
};

export default ConsultDoctor; 