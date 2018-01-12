const async = require('async');
const redis = require("redis");
const config = require("./config");
const logger = require("./logger");

const registerWorker = function(eventName, worker) {
  // Connect to messaging service
  // Listen for the specific event
  // When message is received, invoke the worker
  // Keep doing that

  // For redis, keeping the channel name same as event
  let channel = eventName;

  async.waterfall([
    createClient.bind(null, config.REDIS.REDIS_URL),
    subscribeToChannel.bind(null, channel),
    onMessage.bind(null, channel, worker)
  ], (err, result) => {
    if (err) logger.error("Error in listening for worker messages, ERROR::", err);
  })
}

const onMessage = function(channel, worker, client, next) {
  client.on("message", (chn, message) => {
    logger.debug("Received message from channel: ", chn);

    if (channel !== chn) return;

    message = JSON.parse(message);

    worker(message, (err, result) => {
      if (err) {
        logger.error("Worker returned error ", err);
      }
      logger.info(`Worker finished WITH ${(!err)?'OUT':''} errors`);
    });
  });
}

const subscribeToChannel = function(channel, client, next) {
  client.subscribe(channel);

  client.on("subscribe", (chn, count) => {
    logger.debug(`Subscribed to ${chn}(${count}) and ready..!`);
    next(null, client);
  });
}

const createClient = function(redisURL, next) {
  let client = redis.createClient(redisURL);

  // Register error handler
  client.on("error", (err) => {
    if (err) {
      logger.error("Error with Redis connection, ERROR::", err);

      client.unsubscribe();
      client.quit();

      process.exit(1);
    }
  });

  process.on('SIGINT', function() {
    if (client) {
      logger.info("Quitting messaging subscription..!");

      client.unsubscribe();
      client.quit();
    }
  });

  next(null, client);
}

module.exports = registerWorker;