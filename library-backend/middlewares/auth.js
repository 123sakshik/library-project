const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(403).json({ message: 'Invalid token' });
    }
};


const authorizeRole = (role) => (req, res, next) => {
    if (req.user.role !== role) {
        return res.status
        (403).json({ message: 'Access forbidden: insufficient rights' });
    }
    next();
};

module.exports = { authenticateToken, authorizeRole };
