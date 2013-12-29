var Locations = require('../db').Locations;

module.exports = {
	create: function(req, res, next) {
		if (!req.body.latitude ||
			!req.body.longitude) {
			res.json(400, { 
				error: { 
					message: 'Missing required parameters: latitude and/or longitude'
				}
			});
		}

		// store latitude and longitude
		var location = Locations.model.build(req.body);

		location.save()
		.then(function() {
			res.json(201, {});

			// transmit location info to frontend
			req.io.sockets.emit('location', {
				lat: req.body.latitude,
				lon: req.body.longitude
			});
		},
		function(err) {
			console.log('error saving location: ', err);
		});
	},

	list: function(req, res, next) {
		Locations.model.findAll({ limit: 50, order: 'created_at DESC' })
		.then(function(locations) {
			res.json(200, locations);
		},
		function(err) {
			res.json(500, err);
		});
	}
}
