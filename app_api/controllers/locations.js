var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

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
	sendJsonResponse(res, 200, "Success");
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