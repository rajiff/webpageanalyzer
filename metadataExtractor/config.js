let config = {
  MONGO: {
    MONGO_URL: (process.env.MONGO_URL || 'mongodb://localhost:27017/webpageanalyzer')
  },
  CASSANDRA: {
    CASSANDRA_HOST_POINTS: [(process.env.CASSANDRA_HOST || '192.168.99.100')],
    KEYSPACE_WEBDOC_METDATA: (process.env.CASSANDRA_KEYSPACE_WEBDOC_METDATA || 'webdocuments_metdata')
  },
  REDIS: {
    // URL format: [redis[s]:]//[[user][:password@]][host][:port][/db-number][?db=db-number[&password=bar[&option=value]]]
    REDIS_URL: (process.env.REDIS_URL || 'redis://192.168.99.100:6379/')
  },
  EVENTS: {
    NEW_WEBDOCUMENT_ADDED: "NEW_WEBDOCUMENT_ADDED",
    WEBDOCUMENT_METADTA_EXTRACTED: "WEBDOCUMENT_METADTA_EXTRACTED"
  },
  WEB_DOC_REQ_TIMEOUT : 10000,
  WEB_DOC_REQ_DEADLINE: 30000,
  WEB_DOC_REQ_MAX_REDIRECTS: 3,
  WEB_DOC_REQ_MAX_RETRY: 2
}

config.CASSANDRA.TABLE_WEBDOC_METADATA = `${config.CASSANDRA.KEYSPACE_WEBDOC_METDATA}.webdoc_metadata`

module.exports = config;