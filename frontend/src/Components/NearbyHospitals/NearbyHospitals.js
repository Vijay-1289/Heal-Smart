import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 20px;
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
`;

const HospitalList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const HospitalCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const HospitalName = styled.h2`
  color: #2c3e50;
  margin-bottom: 5px;
`;

const HospitalAddress = styled.p`
  color: #7f8c8d;
  margin-bottom: 10px;
`;

const HospitalDistance = styled.p`
  color: #3498db;
  font-weight: bold;
`;

const NearbyHospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // This is a placeholder for the actual API call
    const mockHospitals = [
      {
        id: 1,
        name: 'City General Hospital',
        address: '123 Main St, City, State',
        distance: '2.5 miles'
      },
      {
        id: 2,
        name: 'Community Medical Center',
        address: '456 Oak Ave, City, State',
        distance: '3.1 miles'
      },
      {
        id: 3,
        name: 'Regional Health Center',
        address: '789 Pine St, City, State',
        distance: '4.2 miles'
      }
    ];
    setHospitals(mockHospitals);
  }, []);

  const filteredHospitals = hospitals.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hospital.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container>
      <Title>Nearby Hospitals</Title>
      <SearchBar
        type="text"
        placeholder="Search hospitals..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <HospitalList>
        {filteredHospitals.map(hospital => (
          <HospitalCard key={hospital.id}>
            <HospitalName>{hospital.name}</HospitalName>
            <HospitalAddress>{hospital.address}</HospitalAddress>
            <HospitalDistance>{hospital.distance} away</HospitalDistance>
          </HospitalCard>
        ))}
      </HospitalList>
    </Container>
  );
};

export default NearbyHospitals; 