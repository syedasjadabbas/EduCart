const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // Note for User: To test out actual emails, you need to configure your own email/password combo.
    // E.g., via a test SMTP server like Mailtrap or real service like SendGrid, or Gmail APP password.
    // For now, it will safely attempt or log to console.

    // We can use Ethereal for dummy emails if no real auth is provided, but since we are showing them the template:
    const transporter = nodemailer.createTransport({
        service: 'gmail', // You can change this to your preferred provider
        auth: {
            user: process.env.EMAIL_USER || 'your.email@gmail.com',     // Set this in .env
            pass: process.env.EMAIL_PASS || 'your-app-password-here'    // Set this in .env
        }
    });

    const mailOptions = {
        from: `EduCart Store <no-reply@educart.com>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email properly dispatched to ${options.email}`);
    } catch (error) {
        console.error('Error sending email. Remember to add your real SMTP info to your .env file.', error);
        // We aren't failing the whole backend just because the fake SMTP isn't set up yet
    }
};

module.exports = sendEmail;
