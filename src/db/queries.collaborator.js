const User = require('../db/models').User;
const Collaborator = require('../db/models').Collaborator;
const Wiki = require('../db/models').Wiki;
const Authorizer = require('../policies/collaborators');

module.exports = {
    createCollaborator(req, callback) {
        return User.findOne({
            where: {
                email: req.body.collaborator
            }
        })
        .then((user) => {
            if (!user) {
                callback('There was no user found that matches that email address.');
            } else {
                Wiki.findByPk(req.params.id)
                .then((wiki) => {
                        console.log('Req.user', req.user);
                        const authorized = new Authorizer(req.user, wiki).addCollaborator();
                        if (authorized) {
                           Collaborator.findOne({ where: {
                                userId: user.id,
                                wikiId: req.params.id
                            }})
                            .then((collaboratorObj) => {
                                if (!collaboratorObj) {
                                    Collaborator.create({ 
                                        userId: user.id,
                                        wikiId: req.params.id 
                                    })
                                    .then((collaboratorObj) => {
                                        callback(null, collaboratorObj);
                                    })
                                    .catch((err) => {
                                        callback(err);
                                    });
                                } else {
                                    callback('This user is already added as a collaborator for this wiki.')
                                } 
                            })
                            .catch((err) => {
                                callback(err);
                            })
                        } else {
                            callback('Only the owner can add collaborators to this wiki.');
                        }    
                })
                .catch((err) => {
                    console.log(err);
                })
            }
                        
        })            
    },
    deleteCollaborator(id, callback) {
        return Collaborator.findByPk(id)
        .then((collaborator) => {
            collaborator.destroy()
            .then((deleted) => {
                callback(null, deleted);
            })
            .catch((err) => {
                callback(err);
            });
        })
        .catch((err) => {
            callback(err);
        });
    }
}