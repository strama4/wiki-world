const wikiQueries = require('../db/queries.wiki');
const Authorizer = require('../policies/wikis');
const markdown = require('markdown').markdown;

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
        
        let authorized;
        
        if (newWiki.private === 'true') {
            authorized = new Authorizer(req.user, newWiki).createPrivate()
        } else {
            authorized = new Authorizer(req.user, newWiki).create();
        }

        if (authorized) {
            wikiQueries.createWiki(newWiki, (err, wiki) => {
                if (err || wiki == null) {
                    res.redirect(500, '/wikis/new');
                }  else {
                    req.flash('notice', 'New Wiki created!');
                    res.redirect(302, `/wikis/${wiki.id}`);
                }
            });
        } else {
            if (newWiki.private === 'true') {
                req.flash('notice', 'You must be a premium member to create private wikis.');
            } else {
                req.flash('notice', 'You are not authorized to do that.');
            }
            res.redirect('/wikis');
        }
    },
    show(req, res, next) {
        wikiQueries.showWiki(req.params.id, (err, wiki) => {
            if (err || wiki == null) {
                res.redirect(404, '/wikis');
            } else {
                const wikiMarkedDown = markdown.toHTML(wiki.body);
                res.render('wikis/show', { wikiMarkedDown, wiki });
            }
        });
    },
    edit(req, res, next) {
        wikiQueries.getWiki(req.params.id, (err, wiki) => {
            const authorized = new Authorizer(req.user).edit();

            if (err || wiki === null) {
                res.redirect(404, '/wikis');
            } else {
                if (authorized) {
                    res.render('wikis/edit', { wiki });
                } else {
                    req.flash('notice', 'You are not authorized to do that.');
                    res.redirect(`/wikis/${req.params.id}`);
                }                
            }
        });
    },
    update(req, res, next) {
        let updatedWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.privateWiki 
        }

        if (updatedWiki.private && updatedWiki.private === 'true') {
            let authorized = new Authorizer(req.user).updateToPrivate();
            if (!authorized) {
                req.flash('error', 'You must be a Premium user to update to private wiki.')
                res.redirect(`/wikis/${req.params.id}/edit`);
            } else {
                wikiQueries.updateWiki(req, updatedWiki, (err, wiki) => {
                    if (err) {
                        res.redirect(`/wikis/${req.params.id}/edit`);
                    } else {
                        res.redirect(`/wikis/${req.params.id}`);
                    }
                }) 
            }
        } else {
            wikiQueries.updateWiki(req, updatedWiki, (err, wiki) => {
                if (err) {
                    res.redirect(`/wikis/${req.params.id}/edit`);
                } else {
                    res.redirect(`/wikis/${req.params.id}`);
                }
            }); 
        }

        
    },
    destroy(req, res, next) {
        wikiQueries.deleteWiki(req, (err, deleteCount) => {
            if (err) {
                res.redirect(500, `/wikis/${req.params.id}`);
            } else {
                req.flash('notice', 'Wiki has been deleted');
                res.redirect('/wikis');
            }
        });
    }
}