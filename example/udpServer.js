var dgram = require("dgram");
var server = dgram.createSocket("udp4");
server.on("message", function (msg, rinfo) {
	
	switch(msg[0].toString(16)){
	case 0x45.toString(16): console.log('Zone 1 on'); break;
	case 0x46.toString(16): console.log('Zone 1 off'); break;
	case 0x47.toString(16): console.log('Zone 2 on'); break;
	case 0x48.toString(16): console.log('Zone 2 off'); break;
	case 0x49.toString(16): console.log('Zone 3 on'); break;
	case 0x4A.toString(16): console.log('Zone 3 off'); break;
	case 0x4B.toString(16): console.log('Zone 4 on'); break;
	case 0x4C.toString(16): console.log('Zone 4 off'); break;
	case 0x4D.toString(16): console.log('Disco Mode'); break;
	case 0x4E.toString(16): console.log('Brightness set to '+msg[1].toString(16)); break;
	case 0x40.toString(16): console.log('Color set to '+msg[1].toString(16)); break;
	default: console.log('invalid command');
	
	}
  console.log("server got: " + parseInt(msg, 16) + " from " + rinfo.address + ":" + rinfo.port);
});
server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});
server.bind(8899, '127.0.0.1');