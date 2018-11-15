const request = require('request');
const server = require('../../server');
const base = 'http://localhost:3000/';

describe('routes : static', () => {
    it('should render the landing page', (done) => {
        request.get(base, (err, res, body) =>{
            expect(body).toContain('Social, Markdown Wikis');
            done();
        });
    });
});