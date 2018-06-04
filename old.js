/*
npm install system-sleep
npm install node-fetch
npm install simple-argv
npm install request
*/

//node client.js -u url -n name -m mode [-t sleppTimeout][-h height -w width]:[-x attackX -y attackY]
//node client.js -u http://192.168.1.231:8000 -m 1 -h 1000 -w 1000 -n Th995 -t 0

const { u, n, w, h, m, x, y, t} = require('simple-argv');
const sleep  = require("system-sleep");
const fetch = require("node-fetch");
//const request = require('request');

/*for (let i = 1; i <= w; i++) {
	for (let j = 1; j <= h; j++) {
		request()
		attack(i, j);
		console.log(i, j)
	}
}*/
	
function ri(min, max) {
	max++;
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //Il max è escluso e il min è incluso
}

const accr = (name) => {
	fetch(`${u}/signup`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			name
		})
	})
		.then(res => res.json())
		.then(console.log)
		.catch(console.log)
}

const attack = (x, y) => {
	fetch(`${u}/`, {
		method: "POST",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify({
			x,
			y
		})
	})
		.then(res => res.json())
		.then(console.log)
		.catch(console.log)
}

switch(m) {
	case 0: //attack all without delay
		if (!n)
			console.log("ERROR: NO NAME SPECIFIED");
		for (let i = 1; i <= w; i++) {
			for (let j = 1; j <= h; j++) {
				accr(n);
				attack(i, j);
				console.log(i, j)
			}
		}
		break;
	case 1: //attack all with delay
		if (!n)
			console.log("ERROR: NO NAME SPECIFIED");
		for (let i = 1; i <= w; i++) {
			for (let j = 1; j <= h; j++) {
				accr(n);
				sleep(t || 0);
				attack(i, j);
			}
		}
		break;

	case 2: //just attack
		if (typeof x === "undefined" || typeof y === "undefined")
			console.log("ERROR: MISSING x OR y PARAMS")
		attack(Number(x), Number(y));
		break;

	case 3: //just attack random
		if (!h || !w)
			console.log("MISSING h or w");
		else
			attack(ri(1, w), ri(1, h));
		break;

	default: //just accr
		if (n)
			accr(n)
		else 
			console.log("err: cannot accred");
		break;
}
