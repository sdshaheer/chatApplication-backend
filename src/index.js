const mongoose = require('mongoose');
const admin = require('firebase-admin');
const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');


// initialize firebase admin
admin.initializeApp({ credential: admin.credential.cert(config?.firebaseServiceAccount) });
logger.info('Firebase Admin Initialized!!');

// connect to MongoDB
mongoose
    .connect(config?.mongoose?.url)
    .then(() => {
        logger.info(`Connected to MongoDB DataBase`);
    })
    .catch((err) => {
        logger.info('Error connecting to MongoDB:', err);
    });


const server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
