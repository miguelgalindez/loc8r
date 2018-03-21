var mongoose = require('mongoose');
var dbURI=process.env.NODE_DB;
if(!dbURI)
	dbURI='mongodb://localhost/loc8r';
mongoose.connect(dbURI);

/*
var dbURIlog = 'mongodb://localhost/Loc8rLog';
var logDB = mongoose.createConnection(dbURIlog);
logDB.on('connected', function () {
	console.log('Mongoose connected to ' + dbURIlog);
});
logDB.close(function () {
	console.log('Mongoose log disconnected');
});
*/

mongoose.connection.on('connected', function() {
	console.log('Mongoose conected to: ' + dbURI);
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