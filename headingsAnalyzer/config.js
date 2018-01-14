let config = {
  WWW_PORT: (process.env.PORT || 8020),
  CASSANDRA: {
    CASSANDRA_HOST_POINTS: [(process.env.CASSANDRA_HOST || '192.168.99.100')],
    KEYSPACE_WEBDOC_HEADINGS: (process.env.CASSANDRA_KEYSPACE_WEBDOC_HEADINGS || 'webdocuments_headings')
  },
  REDIS: {
    // URL format: [redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
    REDIS_URL: (process.env.REDIS_URL || 'redis://192.168.99.100:6379/')
  },
  EVENTS: {
    WEBDOCUMENT_METADTA_EXTRACTED: "WEBDOCUMENT_METADTA_EXTRACTED"
  }
}

config.CASSANDRA.TABLE_WEBDOC_HEADINGS = `${config.CASSANDRA.KEYSPACE_WEBDOC_HEADINGS}.webdoc_headings`

module.exports = config;