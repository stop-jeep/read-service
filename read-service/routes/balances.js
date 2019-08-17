var express = require('express');
var request = require('request');
var router = express.Router();
var axios = require('axios');

/* GET users listing. */
router.get('/:userId/balances', async function (req, res, next) {
    var userId = req.params.userId;
    let requestDateTime = new Date(req.query.dateTime)
    var getProjectionUrl = 'http://34.87.47.20:2113/projection/user_{userId}_projection/state';
    var getAllEventUrl = 'http://34.87.47.20:2113/streams/stop-jeep/head/backward/4096?embed=body'
    getProjectionUrl = getProjectionUrl.replace('{userId}',userId);

    console.log(getProjectionUrl);
    if(requestDateTime != "Invalid Date") {

      var headers = {
        'Accept': 'application/vnd.eventstore.atom+json'
      };

      var totalEvents = []
      while(getAllEventUrl != undefined){

        console.log(getAllEventUrl)
        console.log("start collecting events")

        let body = await axios.get(getAllEventUrl, { headers });

        var responseBody = body.data
        var events = responseBody.entries

        totalEvents = totalEvents.concat(events)

        let nextLinkBody = responseBody.links.find(link => link.relation === 'next');
        if(nextLinkBody === undefined)
          getAllEventUrl = undefined
        else
          getAllEventUrl = nextLinkBody.uri+"?embed=body";

      }
      console.log("start calculate")

      var sum = 0;
      var size = totalEvents.length;
      for(var i = size-1 ; i >=0 ; i--){
        let date = new Date(totalEvents[i].updated)
        const eventData = JSON.parse(totalEvents[i].data)
        console.log(eventData.account_id)
        if(userId === eventData.account_id) {
          if (date < requestDateTime) {
            sum += eventData.amount
          } else {
            break;
          }
        }

      }
      res.send({
        totalBalance: sum
      });
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