const insertWebDocument = function(newWebDocObj, {upsert}, done) {
	done(null, {OK: 1});
}

const getAllWebDocument = function({order, page, limit}, done) {
	done(null, {OK: 1});
}

const findWebDocumentByURL = function(docURL, done) {
	done(null, {OK: 1});
}

module.exports = {
	insertWebDocument,
	getAllWebDocument,
	findWebDocumentByURL
}