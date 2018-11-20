const Wiki = require('./models').Wiki;
const User = require('./models').User;
const Authorizer = require('../policies/wikis');

module.exports = {
    getWikis(callback) {
        return Wiki.findAll()
        .then((wikis) => {
            callback(null, wikis);
        })
        .catch((err) => {
            callback(err);
        });
    },
    getWiki(id, callback) {
        return Wiki.findByPk(id)
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
    updateWiki(id, updatedWiki, callback) {
        Wiki.findByPk(id)
        .then((wiki) => {
            wiki.update({
                title: updatedWiki.title,
                body: updatedWiki.body,
                private: updatedWiki.private
            })
            .then((upToDateWiki) => {
                callback(null, upToDateWiki);
            })
            .catch((err) => {
                callback(err);
            });
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
                console.log('at least it gets here');
                req.flash('notice', 'You are not authorized to do that');
                callback(401);
            }
        })
        .catch((err) => {
            console.log(err);
            callback(err);
        });
    }
}