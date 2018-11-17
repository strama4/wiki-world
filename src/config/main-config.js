require('dotenv').config();
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const validator = require('express-validator');
const session = require('express-session');
const passportConfig = require('./passport-config');

module.exports = {
    init(app, express) {
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set('view engine', 'ejs');
        app.use(logger('dev'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(validator());
        app.use(session({
            resave: false,
            saveUninitialized: false,
            secret: 'secret', 
            cookie: { maxAge: 1.21e+9 }
        }));
        app.use(flash());
        passportConfig.init(app);

        app.use((req, res, next) => {
            res.locals.currentUser = req.user;
            next();
        })
    }
}