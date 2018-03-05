var express = require('express');
var mongoose = require('mongoose');
var app = express();

var configDB = require('./db/database.js');

// configuration ===============================================================

mongoose.connect(configDB.url); // connect to our database

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var user_token = new Schema({
	_id		:ObjectId,
	name		:String,
	createdAt	:Date
});

//var Person = mongoose.model('', yourSchema);

app.get('/track/:token/', function(req, res){
	mongoose.connection.db.listCollections({'name':'users'})
		.next(function (err, collinfo){console.log(collinfo); });
	res.send(req.params);
});

app.listen(8888, function (){
	console.log('port - 8888');
});
