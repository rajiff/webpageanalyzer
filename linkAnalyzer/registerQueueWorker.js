const async = require('async');
const redis = require("redis");
const config = require("./config");
const logger = require("./logger");

const registerQueueWorker = function(queueName, worker) {
  // Connect to messaging service
  // Pop message from the specific queue
  // When message is received, invoke the worker
  // Keep doing that

  async.waterfall([
    createClient.bind(null, config.REDIS.REDIS_URL),
    subscribeToQueue.bind(null, queueName, worker)
  ], (err, result) => {
    if (err) logger.error("Error in listening for queue worker messages, ERROR::", err);
  })
}

const subscribeToQueue = function(queueName, worker, client, next) {
  // Keep checking if any message is in the queue
  setInterval(() => {
    client.brpop(queueName, 1, (err, message) => {
      process.stdout.write(".");
      if(err) {
        logger.error("Error in poping message from message queue, ERROR::", err);
        return;
      }
      if (message) {
        logger.debug("Popped a message ", message);
        message = JSON.parse(message[1]);
        worker(message, (err, result) => {
          if (err) {
            logger.error("Worker returned error ", err);
          }
          logger.info(`Worker finished WITH ${(!err)?'OUT':''} errors`);
        })
      }
    });
  }, 1000);
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

      process.exit(1);
    }
  });

  next(null, client);
}

module.exports = registerQueueWorker;