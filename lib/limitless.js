var dgram = require('dgram'),
    net = require('net'),
    logger = require('log4js').getLogger();

var VALIDATION_BYTE = 0x00,
    CLOSE_BYTE = 0x55,
    TYPE_UDP = 'udp',
    TYPE_TCP = 'tcp';

var hexCommands = {
	    ALL_OFF: 0x41,
	    ALL_ON: 0x42,
	    DISCO_SPEED_SLOWER: 0x43,
	    DISCO_SPEED_FASTER: 0x44,
	    ZONE_1_ON: 0x45,
	    ZONE_1_OFF: 0x46,
	    ZONE_2_ON: 0x47,
	    ZONE_2_OFF: 0x48,
	    ZONE_3_ON: 0x49,
	    ZONE_3_OFF: 0x4A,
	    ZONE_4_ON: 0x4B,
	    ZONE_4_OFF: 0x4C,
	    DISCO_MODE: 0x4D,
	    BRIGHTNESS: 0x4E,
	    COLORS: 0x40
};

function LimitlessLED(params) {
    this.addr = params.host;
    this.port = params.port;
    this.type = params.type;

    callback = (typeof(params.callback) === "function") ? params.callback : function () {};

    switch (this.type) {
        case TYPE_UDP:
            this.client = dgram.createSocket('udp4');
            break;
        case TYPE_TCP:
            this.client = net.connect(params, params.callback);
            break;
        default:
            throw new Error('Invalid type');
    }
}

function convertBrightLevel(number){
	var result = Math.floor(((number % 100)*27 ) / 100);
	//console.log(result.toString(16))
	return parseInt(result.toString(16), 16);
}

function convertColor(value){
	return parseInt((value % 255).toString(16), 16);
}


LimitlessLED.prototype = Object.create({}, {
	turnOn: {
		value: function(zone){
			console.log("Turning "+zone+" on");
			this.send(hexCommands["ZONE_"+zone+"_ON"], VALIDATION_BYTE);
		}
	},	
	turnOff: {
		value: function(zone){
			console.log("Turning "+zone+" off");
			this.send(hexCommands["ZONE_"+zone+"_OFF"], VALIDATION_BYTE);
		}
	},
	setbrightness: {
		value: function(zone, val){
			this.turnOn(zone);
			this.send(hexCommands["BRIGHTNESS"], convertBrightLevel(val) + VALIDATION_BYTE);
		}
	},
	setColor: {
		value: function(zone, val){
			this.turnOn(zone);
			this.send(hexCommands["COLORS"], convertColor(val) + VALIDATION_BYTE);
		}
	},
	
    send: {
        value: function (cmd, val) {
        	var brightness = convertBrightLevel(val) + VALIDATION_BYTE;
            var buffer = new Buffer([cmd, val, CLOSE_BYTE], 'hex');
            logger.info('sending: ', buffer);

            switch (this.type) {
                case TYPE_UDP:
                    this.sendUtp(buffer);
                    break;
                case TYPE_TCP:
                    this.sendTcp(buffer);
                    break;
            }
        },
        enumerable: true
    },
    sendUtp: {
        value: function (buffer, cb) {
            var self = this;

            cb = (typeof(cb) === "function") ? cb : function (err, bytes) {
                if (err) {
                    logger.info("udp error:" + err);
                    throw new Error(err);
                } else {
                    logger.info('bytes send: ', buffer, 'to: ', self.addr + ':' + self.port);
                }
            }

            this.client.send(
                buffer,
                0,
                buffer.length,
                self.port,
                self.addr,
                cb
            );
        }
    },
    sendTcp: {
        value: function (buffer, cb) {
            this.client.write(buffer);
        }
    }
});

exports.LimitlessLED = LimitlessLED;