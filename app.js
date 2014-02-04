
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var api = require('./routes/api');
var http = require('http');
var path = require('path');

var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/mashapetest');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// Base Routes
app.get('/', routes.index);

// API Routes
app.get('/todos', api.list(db));
app.get('/todos/current', api.current(db));
app.get('/todos/completed', api.completed(db));
app.get('/todos/:id', api.get(db));
app.put('/todos/update/:id', api.update(db));
app.post('/todos/update/:id', api.update(db));
app.put('/todos/toggle-done/:id', api.toggle_done(db));
app.post('/todos/toggle-done/:id', api.toggle_done(db));
app.post('/todos', api.create(db));
app.delete('/todos/delete/:id', api.destroy(db));
app.post('/todos/delete/:id', api.destroy(db));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
