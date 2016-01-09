var request = require('request')
var api_key = '43082604af0364179cad876bc71702805ec719e3'
var criteria = 'area:downtown-manhattan|price:-2500|no_fee:1|beds<=1'
var url = 'http://streeteasy.com/nyc/api/rentals/search?limit=9999&key='+api_key+'&format=json&criteria='+criteria

// perform first fetch
fetch_listings()

// then fetch every minute
setInterval(function() {
	fetch_listings()
}, 60 * 1000)

function fetch_listings() {
	request(url, function (error, response, body) {
		var listings = JSON.parse(body).listings.object

		// sort by decreasing order of id (i.e. newest listing first)
		listings.sort(function (a, b) {
			if (a.rental.id < b.rental.id) {
				return 1
			}
			if (a.rental.id > b.rental.id) {
				return -1
			}
			return 0
		})

		for (var i in listings) {
			var listing = listings[i].rental

			// manually build listing url
			// ex: http://streeteasy.com/building/336-east-15-street-new_york/2
			var listing_url = 'http://streeteasy.com/building/'+listing.building_idstr+'/'+listing.addr_unit_idstr

			console.log(listing_url)
		}
	})
}
