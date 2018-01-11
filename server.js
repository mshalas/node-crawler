const express = require('express')
const app = express()
const crawler = require('./crawler.js');
crawler.initPhantom();

const url = "http://localhost";


app.get('/', (req, res) => {
	
	var variableName = "wigetVar";
	
	crawler.executeOnPage(url, variableName).then(function(data){
		res.send(data);
	}, function(e){
		res.send("error");
	});
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))