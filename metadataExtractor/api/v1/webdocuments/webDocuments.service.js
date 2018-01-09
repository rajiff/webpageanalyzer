const async = require('async');
const WebDocumentsDAO = require('./webDocumentsDAO');

const insertWebDocument = function(newWebDocObj, options, done) {
  async.waterfall([
    WebDocumentsDAO.insertWebDocument.bind(null, newWebDocObj, options),
    function(insertResult, callback) {
      return WebDocumentsDAO.findWebDocumentByURL(newWebDocObj.URL, callback);
    }
  ], done);
}

const getAllWebDocument = function(options, done) {
  WebDocumentsDAO.getAllWebDocument(options, done);
}

const findWebDocumentByURL = function(docURL, done) {
  WebDocumentsDAO.findWebDocumentByURL(docURL, done);
}

module.exports = {
  insertWebDocument,
  getAllWebDocument,
  findWebDocumentByURL
}