const express = require('express');
const router = express.Router();
const { registerUser, authUser, forgotPassword, resetPassword, verifyEmail, updateProfile, uploadStudentId, getPendingVerifications, reviewStudentVerification, getAllUsers, exportUsersCsv } = require('../controllers/userController');
const upload = require('../middleware/upload');

router.route('/')
    .post(registerUser)
    .get(getAllUsers);
router.post('/login', authUser);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);
router.get('/export-csv', exportUsersCsv);
router.put('/profile', upload.single('profilePicture'), updateProfile);

router.post('/student-id', upload.single('studentIdCard'), uploadStudentId);
router.get('/pending-verifications', getPendingVerifications);
router.put('/review-verification/:id', reviewStudentVerification);

module.exports = router;
