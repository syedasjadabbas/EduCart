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
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h1 style="color: #2563eb; margin: 0;">EduCart</h1>
                        <p style="color: #64748b; margin-top: 4px;">Student Essentials Store</p>
                    </div>
                    <div style="text-align: center; margin-bottom: 24px;">
                        <div style="display: inline-block; background-color: #dbeafe; padding: 16px; border-radius: 50%;">
                            <span style="font-size: 36px;">📬</span>
                        </div>
                    </div>
                    <h2 style="color: #2563eb; text-align: center;">Welcome to Our Newsletter!</h2>
                    <p style="color: #475569;">Hi there,</p>
                    <p style="color: #475569;">Thank you for subscribing to the <strong>EduCart Newsletter</strong>! You'll be the first to know when we add new products, run exclusive deals, and launch special student promotions.</p>
                    <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
                        <h3 style="margin: 0 0 8px 0; font-size: 20px;">🛍️ What to Expect</h3>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">New product alerts • Exclusive student discounts • Early access to sales</p>
                    </div>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Browse Products</a>
                    </div>
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                    <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 EduCart. All rights reserved.</p>
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
