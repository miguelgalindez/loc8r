var request = require('request');

var apiOptions = {
	server: process.env.NODE_ENV === 'production' ? '' : "http://localhost:3000"
};

var renderHome = function(req, res, locations) {
	var message;
	if(!(locations instanceof Array)){
		message= {
			class: "danger",
			text: "API lookup error."
		};
		locations= [];
	}
	else if(!locations.length){
		message={
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
	res.render('location-info', {
		title: 'Home'
	});
};

module.exports.addReview = function(req, res) {
	res.render('location-review-form', {
		title: 'Add Review'
	});
};