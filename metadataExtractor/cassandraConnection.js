const cassandra = require('cassandra-driver');
const config = require('./config');

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
      console.log("Error in connection to cassandra, ERROR::", err);
      if(done) done(err);
      return;
    }
    console.log("Connection, Keyspace OK, connected to ", result.info.queriedHost);
    if(done) done(null, result);
  });
}

module.exports = {
  getClient,
  createKeyspace
}