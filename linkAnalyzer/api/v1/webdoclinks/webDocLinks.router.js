const router = require('express').Router();
const webDocLinkCtrl = require('./webDocLinks.controller');
const logger = require('../../../logger');

/**
 *
 * Fetch hyper links of the specified web documents
 *
 */
router.get('/:url', function(req, res) {
  try {
    let options = {};
    webDocLinkCtrl.getHyperLinksOfWebDoc(req.params.url, options, function(err, result) {
      if (err) {
        logger.error('Error in fetching hyperlinks of a web document, ERROR::', err);
        res.status(400).send({ error: 'Something went wrong, please check and try again..!' });
        return;
      }
      res.send(result);
      return;
    })
  } catch (err) {
    logger.error('Unexpected error in fetching hyperlinks of a web document, ERROR::', err);
    res.status(500).send({ error: 'Unexpected internal error, please try later..!' });
    return;
  }
});

module.exports = router;