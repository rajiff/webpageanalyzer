const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const logger = require('./logger');

let app = express();

// Configure morgan to log your requests, with a standard date & time format
morgan.token('time', (req, res) => new Date().toISOString());
app.use(morgan('[:time] :remote-addr :method :url :status :res[content-length] :response-time ms'));

// Setup bodyParsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initilise the db after some rudimentary middleware finished
// const mongoConn = require('./mongoConnection')();
const cassandraConnection = require('./cassandraConnection');
cassandraConnection.initlizeDB((err, result) => {
  if (err) {
    logger.fatal("Error with DB initialization, aborting...!");
    process.exit(1);
  }
  logger.info("DB initialization OK..!");
});

// Mount the APIs specific to version
app.use('/api/v1', require('./api/v1'));
// app.use(require('./api/v1'));

module.exports = app;