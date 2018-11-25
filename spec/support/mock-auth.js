module.exports = {
    fakeIt(app) {
        let role, id, email, username;
        
        function middleware(req, res, next) {
            id = req.body.userId || id;
            role = req.body.role || role;
            email = req.body.email || email;
            username = req.body.username || username;

        
            if (id && id != -1) {
                req.user = {
                    'id': id,
                    'role': role,
                    'email': email,
                    'name': username
                }
            } else if (id === -1) {
                delete req.user;
            } 

            if (next) { next () }
        }
        function route(req, res) {
            res.redirect('/');
        }

        app.use(middleware);
        app.get('/auth/fake', route);
        
    }
}