const userQueries = require('../db/queries.user');
const passport = require('passport');
const sgMail = require('@sendgrid/mail');

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
    }
}
