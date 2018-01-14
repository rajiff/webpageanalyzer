const async = require('async');
const logger = require('../../../logger');

const extractHeadings = require('./extractHeadings');
const saveWebDocHeadings = require('./saveWebDocHeadings');

const doWork = function(message, done) {
  logger.debug("Got message to work ", message.event);

  // Check the webpage is reachable and has HTML content only
  // Extract all the headers from the body of the DOM document
  // Persist all the headings
  let webDoc = message.payload;

  if (!webDoc.url) {
    done({ error: "Invalid URL, cannot extract" });
    return;
  }

  if (webDoc.contenttype != 'text/html' || (parseInt(webDoc.accessstatus)/100 != 2) ) {
  	done({ error: "Invalid Web Document, headings not exist/will not make sense analyzing them, skipping analysis..!" });
    return;
  }

  async.waterfall([
  	extractHeadings.bind(null, webDoc),
  	saveWebDocHeadings.bind(null, webDoc)
  ], (err, result) => {
    if (err)
      logger.debug("HEADINGS extraction process done, ERROR::[", err, "] RESULT::[", result, "]");
    else
      logger.debug("HEADINGS extraction process done for", webDoc.url);

    done(err, result);
  })
}

module.exports = doWork;