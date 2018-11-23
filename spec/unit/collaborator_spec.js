const sequelize = require('../../src/db/models/index').sequelize;
const Wiki = require('../../src/db/models').Wiki;
const User = require('../../src/db/models').User;
const Collaborator = require('../../src/db/models').Collaborator;

describe('Collaborator', () => {
    beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({ force: true }).then(() => {
            User.create({
                name: 'Johnny',
                email: 'johnnyboy@gmail.com',
                password: '123456789',
                confirmPassword: '123456789'
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: 'Javascript for Beginners',
                    body: 'The language that powers most of the internet (it works on the backend too!)',
                    private: true,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe('#create()', () => {
        it('should create a collaborator item with the passed in values', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collaborator) => {
                expect(collaborator).not.toBeNull();
                expect(collaborator.userId).toBe(this.user.id);
                expect(collaborator.wikiId).toBe(this.wiki.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it('should not create a collaborator object without both a userId and wikiId', (done) => {
            Collaborator.create({
                userId: this.user.id
            })
            .then((collaborator) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('Collaborator.wikiId cannot be null');
                done();
            });
        });
    });

    describe('#getUser()', () => {
        it('should return the user associated with the collaborator object', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collaborator) => {
                collaborator.getUser()
                .then((user) => {
                    expect(user.name).toBe('Johnny');
                    expect(user.email).toBe('johnnyboy@gmail.com');
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe('setUser()', () => {
        it('should set the user associated with the collaborator object', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collaborator) => {
                this.collaborator = collaborator;
                User.create({
                    name: 'Bob',
                    email: 'bobby@gmail.com',
                    password: 'password',
                    confirmPassword: 'password'
                })
                .then((newUser) => {
                    expect(this.collaborator.userId).toBe(this.user.id);
                    this.collaborator.setUser(newUser)
                    .then((updatedCollaborator) => {
                        expect(this.collaborator.userId).toBe(newUser.id);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    });

    describe('#getWiki()', () => {
        it('should return the wiki associated with the collaborator object', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collaborator) => {
                collaborator.getWiki()
                .then((wiki) => {
                    expect(wiki.title).toBe('Javascript for Beginners');
                    expect(wiki.body).toBe('The language that powers most of the internet (it works on the backend too!)');
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    describe('setWiki()', () => {
        it('should set the wiki associated with the collaborator object', (done) => {
            Collaborator.create({
                userId: this.user.id,
                wikiId: this.wiki.id
            })
            .then((collaborator) => {
                this.collaborator = collaborator;
                Wiki.create({
                    title: 'Ruby on Rails',
                    body: 'The other framework taught at Bloc',
                    private: true,
                    userId: this.user.id
                })
                .then((newWiki) => {
                    expect(this.collaborator.wikiId).toBe(this.wiki.id);
                    this.collaborator.setWiki(newWiki)
                    .then((updatedCollaborator) => {
                        expect(this.collaborator.wikiId).toBe(newWiki.id);
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            });
        });
    });
});