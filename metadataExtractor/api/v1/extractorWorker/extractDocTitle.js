const cheerio = require('cheerio');
const logger = require('../../../logger');

module.exports = function(webDoc, next) {
	logger.debug("Got webdoc to extracting title of document..! ");

	let docTitle = '';
	if(webDoc.contenttype === 'text/html') {
		let $ = cheerio.load(webDoc.htmldoc);
		docTitle = $("title").text();;
	}

	webDoc.title = docTitle;

	next(null, webDoc);
}