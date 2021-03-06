require('newrelic');

var express = require('express');
var locations = require('./routes/locations');
var http = require('http');
var path = require('path');
var socketIo = require('socket.io');
var db = require('./db');
var config = require('./config');

var app = express();

var io;

// auth middleware
var auth = function(req, res, next) {
    if (!req.headers.token ||
        req.headers.token != config.token) {
        return res.json(403, { error: { message: 'Invalid auth token' } });
    }

    next();
}

db.sequelize.sync()
.then(function() {
    console.log('database sync complete!');

    // all environments
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());

    // development only
    if ('development' == app.get('env')) {
      app.use(express.errorHandler());
    }

    // add socket io object to all requests
    app.all('*', function(req, res, next) {
        req.io = io;
        next();
    });

    app.get('/', function(req, res, next) {
        res.redirect('/map.html');
    });

    app.get('/locations', locations.list);
    app.post('/locations', auth, locations.create);

    app.set('port', process.env.PORT || 8000);

    var server = http.createServer(app);
    io = socketIo.listen(server);

    server.listen(app.get('port'), function() {
      console.log('Express server listening on port ' + app.get('port'));
    });

    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});
