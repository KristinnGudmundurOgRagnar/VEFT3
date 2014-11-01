var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    debug = require('debug')('myapp');


var api = require('./routes/api');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(logger('dev'));


// Routing
app.use('/api', api);

module.exports = app;

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});