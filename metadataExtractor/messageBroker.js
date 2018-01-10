const redis = require("redis");
const logger = require("./logger");
const config = require("./config");

const publishEvent = function(eventName, eventPayload, done) {
  reidsClient = redis.createClient(config.REDIS.REDIS_URL);

  reidsClient.on("error", function(err) {
    if (err)
      logger.error("Error with Redis ", err);
  });

  let publishData = JSON.stringify({ event: eventName, payload: eventPayload });
  reidsClient.publish(eventName, publishData, done);

  /*process.on('SIGINT', function() {
  	if(reidsClient) {
  		logger.info("Quitting message broker connection..!");
  		reidsClient.quit();
  	}
  });

  process.on('SIGTERM', function() {
  	if(reidsClient) {
  		logger.info("Quitting on SIGTERM message broker connection..!");
  		reidsClient.quit();
  	}
  });*/
}

module.exports = {
	publishEvent
}