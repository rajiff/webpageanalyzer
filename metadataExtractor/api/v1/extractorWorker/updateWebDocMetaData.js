const webDocCtrl = require('../webdocuments/webDocuments.controller');
const logger = require('../../../logger');

module.exports = function(webDoc, next) {
	logger.debug("Updating metadata extracted webdoc ", webDoc.url);
	try {
		webDoc.analyzedon = new Date();

    let options = { upsert: true };
    webDocCtrl.updateWebDocument(webDoc, options, function(err, result) {
      if (err) {
        logger.error('Error in updating web doc, ERROR::', err);
        next(err);
        return;
      }
      // logger.debug("Updated webdocument with result:", result);
      logger.debug("Updated webdocument ", result.url);
      next(null, result);
    })
  } catch (err) {
    logger.error('Unexpected error in updating web doc, ERROR::', err);
    next(err);
    return;
  }
}