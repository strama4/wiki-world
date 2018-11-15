module.exports = {
    init(app) {
        const staticRoutes = require('../routes/static.js');
        const userRoutes = require('../routes/users.js');

        app.use(staticRoutes);
        app.use(userRoutes);
    }
}