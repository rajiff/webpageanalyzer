const logger = require('../../../logger');

module.exports = function(webDoc, hyperLinkColln, next) {
	logger.debug("Got extracted hyperlinks to save in DB for web document ", webDoc.url);

	next(null, hyperLinkColln);
}