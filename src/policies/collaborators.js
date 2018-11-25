const ApplicationPolicy = require('./application');

module.exports = class CollaboratorPolicy extends ApplicationPolicy {
    addCollaborator() {
        return this._isOwner();
    }

    removeCollaborator() {
        return this.addCollaborator();
    }
}