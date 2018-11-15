const userQueries = require('../db/queries.user');

module.exports = {
    signUp(req, res, next) {
        res.render('users/sign_up');
    },
    create(req, res, next) {
        const newUser = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            confirmPassword: req.body.password_conf
        }
        userQueries.createUser(newUser, (err, user) => {
            if (err) {
                req.flash('error', err);
                res.redirect('/users/sign_up');
            } else {
                const sgMail = require('@sendgrid/mail');
                sgMail.setApiKey(process.env.SENDGRID_API);
                const msg = {
                    to: newUser.email,
                    from: 'admin@blocipedia.com',
                    subject: 'Welcome to Blocipedia!',
                    text: 'Start sharing today...'
                };
                sgMail.send(msg);

                req.flash('notice', 'You have signed in!');
                res.redirect('/');
            }
        });
    }
}