const wikiQueries = require('../db/queries.wiki');

module.exports = {
    new(req, res, next) {
        res.render('wikis/new');
    },
    index(req, res, next) {
        wikiQueries.getWikis((err, wikis) => {
            if (err) {
                res.redirect(500, '/');
            } else {
                res.render('wikis/index', { wikis });
            }
        });
    },
    create(req, res, next) {
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.privateWiki,
            userId: req.user.id
        }
        wikiQueries.createWiki(newWiki, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(500, '/wikis/new');
            } else {
                req.flash('notice', 'New Wiki created!');
                res.redirect(302, `/wikis/${wiki.id}`);
            }
        });
    },
    show(req, res, next) {
        wikiQueries.showWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, '/wikis');
            } else {
                res.render('wikis/show', { wiki });
            }
        });
    },
    edit(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            if (err || wiki === null) {
                res.redirect(404, '/wikis');
            } else {
                res.render('wikis/edit', { wiki });
            }
        });
    },
    update(req, res, next) {
        let updatedWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.privateWiki
        }
        wikiQueries.updateWiki(req.params.id, updatedWiki, (err, wiki) => {
            if (err) {
                res.redirect(`/wikis/${req.params.id}/edit`);
            } else {
                res.redirect(`/wikis/${req.params.id}`);
            }
        })
    },
    destroy(req, res, next) {
        wikiQueries.deleteWiki(req.params.id, (err, deleteCount) => {
            if (err) {
                res.redirect(`/wikis/${req.params.id}`);
            } else {
                req.flash('notice', 'Wiki has been deleted');
                res.redirect('/wikis');
            }
        });
    }
}