const chai = require('chai');
const expect = chai.expect;
const logger = require('../../../logger');

const extractHTMLVersion = require('./extractHTMLVersion');

describe('Extract HTMLVersion', function() {

  // this.timeout(10000);

  it('Extract on valid HTML v5 webpage', function(done) {

    let webDoc = {
      url: 'http://google.com',
      contenttype: 'text/html',
      htmldoc: `<!DOCTYPE HTML><html><head><title>Test</title></head><body></body></html>`
    }

    extractHTMLVersion(webDoc, (err, result) => {
      if (err) {
        done(err);
        return;
      }

      logger.debug("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.htmlversion).equal('HTML5');
      done();
    });
  })

  it('Lowercase Doctype', function(done) {

    let webDoc = {
      url: 'http://google.com',
      contenttype: 'text/html',
      htmldoc: `<!doctype html><html><head><title>Test</title></head><body></body></html>`
    }

    extractHTMLVersion(webDoc, (err, result) => {
      if (err) {
        done(err);
        return;
      }

      logger.debug("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.htmlversion).equal('HTML5');
      done();
    });
  })

  it('No Doctype', function(done) {

    let webDoc = {
      url: 'http://google.com',
      contenttype: 'text/html',
      htmldoc: `<html><head><title>Test</title></head><body></body></html>`
    }

    extractHTMLVersion(webDoc, (err, result) => {
      if (err) {
        done(err);
        return;
      }

      logger.debug("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.htmlversion).equal('HTML');
      done();
    });
  })

  it('HML v4 Doctype', function(done) {

    let webDoc = {
      url: 'http://google.com',
      contenttype: 'text/html',
      htmldoc: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN"
      "http://www.w3.org/TR/html4/strict.dtd"><html><head><title>Test</title></head><body></body></html>`
    }

    extractHTMLVersion(webDoc, (err, result) => {
      if (err) {
        done(err);
        return;
      }

      logger.debug("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.htmlversion).equal('HTML');
      done();
    });
  })

  it('Non HTML', function(done) {

    let webDoc = {
      url: 'http://google.com',
      contenttype: 'application/json',
      htmldoc: `{key: 'value'}`
    }

    extractHTMLVersion(webDoc, (err, result) => {
      if (err) {
        done(err);
        return;
      }

      logger.debug("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.htmlversion).equal('');
      done();
    });
  })

});