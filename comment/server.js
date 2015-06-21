var express = require('express'),
    app = express(),
    r = require('rethinkdb'),
    config = require('./config.json'),
    cookieParser = require('cookie-parser'),
    redis = require('redis').createClient(),
    bodyParser = require('body-parser');

// settings
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// setting CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  'OPTIONS' == req.method ? res.status(200).send('') : next()
});

// database
var connRethinkdb;
r.connect(config.rethinkdb).then(function(conn) {
  connRethinkdb = conn;
  console.log("rethinkdb connected ok");
}).error(function(error){
  console.log(error.message);
});

function handleError(res) {
  return function(error) {
    res.status(500).send({error: error.message});
  }
}

function authenticate(req, res, next) {
  if(req.cookies && req.cookies['_shared_session']) {
    redis.hget(['sessionStore', req.cookies['_shared_session']], function (err, session) {
      if (err || !session) {
        res.status(401).send({error: 'unauthorized'})
      } else {
        req.metaData = JSON.parse(session);
        next();
      }
    });
  } else {
    res.status(401).send({error: 'unauthorized'})
  }
}

app.get('/posts/:id/comments', function(req, res, next) {
  r.table('comments')
  .filter({post_id: req.params.id})
  .run(connRethinkdb)
  .then(function(cursor) {
    return cursor.toArray();
  }).then(function(result) {
    res.json(result);
  }).error(handleError(res));
});

app.post('/posts/:id/comments', authenticate, function(req, res, next) {
  comment = {
    post_id: req.params.id,
    content: req.body.content,
    by: req.metaData
  }

  r.table('comments')
  .insert(comment, {returnChanges: true})
  .run(connRethinkdb)
  .then(function(result) {
    if (result.inserted !== 1) {
      handleError(res, next)(new Error("Document was not inserted.")); 
    } else {
      res.json(result.changes[0].new_val);
    }
  }).error(handleError(res))
  .finally(next);
});

var server = app.listen(3003, function () {
  var host = server.address().address
  var port = server.address().port
  console.log('Example app listening at http://%s:%s', host, port)
});
