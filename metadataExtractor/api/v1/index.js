const router = require('express').Router();

router.use('/webdocuments/', require('./webdocuments'));

module.exports = router;