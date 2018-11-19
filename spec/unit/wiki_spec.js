const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;
const Wiki = require('../../src/db/models').Wiki;

describe('Wiki', () => {
    beforeEach((done) => {
        this.user;
        this.wiki;
        sequelize.sync({ force: true}).then(() => {
            User.create({
                name: 'Johnny',
                email: 'johnnyboy@gmail.com',
                password: 'hedachamp'
            })
            .then((user) => {
                this.user = user;
                done();
            });
        });
    });

    describe('#create', () => {
        it('should create a wiki with the associated user', (done) => {
            Wiki.create({
                title: 'Javascript for Beginners',
                body: 'A functional programming language used to power most of the web',
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                expect(wiki).not.toBeNull();
                expect(wiki.title).toBe('Javascript for Beginners');
                expect(wiki.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
        it('should not create a wiki with missing fields', (done) => {
            Wiki.create({
                title: 'Javascript for Beginners',
                userId: this.user.id
            })
            .then((wiki) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('Wiki.body cannot be null');
                expect(err.message).toContain('Wiki.private cannot be null');
                done();
            });
        });
    });

    describe('#setUser', () => {
        it('should set a wiki\'s userId to a different user', (done) => {
            Wiki.create({
                title: 'Javascript for Beginners',
                body: 'A functional programming language used to power most of the web',
                private: false,
                userId: this.user.id
            })
            .then((wiki) => {
                this.wiki = wiki;
                User.create({
                    name: 'Bill',
                    email: 'newguy@gmail.com',
                    password: '123456'
                })
                .then((newUser) => {
                    expect(this.wiki.userId).toBe(this.user.id);
                    this.wiki.setUser(newUser)
                    .then((updatedWiki) => {
                        expect(this.wiki.userId).toBe(newUser.id);
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

    describe('#getUser', () => {
        it('should return the user associated with the wiki', (done) => {
            Wiki.create({
                title: 'Javascript for Beginners',
                body: 'A functional programming language used to power most of the web',
                private: false,
                userId: this.user.id 
            })
            .then((wiki) => {
                wiki.getUser()
                .then((associatedUser) => {
                    expect(associatedUser.email).toBe('johnnyboy@gmail.com');
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