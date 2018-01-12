const logger = require('../../../logger');

module.exports = function(webDoc, hyperLinkColln, next) {
	logger.debug("Got extracted hyperlinks to publish event for web document ", webDoc.url);

	next(null, hyperLinkColln);
}