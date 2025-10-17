import nodemailer from "nodemailer";
import { ENV } from "./env.js";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    service: "gmail",
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASSWORD
    }
});

const sendResetCode = async (email, resetCode) => {
    try {
        const mailOptions = {
            from: ENV.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            html: `
        <h2>Password Reset Request</h2>
        <p>Your password reset code is:</p>
        <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px;">
          ${resetCode}
        </h1>
        <p>This code will expire in 1 minute.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
        };

        await transporter.sendMail(mailOptions);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send email');
    }
};

export default sendResetCode;
