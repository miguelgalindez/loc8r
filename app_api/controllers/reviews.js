var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	if(typeof content == 'string')
		res.json({message: content});
	else
		res.json(content);
};


module.exports.reviewsCreate=function(req, res){
	sendJsonResponse(res, 200, "Success");
};

module.exports.reviewsReadOne=function(req, res){
	if(req.params && req.params.locationID && req.params.reviewID){
		Loc.findById(req.params.locationID)
			.select("name reviews")
			.exec(function(err, location){				
				if(!location){
					sendJsonResponse(res, 404, "Location not found");
					return;
				}
				else if(err){
					sendJsonResponse(res, 404, err);
					return;
				}				
				if(location.reviews && location.reviews.length > 0){
					var review=location.reviews.id(req.params.reviewID);
					if(!review){
						sendJsonResponse(res, 404, "Review not found");						
					}
					else{
						var response= {
							location: {
								name: location.name,
								id: req.params.locationID
							},
							review: review
						};
						sendJsonResponse(res, 200, response);
					}
				}
				else{
					sendJsonResponse(res, 404, "No reviews found");
				}

			});
	}
	else
		sendJsonResponse(res, 404, "Not found, locationID and reviewID are both required");
};

module.exports.reviewsUpdateOne=function(req, res){
	sendJsonResponse(res, 200, "Success");
};

module.exports.reviewsDeleteOne=function(req, res){
	sendJsonResponse(res, 200, "Success");
};
