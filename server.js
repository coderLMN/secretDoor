var express = require("express"),
    path = require('path'),
    bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
    , ObjectID = require('mongodb').ObjectID
    , format = require('util').format;
var app = express();

var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
};
function replaceTag(tag) {
    return tagsToReplace[tag] || tag;
}
function safe_tags_replace(str) {
    return str.replace(/[&<>]/g, replaceTag);
}

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var jsonParser = bodyParser.json();
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.static(path.join(__dirname,'public')));

var uri = 'mongodb://localhost:27017/sd';
if (process.env.MONGOLAB_URI) {
    uri = process.env.MONGOLAB_URI;
}
var db;
MongoClient.connect(uri, {server: {auto_reconnect: true}}, function (err, mongo) {
    if (err) console.log(err);
    db = mongo;
});

app.get('/', function (req, res) {
    res.sendFile('index.html');
})

app.post('/text', function(req,res){
    var record = req.body;
    var size = Object.keys(record).length;
    res.setHeader('Content-Type', 'application/json; charset="utf-8"');
    if (record.w && size == 1) {
        if(record.w.length > 1024)
            record.w = record.w.substring(0,1024);
        record.w = safe_tags_replace(record.w);
        db.collection('quote').insert(record, function (err, result) {
            res.end(JSON.stringify({status: 'ok'}));
        });
    }
    else {
        res.end(JSON.stringify({status: 'fail'}));
    }
})
app.get('/text', function(req, res){
    db.collection('quote').count({}, function(err, total){
        db.collection('quote').find({'w':{ $exists: true}}).sort({"_id":-1}).limit(500).toArray(function(err, data){
            res.setHeader('Content-Type', 'application/json; charset="utf-8"');
            var words = [] , count= data.length;
            for(var i= 0; i<count; i++){
                words[i] = data[i].w;
            }
            res.end(JSON.stringify(words));
        });
    });
})

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log('Node app is running on port', app.get('port'));
});