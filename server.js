const express = require('express');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const argv = require('simple-argv');

const app = new express();
app.set('view engine', 'pug');
const server = app.listen(argv.port || 1111);
const io = require('socket.io').listen(server);

//utils
const { log } = console;
const url = 'http://localhost:8000' || 'http://192.168.1.231:8000';
const username = 'P2.7na';
const m2s = (matrix) => {
	return matrix
		.map(e => e.join(''))
		.reduce((acc, e) => {
			return `${acc}${e}`;
		}, '');
}

//state
let h = null;
let w = null;
let field = null;
let players = {};
let bullet = true;;


fetch(`${url}/signup`, {
	method: "POST",
	headers: {
		"content-type": "application/json"
	},
	body: JSON.stringify({
		name: username
	})
})
	.then(res => res.json())
	.then(console.log)
	.catch(console.log)


let refresh = setInterval(() => {
	fetch(`${url}/info`)
		.then(res => res.json())
		.then((data) => {
			if (JSON.stringify(players) !== JSON.stringify(data.players))
				io.sockets.emit('players', data.players); //API
			players = data.players;

			const newBullet = Object.values(players)
				.filter(e => e.name === username)[0]
				.loaded;

			if (newBullet !== bullet)
				io.sockets.emit('bullet', newBullet); //API
			bullet = newBullet;

			const {field} = data;
			h = field.h;
			w = field.w;
			return fetch(`${url}/`);
		})
		.then(res => res.text())
		.then((data) => {
			const $ = cheerio.load(data);
			/*
			//From https://stackoverflow.com/questions/9579721/convert-html-table-to-array-in-javascript
			const res = [];
			$("table#field tr").each(() => {
				const arrayOfThisRow = [];
				const tableData = $(this).find('td');
				if (tableData.length > 0) {
					tableData.each(() => arrayOfThisRow.push($(this).attr('class')));
					res.push(arrayOfThisRow);
				}
			});
			////////////////////////////////////////////////////////////////////////////////////////////

			if (m2s(res) !== m2s(field))
				io.sockets.emit('field', res); //API
			field = res;
			*/
			const res = $("#field tbody").html();
			if (res !== field)
				io.sockets.emit('field', res); //API
			field = res;
		})
		.catch(console.log)
}, 101);

app.get('/', (req, res) =>{
	res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket) {
	log('connected');
	io.sockets.emit('field', field); //API
	io.sockets.emit('players', players); //API
	socket.on('attack', ({x, y}) => {
		fetch(`${url}/`, {
			method: "POST",
			headers: {
				"content-type": "application/json"
			},
			body: JSON.stringify({
				x: Number(x),
				y: Number(y)
			})
		})
			.then(res => res.json())
			.then((data) => socket.emit('chat', data))
			.catch(console.log)
		})
});

