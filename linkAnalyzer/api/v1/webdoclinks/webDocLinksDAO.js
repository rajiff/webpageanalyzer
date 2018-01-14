let cassandraConn = require('../../../cassandraConnection');
let async = require('async');
let config = require('../../../config');
let logger = require('../../../logger');

const getHyperLinksOfWebDoc = function(webDocURL, { order, page, limit }, done) {
  let query = `SELECT * FROM ${config.CASSANDRA.TABLE_WEBDOC_LINKS} WHERE url = ?`;

  const client = cassandraConn.getClient();
  client.execute(query, [webDocURL], (err, result) => {
    if (err) {
      logger.debug(`Error fetching record from ${config.CASSANDRA.TABLE_WEBDOC_LINKS}, ERROR: ${err}`);
      done(err);
      return;
    }
    logger.debug(`Done fetching record from ${config.CASSANDRA.TABLE_WEBDOC_LINKS}, result: ${result.rows.length}`);
    done(null, result.rows);
  });
}

const saveWebDocLinks = function(webDocLinkColln, { upsert }, done) {
  if(!webDocLinkColln.length) {
    done({error: 'Empty collection of links cannot be saved..!'});
    return;
  }

  let queryColln = [];

  queryColln = webDocLinkColln.map((docLink) => {

    docLink.submittedon = new Date();

    let query = `INSERT INTO ${config.CASSANDRA.TABLE_WEBDOC_LINKS} \
    (url, hyperlink, linksource, contenttype, accessstatus, statusmessage, error, submittedon) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    let params = [
      docLink.url,
      docLink.hyperlink,
      docLink.linksource,
      docLink.contenttype,
      docLink.accessstatus,
      docLink.statusmessage,
      docLink.error,
      docLink.submittedon
    ];

    // queryColln.push({ query, params });
    return { query, params };
  });

  const client = cassandraConn.getClient();
  client.batch(queryColln, { prepare: true }, (err, result) => {
    if (err) {
      logger.debug(`Error saving records to ${config.CASSANDRA.TABLE_WEBDOC_LINKS}, ERROR: `, err);
      done(err);
      return;
    }
    logger.debug(`Done saving records to ${config.CASSANDRA.TABLE_WEBDOC_LINKS}, result: `, result.rows);
    done(null, result);
  });
}

const updateWebDocLink = function(webDocLinkObj, options, done) {
  webDocLinkObj.analyzedon = new Date();

  let query = `UPDATE ${config.CASSANDRA.TABLE_WEBDOC_LINKS} \
    SET contenttype = ?, accessstatus = ?, statusmessage = ?, error = ?, analyzedon = ? \
    WHERE url = ? AND hyperlink = ?`;

  const client = cassandraConn.getClient();
  client.execute(query, [
    webDocLinkObj.contenttype,
    webDocLinkObj.accessstatus,
    webDocLinkObj.statusmessage,
    webDocLinkObj.error,
    webDocLinkObj.analyzedon,
    webDocLinkObj.url,
    webDocLinkObj.hyperlink
  ], { prepare: true }, (err, result) => {
    if (err) {
      logger.debug(`Done updating record to ${config.CASSANDRA.TABLE_WEBDOC_LINKS}, ERROR: ${err} RECORD: ${webDocLinkObj}`);
      done(err);
      return;
    }
    logger.debug(`Done updating record to ${config.CASSANDRA.TABLE_WEBDOC_LINKS}, result: ${result}`);
    done(null, result);
  });
}

module.exports = {
  getHyperLinksOfWebDoc,
  saveWebDocLinks,
  updateWebDocLink
}