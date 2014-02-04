
var unirest = require('unirest');
var mongo = require('mongodb');
var BSON = mongo.BSONPure;

// Returns all Todos
exports.list = function (db) {
  return function (req, res) {
    var todos = db.get('todos');
    todos.find({}, {}, function (err, doc) {
      res.json(doc);
    });
  };
};

// Returns current [non-completed] Todos
exports.current = function (db) {
  return function (req, res) {
    var todos = db.get('todos');
    todos.find({'done': false}, {}, function (err, doc) {
      res.json(doc);
    });
  };
};

// Returns completed Todos
exports.completed = function (db) {
  return function (req, res) {
    var todos = db.get('todos');
    todos.find({'done': true}, {}, function (err, doc) {
      res.json(doc);
    });
  };
};

// Gets Todo with :id
exports.get = function (db) {
  return function (req, res) {
    var todos = db.get('todos');
    todos.find({
      '_id': new BSON.ObjectID(req.params.id)
    }, {}, function (err, doc) {
      if (err) {
        res.send(404);
      } else {
        res.send(doc);
      }
    });
  };
};

// Creates new Todo
exports.create = function (db) {
  return function (req, res) {
    var todos = db.get('todos');
    todos.insert({
      'title': req.body.title,
      'body': req.body.body,
      'done': false
    }, function (err, doc) {
      res.send(err ? 404 : 200);
      res.location('/');
      res.redirect('/');
    });
  };
};

// Updates Todo with :id
exports.update = function (db) {
  return function (req, res) {
    var todos = db.get('todos');
    todos.update({
      '_id': new BSON.ObjectID(req.params.id)
    }, {
      'title': req.body.title,
      'body': req.body.body,
      'done': (req.body.done == "false") ? false : true
    }, function (err, doc) {
      res.send(err ? 404 : 200);
      res.location('/');
      res.redirect('/');
    });
  };
};

// Toggles 'done' field of given Todo
var SEND_TWILIO = true;
exports.toggle_done = function (db) {
  return function (req, res) {
    var todos = db.get('todos');
    todos.find({
      '_id': new BSON.ObjectID(req.params.id)
    }, {}, function (err, doc) {
      if (err) {
        res.send(404);
      } else {
        var completed = doc[0].done;
        var title = doc[0].title;
        todos.update({
          '_id': new BSON.ObjectID(req.params.id)
        }, {
          '$set': {
            'done': !(doc[0].done)
          }
        }, function (err, doc) {
          if (!completed && SEND_TWILIO) {
            unirest.post('https://twilio.p.mashape.com/<AccountSID>/SMS/Messages.json')
            .headers({"X-Mashape-Authorization": "0tjalWpxjql9dDNxF3fcHCRjBYhO2iT5"})
            .auth({
              'username': '<AccountSID>',
              'password': '<Password>'
            })
            .send({
              'From': '<From>',
              'To': '<To>',
              'Body': 'Success!! Completed: ' + title
            })
            .end(function (response) {
              console.log(response);
            });
          }
          
          res.send(err ? 404 : 200);
          if (req.method == "POST") {
            res.location('/');
            res.redirect('/');
          }
        });
      }
    });
  };
};

// Deletes Todo with :id
exports.destroy = function (db) {
  return function (req, res) {
    var todos = db.get('todos');
    todos.remove({
      '_id': new BSON.ObjectID(req.params.id)
    }, function (err, doc) {
      res.send(err ? 404 : 200);
      res.location('/');
      res.redirect('/');
    });
  };
};
