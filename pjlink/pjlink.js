module.exports = function(RED) {  
    var pjlink = require('pjlink');
    function PJLink_func(config) {
        RED.nodes.createNode(this,config);
        this.ip = config.ip;
        this.port = config.port;
        var node = this;
        var beamer = new pjlink(node.ip, node.port, node.credentials.password);
        this.on('input', function(msg) {
            if (msg.payload == "on") {
                beamer.powerOn(function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                });
            }
            if (msg.payload == "off") {
                beamer.powerOff(function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                });
            }
            if (msg.payload == "getname") {
                beamer.getName(function(err, name){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: name}, null]);
                });
            }
            if (msg.payload == "getmanufacturer") {
                beamer.getManufacturer(function(err, manufacturer){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: manufacturer}, null]);
                });
            }
            if (msg.payload == "getmodel") {
                beamer.getModel(function(err, model){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: model}, null]);
                });
            }
            if (msg.payload == "getmute") {
                beamer.getMute(function(err, mute){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: mute}, null]);
                });
            }
            if (msg.payload == "geterrors") {
                beamer.getErrors(function(err, errors){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: errors}, null]);
                });
            }
            if (msg.payload == "getlamps") {
                beamer.getLamps(function(err, lamps){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: lamps}, null]);
                });
            }
            if (msg.payload == "getinput") {
                beamer.getInput(function(err, input){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: input}, null]);
                });
            }
            if (msg.payload == "getinputs") {
                beamer.getInputs(function(err, inputs){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: inputs}, null]);
                });
            }
            if (msg.payload == "getinfo") {
                beamer.getInfo(function(err, info){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: info}, null]);
                });
            }
            if (msg.payload == "getclass") {
                beamer.getClass(function(err, _class){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: _class}, null]);
                });
            }
            if (msg.payload == "getpowerstate") {
                beamer.getPowerState(function(err, state){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: state}, null]);
                });
            }
            if (msg.payload.setinput != null) {
                beamer.setInput(msg.payload.setinput, function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                });
            }
            if (msg.payload.setmute != null) {
                beamer.setMute(msg.payload.setmute, function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                });
            }
        });
    }
    RED.nodes.registerType("pjlink",PJLink_func,{
        credentials: {
        password: {type:"password"}
        }
    });
}