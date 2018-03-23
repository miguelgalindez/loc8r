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
	sendJsonResponse(res, 200, "Success");
};
module.exports.locationsListByDistance=function(req, res){
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDist = parseInt(req.query.maxDist);
	if(lng && lat){
		var options={
			center: [lng, lat],
			spherical: true
		};

		if(maxDist)
			options.maxDistance=maxDist;	
		Loc.find().where('coords').near(options).exec(function(err, doc){
			if(err)
				sendJsonResponse(res, 404, err);
			else
				sendJsonResponse(res, 200, doc);
		});
	}
	else
		sendJsonResponse(res, 404, 'You must provide the longitude (lng) and latitude (lat).');	
};

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