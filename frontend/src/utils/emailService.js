import emailjs from '@emailjs/browser';

// Initialize EmailJS with your user ID
emailjs.init("YOUR_USER_ID"); // Replace with your EmailJS user ID

export const sendAppointmentEmails = async (appointmentData) => {
    try {
        // Send email to doctor
        await emailjs.send(
            "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
            "YOUR_DOCTOR_TEMPLATE_ID", // Replace with your doctor email template ID
            {
                doctor_name: appointmentData.doctorName,
                doctor_email: appointmentData.doctorEmail,
                patient_name: appointmentData.patientName,
                appointment_date: appointmentData.date,
                appointment_time: appointmentData.time,
                patient_email: appointmentData.patientEmail,
                patient_phone: appointmentData.phone,
                symptoms: appointmentData.symptoms
            }
        );

        // Send confirmation email to patient
        await emailjs.send(
            "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
            "YOUR_PATIENT_TEMPLATE_ID", // Replace with your patient email template ID
            {
                doctor_name: appointmentData.doctorName,
                doctor_email: appointmentData.doctorEmail,
                patient_name: appointmentData.patientName,
                appointment_date: appointmentData.date,
                appointment_time: appointmentData.time,
                patient_email: appointmentData.patientEmail,
                patient_phone: appointmentData.phone,
                symptoms: appointmentData.symptoms
            }
        );

        return { success: true, message: "Appointment confirmation emails sent successfully!" };
    } catch (error) {
        console.error("Error sending emails:", error);
        return { success: false, message: "Failed to send confirmation emails. Please try again." };
    }
}; 