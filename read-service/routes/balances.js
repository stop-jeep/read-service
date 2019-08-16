var express = require('express');
var request = require('request');
var router = express.Router();

/* GET users listing. */
router.get('/:userId/balances', function (req, res, next) {
    var userId = req.params.userId;
    let requestDateTime = new Date(req.query.dateTime)
    var getProjectionUrl = 'http://34.87.47.20:2113/projection/user_{userId}_projection/state';
    var getAllEventUrl = 'http://34.87.47.20:2113/streams/stop-jeep/head/backward/4096?embed=body'
    getProjectionUrl = getProjectionUrl.replace('{userId}',userId);

    console.log(getProjectionUrl);
    if(requestDateTime != "Invalid Date") {
      const options = {
        url: getAllEventUrl,
        headers: {
          'Accept': 'application/vnd.eventstore.atom+json'
        }
      };
      request(options,
          function (error, response, body) {
            console.log("start calculate")
            var events = JSON.parse(body).entries
            if (!error && response.statusCode == 200) {
              var sum = 0;
              var size = events.length;
              console.log(size)

              var start = Date.now()
              for(var i = size-1 ; i >=0 ; i--){
                let date = new Date(events[i].updated)
                if(date < requestDateTime) {
                  const eventData = JSON.parse(events[i].data)
                  sum += eventData.amount
                }
                else {
                  break;
                }

              }
              var end = Date.now()
              console.log(end - start)
              res.send({
                totalBalance: sum
              });
            } else {
              res.send('user not found');
            }
          })
    }

    else {
      request(getProjectionUrl,
          function (error, response, body) {
            if (!error && response.statusCode == 200) {
              console.log(body);
              res.send(body);
            } else {
              res.send('user not found');
            }
          })
    }

});

async function loop(){

}
module.exports = router;