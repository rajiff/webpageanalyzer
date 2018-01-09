let config = {
	MONGO: {
		MONGO_URL: (process.env.MONGO_URL || 'mongodb://localhost:27017/webpageanalyzer')
	},
	CASSANDRA: {
		CASSANDRA_HOST_POINTS: [(process.env.CASSANDRA_HOST || '192.168.99.102')],
		KEYSPACE_WEBDOC_METDATA: (process.env.CASSANDRA_KEYSPACE_WEBDOC_METDATA || 'webdocuments_metdata')
	}
}

module.exports = config;