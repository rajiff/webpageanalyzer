const webDocHeadingsCtrl = require('../webdocheadings/webDocHeadings.controller');
const logger = require('../../../logger');

module.exports = function(webDoc, headingColln, next) {
  logger.debug("Got extracted headings to save in DB for web document ", webDoc.url);

  try {
    let webDocHeadingColln = [];

    webDocHeadingColln = headingColln.map((docHeading) => {
      let webDocHeading = {
        url: webDoc.url,
        heading: docHeading.heading,
        headingtext: docHeading.headingtext,
        headingtag: docHeading.headingtag,
        submittedon: new Date(),
        analyzedon: new Date()
      };
      return webDocHeading;
    });

    logger.debug(`Saving ${webDocHeadingColln.length} number of web doc headings`);

    let options = { upsert: true };
    webDocHeadingsCtrl.saveWebDocHeadings(webDoc.url, webDocHeadingColln, options, function(err, result) {
      if (err) {
        logger.error('Error in saving web doc headings, ERROR::', err);
        next(err);
        return;
      }
      logger.debug("saved web doc headings ", result);
      next(null, result);
    })
  } catch (err) {
    logger.error('Caught unexpected error in saving web doc heading, ERROR::', err);
    next(err);
    return;
  }
}