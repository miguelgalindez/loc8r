var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var theEarth = require('./earth');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	if (typeof content == 'string')
		res.json({
			message: content
		});
	else
		res.json(content);
};

module.exports.locationsCreate = function(req, res) {
	setRequestDataIntoLocation(req, {}, function(location){
		Loc.create(location, function(err, doc) {
			if (err)
				sendJsonResponse(res, 400, err);
			else
				sendJsonResponse(res, 201, doc);
		});	
	});	
};

module.exports.locationsListByDistance = function(req, res) {
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDist = parseFloat(req.query.maxDist);
	var limit=parseInt(req.query.limit);
	if (lng && lat) {
		var options = {
			near: [lat, lng],
			distanceField: 'dist.calculated',
			spherical: true			
		};

		if (maxDist)
			options.maxDistance = theEarth.getRadsFromDistance(maxDist);
		if(limit)
			options.limit=limit;
		Loc.aggregate().near(options).exec(function(err, docs) {
			if (err)
				sendJsonResponse(res, 404, err);
			else {
				processLocationsListByDistance(res, docs);
			}
		});
	} else
		sendJsonResponse(res, 404, 'You must provide the longitude (lng) and latitude (lat).');
};

function processLocationsListByDistance(res, docs) {
	var locations = [];
	docs.forEach(function(location) {
		locations.push({
			distance: theEarth.getDistanceFromRads(location.dist.calculated).toFixed(1),
			name: location.name,
			address: location.address,
			rating: location.rating,
			facilities: location.facilities,
			_id: location._id
		});
	});
	sendJsonResponse(res, 200, locations);
}

module.exports.locationsReadOne = function(req, res) {
	if (req.params && req.params.locationID) {
		Loc.findById(req.params.locationID).exec(function(err, location) {
			if (err)
				sendJsonResponse(res, 404, err);
			else {
				if (location)
					sendJsonResponse(res, 200, location);
				else
					sendJsonResponse(res, 404, "Location not found. Check out the location ID");
			}
		});
	} else
		sendJsonResponse(res, 404, "No location ID in the request");
};


module.exports.locationsUpdateOne = function(req, res) {
	if (req.params.locationID) {		
		Loc.findById(req.params.locationID).select('-reviews -rating').exec(function(err, location) {
			if (err)
				sendJsonResponse(res, 400, err);
			else if (!location)
				sendJsonResponse(res, 404, "Location not found.");
			else {				
				setRequestDataIntoLocation(req, location, function(location){										
					location.save(function(err, location) {
						if (err)
							sendJsonResponse(res, 400, err);
						else
							sendJsonResponse(res, 200, location);
					});
				});								
			}
		});
	} else
		sendJsonResponse(res, 400, "You must specify the location ID");
};


module.exports.locationsDeleteOne = function(req, res) {
	var locationID=req.params.locationID;
	if(locationID){
		Loc.findByIdAndRemove(locationID).exec(function(err, location){
			if(err){
				sendJsonResponse(res, 400, err);
				return;
			}
			sendJsonResponse(res, 204, null);
		});
	}
	else
		sendJsonResponse(res, 400, "You must specify the location ID");
};


module.exports.udpateAverageRating = function(locationID) {
	Loc.findById(locationID).select('rating reviews').exec(function(err, location) {
		if (!err)
			calculateAverageRating(location);
	});
};

var calculateAverageRating = function(location) {
	var i, reviewCount, ratingAverage, ratingTotal;
	if (location.reviews && location.reviews.length > 0) {
		reviewCount = location.reviews.length;
		ratingTotal = 0;
		for (i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + location.reviews[i].rating;
		}
		ratingAverage = parseInt(ratingTotal / reviewCount, 10);
		location.rating = ratingAverage;
		location.save(function(err, location) {
			if (err)
				console.log("Error when trying to update the location rating value. " + JSON.stringify(err));
		});
	}
};

var setRequestDataIntoLocation = function(req, location, callback) {		
	for(var key in req.body)
		location[key] = req.body[key] ? req.body[key] : location[key];

	location.facilities = req.body.facilities ? req.body.facilities.replace(/\s{2,}/g, ' ').split(",").map(function(elem) {
		var aux=elem.trim();
		return aux.substring(0,1).toUpperCase()+aux.substring(1);
	}) : location.facilities;	

	location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];

	location.openingTimes = [{
		days: req.body.days1,
		opening: req.body.opening1,
		closing: req.body.closing1,
		closed: req.body.closed1,
	}, {
		days: req.body.days2,
		opening: req.body.opening2,
		closing: req.body.closing2,
		closed: req.body.closed2,
	}];	
	callback(location);
};
