var express = require('express');
var mongoose = require('mongoose');
var app = express();

var configDB = require('./db/database.js');

// configuration ===============================================================

mongoose.connect(configDB.url); // connect to our database

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var user_token = new Schema({
	user_id		:Number,
	name		:String,
	createdAt	:Date
});

//var Person = mongoose.model('', yourSchema);

app.get('/track/:token/', function(req, res){
	mongoose.connection.db.listCollections({'name':'token' + req.params.token})
		.next(function (err, collinfo){
			console.log(collinfo);
			if(collinfo)
				{
					if(req.param('name'))
						{
							var data = mongoose.model('token' + req.params.token, user_token);
							var n = new data();
							var now = new Date();
							n.user_id	= req.param('user');
							n.name 		= req.param('name');
							n.createdAt 	= now;
							n.save(function(err){console.log(err)});
							res.send('success');
						}
				}
			else{ res.send('Invalid token...');}
		 });
});

app.listen(80, function (){
	console.log('port - 80');
});
