const express = require('express');
const userAuthRoute = require('./userAuth.route')
const userRoute = require('./user.route')
const chatRoute = require('./chat.route')
const messageRoute = require('./message.route')

const firebaseAuthMiddleware = require('../middlewares/firebaseAuth')
const mongoAuthMiddleware = require('../middlewares/mongoAuth')

const router = express.Router();

const defaultRoutes = [

    {
        path: '/userAuth',
        route: userAuthRoute,
    },
    {
        path: '/user',
        route: userRoute,
        middlewares: [firebaseAuthMiddleware, mongoAuthMiddleware]
    },
    {
        path: '/chat',
        route: chatRoute,
        middlewares: [firebaseAuthMiddleware, mongoAuthMiddleware]
    },
    {
        path: '/message',
        route: messageRoute,
        middlewares: [firebaseAuthMiddleware, mongoAuthMiddleware]
    },

];


defaultRoutes.forEach((route) => {
    router.use(route.path, ...(route.middlewares || []), route.route);
});

module.exports = router;
