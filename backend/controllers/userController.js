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
        const normalizedEmail = email.trim().toLowerCase();
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

        const user = await User.create({
            name,
            email: normalizedEmail,
            password,
            isStudentVerified: isStudentVerified || false,
            isEmailVerified: false,
            emailVerificationToken: hashedToken,
            emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid user data' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const verifyUrl = `${frontendUrl}/verify-email/${verificationToken}`;

        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #3b82f6, #6366f1); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to EduCart! 🎓</h1>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <h2 style="color: #1e293b; margin-top: 0;">Verify Your Email Address</h2>
                    <p style="color: #475569; font-size: 16px;">Hi <strong>${name}</strong>,</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Thank you for registering! Please click the button below to verify your email address and activate your student account.</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${verifyUrl}" style="background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);">Verify Email Address</a>
                    </div>
                    <p style="color: #64748b; font-size: 14px; text-align: center;">This link will expire in <strong>24 hours</strong>. If you did not create an account, you can safely ignore this email.</p>
                    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                        <p style="font-size: 14px; color: #94a3b8; margin: 0;">Thanks for choosing EduCart Store!</p>
                    </div>
                </div>
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
        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (user && (await user.matchPassword(password))) {
            // Block login if email not verified (Allow admins to bypass for safety)
            if (!user.isEmailVerified && user.role !== 'admin') {
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

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Request 🔐</h1>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <p style="color: #475569; font-size: 16px;">Hello <strong>${user.name}</strong>,</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">We received a request to reset the password for your EduCart student account. Click the button below to set a new password.</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${resetUrl}" style="background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.2);">Reset Password</a>
                    </div>
                    <p style="color: #64748b; font-size: 14px; text-align: center;">This link is only valid for <strong>10 minutes</strong>. If you didn't request this, please ignore this email.</p>
                    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                        <p style="font-size: 14px; color: #94a3b8; margin: 0;">Thanks for choosing EduCart Store!</p>
                    </div>
                </div>
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
        if (req.file) user.profilePicture = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;

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

        user.studentIdCard = req.file.path.startsWith('http') ? req.file.path : `/uploads/${req.file.filename}`;
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
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d1fae5; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #10b981, #059669); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Verification Approved! ✅</h1>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <p style="color: #475569; font-size: 16px;">Hi <strong>${user.name}</strong>,</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Great news! Your student ID has been verified. You are now an official <strong>Verified Student</strong> on EduCart.</p>
                    
                    <div style="background: linear-gradient(135deg, #ecfdf5, #d1fae5); color: #065f46; padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px solid #a7f3d0;">
                        <h3 style="margin: 0 0 8px 0; font-size: 20px;">🎉 15% Discount Activated!</h3>
                        <p style="margin: 0; font-size: 14px; opacity: 0.9;">Your student discount is now automatically applied to every purchase.</p>
                    </div>

                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.2);">Start Shopping Now</a>
                    </div>
                    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                        <p style="font-size: 14px; color: #94a3b8; margin: 0;">Thanks for joining our student community!</p>
                    </div>
                </div>
            </div>
            `
            : `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Verification Update ❌</h1>
                </div>
                <div style="padding: 32px; background-color: white;">
                    <p style="color: #475569; font-size: 16px;">Hi <strong>${user.name}</strong>,</p>
                    <p style="color: #475569; font-size: 16px; line-height: 1.6;">Unfortunately, we were unable to verify your student ID. Common reasons include blurry images or expired cards.</p>
                    
                    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin: 24px 0; border-left: 4px solid #ef4444;">
                        <p style="margin: 0; font-size: 15px; color: #991b1b;">Please ensure your photo is clear and clearly shows your name and expiry date.</p>
                    </div>

                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify" style="background: linear-gradient(135deg, #ef4444, #dc2626); color: white; padding: 14px 32px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);">Re-upload Student ID</a>
                    </div>
                    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
                        <p style="font-size: 14px; color: #94a3b8; margin: 0;">Need help? Reply to this email.</p>
                    </div>
                </div>
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
