let config = {
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
    WEBDOCUMENT_LINK_EXTRACTED: "WEBDOCUMENT_LINK_EXTRACTED"
  },
  WEB_DOC_REQ_TIMEOUT: 10000,
  WEB_DOC_REQ_DEADLINE: 30000,
  WEB_DOC_REQ_MAX_REDIRECTS: 3,
  WEB_DOC_REQ_MAX_RETRY: 2
}

config.CASSANDRA.TABLE_WEBDOC_LINKS = `${config.CASSANDRA.KEYSPACE_WEBDOC_HYPERLINKS}.webdoc_links`

module.exports = config;