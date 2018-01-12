const async = require('async');
const logger = require('../../../logger');

const extractHyperLinks = require('./extractHyperLinks');
const saveWebDocHyperLinks = require('./saveWebDocHyperLinks');
const publishWebDocHyperLinksExtracted = require('./publishWebDocHyperLinksExtracted');

const doWork = function(message, done) {
  logger.debug("Got message to work ", message.event);

  // Check the webpage is reachable and has HTML content only
  // Extract all the links (internal, external) from the body of the DOM document
  // Persist all the links
  // Publish event for each links found
  let webDoc = message.payload;

  if (!webDoc.url) {
    done({ error: "Invalid URL, cannot extract" });
    return;
  }

  if (webDoc.contenttype != 'text/html' || (parseInt(webDoc.accessstatus)/100 != 2) ) {
  	done({ error: "Invalid Web Document, hyper links may not exist/will not make sense analyzing them, skipping analysis..!" });
    return;
  }

  async.waterfall([
  	extractHyperLinks.bind(null, webDoc),
  	saveWebDocHyperLinks.bind(null, webDoc),
  	publishWebDocHyperLinksExtracted.bind(null, webDoc)
  ], (err, result) => {
    if (err)
      logger.debug("HYPER LINKS extraction process done, ERROR::[", err, "] RESULT::[", result, "]");
    else
      logger.debug("HYPER LINKS extraction process done for", webDoc.url);

    done(err, result);
  })
}

module.exports = doWork;