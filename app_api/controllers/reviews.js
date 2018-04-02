var mongoose = require('mongoose');
var Loc = mongoose.model('Location');
var ctrlLocations = require('./locations');

var sendJsonResponse = function(res, status, content) {
	res.status(status);
	if (typeof content == 'string')
		res.json({
			message: content
		});
	else
		res.json(content);
};


module.exports.reviewsCreate = function(req, res) {	
	var locationID = req.params.locationID;
	if (locationID) {
		Loc.findById(locationID).select('reviews').exec(function(err, location) {
			if (err)
				sendJsonResponse(res, 400, err);
			else
				addReview(req, res, location);
		});
	} else {
		sendJsonResponse(res, 400, "You must specify the location ID which the review will be added to.");
	}
};

function addReview(req, res, location) {
	if (location) {
		setRequestDataIntoReview(req, {}, function(review){	
			location.reviews.push(review);
			location.save(function(err, loc) {
				if (err)
					sendJsonResponse(res, 400, err);
				else {
					ctrlLocations.udpateAverageRating(loc._id);
					sendJsonResponse(res, 201, loc.reviews[loc.reviews.length - 1]);
				}
			});
		});

	} else
		sendJsonResponse(res, 404, "Location not found.");
}

module.exports.reviewsReadAll = function(req, res) {
	if (req.params.locationID) {
		Loc.findById(req.params.locationID).select("reviews").exec(function(err, location) {
			if (err)
				sendJsonResponse(res, 400, err);
			else {
				if (location.reviews && location.reviews.length > 0)
					sendJsonResponse(res, 200, location.reviews);
				else
					sendJsonResponse(res, 404, "Reviews not found for the location specified");
			}
		});
	} else
		sendJsonResponse(res, 400, "You must specify the location ID");
};

module.exports.reviewsReadOne = function(req, res) {
	if (req.params && req.params.locationID && req.params.reviewID) {
		Loc.findById(req.params.locationID)
			.select("name reviews")
			.exec(function(err, location) {
				if (!location) {
					sendJsonResponse(res, 404, "Location not found");
					return;
				} else if (err) {
					sendJsonResponse(res, 400, err);
					return;
				}
				if (location.reviews && location.reviews.length > 0) {
					var review = location.reviews.id(req.params.reviewID);
					if (!review) {
						sendJsonResponse(res, 404, "Review not found");
					} else {
						var response = {
							location: {
								name: location.name,
								id: req.params.locationID
							},
							review: review
						};
						sendJsonResponse(res, 200, response);
					}
				} else {
					sendJsonResponse(res, 404, "No reviews found");
				}

			});
	} else
		sendJsonResponse(res, 404, "Not found, locationID and reviewID are both required");
};

module.exports.reviewsUpdateOne = function(req, res) {
	var locationID=req.params.locationID;
	var reviewID=req.params.reviewID;
	if(locationID && reviewID){
		Loc.findById(locationID).select("reviews").exec(function(err, location){
			if(err)
				sendJsonResponse(res, 400, err);
			else if(!location)
				sendJsonResponse(res, 404, "Location not found");
			else{
				if(location.reviews && location.reviews.length>0){
					var review=location.reviews.id(reviewID);
					if(review){
						setRequestDataIntoReview(req, review, function(review){
							location.save(function(err, location){
								if(err)
									sendJsonResponse(res, 400, err);
								else{
									sendJsonResponse(res, 201, review);
									ctrlLocations.udpateAverageRating(location._id);
								}
							});
						});
					}
					else
						sendJsonResponse(res, 404, "Review not found");	
				}
				else
					sendJsonResponse(res, 404, "Review not found");
			}
		});
	}
	else
		sendJsonResponse(res, 400, "You must specify both the location ID and review ID");
};

module.exports.reviewsDeleteOne = function(req, res) {
	var locationID=req.params.locationID;
	var reviewID=req.params.reviewID;
	if(locationID && reviewID){
		Loc.findById(locationID).select("reviews").exec(function(err, location){
			if(err)
				sendJsonResponse(res, 400, err);
			else if(!location)
				sendJsonResponse(res, 404, "Location not found");
			else{
				var review=location.reviews.id(reviewID);
				if(review){
					review.remove();
					location.save(function(err, location){
						if(err)
							sendJsonResponse(res, 400, err);
						else{							
							sendJsonResponse(res, 204, null);
							ctrlLocations.udpateAverageRating(location._id);
						}
					});
				}
				else
					sendJsonResponse(res, 404, "Review not found");
			}

		});
	}
	else
		sendJsonResponse(res, 400, "You must specify both the location ID and review ID");
};

var setRequestDataIntoReview = function(req, review, callback) {
	for (var key in req.body)
		review[key] = req.body[key] ? req.body[key] : review[key];
	callback(review);
};