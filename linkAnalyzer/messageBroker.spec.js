const chai = require('chai');
const config = require('./config');
const redis = require("redis");
const expect = chai.expect;
const messageBroker = require('./messageBroker');
const logger = require('./logger');

describe('MessageBroker publish', function() {

  it('Published message should be received by subscribing client, message structure should be full', function(done) {
    let channel = evenName = "CH-FOO";
    let msgCount = 0;

    sub = redis.createClient(config.REDIS.REDIS_URL);
    sub.on("error", function(err) {
      if (err)
        logger.error("Error with Redis ", err);
    });

    sub.subscribe(channel);

    sub.on("subscribe", function(channel, count) {
      messageBroker.publishEvent(evenName, "I am sending a message One");
      messageBroker.publishEvent(evenName, "I am sending a message Two");
      messageBroker.publishEvent(evenName, "I am sending a message Three");
    });

    sub.on("message", function(chn, message) {
    	logger.debug("Received message from channel: ", chn, " message: ", message);
      if (channel === chn) {
        ++msgCount;

        logger.debug("Msg: ", msgCount, " MESSAGE::", message);

        if (msgCount === 3) {
          sub.unsubscribe();
          sub.quit();
          done();
        }
      }
    });
  });
});