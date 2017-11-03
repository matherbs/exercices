// Script entier en mode strict
"use strict";

let 	config = require('./config');

const	HOST = process.env.HOST || config.host, 
		PORT = process.env.PORT || config.port,

		firebase = require('firebase'),
		ip = require("ip"),
		http = require('http'),
		fs   = require('fs');

firebase.initializeApp({
    databaseURL: 'https://becode-imin.firebaseio.com/',
    serviceAccount: './db/Becode-ImIn-fb6bf9274c93.json'
});

// Get a database reference to our posts
const 	db = firebase.database();

const 	handler = function(req,res){
	if(req.url == '/'){
		req.url = '/index.html';
	}
	fs.readFile('./app'+req.url,function(err,file){
		if(err){
			res.writeHead(404);
			res.end('Content not found');
		}else{
			res.writeHead(200);
			res.end(file.toString());
		}
	})
}

const 	server 	= http.createServer(handler),
		io		= require('socket.io')(server);

io.on('connection',(socket)=>{
	console.log('New socket with ID: '+socket.id+' just connected.');

	socket.on('getBecode',()=>{
		let ref = db.ref("/team");
		ref.on("value", function(snapshot) {
			let data = snapshot.val();
			socket.emit('setBecode',data);
		}, function (errorObject) {
		  	console.log("The read failed: " + errorObject.code);
		});
	});

	socket.on('updateStudent',function(id,time){
		
	});

	socket.on('disconnect',()=>{
		console.log('Socket with ID: '+socket.id+' just disconnected.');
	});
});

server.listen(PORT,HOST,()=>{
	console.log('Server running on: '+ip.address()+':'+PORT);
});