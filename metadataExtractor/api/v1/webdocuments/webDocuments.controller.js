const webDocService = require('./webDocuments.service');

const insertWebDocument = function(newWebDocObj, options, done) {
  webDocService.insertWebDocument(newWebDocObj, options, done);
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