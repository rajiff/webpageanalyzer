const cassandra = require('cassandra-driver');
const config = require('./config');
const logger = require('./logger');
const async = require('async');

// Standardizes and isolates the client creation in one module, so that we can control the hosts, keyspace etc., to be consistent
const getClient = function() {
  const client = new cassandra.Client({
    contactPoints: config.CASSANDRA.CASSANDRA_HOST_POINTS
  });

  return client;
}

/*
 * callback is optional
 */
const createKeyspace = function(done) {
  const client = getClient();
  // Create keyspace for a simple standalone (SimpleStrategy) cassandra node
  const query = `CREATE KEYSPACE IF NOT EXISTS ${config.CASSANDRA.KEYSPACE_WEBDOC_METDATA} WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '2' }`;
  client.execute(query, (err, result) => {
    if (err) {
      logger.error("Error in connection to cassandra, ERROR::", err);
      if (done) done(err);
      return;
    }
    logger.info("Connection, Keyspace OK, connected to ", result.info.queriedHost);
    if (done) done(null, result);
  });
}

/*
 * callback is optional
 */
const createTables = function(done) {
  let script = `CREATE TABLE IF NOT EXISTS ${config.CASSANDRA.TABLE_WEBDOC_METADATA} ( \
    url text, \
    htmlversion text, \
    title text, \
    htmldoc text, \
    contenttype text, \
    accessstatus text, \
    statusmessage text, \
    error text, \
    submittedon timestamp, \
    analyzedon timestamp, \
    PRIMARY KEY (url) \
  )`;
  const client = getClient();

  client.execute(script, (err, result) => {
    if (err) {
      logger.error("Error in creating table, ERROR::", err);
      if (done) done(err);
      return;
    }
    logger.debug('Done creating table..!');
    return done(null, result);
  });
}

const initlizeDB = function(done) {
  async.waterfall([
    createKeyspace,
    (r, cb) => { createTables(cb); }
  ], (err, result) => {
    if (done) done(err, result);
  })
}

module.exports = {
  getClient,
  createKeyspace,
  initlizeDB
}