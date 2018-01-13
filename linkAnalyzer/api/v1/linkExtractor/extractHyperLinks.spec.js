const chai = require('chai');
const expect = chai.expect;

const extractHyperLinks = require('./extractHyperLinks');
const logger = require('../../../logger');

describe('MessageBroker publish', function() {
  it('Hyperlink extraction from text/html document', function(done) {
    let mockWebDoc = require('./mockWebDoc');
    extractHyperLinks(mockWebDoc, (err, result) => {
      if (err) return done(err);

      // console.log("Got result ", result);

      expect(result).to.be.an('array');
      expect(result.length).to.be.equal(29);
      done();
    });
  })

  it('Empty html document, must not throw error, but returns no links', function(done) {
    let mockWebDoc = {
      url: 'http://google.com',
      accessstatus: '200',
      contenttype: 'text/html',
      error: '',
      htmldoc: '',
      htmlversion: '',
      statusmessage: '',
      title: 'Empty HTML doc'
    };
    extractHyperLinks(mockWebDoc, (err, result) => {
      if(err) return done(err);

      console.log("Got result ", result);

      expect(result).to.be.an('array');
      expect(result.length).to.be.equal(0);
      done();
    });
  })

  it('Non-HTML document extraction for links, must skip', function(done) {
    let mockWebDoc = {
      url: 'http://google.com',
      accessstatus: '200',
      contenttype: 'application/json',
      error: '',
      htmldoc: '',
      htmlversion: '',
      statusmessage: '',
      title: 'API'
    };
    extractHyperLinks(mockWebDoc, (err, result) => {
      // if(err) return done(err);

      console.log("Got result ", result);

      expect(err).not.equal(null);
      expect(result).equal(undefined);
      done();
    });
  })
});