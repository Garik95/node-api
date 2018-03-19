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
	request		:String,
	ip			:String,	
	createdAt	:Date
});

app.get('/track/:token/', function(req, res){
	console.log(getIp(req));
	mongoose.connection.db.listCollections({'name':'token' + req.params.token})
		.next(function (err, collinfo){
			if(collinfo)
				{
					if(req.param('request'))
						{
							var data = mongoose.model('token' + req.params.token, user_token);
							var n = new data();
							var now = new Date();
							n.user_id		= req.param('user');
							n.request 		= req.param('request');
							n.ip	 		= getIp(req);
							n.createdAt 	= now;
							n.save(function(err){console.log(err)});
							res.send('success');
						}
					else {res.send("Specify param");}
				}
			else{ res.send('Invalid token...');}
		 });
});

function getIp(req)
{
	var ip = req.headers['x-forwarded-for'] || 
	req.connection.remoteAddress || 
	req.socket.remoteAddress ||
	(req.connection.socket ? req.connection.socket.remoteAddress : null);
	return ip;
}


app.listen(process.env.PORT || 8888, function (){
	console.log('port - 8888');
});
