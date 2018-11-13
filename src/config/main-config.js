require('dotenv').config();
const path = require('path');
const logger = require('morgan');

module.exports = {
    init(app) {
        app.set('views', path.join(__dirname, '..', 'views'));
        app.set('view engine', 'ejs');
        app.use(logger('dev'));
    }
}