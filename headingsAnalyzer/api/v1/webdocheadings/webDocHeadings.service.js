const async = require('async');
const WebDocHeadingsDAO = require('./webDocHeadingsDAO');
let logger = require('../../../logger');

const getHeadingsOfWebDoc = function(url, options, done) {
  WebDocHeadingsDAO.getHeadingsOfWebDoc(url, options, done);
}

const saveWebDocHeadings = function(url, webDocHeadingColln, options, done) {
	async.waterfall([
			WebDocHeadingsDAO.saveWebDocHeadings.bind(null, webDocHeadingColln, options),
			(savedResult, cb) => {
				getHeadingsOfWebDoc(url, {}, cb);
			}
		], done);
}

module.exports = {
  getHeadingsOfWebDoc,
  saveWebDocHeadings
}