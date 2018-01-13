const webDocLinkService = require('./webDocLinks.service');

const getHyperLinksOfWebDoc = function(url, options, done) {
  webDocLinkService.getHyperLinksOfWebDoc(url, options, done);
}

const saveWebDocLinks = function(url, webDocLinkColln, options, done) {
  webDocLinkService.saveWebDocLinks(url, webDocLinkColln, options, done);
}

const updateWebDocLink = function(webDocLinkObj, options, done) {
  webDocLinkService.updateWebDocLink(webDocLinkObj, options, done);
}

module.exports = {
  getHyperLinksOfWebDoc,
  saveWebDocLinks,
  updateWebDocLink
}