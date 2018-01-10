const request = require('superagent');
const logger = require('../../../logger');

const normalizeHTTPError = function() {

}

const readWebDocument = function(webDoc, next) {
	request
  .get(webDoc.url)
  .end((err, res) => {
    if(err) {
      logger.error("Error in reading web document, ERROR::", err);
    	next(err);
      return;
    }

    logger.debug("Response: ", res);

    //'content-type'

    webDoc.htmlDoc = res.text;
    webDoc.accessStatus = res.status;

    next(null, webDoc);
  });
}

module.exports = readWebDocument;