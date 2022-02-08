const express = require('express');
const passport = require('passport');
const catchAsync = require('../utils/catch-async');
const users = require('../controllers/users');

const router = express.Router();

/* ==========================================================================
   User Routes
   ========================================================================== */

router.route('/register')
  .get(users.renderRester)
  .post(catchAsync(users.register))

router.route('/login')
  .get(users.renderLogin)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout);

module.exports = router;