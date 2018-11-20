const ApplicationPolicy = require('./application');

module.exports = class WikiPolicy extends ApplicationPolicy {     
    createPrivate() {
        return this._isPremium() || this._isAdmin();
    }
    
    showPrivate() {
        return this._isPremium() && this._isOwner();
    }

    destroy() {
        return this._isOwner() || this._isAdmin();
    }

    edit() {
        return this.new();
    }
}