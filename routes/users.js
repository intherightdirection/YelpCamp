const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catch-async');
const users = require('../controllers/users');

const router = express.Router();

router.get('/register', users.renderRester);

router.post('/register', catchAsync(users.register));

router.get('/login', users.renderLogin);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login);

router.get('/logout', users.logout);

module.exports = router;