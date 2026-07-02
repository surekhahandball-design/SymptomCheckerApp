import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (email, subject, htmlContent) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject,
      html: htmlContent,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
  const htmlContent = `
    <h2>Password Reset Request</h2>
    <p>Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link expires in 1 hour.</p>
  `;
  return sendEmail(email, 'Password Reset', htmlContent);
};

export const sendVerificationEmail = (email, verificationCode) => {
  const htmlContent = `
    <h2>Email Verification</h2>
    <p>Your verification code is: <strong>${verificationCode}</strong></p>
    <p>This code expires in 30 minutes.</p>
  `;
  return sendEmail(email, 'Email Verification', htmlContent);
};

export const sendAppointmentConfirmation = (email, appointmentDetails) => {
  const htmlContent = `
    <h2>Appointment Confirmed</h2>
    <p>Your appointment has been confirmed with Dr. ${appointmentDetails.doctorName}</p>
    <p><strong>Date:</strong> ${appointmentDetails.date}</p>
    <p><strong>Time:</strong> ${appointmentDetails.time}</p>
    <p><strong>Location:</strong> ${appointmentDetails.location}</p>
  `;
  return sendEmail(email, 'Appointment Confirmation', htmlContent);
};
