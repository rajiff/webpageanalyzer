const chai = require('chai');
const expect = chai.expect;

const readWebDocument = require('./readWebDocument');

// 1. WebPage exists, able to access, returns HTML content
// 2. WebPage exists, timing out in accessing, may be webpage has server side error or slow
// 3. WebPage does not exist, network responding
// 4. No network or Network error
// 5. WebPage exists, returns non-html content

describe('Reading webdocuments for extracting metadata', function() {

  // Overall as this involves querying a webpage, lets keep at least 5 second
  this.timeout(5000);

  it('WebPage exists, timing out in accessing', function(done) {
    this.timeout(60000);
    let webDoc = {
      // This only works locally, or if there is any custom page
      url: 'http://localhost:9090/test-not-work'
    }

    readWebDocument(webDoc, (err, result) => {
      if(err) {
        done(err);
        return;
      }
      // console.log("Returned result::", result);

      expect(result).not.equal(null);
      expect(result.accessStatus).equal("ECONNREFUSED");
      expect(result.statusMessage).not.equal(null);
      expect(result.htmlDoc).equal("");
      expect(result.contentType).equal("");
      done();
    });
  })

  it('WebPage does not exist, network responding', function(done) {
    // this.timeout(60000);
    let webDoc = {
      url: 'http://no-way-on-earth-this-exists.com'
    }
    readWebDocument(webDoc, (err, result) => {
      if(err) {
        done(err);
        return;
      }
      // console.log("Returned result::", result);

      expect(result).not.equal(null);
      expect(result.accessStatus).equal("ENOTFOUND");
      expect(result.statusMessage).not.equal(null);
      expect(result.htmlDoc).equal("");
      expect(result.contentType).equal("");
      done();
    });
  })

  it('WebPage exists, able to access, returns HTML content', function(done) {
    let webDoc = {
      url: 'http://google.com'
    }
    readWebDocument(webDoc, (err, result) => {
      if(err) {
        done(err);
        return;
      }

      // console.log("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.error).equal("");
      expect(result.statusMessage).equal("");
      expect(result.htmlDoc).not.equal(null);
      expect(result.htmlDoc.accessStatus).not.equal(null);
      expect(result.htmlDoc).not.equal("");
      expect(result.htmlDoc.accessStatus).not.equal("");
      expect(result.contentType).not.equal("");
      done();
    });
  });

  it('WebPage exists, returns non-html content', function(done) {
    this.timeout(10000);

    let webDoc = {
      url: 'https://api.github.com/graphql'
    }
    readWebDocument(webDoc, (err, result) => {
      if(err) {
        done(err);
        return;
      }

      // console.log("Returned webdoc ", result);

      expect(result).not.equal(null);
      expect(result.error).not.equal("");
      expect(result.statusMessage).not.equal("");
      expect(result.htmlDoc).not.equal(null);
      expect(result.htmlDoc.accessStatus).not.equal(null);
      expect(result.htmlDoc).not.equal("");
      expect(result.htmlDoc.accessStatus).not.equal("");
      expect(result.contentType).not.equal("");
      done();
    });
  })
});