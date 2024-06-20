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

const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:5173'
    }
})

io.on('connection', (socket) => {
    console.log('connected to socket.io')

    socket.on('setup', (user) => {
        socket.join(user.uid)
        socket.emit('connected')
    })

    socket.on('joinChat', (room) => {
        socket.join(room)
        console.log('user joined room ', room)
    })

    socket.on('newMessage', (newMessageRecieved) => {
        let chat = newMessageRecieved?.chat

        if (!chat?.users) return console.log('no users in chat')
        // socket.in(chat?._id).emit('messageRecieved', newMessageRecieved)


        chat?.users.forEach((user) => {
            if (user?._id === newMessageRecieved?.sender?._id) return

            console.log('new message sending', user?._id, newMessageRecieved?.sender?._id, user?._id === newMessageRecieved?.sender?._id)
            socket.in(user?.uuid).emit('messageRecieved', newMessageRecieved)
        })
    })

})

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
