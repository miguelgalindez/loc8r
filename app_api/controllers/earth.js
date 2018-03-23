var earthRadius = 6371;

module.exports.getDistanceFromRads = function(rads) {
	return parseFloat(rads * earthRadius);
};

module.exports.getRadsFromDistance = function(distance) {
	return parseFloat(distance / earthRadius);
};