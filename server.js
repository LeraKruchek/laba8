/**
 * Created by Valeryia_Kruchak on 14-Nov-14.
 */
var express = require('express');
var app = express();

var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

mongoose.connect('mongodb://lera:1234@ds051720.mongolab.com:51720/lab8');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

var Rule = mongoose.model('Rule',{
    name: String,
    max: Number,
    min: Number,
    snow: Boolean,
    smog: Boolean,
    rain: Boolean,
    sun: Boolean,
    humid: Boolean
});
app.get('/api/rules', function(req, res) {

    // use mongoose to get all todos in the database
    Rule.find(function(err, rules) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        res.json(rules); // return all todos in JSON format
    });
});

app.post('/api/rules', function(req,res){
    Rule.create({
        name: req.body.name,
        max: req.body.max,
        min: req.body.min,
        snow: req.body.snow,
        smog: req.body.smog,
        rain: req.body.rain,
        sun: req.body.sun,
        humid: req.body.humid
    }, function(err, rule) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        Rule.find(function(err, rules) {
            if (err)
                res.send(err)
            res.json(rules);
        });
})

});

app.get('/index.html', function(req, res) {
    res.sendfile('index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
app.get('/style.css', function(req, res) {
        res.sendfile('style.css');
});
app.get('/core.js', function(req, res) {
    res.sendfile('core.js');
});
app.listen(8082);
console.log("App listening on port 8082");