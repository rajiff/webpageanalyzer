# webpageanalyzer
Small app for analyse web pages, in a scalable way using microservices approach

### How to build in your local

Run these commands in these sequence

#### Clone the repo

	git clone https://github.com/rajiff/webpageanalyzer.git

#### currently only metadata extractor component is done and can run
You need Cassandra, Redis running in your local environment
set the environment variables `CASSANDRA_HOST` and `REDIS_URL` to point to your servers
You can webpageanalyzer/metadataExtractor/config.js to check out the variables, you can override via environment variables

	cd webpageanalyzer/metadataExtractor

#### Install dependencies

	yarn

#### Run the application, so that it initilizes DB and stop it after it says DB is initilized (will see a better way later)

	npm start
	Ctrl+C

#### Now run the extractor in another terminal

	npm run extract

#### Now run the test cases, it will run all the test cases and also will feed a URL to extractor, which gets analyzed for metadata

	npm test
