const sequelize = require('../../src/db/models/index').sequelize;
const User = require('../../src/db/models').User;

describe('User', () => {
    beforeEach((done) => {
        sequelize.sync({ force: true})
        .then(() => {
            done();
        });
    });
    describe('#create', () => {
        it('should create a new user', (done) => {
            User.create({
                name: 'Johnny',
                email: 'johnnyboy@gmail.com',
                password: 'hedachamp'
            })
            .then((user) => {
                expect(user.email).toBe('johnnyboy@gmail.com');
                expect(user.id).not.toBeNull();
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });
        it('should not create a user with invalid credentials', (done) => {
            User.create({
                email: 'johnnyboyatgmail.com',
                password: '.....'
            })
            .then((user) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain('Validation error: Must be a valid email');
                done();
            });
        });
        it('should not create a user with an email that\'s already in use', (done) => {
            User.create({
                name: 'Johnny',
                email: 'johnnyboy@gmail.com',
                password: 'hedachamp'
            })
            .then((user) => {
                User.create({
                    name: 'Johnny',
                    email: 'johnnyboy@gmail.com',
                    password: 'hedachamp'
                })
                .then((duplicateUser) => {
                    done();
                })
                .catch((err) => {
                    expect(err.message).toContain('Validation error');
                });
            });
        });
    });
});