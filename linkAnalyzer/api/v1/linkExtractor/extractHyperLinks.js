const cheerio = require('cheerio');
const async = require('async');
const logger = require('../../../logger');

module.exports = function(webDoc, next) {
  logger.debug("Got webdoc to extracting hyper links of document ", webDoc.url);

  // @THINK do we have to worry about the order of the links in the web document?

  let hyperLinkColln = [];
  let rawHyperLinks = [];

  if (webDoc.contenttype === 'text/html') {
    let $ = cheerio.load(webDoc.htmldoc);
    rawHyperLinks = $('a'); //Extract all hyperlinks
  } else {
    logger.error("Got a non-html document for extracting links, skipping...!");
    next({ error: "Not a HTML content, skipping links extraction..!" });
    return;
  }

  logger.debug(`Extracted ${rawHyperLinks.length} number of raw hyperlinks for ${webDoc.url}`);

  async.each(rawHyperLinks, (hyperLink, cb) => {
    let linkURL = hyperLink.attribs['href'];

    if (linkURL) {
      let httpProto = /^https?:\/\//gi;
      let linkSource = httpProto.test(linkURL) ? 'external' : 'internal';

      let webDocLink = {
        url: webDoc.url,
        hyperlink: linkURL,
        linksource: linkSource
      }
      hyperLinkColln.push(webDocLink);
    }
    cb();
  }, (err) => {
    if (err) {
      logger.error("Error in iterating over hyperlink for hyperLinkObject creation, ERROR::", err);
      next(err, []);
    } else {
      // Filter out duplicate links
      hyperLinkColln = hyperLinkColln.filter(function(value, index, self) {
        // The anonymous function should identify the duplication element and return its index, so that that can be filtered
        return self.findIndex(function(hl, element) { return element.hyperlink == hl; }.bind(null, value.hyperlink)) === index;
      });

      logger.debug(`Extracted ${hyperLinkColln.length} number of webdocument hyperlinks for ${webDoc.url}`);

      next(null, hyperLinkColln);
    }
  });
}