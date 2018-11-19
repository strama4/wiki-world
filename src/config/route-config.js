module.exports = {
    init(app) {
        const staticRoutes = require('../routes/static.js');
        const userRoutes = require('../routes/users.js');
        const wikiRoutes = require('../routes/wikis.js');

        if (process.env.NODE_ENV === "test") {
            const mockAuth = require('../../spec/support/mock-auth.js');
            mockAuth.fakeIt(app);
        }
        app.use(staticRoutes);
        app.use(userRoutes);
        app.use(wikiRoutes);
    }
}