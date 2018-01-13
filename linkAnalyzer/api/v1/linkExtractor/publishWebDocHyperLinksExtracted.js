const async = require('async');
const logger = require('../../../logger');
const config = require('../../../config');
const messageBroker = require('../../../messageBroker');

module.exports = function(webDoc, webDocLinkColln, next) {
	logger.debug("Got extracted hyper links to publish event for web document ", webDoc.url);

	async.each(webDocLinkColln, (docLink, cb) => {
		logger.debug("Publishing message ", docLink);
		messageBroker.publishToQueue(config.EVENTS.WEBDOCUMENT_LINK_EXTRACTED, docLink, cb);
	}, (err) => {
		if(err) {
			logger.error("Error in publishing web dock link extraction event, ERROR::", err);
		}
		next(err, webDocLinkColln);
	})
}