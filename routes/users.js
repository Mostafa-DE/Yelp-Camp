const express = require('express');
const router = express.Router();
const handleAsync = require('../helpers/handleAsync');
const User = require('../models/user');
const methodOverride = require('method-override');
const { UserSchema } = require('../Schema_Joi');
const passport = require('passport');
const users = require('../controllers/user');

router.route('/register')
    .get(users.renderSignupForm)
    .post(handleAsync(users.SignUp));

router.route('/login')
    .get(users.renderSigninForm)
    .post(passport.authenticate('local' , {failureFlash: true , failureRedirect: '/login'}) , users.login);

router.get('/logout' , users.logout);




module.exports = router;