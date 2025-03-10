import React, { createContext, useState, useContext, useEffect } from 'react';

const AppointmentContext = createContext();

export const useAppointments = () => {
  return useContext(AppointmentContext);
};

export const AppointmentProvider = ({ children }) => {
  const [appointments, setAppointments] = useState(() => {
    // Load appointments from localStorage on initial render
    const savedAppointments = localStorage.getItem('appointments');
    console.log('Initial appointments from localStorage:', savedAppointments);
    return savedAppointments ? JSON.parse(savedAppointments) : [];
  });

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    console.log('Saving appointments to localStorage:', appointments);
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  const addAppointment = (appointment) => {
    console.log('Adding new appointment:', appointment);
    const newAppointment = {
      ...appointment,
      id: Date.now(),
      status: 'Upcoming',
      bookedAt: new Date().toISOString()
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id, status) => {
    console.log('Updating appointment:', id, status);
    setAppointments(prev =>
      prev.map(appointment =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
  };

  const cancelAppointment = (id) => {
    console.log('Cancelling appointment:', id);
    updateAppointment(id, 'Cancelled');
  };

  const completeAppointment = (id) => {
    console.log('Completing appointment:', id);
    updateAppointment(id, 'Completed');
  };

  const value = {
    appointments,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment
  };

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  );
}; 