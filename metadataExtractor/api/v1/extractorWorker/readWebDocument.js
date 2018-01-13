const request = require('superagent');
const logger = require('../../../logger');
const config = require('../../../config');

const normalizeHTTPResponse = function(err, res) {
  let result = {
    error: "",
    errorMessage: "",
    status: "",
    doc: "",
    contentType: ""
  }

  // Check was able to access the URL
  // If not able to access no further checking is needed
  // If ABLE to access, check for status and response details

  if (!err && !res) {
    // FATAL cases
    logger.error("Unknown FATAL Error in accessing web page..!");

    result.status = result.error = "UNKNOWN";
    result.errorMessage = "Cannot access or unknown error with specified URL";

  } else if (!err && res) {
    // SUCCESS Cases
    logger.debug("SUCCESSful accessing specified web page..!");

    result.error = "";
    result.errorMessage = "";
    result.status = res.status;
    result.doc = (res.text || res.body || 'empty response');
    result.contentType = res.type;
  } else if (err) {
    // ERROR cases
    logger.error("Error in accessing web page, ERROR::");

    if (err.code === "ENOTFOUND") {
      result.status = result.error = err.code;
      result.errorMessage = "Cannot find web page for specified URL";
    } else if (err.code === "ECONNABORTED" || err.code === "ECONNREFUSED") {
      result.status = result.error = err.code;
      result.errorMessage = (err.timeout) ? "Timeout, waiting for response" : "Request not completed, aborted...!";
    } else {
      result.error = (err.code || err.status || 'ERROR');
      result.status = err.status;
      result.errorMessage = "Cannot access, error with specified URL";
      if(res) {
        result.doc = (res.text || res.body || 'empty response');
        result.contentType = res.type;
      }
    }
  } else if (!err && res) {
    logger.error("Control reached UNEXPECTED place..! ", err);
    // Practically, control might not come here, but to be on safer side
    result.status = result.error = "UNKNOWN";
    result.errorMessage = "Cannot access or unknown error with specified URL";
  }
  return result;
}

const readWebDocument = function(webDoc, next) {
  request
    .get(webDoc.url)
    .timeout({
      response: (config.WEB_DOC_REQ_TIMEOUT || 5000), // Wait 20 seconds or as configured for the server to start sending,
      deadline: (config.WEB_DOC_REQ_DEADLINE || 60000), // but allow 1 minute or as configured for the file to finish loading.
    })
    .redirects((config.WEB_DOC_REQ_MAX_REDIRECTS || 5)) // Follow max 5 or as configured number of redirects
    .retry((config.WEB_DOC_REQ_MAX_RETRY || 2)) // Retry, like in case of slow network, default is 2
    .end((err, res) => {
      let result = normalizeHTTPResponse(err, res)

      webDoc.contenttype = result.contentType;
      webDoc.htmldoc = result.doc;
      webDoc.accessstatus = "" + result.status; //To ensure it gets converted to string
      webDoc.statusmessage = result.errorMessage;
      webDoc.error = "" + result.error;

      next(null, webDoc);
    });
}

module.exports = readWebDocument;