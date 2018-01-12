const chai = require('chai');
const expect = chai.expect;

const extractHyperLinks = require('./extractHyperLinks');
const logger = require('../../../logger');

describe('MessageBroker publish', function() {
	it('Hyperlink extraction from text/html document', function(done) {
		let mockWebDoc = require('./mockWebDoc');
		extractHyperLinks(mockWebDoc, (err, result) => {
			if(err) return done(err);

			console.log("Got result ", result);

			expect(result).to.be.an('array');
			done();
		});
	})
});