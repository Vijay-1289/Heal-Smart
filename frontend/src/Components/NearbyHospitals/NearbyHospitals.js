import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { FaMapMarkerAlt, FaPhone, FaStar, FaClock, FaWheelchair, FaAmbulance, FaSearch, FaTimes } from 'react-icons/fa';

// Function to check if a hospital is currently open
const checkIfOpen = (operatingHours) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay();
    const isWeekend = currentDay === 0 || currentDay === 6;

    if (operatingHours.weekdays === "24 Hours") return "Open Now";

    const timeRange = isWeekend ? operatingHours.weekends : operatingHours.weekdays;
    if (!timeRange) return "Closed";

    const [start, end] = timeRange.split(" - ").map(time => {
        const [hours, minutes] = time.replace(/[APM]/g, "").trim().split(":");
        let hour = parseInt(hours);
        if (time.includes("PM") && hour !== 12) hour += 12;
        if (time.includes("AM") && hour === 12) hour = 0;
        return hour;
    });

    return (currentHour >= start && currentHour < end) ? "Open Now" : "Closed";
};

// Enhanced mock data with real operating hours and more detailed information
const mockHospitals = [
  {
    id: 1,
        name: "Ramesh Hospitals",
        address: "Ramesh Heart Centre, Gunadala, Vijayawada",
        area: "Gunadala",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        phone: "0866 244 4444",
        rating: 4.7,
        operatingHours: {
            weekdays: "24 Hours",
            weekends: "24 Hours"
        },
        emergency: true,
        wheelchair: true,
        distance: "0.5 km",
        coordinates: {
            lat: 16.5062,
            lng: 80.6480
        },
        specialties: ["Cardiology", "Emergency Care", "Multi Specialty"],
        facilities: ["Cath Lab", "ICU", "Blood Bank"]
  },
  {
    id: 2,
        name: "Andhra Hospitals",
        address: "Beside Polyclinic, Governorpet, Vijayawada",
        area: "Governorpet",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        phone: "0866 247 2472",
        rating: 4.6,
        operatingHours: {
            weekdays: "24 Hours",
            weekends: "24 Hours"
        },
        emergency: true,
        wheelchair: true,
        distance: "1.2 km",
        coordinates: {
            lat: 16.5089,
            lng: 80.6419
        },
        specialties: ["Pediatrics", "Cardiology", "Neurology"],
        facilities: ["NICU", "PICU", "Emergency Care"]
  },
  {
    id: 3,
        name: "Kamineni Hospitals",
        address: "100 Feet Road, Poranki, Vijayawada",
        area: "Poranki",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        phone: "0866 246 8001",
        rating: 4.5,
        operatingHours: {
            weekdays: "24 Hours",
            weekends: "24 Hours"
        },
        emergency: true,
        wheelchair: true,
        distance: "2.5 km",
        coordinates: {
            lat: 16.4902,
            lng: 80.6651
        },
        specialties: ["Multi Specialty", "Orthopedics", "General Surgery"],
        facilities: ["Operation Theatres", "ICU", "Diagnostic Center"]
  },
  {
    id: 4,
        name: "Lotus Hospitals",
        address: "Near Chuttugunta Center, Vijayawada",
        area: "Chuttugunta",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        phone: "0866 242 4242",
        rating: 4.4,
        operatingHours: {
            weekdays: "8:00 AM - 10:00 PM",
            weekends: "9:00 AM - 8:00 PM"
        },
        emergency: true,
        wheelchair: true,
        distance: "1.8 km",
        coordinates: {
            lat: 16.5157,
            lng: 80.6337
        },
        specialties: ["Pediatrics", "Women's Health", "General Medicine"],
        facilities: ["Labor Rooms", "NICU", "Pharmacy"]
    },
    {
        id: 5,
        name: "Eluru Government Hospital",
        address: "Hospital Road, Eluru",
        area: "City Center",
        city: "Eluru",
        state: "Andhra Pradesh",
        phone: "08812 232 873",
    rating: 4.0,
        operatingHours: {
            weekdays: "24 Hours",
            weekends: "24 Hours"
        },
        emergency: true,
        wheelchair: true,
        distance: "3.0 km",
        coordinates: {
            lat: 16.7107,
            lng: 81.0952
        },
        specialties: ["General Medicine", "Emergency Care", "Surgery"],
        facilities: ["Emergency Ward", "Blood Bank", "X-Ray"]
    },
    {
        id: 6,
        name: "Alluri Sitarama Raju Academy of Medical Sciences",
        address: "ASRAM Nagar, Eluru",
        area: "ASRAM",
        city: "Eluru",
        state: "Andhra Pradesh",
        phone: "08812 244 983",
        rating: 4.3,
        operatingHours: {
            weekdays: "24 Hours",
            weekends: "24 Hours"
        },
        emergency: true,
        wheelchair: true,
        distance: "4.2 km",
        coordinates: {
            lat: 16.7150,
            lng: 81.0891
        },
        specialties: ["Multi Specialty", "Trauma Care", "Neurology"],
        facilities: ["CT Scan", "MRI", "ICU"]
    },
    {
        id: 7,
        name: "Medicover Hospitals",
        address: "Near PVP Square, MG Road, Vijayawada",
        area: "Mogalrajapuram",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        phone: "0866 241 1888",
        rating: 4.6,
        operatingHours: {
            weekdays: "24 Hours",
            weekends: "24 Hours"
        },
        emergency: true,
        wheelchair: true,
        distance: "1.5 km",
        coordinates: {
            lat: 16.5047,
            lng: 80.6495
        },
        specialties: ["Multi Specialty", "Cardiology", "Oncology"],
        facilities: ["Cath Lab", "Cancer Center", "Advanced Diagnostics"]
    },
    {
        id: 8,
        name: "Sunrise Hospitals",
        address: "Eluru Road, Vijayawada",
        area: "Patamata",
        city: "Vijayawada",
        state: "Andhra Pradesh",
        phone: "0866 247 8899",
        rating: 4.4,
        operatingHours: {
            weekdays: "8:30 AM - 9:00 PM",
            weekends: "9:00 AM - 6:00 PM"
        },
        emergency: false,
        wheelchair: true,
        distance: "2.8 km",
        coordinates: {
            lat: 16.5012,
            lng: 80.6602
        },
        specialties: ["Orthopedics", "Physiotherapy", "Sports Medicine"],
        facilities: ["Rehabilitation Center", "Physiotherapy Unit"]
    }
];

function NearbyHospitals() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
    const [selectedCity, setSelectedCity] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [locationError, setLocationError] = useState('');
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDirections, setShowDirections] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);

    // Get unique cities from mock data
    const cities = [...new Set(mockHospitals.map(hospital => hospital.city))].sort();

    // Update hospital status every minute
  useEffect(() => {
        const updateHospitalStatus = () => {
            const updatedHospitals = mockHospitals.map(hospital => ({
                ...hospital,
                operatingHours: {
                    ...hospital.operatingHours,
                    current: checkIfOpen(hospital.operatingHours)
                }
            }));
            setHospitals(updatedHospitals);
        setLoading(false);
    };

        updateHospitalStatus(); // Initial update
        const interval = setInterval(updateHospitalStatus, 60000); // Update every minute

        return () => clearInterval(interval);
  }, []);

    useEffect(() => {
        // Get user's location when component mounts
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    setLocationError('Unable to get your location. Showing all hospitals.');
                }
            );
        }
    }, []);

    // Calculate distance between two points using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        return distance.toFixed(1) + " km";
    };

    // Get unique specialties from mock data
    const specialties = [...new Set(hospitals.flatMap(hospital => hospital.specialties))].sort();

    // Enhanced filter function with city filtering
    const filteredHospitals = hospitals.map(hospital => {
        if (userLocation) {
            return {
                ...hospital,
                distance: calculateDistance(
                    userLocation.lat,
                    userLocation.lng,
                    hospital.coordinates.lat,
                    hospital.coordinates.lng
                )
            };
        }
        return hospital;
    }).filter(hospital => {
        const matchesSearch = 
            hospital.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
            hospital.specialties.some(specialty => 
                specialty.toLowerCase().includes(searchTerm.toLowerCase())
            );
        const matchesSpecialty = !selectedSpecialty || hospital.specialties.includes(selectedSpecialty);
        const matchesEmergency = !showEmergencyOnly || hospital.emergency;
        const matchesCity = !selectedCity || hospital.city === selectedCity;
        return matchesSearch && matchesSpecialty && matchesEmergency && matchesCity;
    }).sort((a, b) => {
        if (userLocation) {
            return parseFloat(a.distance) - parseFloat(b.distance);
        }
        return 0;
    });

    const handleGetDirections = (hospital) => {
        setSelectedHospital(hospital);
        setShowDirections(true);
    };

    const handleCloseDirections = () => {
        setShowDirections(false);
        setSelectedHospital(null);
    };

    if (loading) {
        return (
            <HospitalsStyled>
                <InnerLayout>
                    <div className="header">
                        <h2>Loading Hospitals...</h2>
                        <p>Please wait while we fetch the latest information</p>
                    </div>
                </InnerLayout>
            </HospitalsStyled>
        );
    }

  return (
    <HospitalsStyled>
      <InnerLayout>
                <div className="header">
          <h2>Nearby Hospitals</h2>
                    <p>Find healthcare facilities in Andhra Pradesh</p>
                    {locationError && <p className="location-error">{locationError}</p>}
                </div>

                <div className="filters">
                    <div className="search-box">
                        <FaSearch className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search by hospital name, location, or specialty..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="city-select"
                        >
                            <option value="">All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="specialty-select"
                        >
                            <option value="">All Specialties</option>
                            {specialties.map(specialty => (
                                <option key={specialty} value={specialty}>{specialty}</option>
                            ))}
                        </select>
                        <button 
                            className={`emergency-filter ${showEmergencyOnly ? 'active' : ''}`}
                            onClick={() => setShowEmergencyOnly(!showEmergencyOnly)}
                        >
                            <FaAmbulance />
                            Emergency Only
                        </button>
                    </div>
                </div>

                <div className="hospitals-container">
                    <div className={`hospitals-grid ${showDirections ? 'with-directions' : ''}`}>
                        {filteredHospitals.length === 0 ? (
                            <div className="no-results">
                                <p>No hospitals found matching your criteria</p>
                            </div>
                        ) : (
                            filteredHospitals.map((hospital) => (
                <div key={hospital.id} className="hospital-card">
                                <div className="card-header">
                    <h3>{hospital.name}</h3>
                    <span className="distance">{hospital.distance}</span>
                  </div>
                  
                                <div className="info-row">
                                    <FaMapMarkerAlt className="icon location" />
                                    <p>{hospital.address}</p>
                                </div>

                                <div className="info-row">
                                    <FaPhone className="icon phone" />
                                    <p>{hospital.phone}</p>
                                </div>

                                <div className="info-row">
                                    <FaStar className="icon rating" />
                                    <p>{hospital.rating} / 5</p>
                                </div>

                                <div className="info-row">
                                    <FaClock className="icon hours" />
                                    <div className="hours-details">
                                        <p className={`current-status ${hospital.operatingHours.current === "Open Now" ? "open" : "closed"}`}>
                                            {hospital.operatingHours.current}
                                        </p>
                                        <p>Weekdays: {hospital.operatingHours.weekdays}</p>
                                        <p>Weekends: {hospital.operatingHours.weekends}</p>
                                    </div>
                                </div>

                                <div className="features">
                                    {hospital.emergency && (
                                        <div className="feature emergency">
                                            <FaAmbulance />
                                            <span>24/7 Emergency</span>
                                        </div>
                                    )}
                                    {hospital.wheelchair && (
                                        <div className="feature wheelchair">
                                            <FaWheelchair />
                                            <span>Wheelchair Access</span>
                    </div>
                  )}
                                </div>

                                <div className="facilities">
                                    <h4>Available Facilities:</h4>
                                    <div className="facility-tags">
                                        {hospital.facilities.map((facility, index) => (
                                            <span key={index} className="facility-tag">
                                                {facility}
                                            </span>
                                        ))}
                                    </div>
                  </div>

                                <div className="specialties">
                                    {hospital.specialties.map((specialty, index) => (
                                        <span key={index} className="specialty-tag">
                                            {specialty}
                                        </span>
                                    ))}
                  </div>

                                <button 
                                    className="directions-button"
                                    onClick={() => handleGetDirections(hospital)}
                                >
                                    Get Directions
                    </button>
                  </div>
                        ))
          )}
        </div>

                    {showDirections && selectedHospital && (
                        <div className="directions-overlay">
                            <div className="directions-container">
                                <div className="directions-header">
                                    <h3>Directions to {selectedHospital.name}</h3>
                                    <button className="close-btn" onClick={handleCloseDirections}>
                                        <FaTimes />
                                    </button>
                                </div>
                                <div className="map-container">
                                    <iframe
                                        title="Hospital Directions"
                                        width="100%"
                                        height="100%"
                                        frameBorder="0"
                                        style={{ border: 0 }}
                                        src={`https://www.google.com/maps/embed/v1/directions?key=AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao
                                            &origin=${userLocation?.lat},${userLocation?.lng}
                                            &destination=${selectedHospital.coordinates.lat},${selectedHospital.coordinates.lng}
                                            &mode=driving`}
                                        allowFullScreen
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
      </InnerLayout>
    </HospitalsStyled>
  );
}

const HospitalsStyled = styled.div`
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

    .header {
        text-align: center;
        margin-bottom: 2rem;
        position: sticky;
        top: 0;
        background: rgba(252, 246, 249, 0.9);
        padding: 1rem;
        backdrop-filter: blur(8px);
        z-index: 10;

        h2 {
            color: #9333ea;
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        p {
            color: #666;
            font-size: 1.1rem;
        }

        .location-error {
            color: #ef4444;
            font-size: 0.9rem;
            margin-top: 0.5rem;
        }
    }

    .filters {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
        padding: 0 1rem;
        position: sticky;
        top: 100px;
        background: rgba(252, 246, 249, 0.9);
        backdrop-filter: blur(8px);
        z-index: 9;
        padding: 1rem;

        .search-box {
            width: 100%;
            position: relative;
            
            .search-icon {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #9333ea;
            }
            
            input {
                width: 100%;
                padding: 0.75rem 1rem 0.75rem 2.5rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;

                &:focus {
                    outline: none;
                    border-color: #9333ea;
                }
            }
        }

        .filter-group {
            display: flex;
            gap: 1rem;
            align-items: center;

            .city-select,
            .specialty-select {
                flex: 1;
                padding: 0.75rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;

                &:focus {
                    outline: none;
                    border-color: #9333ea;
                }
            }

            .emergency-filter {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                background: white;
                color: #666;
                cursor: pointer;
                transition: all 0.3s ease;
                white-space: nowrap;

                &.active {
                    background: #ef4444;
                    color: white;
                    border-color: #ef4444;
                }

                &:hover {
                    border-color: #ef4444;
                }
            }
        }
    }

    .hospitals-container {
        position: relative;
        width: 100%;
    }

    .hospitals-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 2rem;
        padding: 1rem;
        margin-top: 1rem;
        transition: all 0.3s ease;

        &.with-directions {
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            margin-right: 400px;
        }
    }

    .hospital-card {
        background: white;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        height: fit-content;
        max-height: 90vh;
        overflow-y: auto;

        /* Customize scrollbar for hospital cards */
        &::-webkit-scrollbar {
            width: 6px;
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

        &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 1rem;
            position: sticky;
            top: 0;
            background: white;
            padding: 0.5rem 0;
            z-index: 1;

            h3 {
                color: #333;
                font-size: 1.25rem;
                margin: 0;
                line-height: 1.4;
            }

            .distance {
                background: #9333ea;
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 20px;
                font-size: 0.875rem;
            }
        }

        .info-row {
            display: flex;
            align-items: start;
            gap: 0.75rem;
            margin-bottom: 0.75rem;

            .icon {
                margin-top: 4px;
                font-size: 1.1rem;

                &.location { color: #ef4444; }
                &.phone { color: #3b82f6; }
                &.rating { color: #f59e0b; }
                &.hours { color: #10b981; }
            }

            .hours-details {
                .current-status {
                    &.open {
                        color: #10b981;
                    }
                    &.closed {
                        color: #ef4444;
                    }
                    font-weight: 600;
                }

                p {
                    color: #666;
                    font-size: 0.95rem;
                    line-height: 1.5;
                    margin: 0;
                }
            }

            p {
                color: #666;
                font-size: 0.95rem;
                line-height: 1.5;
                margin: 0;
            }
        }

        .features {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            margin: 1rem 0;

            .feature {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 0.875rem;
                color: #666;

                &.emergency svg { color: #ef4444; }
                &.wheelchair svg { color: #3b82f6; }
            }
        }

        .facilities {
            margin: 1rem 0;

            h4 {
                color: #333;
                font-size: 1rem;
                margin-bottom: 0.5rem;
            }

            .facility-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;

                .facility-tag {
                    background: #e5e7eb;
                    color: #4b5563;
                    padding: 0.25rem 0.75rem;
                    border-radius: 20px;
                    font-size: 0.875rem;
                }
            }
        }

        .specialties {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin: 1rem 0;

            .specialty-tag {
                background: #f3e8ff;
                color: #9333ea;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.875rem;
            }
        }

        .directions-button {
            width: 100%;
            padding: 0.75rem 1.5rem;
            background: #9333ea;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
            position: sticky;
            bottom: 0;
            margin-top: 1rem;

            &:hover {
                background: #7e22ce;
            }
        }
    }

    .directions-overlay {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        max-width: 400px;
        background: rgba(255, 255, 255, 0.95);
        box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }

    .directions-container {
        height: 100%;
        display: flex;
        flex-direction: column;

        .directions-header {
            padding: 1rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e5e7eb;

            h3 {
                margin: 0;
                color: #333;
                font-size: 1.2rem;
            }

            .close-btn {
                background: none;
                border: none;
                color: #666;
                cursor: pointer;
                padding: 0.5rem;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;

                &:hover {
                    color: #333;
                }
            }
        }

        .map-container {
            flex: 1;
            overflow: hidden;

            iframe {
                width: 100%;
                height: 100%;
            }
        }
    }

    .no-results {
        grid-column: 1 / -1;
        text-align: center;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

        p {
            color: #666;
            font-size: 1.1rem;
        }
    }

    @media (max-width: 768px) {
        .filters {
            .filter-group {
                flex-direction: column;
                
                .city-select,
                .specialty-select {
                    width: 100%;
                }
            }
        }

        .hospitals-grid {
            grid-template-columns: 1fr;
            padding: 0.5rem;
        }
    }

    @media (max-width: 1024px) {
        .hospitals-grid.with-directions {
            margin-right: 0;
        }

        .directions-overlay {
            width: 100%;
            max-width: none;
        }
    }
`;

export default NearbyHospitals; 