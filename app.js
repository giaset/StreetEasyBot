var request = require('request')
var api_key = '43082604af0364179cad876bc71702805ec719e3'
var criteria = 'area:downtown-manhattan|status:open|price:-2500|no_fee:1|beds<=1'
var url = 'http://streeteasy.com/nyc/api/rentals/data?key='+api_key+'&format=json&criteria='+criteria

// PERFORM FIRST FETCH
fetch_listings()

// THEN FETCH EVERY MINUTE
setInterval(function() {
	fetch_listings()
}, 60 * 1000)

function fetch_listings() {
	request(url, function (error, response, body) {
		console.log(JSON.parse(body))
	})
}