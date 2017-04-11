const parseString = require('xml2js').parseString;
const request = require('request');
const throttledRequest = require('throttled-request')(request);


throttledRequest.configure({
  requests: 5,
  milliseconds: 1000
});


const ZILLOW_API_KEY = '<YOUR KEY HERE>';

function getPropertyValue(zillowAPIKey, address, citystatezip, onRequestDone) {
  throttledRequest({
      url: 'http://www.zillow.com/webservice/GetSearchResults.htm',
      qs: {
        'zws-id': zillowAPIKey,
        'address': address,
        'citystatezip': citystatezip
      }}, 
    
    function(error, response, body) {
      if (error) {
        onRequestDone(error, null);
      }

      parseString(body, {explicitArray: false}, function (err, result) {
          onRequestDone(null, result['SearchResults:searchresults'].response.results.result.zestimate.amount['_']);
      });
    }
  );
}

getPropertyValue(ZILLOW_API_KEY, '2114 Bigelow Ave', 'Seattle, WA', function(error, data) {
  if (error) throw error;
  console.log(data);
});

 //dan@pubnub.com



