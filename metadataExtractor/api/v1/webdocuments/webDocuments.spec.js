let chai = require('chai');
let supertest = require('supertest');
let api = supertest(require('../../../app')); // supertest init;
let expect = chai.expect;

describe('/webdocuments', function() {

  describe('Create new WebDocument', function() {
    it('Should respond with 201 status and returning newly created webdocument object', function(done) {

      let newWebDoc = {URL:"http://google.com"};

      api.post('/api/v1/webdocuments')
      .set('Content-Type', 'application/json')
      .send(newWebDoc)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        console.log("Returned object: ", res.body);
        expect(res.body).not.equal(null);
        expect(res.body).equal(newWebDoc);
        done();
      });
    });

  });

  describe('Get all WebDocuments', function() {
    it('Should respond with 200 status and return all webdocuments paginated', function(done) {

      api.get('/api/v1/webdocuments')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        expect(res.body).not.equal(null);
        done();
      });
    });

  });

});
