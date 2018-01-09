let config = {
	MONGO: {
		MONGO_URL: (process.env.MONGO_URL || 'mongodb://localhost:27017/webpageanalyzer')
	}
}

module.exports = config;