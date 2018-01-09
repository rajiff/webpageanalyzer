const router = require('express').Router();
const webDocCtrl = require('./webDocuments.controller');


/**
 *
 * Create a new instance of WebDocument
 *
 * Can support for multiple WebDocuments, currently only one document object per request
 *
 */
router.post('/', function(req, res) {
  try {
    let newWebDocObj = req.body;

    if(!newWebDocObj) {
      res.status(400).send({ error: 'Invalid request data..!' });
      return;
    }

    let options = { upsert: true };
    webDocCtrl.insertWebDocument(newWebDocObj, options, function(err, result) {
      if (err) {
        console.error('Error in inserting web doc, ERROR::', err);
        res.status(400).send({ error: 'Something went wrong, please check and tray again..!' });
        return;
      }
      res.send(result);
      return;
    })
  } catch (err) {
    console.error('Unexpected error in inserting web doc, ERROR::', err);
    res.status(500).send({ error: 'Unexpected internal error, please try later..!' });
    return;
  }
});

/**
 *
 * Fetch all web documents in the system, sorted & paginated
 *
 * Can support additional filters
 *
 */
router.get('/', function(req, res) {
  try {
    let options = { order: -1, page: 1, limit: 10 };
    webDocCtrl.getAllWebDocument(options, function(err, result) {
      if (err) {
        console.error('Error in fetching web docs, ERROR::', err);
        res.status(400).send({ error: 'Something went wrong, please check and tray again..!' });
        return;
      }
      res.send(result);
      return;
    })
  } catch (err) {
    console.error('Unexpected error in fetching web docs, ERROR::', err);
    res.status(500).send({ error: 'Unexpected internal error, please try later..!' });
    return;
  }
});

module.exports = router;