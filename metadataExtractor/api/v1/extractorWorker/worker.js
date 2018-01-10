const logger = require('../../../logger');

const doWork = function(message, done) {
	logger.debug("Got message to work ", message);
	done(null, {Ok: 1});
}

module.exports = doWork;