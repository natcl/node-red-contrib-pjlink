module.exports = function(RED) {  
    var pjlink = require('pjlink');
    function PJLink_func(config) {
        RED.nodes.createNode(this,config);
        this.ip = config.ip;
        this.port = config.port;
        this.password = config.password;
        var node = this;
        var beamer = new pjlink(node.ip, node.port, node.password);
        this.on('input', function(msg) {
            if (msg.payload == "on") {
                beamer.powerOn();
            }
            if (msg.payload == "off") {
                beamer.powerOff();
            }
            node.send(msg);
        });
    }
    RED.nodes.registerType("pjlink",PJLink_func,{
        credentials: {
        password: {type:"password"}
        }
    });
}