const async = require('async');
const webDocService = require('./webDocuments.service');
const messageBroker = require('../../../messageBroker');
const config = require('../../../config');
const logger = require('../../../logger');

const insertWebDocument = function(newWebDocObj, options, done) {
  async.waterfall([
    webDocService.insertWebDocument.bind(null, newWebDocObj, options),
    function(insertResult, callback) {
      messageBroker.publishEvent(config.EVENTS.NEW_WEBDOCUMENT_ADDED, insertResult, (err, result) => {
        if(err) {
          logger.error("Error in publishing event ", config.EVENTS.NEW_WEBDOCUMENT_ADDED);
        }
        //Irrespective of the publish event status, we will return success with received input, so that controller sends back original object, not the event publish result
        callback(null, insertResult);
      });
    }
  ], done);
}

const updateWebDocument = function(webDocObj, options, done) {
  webDocService.updateWebDocument(webDocObj, options, done);
}

const getAllWebDocument = function(options, done) {
  webDocService.getAllWebDocument(options, done);
}

const findWebDocumentByURL = function(docURL, done) {
  webDocService.findWebDocumentByURL(docURL, done);
}

module.exports = {
  insertWebDocument,
  updateWebDocument,
  getAllWebDocument,
  findWebDocumentByURL
}