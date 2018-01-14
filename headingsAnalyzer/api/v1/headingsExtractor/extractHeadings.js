const async = require('async');
const cheerio = require('cheerio');
const logger = require('../../../logger');

module.exports = function(webDoc, next) {
  logger.debug("Got webdoc to extracting headings of document ", webDoc.url);

  let docHeadingColln = [];
  let headings = [];
  if (webDoc.contenttype === 'text/html') {
    let $ = cheerio.load(webDoc.htmldoc);
    headings = $("h1, h2, h3, h4, h5, h6");
  }

  logger.debug(`Extracted ${headings.length} headings from ${webDoc.url}`);

  async.each(headings, (h, cb) => {
    // logger.debug("Heading ", h);
    let headingName = h.name;
    headingName = headingName.trim();

    let headingStr = "";
    let headingTextElem = h.children.find((c) => c.type === 'text');
    if(headingTextElem){
      headingStr = headingTextElem.data;
      headingStr = headingStr.trim();
    } else {
      headingTextElem = h.children[0];
      headingStr = `${headingTextElem.type}${(headingTextElem.name || headingTextElem.data || '')}`;
    }

    if(headingName) {
      let docHeading = {
        url: webDoc.url,
        heading: headingName,
        headingtext: headingStr,
        headingtag: headingName
      };
      docHeadingColln.push(docHeading);
    }
    cb();
  }, (err) => {
    if (err) {
      logger.error("Error in extracting headings, ERROR::", err);
      next(err);
      return;
    }
    logger.debug(`Extracted ${docHeadingColln.length} number of Headings for `, webDoc.url);
    next(null, docHeadingColln);
  });
}