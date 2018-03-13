module.exports.homeList=function(req, res){
	res.render('locations-list', {
		locations: [
			{
				name: 'StarCups',
				address: '125 High Street, Reading, RG6 1PS',
				rating: 3,
				facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
				distance: '100m'
			},
			{
				name: 'Cafe Hero',
				address: '125 High Street, Reading, RG6 1PS',
				rating: 4,
				facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
				distance: '200m'
			},
			{
				name: 'Burger Queen',
				address: '125 High Street, Reading, RG6 1PS',
				rating: 2,
				facilities: ['Food', 'Premium wifi'],
				distance: '250m'
			},
			{
				name: 'Doña Rosa',
				address: 'FIET- Unicauca',
				rating: 5,
				facilities: ['Empanadas', 'Tintos', 'Las hijas de doña rosa'],
				distance: '40m'
			}
		]
	});
};

module.exports.locationInfo=function(req, res){
	res.render('location-info', {title: 'Home'});
};

module.exports.addReview=function(req, res){
	res.render('location-review-form', {title: 'Add Review'});
};