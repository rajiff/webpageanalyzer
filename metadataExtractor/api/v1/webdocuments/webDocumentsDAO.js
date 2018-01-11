let cassandraConn = require('../../../cassandraConnection');
let config = require('../../../config');
let logger = require('../../../logger');

const insertWebDocument = function(newWebDocObj, { upsert }, done) {
  let webDocObj = {
    url: newWebDocObj.url,
    htmlversion: "",
    title: "",
    htmldoc: "",
    contenttype: "",
    accessstatus: "",
    statusmessage: "",
    error: "",
    submittedon: (newWebDocObj.submittedon || new Date())
  };

  let query = `INSERT INTO ${config.CASSANDRA.TABLE_WEBDOC_METADATA} \
		(url, htmlversion, title, htmldoc, contenttype, accessstatus, statusmessage, error, submittedon) \
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const client = cassandraConn.getClient();
  client.execute(query, [
    webDocObj.url,
    webDocObj.htmlversion,
    webDocObj.title,
    webDocObj.htmldoc,
    webDocObj.contenttype,
    webDocObj.accessstatus,
    webDocObj.statusmessage,
    webDocObj.error,
    webDocObj.submittedon
  ], { prepare: true }, (err, result) => {
    if (err) {
      done(err);
      return;
    }
    logger.debug(`Done inserting record to ${config.CASSANDRA.TABLE_WEBDOC_METADATA}, result: ${result}`);
    done(null, result);
  });
}

const updateWebDocument = function(webDocObj, options, done) {
  let query = `UPDATE ${config.CASSANDRA.TABLE_WEBDOC_METADATA} \
    SET htmlversion = ?, title = ?, htmldoc =?, contenttype = ?, \
    accessstatus = ?, statusmessage = ?, error = ?, analyzedon = ? \
    WHERE url = ?`;

  const client = cassandraConn.getClient();
  client.execute(query, [
    webDocObj.htmlversion,
    webDocObj.title,
    webDocObj.htmldoc,
    webDocObj.contenttype,
    webDocObj.accessstatus,
    webDocObj.statusmessage,
    webDocObj.error,
    webDocObj.analyzedon,
    webDocObj.url,
  ], { prepare: true }, (err, result) => {
    if (err) {
      done(err);
      return;
    }
    logger.debug(`Done updating record to ${config.CASSANDRA.TABLE_WEBDOC_METADATA}, result: ${result}`);
    done(null, result);
  });
}

const getAllWebDocument = function({ order, page, limit }, done) {
  let query = `SELECT * FROM ${config.CASSANDRA.TABLE_WEBDOC_METADATA}`;

  const client = cassandraConn.getClient();
  client.execute(query, (err, result) => {
    if (err) {
      done(err);
      return;
    }
    logger.debug(`Done fetching record from ${config.CASSANDRA.TABLE_WEBDOC_METADATA}, result: ${result.rows.length}`);
    done(null, result.rows);
  });
}

const findWebDocumentByURL = function(docURL, done) {
  let query = `SELECT * FROM ${config.CASSANDRA.TABLE_WEBDOC_METADATA} WHERE url = ?`;

  const client = cassandraConn.getClient();
  client.execute(query, [docURL], { prepare: true }, (err, result) => {
    if (err) {
      done(err);
      return;
    }
    logger.debug(`Done fetching record from ${config.CASSANDRA.TABLE_WEBDOC_METADATA}, result: ${result.rows[0]}`);
    done(null, result.rows[0]);
  });
}

module.exports = {
  insertWebDocument,
  updateWebDocument,
  getAllWebDocument,
  findWebDocumentByURL
}