const phantom = require('phantom');

function Crawler(){
	this.processId = null;
	this.instance = null;	
}
Crawler.prototype.initPhantom = function(){
	console.log("init phantom");	
	phantom.create()
	.then(instance => {
		this.instance = instance;
		this.processId = instance.process.pid;
		console.log("phantom created ", "processId: ", this.processId);
	})
	.catch(error => {
		console.log("phantom crash: ", error);
		instance.exit();
	});	
};
Crawler.prototype.restartPhantom = function(){
	try {
        console.log("try to kill phantom, processId: ", this.processId);
        process.kill(this.processId);
    } catch (error) {
        console.log("restart phantom error: ", error)
    }
	this.initPhantom();
};
Crawler.prototype.executeOnPage = function(url, variableName){
	var that = this;
	//execute variable on destination web page
	return new Promise(function(resolve, reject) {	
		that.instance.createPage().then(function(page){	
			console.log("page created");
			page.open(url).then(function(status){
				console.log("page status: ", status);

				var script = 'function(){return window["'+ variableName + '"];}';
				page.evaluateJavaScript(script).then(function(data){
					console.log("evaluated variable: ", data);
					resolve(data);			
				});
				
				page.close();
			});	
		}).catch(function(error){		
			console.log("error: ", error);	
			that.restartPhantom();
			reject(error);
		});
	});
}


module.exports = new Crawler();