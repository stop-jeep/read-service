var express = require('express');
var request = require('request');
var router = express.Router();

/* GET users listing. */
router.get('/:userId/balances', function (req, res, next) {
    var userId = req.params.userId;
    var getProjectionUrl = 'http://34.87.47.20:2113/projection/user_{userId}_projection/state';
    getProjectionUrl = getProjectionUrl.replace('{userId}',userId);

    console.log(getProjectionUrl);

    request(getProjectionUrl,
        function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body);
                res.send(body);
            } else {
                res.send('user not found');
            }
        })
});

module.exports = router;