
var unirest = require('unirest');

exports.index = function (req, res) {
  unirest.get('http://localhost:3000/todos/current')
    .headers({'Accept': 'application/json'})
    .end(function (response) {
      var todos = response.body
      unirest.get('http://localhost:3000/todos/completed')
        .headers({'Accept': 'application/json'})
        .end(function (response) {
          var completed_todos = response.body
          res.render('index', {
            todos: todos,
            completed_todos: completed_todos
          });
        });
    });
};
