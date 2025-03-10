import React, { useState } from 'react';
import styled from 'styled-components';
import { InnerLayout } from '../../styles/Layouts';
import { toast } from 'react-toastify';
import { sendAppointmentEmails } from '../../utils/emailService';

function BookAppointment({ doctor, onClose }) {
    const [formData, setFormData] = useState({
        patientName: '',
        patientEmail: '',
        phone: '',
        date: '',
        time: '',
        symptoms: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare appointment data
            const appointmentData = {
                ...formData,
                doctorName: doctor.name,
                doctorEmail: doctor.email,
            };

            // Send confirmation emails
            const emailResult = await sendAppointmentEmails(appointmentData);

            if (emailResult.success) {
                toast.success('Appointment booked successfully! Check your email for confirmation.');
                onClose();
            } else {
                toast.error(emailResult.message);
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            toast.error('Failed to book appointment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <BookingStyled>
            <InnerLayout>
                <div className="booking-container">
                    <h2>Book Appointment with Dr. {doctor.name}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Your Name</label>
                            <input
                                type="text"
                                name="patientName"
                                value={formData.patientName}
                                onChange={handleChange}
                                required
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="patientEmail"
                                value={formData.patientEmail}
                                onChange={handleChange}
                                required
                                placeholder="Enter your email"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="Enter your phone number"
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Preferred Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            <div className="form-group">
                                <label>Preferred Time</label>
                                <input
                                    type="time"
                                    name="time"
                                    value={formData.time}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Symptoms/Reason for Visit</label>
                            <textarea
                                name="symptoms"
                                value={formData.symptoms}
                                onChange={handleChange}
                                required
                                placeholder="Please describe your symptoms or reason for visit"
                                rows="4"
                            />
                        </div>

                        <div className="button-group">
                            <button type="button" onClick={onClose} className="cancel-btn">
                                Cancel
                            </button>
                            <button type="submit" disabled={loading} className="submit-btn">
                                {loading ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </div>
                    </form>
                </div>
            </InnerLayout>
        </BookingStyled>
    );
}

const BookingStyled = styled.div`
    .booking-container {
        background: white;
        padding: 2rem;
        border-radius: 15px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);

        h2 {
            color: var(--color-primary);
            margin-bottom: 2rem;
            text-align: center;
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;

            label {
                font-weight: 500;
                color: #333;
            }

            input, textarea {
                padding: 0.8rem;
                border: 1px solid #ddd;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s ease;

                &:focus {
                    border-color: var(--color-primary);
                    outline: none;
                }
            }

            textarea {
                resize: vertical;
            }
        }

        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;

            @media (max-width: 768px) {
                grid-template-columns: 1fr;
            }
        }

        .button-group {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;

            button {
                flex: 1;
                padding: 1rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;

                &:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            }

            .cancel-btn {
                background: #f8f9fa;
                color: #495057;

                &:hover {
                    background: #e9ecef;
                }
            }

            .submit-btn {
                background: var(--color-primary);
                color: white;

                &:hover:not(:disabled) {
                    background: var(--color-primary-dark);
                }
            }
        }
    }
`; 