module.exports = {
    init(app) {
        const staticRoutes = require('../routes/static.js');

        app.use(staticRoutes);
    }
}