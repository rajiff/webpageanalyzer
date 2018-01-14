const webDocHeadingsService = require('./webDocHeadings.service');

const getHeadingsOfWebDoc = function(url, options, done) {
  webDocHeadingsService.getHeadingsOfWebDoc(url, options, done);
}

const saveWebDocHeadings = function(url, webDocHeadingColln, options, done) {
  webDocHeadingsService.saveWebDocHeadings(url, webDocHeadingColln, options, done);
}

module.exports = {
  getHeadingsOfWebDoc,
  saveWebDocHeadings
}