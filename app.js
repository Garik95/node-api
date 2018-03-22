var express = require('express');
var mongoose = require('mongoose');
var app = express();

var configDB = require('./db/database.js');
// var os = require('os');
// console.log(os.cpus());
// console.log(os.totalmem()/1024/1024/1024);
// console.log(os.freemem()/1024/1024/1024);
// configuration ===============================================================

mongoose.connect(configDB.url); // connect to our database

var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;
var user_token = new Schema({
	user_id		:Number,
	request		:String,
	ip			:String,
	flg			:Boolean,	
	createdAt	:Date
});

app.get('/track/:token/', function(req, res){
	console.log(getIp(req));
	mongoose.connection.db.listCollections({'name':'token' + req.params.token})
		.next(function (err, collinfo){
			if(collinfo)
				{
					console.log(req.query);
					if(Object.keys(req.query).length !== 0)
					{
						if(!req.query.request == '')
							{
									if(!req.query.user == '' )
									{
										var data = mongoose.model('token' + req.params.token, user_token);
										var n = new data();
										var now = new Date();
										n.user_id		= req.param('user');
										n.request 		= req.param('request');
										n.response 		= req.param('response');
										n.ip	 		= getIp(req);
										n.flg			= true;
										n.createdAt 	= now;
										n.save(function(err){console.log(err)});
										res.send('success');
									}
									else res.send("user field is empty");
							}
						else res.send("request field is empty");
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
