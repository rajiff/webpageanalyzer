let cassandraConn = require('../../../cassandraConnection');
let config = require('../../../config');
let logger = require('../../../logger');

const insertWebDocument = function(newWebDocObj, { upsert }, done) {
  let webDocObj = {
    URL: newWebDocObj.URL,
    htmlVersion: "",
    title: "",
    htmlDoc: "",
    accessStatus: "",
    submittedOn: new Date()
  };

  let query = `INSERT INTO ${config.CASSANDRA.TABLE_WEBDOC_METADATA} \
		(URL, htmlVersion, title, htmlDoc, accessStatus, submittedOn) \
		VALUES (?, ?, ?, ?, ?, ?)`;

  const client = cassandraConn.getClient();
  client.execute(query, [
    webDocObj.URL,
    webDocObj.htmlVersion,
    webDocObj.title,
    webDocObj.htmlDoc,
    webDocObj.accessStatus,
    webDocObj.submittedOn
  ], { prepare: true }, (err, result) => {
    if (err) {
      done(err);
      return;
    }
    logger.debug(`Done inserting record to ${config.CASSANDRA.TABLE_WEBDOC_METADATA}, result: ${result}`);
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
  let query = `SELECT * FROM ${config.CASSANDRA.TABLE_WEBDOC_METADATA} WHERE URL = ?`;

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
  getAllWebDocument,
  findWebDocumentByURL
}