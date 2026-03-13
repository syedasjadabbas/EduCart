const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

    if (!emailUser || !emailPass) {
        console.error('[EMAIL ERROR] Credentials missing in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    const mailOptions = {
        from: `"EduCart Store" <${emailUser}>`,
        to: options.email,
        subject: options.subject,
        text: options.text || '',
        html: options.html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[EMAIL SUCCESS] Sent to ${options.email}`);
        return info;
    } catch (error) {
        console.error(`[EMAIL FAILURE] ${error.message}`);
        throw error;
    }
};

module.exports = sendEmail;
