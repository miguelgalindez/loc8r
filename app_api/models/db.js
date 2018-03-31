var mongoose = require('mongoose');
var dbURI=process.env.NODE_DB;

if(!dbURI)
	dbURI='mongodb://localhost/loc8r';

var options={
	reconnectTries: Number.MAX_VALUE,
	reconnectInterval: 3000
}

mongoose.connect(dbURI, options);


mongoose.connection.on('connected', function() {
	console.log('Mongoose conected to: ' + dbURI);
});

mongoose.connection.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconected');
});

var gracefulShutdown = function(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

process.once('SIGUSR2', function() {
	gracefulShutdown('Nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	});
});

process.on('SIGINT', function() {
	gracefulShutdown('App termination', function() {
		process.exit(0);
	});
});

process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app shutdown', function() {
		process.exit(0);
	});
});

require('./locations');