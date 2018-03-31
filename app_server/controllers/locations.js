var request = require('request');

var apiOptions = {
	server: process.env.NODE_ENV === 'production' ? '' : "http://localhost:3000"
};

var renderHome = function(req, res, locations) {
	var message;
	if (!(locations instanceof Array)) {
		message = {
			class: "danger",
			text: "API lookup error."
		};
		locations = [];
	} else if (!locations.length) {
		message = {
			class: "info",
			text: "No places found nearby"
		};
	}
	res.render('locations-list', {
		locations: locations,
		message: message,
		title: 'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		},
		sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
	});
};

var renderDetailPage = function(req, res, details) {
	res.render('location-info', {
		title: details.name,
		pageHeader: {title: details.name},
		location: details
	});
};

module.exports.homeList = function(req, res) {
	var requestOptions = {
		url: apiOptions.server + '/api/locations',
		method: 'GET',
		json: {},
		qs: {
			lng: 2.4431259,
			lat: -76.6100172
		}
	};

	request(requestOptions, function(err, response, locations) {
		renderHome(req, res, locations);
	});
};

module.exports.locationInfo = function(req, res) {
	var locationID = req.params.locationID;
	if (locationID) {
		var requestOptions = {
			url: apiOptions.server + '/api/locations/' + locationID,
			method: 'GET',
			json:{}
		};		
		request(requestOptions, function(err, response, body) {			
			if (response.statusCode == 200){				
				var coords=body.coords;
				body.coords={
					lng: coords[0].toFixed(6),
					lat: coords[1].toFixed(6)
				};				
				renderDetailPage(req, res, body);
			}
			else
				renderError(req, res, response.statusCode);
		});

	}
};

module.exports.addReview = function(req, res) {
	res.render('location-review-form', {
		title: 'Add Review'
	});
};

var renderError = function(req, res, status) {
	var title, content;
	if (status == 404) {
		title = '404, page not found';
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wrong.";
		content = "Something, somewhere, has gone just a little bit wrong";
	}
	res.status(status);
	res.render('generic-text', {
		title: title,
		content: content
	});
};