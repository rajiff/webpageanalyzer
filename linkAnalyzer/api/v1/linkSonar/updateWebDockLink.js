const webDocLinksCtrl = require('../webdoclinks/webDocLinks.controller');
const logger = require('../../../logger');

module.exports = function(webDocLink, next) {
  logger.debug("Got analyzed details to save in DB for hyper link ", webDocLink.hyperlink);

  try {
    let options = { upsert: true };
    webDocLinksCtrl.updateWebDocLink(webDocLink, options, function(err, result) {
      if (err) {
        logger.error('Error in updating web doc link analysis details, ERROR::', err);
        next(err);
        return;
      }
      logger.debug("updated web doc link ", result.length);
      next(null, result);
    })
  } catch (err) {
    logger.error('Caught unexpected error in updating web doc link analysis details, ERROR::', err);
    next(err);
    return;
  }
}