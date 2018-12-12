const sequelize = require('../../src/db/models/index').sequelize;
const request = require('request');
const server = require('../../server');
const base = 'http://localhost:3000/wikis/';

const User = require('../../src/db/models').User;
const Wiki = require('../../src/db/models').Wiki;
const Collaborator = require('../../src/db/models').Collaborator;


describe('routes : collaborator', () => {
    beforeEach((done) => {
        this.user;
        this.wiki;
        this.otherUser;
        sequelize.sync({ force: true }).then(() => {
            User.create({
                name: 'Johnny',
                email: 'johnnyboy@gmail.com',
                password: 'hedachamp',
                confirmPassword: 'hedachamp'
            })
            .then((user) => {
                this.user = user;

                User.create({
                    name: 'Billy',
                    email: 'billyboy@gmail.com',
                    password: 'password',
                    confirmPassword: 'password'
                })
                .then((otherUser) => {
                    this.otherUser = otherUser;

                    Wiki.create({
                        title: 'Javascript for Beginners',
                        body: 'A functional programming language used to power most of the web',
                        private: true,
                        userId: this.user.id
                    })
                    .then((wiki) => {
                        this.wiki = wiki;

                        request.get({
                            url: 'http://localhost:3000/auth/fake',
                            form: {
                                userId: this.user.id,
                                email: this.user.email,
                                role: 1,
                                username: this.user.name
                            },
                        }, (err, res, body) => {
                            done();
                        });
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    })
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    // owner context
    describe('POST /wikis/:id/collaborators/add', () => {
        it('should add the collaborator', (done) => {
            const options = {
                url: `${base}${this.wiki.id}/collaborators/add`,
                form: {
                    collaborator: 'billyboy@gmail.com'
                },
                followRedirect: false
            };
            request.post(options, (err, res, body) => {
                Collaborator.findOne({
                    where: { 
                        wikiId: this.wiki.id,
                        userId: this.otherUser.id
                    }
                })
                .then((collaboratorObj) => {
                    expect(collaboratorObj).not.toBeNull();
                    expect(collaboratorObj.wikiId).toBe(this.wiki.id);
                    expect(collaboratorObj.userId).toBe(this.otherUser.id);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

        it('shouldn\'t add the same collaborator twice to the existing wiki', (done) => {
            const options = {
                url: `${base}${this.wiki.id}/collaborators/add`,
                form: {
                    collaborator: 'billyboy@gmail.com'
                }
            }
            request.post(options, (err, res, body) => {
                Collaborator.findAll({
                    where: { 
                        wikiId: this.wiki.id
                    }
                })
                .then((collaboratorObjs) => {
                    let collabLength = collaboratorObjs.length
                    expect(collabLength).toBe(1);
                    request.post(options, (err, res, body) => {
                        Collaborator.findAll({
                            where: { 
                                wikiId: this.wiki.id
                            }
                        })
                        .then((collaboratorObjsAfterAddition) => {
                            expect(collaboratorObjsAfterAddition.length).toBe(collabLength);
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

    describe('POST /wikis/:wikiId/collaborators/:id/remove', () => {
        it('should delete the collaborator object associated with that wiki/user', (done) => {
            Collaborator.create({
                userId: this.otherUser.id,
                wikiId: this.wiki.id 
            })
            .then((collaboratorObj) => {
                this.collaboratorObj = collaboratorObj;
                expect(collaboratorObj.userId).toBe(this.otherUser.id);
                const options = {
                    url: `${base}${this.wiki.id}/collaborators/${this.collaboratorObj.id}/remove`
                }
                request.post(options, (err, res, body) => {
                    Collaborator.findOne({ where: {
                        userId: this.otherUser.id,
                        wikiId: this.wiki.id
                    }})
                    .then((deletedCollaborator) => {
                        expect(deletedCollaborator).toBeNull();
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                });
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
    });

    // standard user context
    describe('POST /wikis/:id/collaborators/add', () => {
        it('should not add the collaborator given the user is not the owner', (done) => {
            request.get({
                url: 'http://localhost:3000/auth/fake',
                form: {
                    userId: this.otherUser.id,
                    email: this.otherUser.email,
                    role: 0,
                    username: this.otherUser.name
                }
            }, (err, res, body) => {
                const options = {
                    url: `${base}${this.wiki.id}/collaborators/add`,
                    form: {
                        collaborator: 'billyboy@gmail.com'
                    }
                }
                request.post(options, (err, res, body) => {
                    expect(res.headers.error).toContain('Only the owner can add collaborators to this wiki');
                    done();
                });
            });
        });
    });
});    