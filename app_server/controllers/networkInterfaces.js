var os = require('os');
var ifaces = os.networkInterfaces();

for(var iface in ifaces){
	console.log("Interface: "+iface);
	ifaces[iface].forEach(function(item){
		if(item.internal==false){
			console.log("Address %s: %s", item.family, item.address);
		}
	});
}