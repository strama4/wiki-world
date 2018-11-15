const sequelize = require('../../src/db/models/index').sequelize;
const request = require('request');
const server = require('../../server');
const base = 'http://localhost:3000/users/';

const User = require('../../src/db/models').User;

describe('routes : users', () => {
    beforeEach((done) => {
        sequelize.sync({ force: true }).then(() => {
            done();
        })
        .catch((err) => {
            console.log(err);
            done();
        })
    })
    describe('GET /users/sign_up', () => {
        it('should render a sign up view', (done) => {
            request.get(`${base}sign_up`, (err, res, body) => {
                expect(err).toBeNull();
                expect(body).toContain('Sign Up');
                done();
            });
        });
    });

    describe('POST /users/sign_up', () => {
        it('should create a user with valid credentials', (done) => {
           const options = {
                url: `${base}sign_up`,
                form: {
                    name: 'Johnny',
                    email: 'johnnyboy@gmail.com',
                    password: 'hedachamp',
                    password_conf: 'hedachamp'
                }
            }
            request.post(options, (err, res, body) => {
                expect(err).toBeNull();
                User.findOne({ where: {email: 'johnnyboy@gmail.com'}})
                .then((user) => {
                    expect(user.id).not.toBeNull();
                    expect(user.email).toBe('johnnyboy@gmail.com');
                    done();
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        }); 
    
        it('should not create a user with invalid credentials', (done) => {
            const options = {
                url: `${base}sign_up`,
                form: {
                    email: 'johnnyboyatgmail.com',
                    password: '.....'
                }
            }
            request.post(options, (err, res, body) => {
                User.findOne({ where: {email: 'johnnyboyatgmail.com'}})
                .then((user) => {
                    expect(user).toBeNull();
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