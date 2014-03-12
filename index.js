/**
 * 
 */
var led = require('limitless-gem'); //Normally require('LimitlessGEM');

var con = led.createSocket({
        host: '192.168.1.34',
        port: 8899
    },
    'udp',
    function () {
        console.log('connected');
    }
);
var bright = 0;

con.turnOn(1);
con.setColor(30);


//con.turnOn(1);

/*
 * proposed api
con.turnOn(zone);
con.turnOff(zone);
con.setbrightness(zone, val)
con.setColor(zone, val);
*/
/*[
 	led.RGBW.BRIGHTNESS
    
].forEach(function (cmd, index) {
   setTimeout(function () {
	   con.turnOn(1);
	   bright += 10;
	   console.log(bright);
       con.send(cmd, bright);
   }, 100);
  
	//console.log(cmd.toString(16))
});*/