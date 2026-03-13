const express = require('express');
const router = express.Router();
const Newsletter = require('../models/Newsletter');
const sendEmail = require('../utils/sendEmail');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
router.post('/', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const existing = await Newsletter.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ message: 'You are already subscribed!' });
        }

        await Newsletter.create({ email: email.toLowerCase() });

        // Send welcome email
        try {
            await sendEmail({
                email,
                subject: 'Welcome to EduCart Newsletter! 🎉',
                html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                    <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 32px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 24px;">You're In! 📬</h1>
                    </div>
                    <div style="padding: 32px; background-color: white;">
                        <h2 style="color: #2563eb; margin-top: 0;">Welcome to Our Newsletter</h2>
                        <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for subscribing to the <strong>EduCart Newsletter</strong>! You'll be the first to know about new student essentials, exclusive deals, and upcoming promos.</p>
                        
                        <div style="background: linear-gradient(135deg, #eff6ff, #dbeafe); color: #1e40af; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px solid #bfdbfe;">
                            <h3 style="margin: 0 0 8px 0; font-size: 18px;">🛍️ What's Coming?</h3>
                            <p style="margin: 0; font-size: 14px; opacity: 0.9;">New product alerts • Student-only discounts • Early access</p>
                        </div>

                        <div style="text-align: center; margin: 32px 0;">
                            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);">Browse Products</a>
                        </div>
                        <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                            <p style="color: #94a3b8; font-size: 14px; margin: 0;">© 2026 EduCart Store. All rights reserved.</p>
                        </div>
                    </div>
                </div>
                `
            });
        } catch (emailErr) {
            console.error('Newsletter welcome email failed:', emailErr.message);
        }

        res.status(201).json({ message: 'Successfully subscribed! Check your email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
