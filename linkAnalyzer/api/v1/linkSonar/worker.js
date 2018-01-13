const async = require('async');
const logger = require('../../../logger');

const readWebDocument = require('./readWebDocument');
const updateWebDockLink = require('./updateWebDockLink');

const doWork = function(message, done) {
  logger.debug("Got message to work ", message);

  // Check the link, if internal or external and prepare it for reading
  // Read the Web Document
  // Update the status in DB
  let webDocLink = message;

  if (!webDocLink.url || !webDocLink.hyperlink) {
    done({ error: "Invalid URL, cannot extract" });
    return;
  }

  async.waterfall([
    (cb) => {
      webDocLink.accessURL = webDocLink.hyperlink;
      if (webDocLink.linksource === 'internal') {
        webDocLink.accessURL = `${webDocLink.url}${webDocLink.hyperlink}`;
      }
      cb(null, webDocLink);
    },
    readWebDocument,
    updateWebDockLink
  ], (err, result) => {
    if (err)
      logger.debug("HYPER LINKS verifying/sensing process done, ERROR::[", err, "] RESULT::[", result, "]");
    else
      logger.debug("HYPER LINKS verifying/sensing process done for", webDocLink.url);

    done(err, result);
  });
}

module.exports = doWork;