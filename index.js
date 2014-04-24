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

con.turnOn(1);
con.setColor(30);

