const collaboratorQueries = require('../db/queries.collaborator');

module.exports = {
    create(req, res, next) {
        collaboratorQueries.createCollaborator(req, (err, collaborator) => {
            if (err) {
                req.flash('error', err);
                res.redirect(`/wikis/${req.params.id}/edit`);
            } else {
                req.flash('notice', 'Collaborator added!');
                res.redirect(`/wikis/${req.params.id}/edit`);
            }
        })
    },
    delete(req, res, next) {
        collaboratorQueries.deleteCollaborator(req.params.id, (err, deleted) => {
            if (err) {
                req.flash('error', err);
                res.redirect(`/wikis/${req.params.wikiId}`);
            } else {
                req.flash('notice', 'Collaborator deleted!');
                res.redirect(`/wikis/${req.params.wikiId}/edit`)
            }
        })
    }
}