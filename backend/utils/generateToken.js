const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('FATAL: JWT_SECRET environment variable is missing.');
    }
    return jwt.sign({ id }, secret, {
        expiresIn: '30d',
    });
};

module.exports = generateToken;
