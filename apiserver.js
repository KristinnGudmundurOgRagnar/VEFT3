var express = require('express'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    debug = require('debug')('VEFT3'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    cors = require('cors');


var api = require('./routes/api');

var app = express();
app.use(logger('dev'));
app.use(methodOverride());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/*app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Content-Type", "application/json; charset=utf-8");
    return next();
});
*/
app.use(cors());

// Routing
app.use('/api', api);

app.get('/', function(req, res) {
    res.send(
        '<ul>Available methods are: ' +
        '<li>/api/keys </li><li>/api/key/:key_id/execution_time ' +
        '</li><li>/api/key/:key_id/execute_time/:time</li></ul>'
    )
});

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});