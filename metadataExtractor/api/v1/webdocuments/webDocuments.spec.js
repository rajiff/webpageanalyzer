const chai = require('chai');
const supertest = require('supertest');
const cassandra = require('cassandra-driver');
const config = require('../../../config');
const api = supertest(require('../../../app')); // supertest init;
const cassandraConnection = require('../../../cassandraConnection');
const expect = chai.expect;

describe('API test cases for /webdocuments', function() {

  before(function(done) {
    const client = new cassandra.Client({ contactPoints: config.CASSANDRA.CASSANDRA_HOST_POINTS });
    let query = `TRUNCATE TABLE ${config.CASSANDRA.TABLE_WEBDOC_METADATA}`;
    client.execute(query, (err, result) => {
      if (err) {
        done(err);
        return;
      }
      console.log(`Done truncating from ${config.CASSANDRA.TABLE_WEBDOC_METADATA}, result: ${result}`);
      done(null);
    });
  });

  it('POST a webdocument, must create and return with status 201', function(done) {

    let newWebDoc = { url: "http://google.com" };

    api.post('/api/v1/webdocuments')
      .set('Content-Type', 'application/json')
      .send(newWebDoc)
      .expect(201)
      .end(function(err, res) {
        if (err) return done(err);

        // console.log("POST res ", res.body);

        expect(res.body).not.equal(null);
        expect(res.body.url).equal(newWebDoc.url);
        done();
      });
  });

  it('Get webdocuments, all inserted webdocuments should be returned', function(done) {
    api.get('/api/v1/webdocuments')
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        // console.log("GET ALL res ", res.body);

        expect(res.body).not.equal(null);
        expect(res.body).to.be.an('array');
        expect(res.body.length).equal(1);
        expect(res.body[0].url).equal("http://google.com");
        done();
      });
  });

  it('Get a specific webdocument, must return only one object, which was specified', function(done) {
    api.get(`/api/v1/webdocuments/${encodeURIComponent('http://google.com')}`)
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        // console.log("GET res ", res.body);

        expect(res.body).not.equal(null);
        expect(res.body).not.to.be.an('array');
        expect(res.body).to.be.an('object')
        expect(res.body.url).equal("http://google.com");
        expect(res.body.submittedon).not.equal(null);
        done();
      });
  });

  it('Get a specific webdocument, which was not inserted, must return no object', function(done) {
    api.get(`/api/v1/webdocuments/${encodeURIComponent('http://notinserted.com')}`)
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);

        // console.log("GET res ", res.body);

        expect(res.body).not.equal(null);
        expect(res.body).not.to.be.an('array');
        expect(res.body).to.be.an('object')
        expect(res.body.url).equal(undefined);
        expect(res.body.submittedon).equal(undefined);
        done();
      });
  });


});