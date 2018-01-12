let config = {
  MONGO: {
    MONGO_URL: (process.env.MONGO_URL || 'mongodb://localhost:27017/webpageanalyzer')
  },
  CASSANDRA: {
    CASSANDRA_HOST_POINTS: [(process.env.CASSANDRA_HOST || '192.168.99.100')],
    KEYSPACE_WEBDOC_HYPERLINKS: (process.env.CASSANDRA_KEYSPACE_WEBDOC_HYPERLINKS || 'webdocuments_hyperlinks')
  },
  REDIS: {
    // URL format: [redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
    REDIS_URL: (process.env.REDIS_URL || 'redis://192.168.99.100:6379/')
  },
  EVENTS: {
    WEBDOCUMENT_METADTA_EXTRACTED: "WEBDOCUMENT_METADTA_EXTRACTED",
    WEBDOCUMENT_EXTERNAL_LINK_EXTRACTED: "WEBDOCUMENT_EXTERNAL_LINK_EXTRACTED"
  }
}

config.CASSANDRA.TABLE_WEBDOC_LINKS = `${config.CASSANDRA.KEYSPACE_WEBDOC_HYPERLINKS}.webdoc_links`

module.exports = config;