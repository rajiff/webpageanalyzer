const cheerio = require('cheerio');
const async = require('async');
const logger = require('../../../logger');

module.exports = function(webDoc, next) {
  logger.debug("Got webdoc to extracting hyperlinks of document ", webDoc.url);

  let hyperLinkColln = [];
  let rawHyperLinks = [];
  if (webDoc.contenttype === 'text/html') {
    let $ = cheerio.load(webDoc.htmldoc);
    rawHyperLinks = $('a'); //Extract all hyperlinks
  }

  console.log(`Extracted ${rawHyperLinks.length} number of raw hyperlinks for ${webDoc.url}`);

  async.each(rawHyperLinks, (hyperLink, done) => {
  	// console.log("Attrib: ", hyperLink.attribs);
  	hyperLinkColln.push({hyperlink: hyperLink.attribs['href']});
  }, (err) => {
  	logger.error("Error in iterating over hyperlink for hyperLinkObject creation, ERROR::", err);
  	next(err);
  });

  // Filter out duplicate links
  hyperLinkColln = hyperLinkColln.filter(function(value, index, self) {
  	return self.findIndex(function(hl, element){ return element.hyperlink == hl; }.bind(null, value.hyperlink)) === index;
  });

  console.log(`Extracted ${hyperLinkColln.length} number of webdocument hyperlinks for ${webDoc.url}`);

  next(null, hyperLinkColln);
}