const sequelize = require('../../src/db/models/index').sequelize;
const request = require('request');
const server = require('../../server');
const base = 'http://localhost:3000/wikis/';

const User = require('../../src/db/models').User;
const Wiki = require('../../src/db/models').Wiki;
const Collaborator = require('../../src/db/models').Collaborator;

describe('routes : wiki', () => {
    beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({ force: true }).then(() => {
            User.create({
                name: 'Johnny',
                email: 'johnnyboy@gmail.com',
                password: 'hedachamp',
                confirmPassword: 'hedachamp'
            })
            .then((user) => {
                this.user = user;

                Wiki.create({
                    title: 'Javascript for Beginners',
                    body: 'A functional programming language used to power most of the web',
                    private: false,
                    userId: this.user.id
                })
                .then((wiki) => {
                    this.wiki = wiki;

                    request.get({
                        url: 'http://localhost:3000/auth/fake',
                        form: {
                            userId: this.user.id,
                            email: this.user.email,
                            role: 0,
                            username: this.user.name
                        }
                    }, (err, res, body) => {
                        done();
                    });
                });
            });
        });
    });

    describe('GET /wikis/new', () => {
        it('should render a view for creating a new wiki', (done) => {
            request.get(`${base}new`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain('Create a new wiki');
                done();
            });
        });
    });

    describe('GET /wikis/', () => {
        it('should render a view with available wikis', (done) => {
            request.get(`${base}`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain('Choose a wiki');
                expect(body).toContain('Javascript for Beginners');
                done();
            });
        });
    });

    describe('POST /wikis/create/', () => {
        it('should create a new wiki with passed in values and redirect', (done) => {
            const options = {
                url: `${base}create`, 
                form: {
                    title: 'The Official Coffee Wiki',
                    body: 'There are 3 things that are key to good coffee, hopefully someone else remembers them!',
                    privateWiki: false,
                }
            }
            Wiki.findAll()
            .then((wikis) => {
                const countBeforeNewWiki = wikis.length;
                request.post(options, (err, res, body) => {                    
                    Wiki.findAll()
                    .then((wikis) => {
                        expect(wikis.length).toBe(countBeforeNewWiki + 1);
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

    describe('POST /wikis/:id/update', () => {
        it('should update the existing wiki with the new values', (done) => {
            const options = {
                url: `${base}${this.wiki.id}/update`, 
                form: {
                    title: 'Javascript for Beginners (and Everyone Else)',
                    body: 'A functional programming language used to power most of the web (client and server side!)',
                    privateWiki: false
                }
            }
            request.post(options, (err, res, body) => {
                Wiki.findByPk(this.wiki.id)
                .then((wiki) => {
                    expect(wiki.title).toBe('Javascript for Beginners (and Everyone Else)');
                    expect(wiki.body).toBe('A functional programming language used to power most of the web (client and server side!)')
                    expect(wiki.userId).toBe(this.user.id);
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe('POST /wikis/:id/destroy', () => {
        it('should delete the wiki and redirect to the wikis page', (done) => {
            request.get({
                url: 'http://localhost:3000/auth/fake',
                form: {
                    userId: this.user.id,
                    email: this.user.email,
                    role: 2,
                    username: this.user.name
                }
            }, (err, res, body) => {
                Wiki.findAll()
                .then((wikis) => {
                    const wikisCountBeforeDelete = wikis.length;
                    expect(wikisCountBeforeDelete).toBe(1);
                    request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
                        Wiki.findAll()
                        .then((wikisAfterDelete) => {
                            expect(wikisAfterDelete.length).toBe(wikisCountBeforeDelete - 1);
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
    });
});