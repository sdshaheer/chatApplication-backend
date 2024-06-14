const admin = require('firebase-admin');
const httpStatus = require('http-status');
const logger = require('../config/logger');

// Middleware function to check Firebase ID token validation
async function firebaseAuthMiddleware(req, res, next) {
    try {
        const idToken = req.headers.authorization || req.query.idToken;
        if (!idToken) {
            return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Unauthorized Access' });
        }

        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;

        next();
    } catch (error) {
        logger.error('Error verifying ID token:', error);
        return res.status(httpStatus.UNAUTHORIZED).json({ error: 'Unauthorized Access' });
    }
}

module.exports = firebaseAuthMiddleware;
