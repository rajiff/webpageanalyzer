const log4js = require('log4js');

log4js.configure({
  appenders: { default: { type: 'file', filename: 'application.log' }, console: { type: 'console' } },
  categories: { default: { appenders: ['default', 'console'], level: 'error' } }
});

const logger = log4js.getLogger('default');

module.exports = logger;