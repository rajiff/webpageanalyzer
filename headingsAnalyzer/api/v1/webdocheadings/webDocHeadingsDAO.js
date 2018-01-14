let cassandraConn = require('../../../cassandraConnection');
let async = require('async');
let config = require('../../../config');
let logger = require('../../../logger');

const getHeadingsOfWebDoc = function(webDocURL, { order, page, limit }, done) {
  let query = `SELECT * FROM ${config.CASSANDRA.TABLE_WEBDOC_HEADINGS} WHERE url = ?`;

  const client = cassandraConn.getClient();
  client.execute(query, [webDocURL], (err, result) => {
    if (err) {
      logger.debug(`Error fetching record from ${config.CASSANDRA.TABLE_WEBDOC_HEADINGS}, ERROR: ${err}`);
      done(err);
      return;
    }
    logger.debug(`Done fetching record from ${config.CASSANDRA.TABLE_WEBDOC_HEADINGS}, result: ${result.rows.length}`);
    done(null, result.rows);
  });
}

const saveWebDocHeadings = function(webDocHeadingColln, { upsert }, done) {
  if(!webDocHeadingColln.length) {
    done({error: 'Empty collection cannot be saved..!'});
    return;
  }

  let occurrance = 0; // A running sequence to ensure duplicate headings, won't get overwritten
  let queryColln = webDocHeadingColln.map((docHeading) => {
    docHeading.submittedon = new Date();

    let query = `INSERT INTO ${config.CASSANDRA.TABLE_WEBDOC_HEADINGS} \
    (url, heading, occurrance, headingtext, headingtag, submittedon, analyzedon) \
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

    let params = [
      docHeading.url,
      docHeading.heading,
      ++occurrance,
      docHeading.headingtext,
      docHeading.headingtag,
      new Date(),
      new Date()
    ];

    return {query, params};
  });
  logger.debug("Saving ", queryColln.length, " headings out of ", webDocHeadingColln.length);

  const client = cassandraConn.getClient();
  client.batch(queryColln, { prepare: true }, (err, result) => {
    if (err) {
      logger.debug(`Error saving records to ${config.CASSANDRA.TABLE_WEBDOC_HEADINGS}, ERROR: `, err);
      done(err);
      return;
    }
    logger.debug(`Done saving records to ${config.CASSANDRA.TABLE_WEBDOC_HEADINGS}, result: `, result.rows);
    done(null, result);
  });
}


module.exports = {
  getHeadingsOfWebDoc,
  saveWebDocHeadings
}