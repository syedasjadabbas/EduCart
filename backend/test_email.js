require('dotenv').config();
const sendEmail = require('./utils/sendEmail');

const test = async () => {
    console.log('Testing email send with:');
    console.log('USER:', process.env.EMAIL_USER);
    console.log('PASS (sanitized):', process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : 'MISSING');

    try {
        await sendEmail({
            email: 'asjadabbaszaidi@gmail.com',
            subject: 'Local Test Connection',
            html: '<h1>Connection Test</h1><p>If you see this, local sending works.</p>'
        });
        console.log('Test successful');
    } catch (err) {
        console.error('Test failed:', err);
    }
};

test();
