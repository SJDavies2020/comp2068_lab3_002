const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// get the home page
router.get('/login', function (req, res, next) {
    res.render('auth/login.pug', { title: 'Login' });
});

//get the registration page
router.get('/register', function (req, res, next) {
    res.render('auth/register.pug', { title: 'Register' });
});

// login post function
router.post(
    '/login',
    passport.authenticate('local', {
        failureFlash: 'There was an issue with your username or password',
        failureRedirect: '/login',
        successRedirect: '/'
    })
);

router.post('/register', (req, res, next) => {
    // Create the account using passport-local-mongoose
    User.register(
        new User({ username: req.body.username }),
        req.body.password,
        function (err, account) {
            if (err) {
                // On error, render the register page
                console.log(err);
                return res.render('auth/register.pug', { account: account });
            }

            // Login if successful
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        }
    );
});

module.exports = router;
