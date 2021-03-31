console.log("import modules");

﻿const {
	exec
} = require("child_process");

const jsdom = require("jsdom");
const {
	JSDOM
} = jsdom;

const fs = require('fs');

var data;
var firsthtml;

console.log("read index.html");
fs.open('index.html', 'w+', function (err, f) {
	if (err) {
		throw err;
	}
	firsthtml = f.readlines();

console.log(firsthtml);
console.log("load jsdom");

var dom = new JSDOM(firsthtml);

var links = dom.window.document.getElementById("links");

console.log("get search results");
exec("youtube-dl -J https://www.youtube.com/channel/UCcn4UOBvB0W2HjCcLFLuu2w/videos --match-title LIVE --playlist-end 20", {
	maxBuffer: 2048 * 2048
}, (error, stdout, stderr) => {
	if (error) {
		console.log(`error: ${error.message}`);
		return;
	}
	if (stderr) {
		console.log(`stderr: ${stderr}`);
		return;
	}

	console.log("parse search results");
	var searchResults = JSON.parse(stdout).entries;

	console.log("get results");
	searchResults.forEach(function(result) {
		var html_id = "vid" + result.id;
		if (dom.window.document.getElementById(html_id) == undefined) {
			console.log("add " + result.id + " to dom");
			var link = dom.window.document.createElement('a');
			link.setAttribute('href', result.id);
			link.innerHtml = result.id;
			links.appendChild(link);
		} else {
			console.log("already written" + result.id);
		}
	});

	data = dom.outerHTML;

	f.write(data);
});
});
