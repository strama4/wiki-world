module.exports = {
    fakeIt(app) {
        let role, id, email;
        
        function middleware(req, res, next) {
            id = req.body.userId || id;
            role = req.body.role || role;
            email = req.body.email || email;

        
            if (id && id !=0) {
                req.user = {
                    'id': id,
                    'role': role,
                    'email': email
                }
            } else if (id === 0) {
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