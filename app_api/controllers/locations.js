var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var theEarth = require('./earth');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	if(typeof content == 'string')
		res.json({message: content});
	else
		res.json(content);
};

module.exports.locationsCreate = function(req, res) {
	Loc.create({
		name: req.body.name,
		address: req.body.address,
		rating: req.body.rating,
		facilities: req.body.facilities,
		coords: [req.body.lng, req.body.lat],
		openingTimes: [{
			days: req.body.days1,
			opening: req.body.opening1,
			closing: req.body.closing1,
			closed: req.body.closed1 == 'true'
		},{
			days: req.body.days2,
			opening: req.body.opening2,
			closing: req.body.closing2,
			closed: req.body.closed2 == 'true'
		}]
	}, function(err, doc){
		if(err)
			sendJsonResponse(res, 400, err);
		else
			sendJsonResponse(res, 200, doc);
	});
};

module.exports.locationsListByDistance=function(req, res){
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDist = parseFloat(req.query.maxDist);
	if(lng && lat){
		var options={
			near: [lng, lat],			
			distanceField: 'dist.calculated',			
			spherical: true,
			limit:2
		};

		if(maxDist)
			options.maxDistance=theEarth.getRadsFromDistance(maxDist);		
		Loc.aggregate().near(options).exec(function(err, docs){
			if(err)
				sendJsonResponse(res, 404, err);
			else{								
				processLocationsListByDistance(res, docs);
			}
		});
	}
	else
		sendJsonResponse(res, 404, 'You must provide the longitude (lng) and latitude (lat).');	
};

function processLocationsListByDistance(res, docs){
	var locations=[];	
	docs.forEach(function(location){
		locations.push({
			distance: theEarth.getDistanceFromRads(location.dist.calculated),
			name: location.name,
			address: location.address,
			rating: location.rating,
			facilities: location.facilities,
			_id: location._id
		});
	});
	sendJsonResponse(res, 200, locations);
}

module.exports.locationsReadOne=function(req, res){
	if(req.params && req.params.locationID){
		Loc.findById(req.params.locationID).exec(function(err, location){
			if(err)
				sendJsonResponse(res, 404, err);
			else{
				if(location)
					sendJsonResponse(res, 200, location);
				else
					sendJsonResponse(res, 404, "Location not found. Check out the location ID");
			}
		});	
	}
	else
		sendJsonResponse(res, 404, "No location ID in the request");
};

module.exports.locationsUpdateOne=function(req, res){
	sendJsonResponse(res, 200, "Success");
};
module.exports.locationsDeleteOne=function(req, res){
	sendJsonResponse(res, 200, "Success");
};


module.exports.udpateAverageRating = function(locationID){
	Loc.findById(locationID).select('rating reviews').exec(function(err, location){
		if(!err)
			calculateAverageRating(location);
	});
};

var calculateAverageRating = function(location){
	var i, reviewCount, ratingAverage, ratingTotal;
	if(location.reviews && location.reviews.length>0){		
		reviewCount=location.reviews.length;
		ratingTotal = 0;		
		for (i = 0; i < reviewCount; i++) {
			ratingTotal = ratingTotal + location.reviews[i].rating;
		}		
		ratingAverage=parseInt(ratingTotal/reviewCount, 10);
		location.rating = ratingAverage;		
		location.save(function(err, location){
			if(err)
				console.log("Error when trying to update the location rating value. "+JSON.stringify(err));
		});		
	}
};