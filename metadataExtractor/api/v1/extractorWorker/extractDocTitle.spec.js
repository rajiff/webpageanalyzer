const chai = require('chai');
const expect = chai.expect;
const logger = require('../../../logger');

const extractDocTitle = require('./extractDocTitle');

describe('Extract HTMLVersion', function() {

  // this.timeout(10000);

  it('Extract document Title of the webpage', function(done) {
    let title = 'This is a web document';
    let webDoc = {
      url: 'http://google.com',
      contenttype: 'text/html',
      htmldoc: `<!DOCTYPE HTML><html><head><title>${title}</title></head><body></body></html>`
    }

    extractDocTitle(webDoc, (err, result) => {
      if (err) {
        done(err);
        return;
      }

      logger.debug("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.title).equal(title);
      done();
    });
  })

  it('Webpage without document Title', function(done) {
    let webDoc = {
      url: 'http://google.com',
      contenttype: 'text/html',
      htmldoc: `<!DOCTYPE HTML><html></head><body></body></html>`
    }

    extractDocTitle(webDoc, (err, result) => {
      if (err) {
        done(err);
        return;
      }

      logger.debug("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.title).equal('');
      done();
    });
  })

});