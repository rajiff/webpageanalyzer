const webDocLinksCtrl = require('../webdoclinks/webDocLinks.controller');
const logger = require('../../../logger');

module.exports = function(webDoc, hyperLinkColln, next) {
  logger.debug("Got extracted hyper links to save in DB for web document ", webDoc.url);

  try {
    let webDocLinkColln = [];

    webDocLinkColln = hyperLinkColln.map((docLink) => {
      let webDocLink = {
        url: webDoc.url,
        hyperlink: docLink.hyperlink,
        linksource: docLink.linksource,
        accessstatus: "",
        statusmessage: "",
        error: "",
        submittedon: new Date()
      };
      return webDocLink;
    });

    logger.debug(`Saving ${webDocLinkColln.length} number of web doc links`);

    let options = { upsert: true };
    webDocLinksCtrl.saveWebDocLinks(webDoc.url, webDocLinkColln, options, function(err, result) {
      if (err) {
        logger.error('Error in saving web doc links, ERROR::', err);
        next(err);
        return;
      }
      logger.debug("saved web doc hypelinks ", result);
      next(null, result);
    })
  } catch (err) {
    logger.error('Caught unexpected error in saving web doc link, ERROR::', err);
    next(err);
    return;
  }
}