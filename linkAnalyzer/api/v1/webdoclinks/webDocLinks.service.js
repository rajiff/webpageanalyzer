const async = require('async');
const WebDocLinksDAO = require('./webDocLinksDAO');
let logger = require('../../../logger');

const getHyperLinksOfWebDoc = function(url, options, done) {
  WebDocLinksDAO.getHyperLinksOfWebDoc(url, options, done);
}

const saveWebDocLinks = function(url, webDocLinkColln, options, done) {
	async.waterfall([
			WebDocLinksDAO.saveWebDocLinks.bind(null, webDocLinkColln, options),
			(savedResult, cb) => {
				getHyperLinksOfWebDoc(url, {}, cb);
			}
		], done);
}

const updateWebDocLink = function(webDocLinkObj, options, done) {
  WebDocLinksDAO.updateWebDocLink(webDocLinkObj, options, done);
}

module.exports = {
  getHyperLinksOfWebDoc,
  saveWebDocLinks,
  updateWebDocLink
}