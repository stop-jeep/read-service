var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:userId/balances', function(req, res, next) {
  res.send(req.params.userId);
});

module.exports = router;
