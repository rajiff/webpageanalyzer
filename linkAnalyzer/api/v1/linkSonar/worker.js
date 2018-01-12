const async = require('async');
const logger = require('../../../logger');

const doWork = function(message, done) {
  logger.debug("Got message to work ", message);
  done(null, {});
}

module.exports = doWork;