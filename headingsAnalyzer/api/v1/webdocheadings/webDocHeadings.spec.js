const chai = require('chai');
const supertest = require('supertest');

const api = supertest(require('../../../app')); // supertest init;
const expect = chai.expect;
const async = require('async');

describe('API test cases for fetching headings of a web document', function() {
  it('', function(done) {
    let url = 'http://google.com';
    api.get( ('/api/v1/webdocheadings/'+encodeURIComponent(url)) )
      .set('Content-Type', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return cb(err);

        // console.log("Get res ", res.body);

        expect(res.body).not.equal(null);
        expect(res.body.url).equal(url);
        cb();
      });
  })
});