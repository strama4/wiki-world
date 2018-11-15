require('dotenv').config();
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const validator = require('express-validator');
const session = require('express-session');

module.exports = {
    init(app, express) {
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set('view engine', 'ejs');
        app.use(logger('dev'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(session({
            resave: false,
            saveUninitialized: false,
            secret: 'secret', 
            cookie: { maxAge: 60000 }}));
        
        app.use(validator());
        app.use(flash());
    }
}