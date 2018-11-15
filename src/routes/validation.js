const User = require('../db/models').User;
const _ = require('lodash');

module.exports = {
    validateUsers(req, res, next) {
        if (req.method === 'POST') {
            
            req.check('name').isLength({min: 2}).withMessage('must be at least 2 characters in length');
            req.checkBody('email', 'must be valid email').isEmail();
            req.checkBody('password', 'must be at least 6 characters in length').isLength({min: 6});
            req.checkBody('password_confirmation', 'must match password').matches(req.body.password);
        }

        const errors = req.validationErrors();
        if (errors) {
            req.flash('error', errors);
            return res.redirect(303, req.headers.referer);
        } else {
            return next();
        }
    }
}