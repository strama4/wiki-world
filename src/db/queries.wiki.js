const Wiki = require('./models').Wiki;

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
        return Wiki.findByPk(id)
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
    deleteWiki(id, callback) {
        Wiki.findByPk(id)
        .then((wiki) => {
            wiki.destroy();
        })
        .then(() => {
            callback(null, null);
        })
        .catch((err) => {
            callback(err);
        });
    }
}