const userQueries = require('../db/queries.user');
const wikiQueries = require('../db/queries.wiki');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');
const stripeKey = process.env.STRIPE_PRIVATE_KEY;
const stripe = require("stripe")(stripeKey);

module.exports = {
    signUp(req, res, next) {
        res.render('users/sign_up');
    },
    create(req, res, next) {
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.password_confirmation
        }
        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/users/sign_up');
            } else {
                passport.authenticate('local')(req, res, () => {
                    sgMail.setApiKey(process.env.SENDGRID_API);
                    const msg = {
                        to: newUser.email,
                        from: 'admin@blocipedia.com',
                        subject: 'Welcome to Blocipedia!',
                        text: 'Start sharing today...'
                    };
                    sgMail.send(msg);

                    req.flash('notice', 'You have created a new account and are now signed in!');
                    res.redirect('/');
                }); 
                
            } 
        });
    },
    signInForm(req, res, next) {
        res.render('users/sign_in');
    },
    signIn(req, res, next) {  
            /* look at the 2nd parameter to the below call */
        passport.authenticate('local', function(err, user, info) {
            if (err) { 
                return next(err); 
            }
            if (!user) { 
                req.flash('notice', 'Login failed. Please try again');
                return res.redirect('/users/sign_in'); 
            }
            req.logIn(user, function(err) {
                if (err) { 
                    return next(err); 
                }
                req.flash('notice', 'You\'ve successfully signed in!');
                return res.redirect('/');
            });
        })(req, res, next); // <-- why?
        
        // (req, res, () => {
        //     if (!req.user) {
        //         console.log('I was here');
        //         req.flash('notice', 'Sign in failed. Please try again.');
        //         return res.redirect('/users/sign_in');
        //     } else {
        //         req.flash('notice', 'You\'ve successfully signed in!');
        //         return res.redirect('/');
        //     }
        // });
    },
    signOut(req, res, next) {
        req.logout();
        req.flash('notice', 'You\'ve successfully logged out');
        res.redirect('/');
    },
    showPremium(req, res, next) {
        userQueries.getUser(req.params.id, (err, user) => {
            if (err || user == null) {
                req.flash('error', err);
                res.redirect(404, '/');
            } else {
                res.render('users/premium', {user});
            }
        })
    },
    upgradeToPremium(req, res, next) {
        const token = req.body.stripeToken;

        userQueries.getUser(req.params.id, (err, user) => {
            if (!user) {
                req.flash('error', 'No user exists');
                res.redirect('/');
            } else {
                stripe.charges.create({
                    amount: 1500,
                    currency: 'usd',
                    source: token
                })
                .then((charge) => {
                    userQueries.toggleUser(user.id, (err, user) => {
                        if (err) {
                            req.flash('error', err);
                        } else {
                            req.flash('notice', 'Congratulations. You are now a premium user!');
                        }
                        res.redirect('/');
                    })
                })
                .catch((err) => {
                    req.flash('error', err);
                    res.redirect('/');
                })
            }     
        });              
    },
    showDowngrade(req, res, next) {
        userQueries.getUser(req.params.id, (err, user) => {
            if (err || user == null) {
                req.flash('error', err);
                res.redirect('/');
            } else {
                res.render('users/downgrade', { user });
            }
        })
    },
    downgrade(req, res, next) {
        wikiQueries.makeWikisPublic(req.params.id, (err, affectedRows) => {
            userQueries.toggleUser(req.params.id, (err, user) => {
                if (err || user == null) {
                    req.flash('error', err);
                    res.redirect('/');
                } else {
                    req.flash('notice', 'Your account has been successfully changed to Standard');
                    res.redirect('/');
                }
            });
        });
    }
}
