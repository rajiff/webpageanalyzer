const logger = require('../../../logger');
const config = require('../../../config');
// const cheerio = require('cheerio');

module.exports = function(webDoc, next) {
	logger.debug("Got webdoc to extract HTML version..! ");
	// logger.debug("Got webdoc to extract HTML version..! ", webDoc);

	let htmlVersion = '';
	if(webDoc.contenttype === 'text/html') {
		// let doctypeRegEx = new RegExp('^<!doctype html>/gi');
		let doctypeRegEx = /^<!doctype html>/gi;
		let isHTML5 = doctypeRegEx.test(webDoc.htmldoc);
		htmlVersion = (isHTML5)?'HTML5':'HTML';
	}

	webDoc.htmlversion = htmlVersion;

	next(null, webDoc);
}
