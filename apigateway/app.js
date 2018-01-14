const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const logger = require('./logger');
const httpProxy = require('http-proxy-middleware');

let app = express();

// Configure morgan to log your requests, with a standard date & time format
morgan.token('time', (req, res) => new Date().toISOString());
app.use(morgan('[:time] :remote-addr :method :url :status :res[content-length] :response-time ms'));

// Setup bodyParsing middleware
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

app.use('/hello', (req, res) => {
	res.send("Howdy...!");
});

// Simple http proxy with rewrite path logic, to simulate a API gateway
proxyMetadata = httpProxy({target: 'http://localhost:8000', pathRewrite: {'^/metadata/' : '/'}});
app.use('/metadata/', proxyMetadata);

proxyDocLinks = httpProxy({target: 'http://localhost:8010', pathRewrite: {'^/doclinks/' : '/'}});
app.use('/doclinks/', proxyDocLinks);

proxyDocHeadings = httpProxy({target: 'http://localhost:8020', pathRewrite: {'^/docheadings/' : '/'}});
app.use('/docheadings/', proxyDocHeadings);

app.use((req, res) => {
	res.status(404).send({message: 'Resource not found..!'});
});

module.exports = app;