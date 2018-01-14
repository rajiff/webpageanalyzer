const router = require('express').Router();
const webDocHeadingsCtrl = require('./webDocHeadings.controller');
const logger = require('../../../logger');

/**
 *
 * Fetch headings of the specified web documents
 *
 */
router.get('/:url', function(req, res) {
  try {
    let options = {};
    webDocHeadingsCtrl.getHeadingsOfWebDoc(req.params.url, options, function(err, result) {
      if (err) {
        logger.error('Error in fetching headings of a web document, ERROR::', err);
        res.status(400).send({ error: 'Something went wrong, please check and try again..!' });
        return;
      }
      res.send(result);
      return;
    })
  } catch (err) {
    logger.error('Unexpected error in fetching headings of a web document, ERROR::', err);
    res.status(500).send({ error: 'Unexpected internal error, please try later..!' });
    return;
  }
});

module.exports = router;