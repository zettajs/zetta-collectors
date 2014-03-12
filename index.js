var Elroy = require('elroy-cloud');
var Server = new Elroy();
var UG = require('usergrid');
var Splunk = require('splunkstorm');

var apigee = new UG.client({
  orgName:'mtraining',
  appName:'sandbox'
});

var API_KEY = process.env.API_KEY;
var PROJECT_ID = process.env.PROJECT_ID;

var logger = new Splunk.Log(API_KEY, PROJECT_ID);

Server.collector('photosensor/value', function(data) {
  var o = {
    type: '_elroylogs', 
    data: {type: 'photosensor/value', data: data }
  };

  apigee.createEntity(o, function(err, res) {
    if(err) {
      console.log('Error:', res);
    } else {
      console.log('Collected');
    }
  });
});

Server.collector('photosensor/value', function(data) {
  logger.send(JSON.stringify({type: 'photosensor/value', data:data}));
});

Server.collector(function(data) {
  var o = {
    type: '_elroylogs', 
    data: data 
  };

  apigee.createEntity(o, function(err, res) {
    if(err) {
      console.log('Error:', res);
    } else {
      console.log('Collected');
    }
  });
});

Server.collector(function(data) {
  logger.send(JSON.stringify(data));
});



Server.listen(process.env.PORT || 3000);
