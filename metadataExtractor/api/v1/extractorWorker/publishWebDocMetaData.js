const messageBroker = require('../../../messageBroker');
const logger = require('../../../logger');
const config = require('../../../config');

module.exports = function(webDoc, next) {
  logger.debug("Got metadata updated webdoc to publish event for url ", webDoc.url);

  messageBroker.publishEvent(config.EVENTS.WEBDOCUMENT_METADTA_EXTRACTED, webDoc, (err, result) => {
    if (err) {
      logger.error("Error in publishing event ", config.EVENTS.WEBDOCUMENT_METADTA_EXTRACTED);
      next(err);
      return;
    }
    next(null, webDoc);
  });
}