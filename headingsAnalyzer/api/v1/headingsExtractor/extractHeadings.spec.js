const chai = require('chai');
const expect = chai.expect;

const extractHeadings = require('./extractHeadings');
const logger = require('../../../logger');

describe('WebDoc headings extraction', function() {
  it('Happy scenario of extracting headers', function(done) {

    let mockWebDoc = require('./mockWebDoc');

    extractHeadings(mockWebDoc, (err, result) => {
      if (err) return done(err);

      console.log("Got result ", result);

      expect(result).to.be.an('array');
      expect(result.length).to.be.equal(12);
      done();
    });
  })
});