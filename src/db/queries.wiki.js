const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Collaborator = require('./models').Collaborator;

const Authorizer = require('../policies/wikis');

module.exports = {
    getWikis(callback) {
        return Wiki.findAll({ 
            include: [
                {model: User },
                    {model: Collaborator, as: 'collaborators'}
            ]
        })
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        });
    },
    getWiki(id, callback) {
        return Wiki.findByPk(id, {
            include: [
                {model: Collaborator, as: 'collaborators',
                    include: [{ model: User }]},
            ]
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        });
    },
    createWiki(newWiki, callback) {
        return Wiki.create({
            title: newWiki.title,
            body: newWiki.body,
            private: newWiki.private,
            userId: newWiki.userId
        })
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        });
    },
    showWiki(id, callback) {
        return Wiki.findByPk(id,{
            include: [{model: User}]
        }
            )
        .then((wiki) => {
            callback(null, wiki);
        })
        .catch((err) => {
            callback(err);
        });
    },
    updateWiki(req, updatedWiki, callback) {
        Wiki.findByPk(req.params.id)
        .then((wiki) => {
            if (!wiki) {
                return callback('No wiki found');
            }

            const authorized = new Authorizer(req.user).update();
            
            if (authorized) {
                 wiki.update({
                    title: updatedWiki.title,
                    body: updatedWiki.body,
                    private: updatedWiki.private || wiki.private
                })
                .then((upToDateWiki) => {
                    callback(null, upToDateWiki);
                })
                .catch((err) => {
                    callback(err);
                });
            } else {
                req.flash('notice', 'You are not authorized to do that.');
                callback('Forbidden');
            }
           
        });
    },
    deleteWiki(req, callback) {
        return Wiki.findByPk(req.params.id)
        .then((wiki) => {
            const authorized = new Authorizer(req.user, wiki).destroy();
            if (authorized) {
                wiki.destroy()
                .then((deleteCount) => {
                    callback(null, deleteCount);
                });
            } else {
                req.flash('notice', 'You are not authorized to do that');
                callback(401);
            }
        })
        .catch((err) => {
            callback(err);
        });
    },
    makeWikisPublic(id, callback) {
        return Wiki.update({
            private: false
        }, {
            where: { userId: id }
        })
        .then((affectedRows) => {
            callback(null, affectedRows);
        })
        .catch((err) => {
            callback(err);
        })
        
    }
}