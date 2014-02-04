
# Mashape Todo (pattern/mashape-todo)

This is my day-long attempt at the traditional todo app.  It uses `mongodb` as a database to store the todo items, and uses `express.js` to serve the API as well as the .

### Database

A `mongod` process should be started, with `--dbpath` pointing to the path at which data should be stored (in this case, I simply made a `data` directory in the project root).

```bash
mkdir <project path>/data
cd <wherever mongod lives>
./mongod --dbpath <project path>/data
```

Once the database daemon is running, use the `mongo` tool to dictate which database to use, and instantiate the `todos` table:

```bash
./mongo
> use mashapetest
> db.todos.insert({'title':'Buy Pizza', 'body':'A necessity.', 'done':false})
```

### Style

The [Stylus](http://learnboost.github.io/stylus/) CSS framework is used.  To compile `style.styl` and make `style.css`, run the following command from the root of the project:

```bash
stylus -w public/stylesheets/
```
