const async = require('async');
const webDocService = require('./webDocuments.service');

const insertWebDocument = function(newWebDocObj, options, done) {
  async.waterfall([
    webDocService.insertWebDocument.bind(null, newWebDocObj, options),
    function(insertResult, callback) {
      return WebDocumentsDAO.findWebDocumentByURL(newWebDocObj.url, callback);
    }
  ], done);
}

const getAllWebDocument = function(options, done) {
  webDocService.getAllWebDocument(options, done);
}

const findWebDocumentByURL = function(docURL, done) {
  webDocService.findWebDocumentByURL(docURL, done);
}

module.exports = {
  insertWebDocument,
  getAllWebDocument,
  findWebDocumentByURL
}