var request = require('request')
var api_key = '43082604af0364179cad876bc71702805ec719e3'
var criteria = 'area:downtown-manhattan|price:-2500|no_fee:1|beds<=1'
var url = 'http://streeteasy.com/nyc/api/rentals/search?limit=9999&key='+api_key+'&format=json&criteria='+criteria

var last_fetched_id = 0

// perform first fetch
fetch_listings()

// then fetch every minute
setInterval(function() {
	fetch_listings()
}, 60 * 1000)

function fetch_listings() {
	console.log('Fetching new listings...')
	request(url, function (error, response, body) {
		var listings = JSON.parse(body).listings.object
		console.log('All done! There are '+listings.length+' listings total.')

		// sort by decreasing order of id (i.e. newest listing first)
		listings.sort(decreasing_ids)

		if (last_fetched_id == 0) {
			var newestListing = listings[0].rental
			last_fetched_id = newestListing.id
			post_listing_to_slack(newestListing)
		} else {
			for (var i in listings) {
				var listing = listings[i].rental

				if (listing.id > last_fetched_id) {
					post_listing_to_slack(listing)
				}
			}
		}
	})
}

function post_listing_to_slack(listing) {
	// manually build listing url
	// ex: http://streeteasy.com/building/336-east-15-street-new_york/2
	var listing_url = 'http://streeteasy.com/building/'+listing.building_idstr+'/'+listing.addr_unit_idstr

	console.log('New listing found! '+listing_url)

	var webhook_url = 'https://hooks.slack.com/services/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'
	var message = 'Hey @giaset, I found a new listing on StreetEasy for you: '+listing_url
	var body = {json: {text: message, 'link_names': 1}}

	request.post(webhook_url, body, function (error, response, body) {

	})
}

function decreasing_ids(a, b) {
	if (a.rental.id < b.rental.id) {
		return 1
	}
	if (a.rental.id > b.rental.id) {
		return -1
	}
	return 0
}
