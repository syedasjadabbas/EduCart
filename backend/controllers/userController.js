const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, isStudentVerified } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

        const user = await User.create({
            name,
            email,
            password,
            isStudentVerified: isStudentVerified || false,
            isEmailVerified: false,
            emailVerificationToken: hashedToken,
            emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

        const verifyUrl = `http://localhost:5173/verify-email/${verificationToken}`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #2563eb; margin: 0;">EduCart</h1>
                    <p style="color: #64748b; margin-top: 4px;">Student Essentials Store</p>
                </div>
                <h2 style="color: #1e293b;">Verify Your Email Address</h2>
                <p style="color: #475569;">Hi ${name},</p>
                <p style="color: #475569;">Thank you for registering! Please click the button below to verify your email address and activate your account.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="${verifyUrl}" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Verify Email Address</a>
                </div>
                <p style="color: #64748b; font-size: 14px;">This link will expire in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 EduCart. All rights reserved.</p>
            </div>
        `;

        try {
        sendEmail({
            email: user.email,
            subject: 'EduCart — Verify Your Email Address',
            html: emailHtml,
        }).catch(err => console.error('Verification email failed:', err.message));
        } catch (emailErr) {
            console.error('Verification email failed to send:', emailErr.message);
        }

        // Do NOT return a token — user must verify email first
        res.status(201).json({
            message: 'Account created! Please check your email to verify your account before logging in.',
            requiresVerification: true,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Block login if email not verified
            if (!user.isEmailVerified) {
                return res.status(403).json({
                    message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
                    requiresVerification: true,
                });
            }
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isStudentVerified: user.isStudentVerified,
                profilePicture: user.profilePicture,
                studentVerificationStatus: user.studentVerificationStatus,
                studentIdCard: user.studentIdCard,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'There is no user with that email' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save({ validateBeforeSave: false });

        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
                <h2 style="color: #2563eb; text-align: center;">EduCart Password Reset</h2>
                <p>Hello ${user.name},</p>
                <p>We received a request to reset the password for your EduCart student account.</p>
                <p>Please click the button below to set a new password. This link is only valid for 10 minutes.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
                </div>
                <p>If you didn't request this, please ignore this email.</p>
                <p>Best,<br>The EduCart Team</p>
            </div>
        `;

            sendEmail({
                email: user.email,
                subject: 'EduCart Account Password Reset',
                html: emailHtml
            }).catch(err => {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpire = undefined;
                user.save({ validateBeforeSave: false });
                console.error('Password reset email failed:', err.message);
            });
            res.status(200).json({ message: 'Email sequence initiated. Please check your inbox shortly.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/users/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset completely successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify email address
// @route   GET /api/users/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        // First: look for a user with a valid (non-expired) token
        let user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() },
        });

        if (user) {
            // Valid token — activate the account
            user.isEmailVerified = true;
            user.emailVerificationToken = undefined;
            user.emailVerificationExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(200).json({ message: 'Email verified successfully! You can now log in.' });
        }

        // Second: check if token exists but is expired
        const expiredUser = await User.findOne({ emailVerificationToken: hashedToken });
        if (expiredUser) {
            return res.status(400).json({
                message: 'This verification link has expired. Please register again to get a new link.',
                expired: true,
            });
        }

        // Third: token not found at all — maybe already verified (link used before)
        // Return a friendly "already verified" response so user can just log in
        return res.status(200).json({
            message: 'Your email is already verified. You can log in now.',
            alreadyVerified: true,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile (name, password, profile picture)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
    try {
        // Verify token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.body.name) user.name = req.body.name;
        if (req.body.password) user.password = req.body.password;
        if (req.file) user.profilePicture = `/uploads/${req.file.filename}`;

        await user.save();

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            isStudentVerified: user.isStudentVerified,
            profilePicture: user.profilePicture,
            studentVerificationStatus: user.studentVerificationStatus,
            studentIdCard: user.studentIdCard,
            token, // return same token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload student ID card for verification
// @route   POST /api/users/student-id
// @access  Private
const uploadStudentId = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        user.studentIdCard = `/uploads/${req.file.filename}`;
        user.studentVerificationStatus = 'pending';
        await user.save();

        res.json({
            message: 'Student ID uploaded successfully. Waiting for admin approval.',
            studentVerificationStatus: user.studentVerificationStatus,
            studentIdCard: user.studentIdCard,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending student verifications
// @route   GET /api/users/pending-verifications
// @access  Private/Admin
const getPendingVerifications = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const pendingUsers = await User.find({ studentVerificationStatus: 'pending' }).select('-password');
        res.json(pendingUsers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Review and approve/reject student ID
// @route   PUT /api/users/review-verification/:id
// @access  Private/Admin
const reviewStudentVerification = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const adminUser = await User.findById(decoded.id);

        if (!adminUser || adminUser.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const { status } = req.body; // 'approved' or 'rejected'
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.studentVerificationStatus = status;
        if (status === 'approved') {
            user.isStudentVerified = true;
        } else if (status === 'rejected') {
            user.isStudentVerified = false;
        }

        await user.save();

        const emailHtml = status === 'approved'
            ? `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #2563eb; margin: 0;">EduCart</h1>
                    <p style="color: #64748b; margin-top: 4px;">Student Essentials Store</p>
                </div>
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; background-color: #d1fae5; padding: 16px; border-radius: 50%;">
                        <span style="font-size: 36px;">✅</span>
                    </div>
                </div>
                <h2 style="color: #059669; text-align: center;">Student Verification Approved!</h2>
                <p style="color: #475569;">Hi ${user.name},</p>
                <p style="color: #475569;">Great news! Your student ID has been verified by our team. You are now an official <strong>Verified Student</strong> on EduCart.</p>
                <div style="background: linear-gradient(135deg, #059669, #0d9488); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 24px 0;">
                    <h3 style="margin: 0 0 8px 0; font-size: 20px;">🎉 15% Discount Activated!</h3>
                    <p style="margin: 0; font-size: 14px; opacity: 0.9;">Your flat 15% student discount is now automatically applied on every purchase.</p>
                </div>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="http://localhost:5173/shop" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Start Shopping Now</a>
                </div>
                <p style="color: #64748b; font-size: 14px;">Thank you for being part of the EduCart student community. Enjoy your discounted experience!</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 EduCart. All rights reserved.</p>
            </div>
            `
            : `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <h1 style="color: #2563eb; margin: 0;">EduCart</h1>
                    <p style="color: #64748b; margin-top: 4px;">Student Essentials Store</p>
                </div>
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="display: inline-block; background-color: #fee2e2; padding: 16px; border-radius: 50%;">
                        <span style="font-size: 36px;">❌</span>
                    </div>
                </div>
                <h2 style="color: #dc2626; text-align: center;">Student Verification Rejected</h2>
                <p style="color: #475569;">Hi ${user.name},</p>
                <p style="color: #475569;">Unfortunately, we were unable to verify your student ID. This could be due to one of the following reasons:</p>
                <ul style="color: #475569; padding-left: 20px;">
                    <li>The uploaded image was unclear or blurry</li>
                    <li>The student ID card appeared to be invalid or expired</li>
                    <li>Required information on the card was not visible</li>
                </ul>
                <p style="color: #475569;">Don't worry — you can try again! Please upload a clearer photo of your valid student ID card.</p>
                <div style="text-align: center; margin: 32px 0;">
                    <a href="http://localhost:5173/verify" style="background-color: #2563eb; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Re-upload Student ID</a>
                </div>
                <p style="color: #64748b; font-size: 14px;">If you believe this was a mistake, please contact our support team for assistance.</p>
                <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
                <p style="color: #94a3b8; font-size: 12px; text-align: center;">© 2026 EduCart. All rights reserved.</p>
            </div>
            `;

        try {
            sendEmail({
                email: user.email,
                subject: status === 'approved' ? 'Student Verification Approved!' : 'Student Verification Rejected',
                html: emailHtml
            }).catch(err => console.error('Verification decision email failed:', err.message));
        } catch (err) { }

        res.json({ message: `User student verification marked as ${status}`, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users with order metrics
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const reqUser = await User.findById(decoded.id);

        if (!reqUser || reqUser.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        // Aggregate to get user data along with their order counts
        const Order = require('../models/Order');
        const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordExpire');
        const orders = await Order.find({ paymentStatus: { $ne: 'rejected' } });

        const usersWithMetrics = users.map(user => {
            const userOrders = orders.filter(o => o.user && o.user.toString() === user._id.toString());
            const totalSpent = userOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

            return {
                ...user.toObject(),
                orderCount: userOrders.length,
                totalSpent
            };
        });

        res.json(usersWithMetrics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// @desc    Export all users as CSV
// @route   GET /api/users/export-csv
// @access  Admin
const exportUsersCsv = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        const reqUser = await User.findById(decoded.id);
        if (!reqUser || reqUser.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized as admin' });
        }

        const users = await User.find({}).select('-password -resetPasswordToken -resetPasswordExpire').sort({ createdAt: -1 });

        const header = 'Name,Email,Role,Student Verified,Verification Status,Joined Date\n';
        const rows = users.map(u => {
            const name = (u.name || 'N/A').replace(/,/g, ' ');
            const email = (u.email || 'N/A').replace(/,/g, ' ');
            const date = new Date(u.createdAt).toLocaleDateString('en-GB');
            return `${name},${email},${u.role},${u.isStudentVerified ? 'Yes' : 'No'},${u.studentVerificationStatus || 'none'},${date}`;
        }).join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=educart_users.csv');
        res.send(header + rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    authUser,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updateProfile,
    uploadStudentId,
    getPendingVerifications,
    reviewStudentVerification,
    getAllUsers,
    exportUsersCsv,
};
