const express = require('express');
const cheerio = require('cheerio');
const fetch = require('node-fetch');
const argv = require('simple-argv');

const app = new express();
app.set('view engine', 'pug');
const server = app.listen(argv.port || 1111);
const io = require('socket.io').listen(server);

const { log } = console;
const url = 'http://localhost:8000' || 'http://192.168.1.231:8000';
const me = 'P2.7na';

//logic
let h = null;
let w = null;
let field = [];
let players = {};

let refresh = setInterval(() => {
	fetch(`${url}/info`)
		.then(res => res.json())
		.then((data) => {
			players = data.players;
			const { field } = data;
			h = field.h;
			w = field.w;
			return fetch(`${url}/`);
		})
		.then(res => res.text())
		.then((data) => {
			const $ = cheerio.load(data);
			//From https://stackoverflow.com/questions/9579721/convert-html-table-to-array-in-javascript
			const res = [];
			$("table#field tr").each(function() {
				const arrayOfThisRow = [];
				const tableData = $(this).find('td');
				if (tableData.length > 0) {
					tableData.each(function() { arrayOfThisRow.push($(this).attr('class')); });
					res.push(arrayOfThisRow);
				}
				field = res;
			});
			////////////////////////////////////////////////////////////////////////////////////////////
		})
		.catch(console.log)
}, 334);

app.get('/', (req, res) =>{
	res.sendFile(__dirname + '/index.html')
});

io.on('connection', function(socket) {
	
});

