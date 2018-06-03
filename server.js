const express = require('express');
const fetch = require('node-fetch');
const argv = require('simple-argv');

const app = new express();
app.set('view engine', 'pug');
const server = app.listen(argv.port || 1111);
const io = require('socket.io').listen(server);

const {log} = console

app.get('/', (req, res) =>{
	res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket) {
	
});