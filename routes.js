const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contactController = require('./src/controllers/contactController');

const {loginRequired} = require('./src/middlewares/middleware')

// Rotas da home
route.get('/', homeController.index);

// Rotas de login
route.get('/login', loginController.index);
route.post('/login/register', loginController.register);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

// Rotas de contato
route.get('/contact', loginRequired,contactController.index);
route.post('/contact/register', loginRequired,contactController.register);

module.exports = route;
