const async = require('async');
const logger = require('../../../logger');

const readWebDocument = require('./readWebDocument');
const extractHTMLVersion = require('./extractHTMLVersion');
const extractDocTitle = require('./extractDocTitle');
const updateWebDocMetaData = require('./updateWebDocMetaData');
const publishWebDocMetaData = require('./publishWebDocMetaData');

const doWork = function(message, done) {
  logger.debug("Got message to work ", message.event);

  // Get the URL
  // Make HTTP Request, follow redirection
  // Get the the HTML Document string
  // Load in cheerio
  // Check HTML Version
  // Check Title
  // Update/Save the details in DB
  // Publish About meta data extraction status

  let webDoc = message.payload;

  if (!webDoc.url) {
    done({ error: "Invalid URL, cannot extract" });
    return;
  }

  async.waterfall([
    readWebDocument.bind(null, webDoc),
    extractHTMLVersion,
    extractDocTitle,
    updateWebDocMetaData,
    publishWebDocMetaData
  ], (err, result) => {
    if (err)
      logger.debug("METADATA Extraction process done, ERROR::[", err, "] RESULT::[", result, "]");
    else
      logger.debug("METADATA Extraction process done for", result.url);

    done(err, result);
  })
}

module.exports = doWork;