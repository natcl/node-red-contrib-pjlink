/**
 * Copyright 2015 Nathanaël Lécaudé
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    var pjlink = require('pjlink');

    function PJLink_func(config) {
        RED.nodes.createNode(this, config);

        var node = this;
        node.ip = config.ip;
        node.port = parseInt(config.port);

        node.projectors = {};

        if (node.ip && node.port) {
            node.projectors[node.ip + ':' + node.port] = new pjlink(node.ip, node.port, node.credentials.password);
            //node.warn(`Creating projector ${node.ip} at port ${node.port}`);
        }
        refreshNodeStatus();

        node.interval = setInterval(refreshNodeStatus, 60 * 1000);

        function refreshNodeStatus() {
            if (node.ip && node.port) {
                if (node.projectors[node.ip + ':' + node.port]) {
                    node.projectors[node.ip + ':' + node.port].getPowerState(function(err, state) {
                        if (state === 0)
                            node.status({
                                fill: "red",
                                shape: "dot",
                                text: "off"
                            });
                        if (state == 1)
                            node.status({
                                fill: "green",
                                shape: "dot",
                                text: "on"
                            });
                        if (state == 2)
                            node.status({
                                fill: "blue",
                                shape: "dot",
                                text: "cooling down..."
                            });
                        if (state == 3)
                            node.status({
                                fill: "yellow",
                                shape: "dot",
                                text: "warming up..."
                            });
                        if (err)
                            node.status({
                                fill: "red",
                                shape: "dot",
                                text: "error"
                            });
                    });
                }
            }
        }

        node.on('input', function(msg) {
            var projectorID;

            if ((!node.port && !msg.port) || (!node.ip && !msg.host)) {
                if (!node.port && !msg.port) node.error("Error: No port specified.", msg);
                if (!node.ip && !msg.host) node.error("Error: No host specified.", msg);
                return;
            }

            // If projector not in list, add it
            if (msg.host && msg.port) {
                projectorID = msg.host + ':' + msg.port;
                if (!node.projectors[projectorID]) {
                    if (msg.password) {
                        node.projectors[projectorID] = new pjlink(msg.host, msg.port, msg.password);
                    } else {
                        node.projectors[projectorID] = new pjlink(msg.host, msg.port);
                    }
                    //node.warn(`Creating projector ${msg.host} at port ${msg.port}`);
                }
            }

            if (node.ip && node.port  && (!msg.ip && !msg.port)) {
                //node.warn('Using ip from config');
                msg.host = node.ip;
                msg.port = node.port;
                msg.password = node.credentials.password;
                projectorID = msg.host + ':' + msg.port;
            }

            if (msg.payload == "on") {
                node.projectors[projectorID].powerOn(function(err) {
                    if (err)
                        node.error(err, msg);
                    else {
                        if (node.ip && node.port) {
                            node.status({
                                fill: "grey",
                                shape: "dot",
                                text: "updating..."
                            });
                            setTimeout(refreshNodeStatus, 15000);
                        }
                    }
                });
            }
            if (msg.payload == "off") {
                node.projectors[projectorID].powerOff(function(err) {
                    if (err)
                        node.error(err, msg);
                    else {
                        if (node.ip && node.port) {
                            node.status({
                                fill: "grey",
                                shape: "dot",
                                text: "updating..."
                            });
                            setTimeout(refreshNodeStatus, 5000);
                        }
                    }
                });
            }
            if (msg.payload == "getname") {
                node.projectors[projectorID].getName(function(err, name) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = name;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getmanufacturer") {
                node.projectors[projectorID].getManufacturer(function(err, manufacturer) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = manufacturer;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getmodel") {
                node.projectors[projectorID].getModel(function(err, model) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = model;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getmute") {
                node.projectors[projectorID].getMute(function(err, mute) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = mute;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "geterrors") {
                node.projectors[projectorID].getErrors(function(err, errors) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = errors;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getlamps") {
                node.projectors[projectorID].getLamps(function(err, lamps) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = lamps;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getinput") {
                node.projectors[projectorID].getInput(function(err, input) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = input;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getinputs") {
                node.projectors[projectorID].getInputs(function(err, inputs) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = inputs;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getinfo") {
                node.projectors[projectorID].getInfo(function(err, info) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = info;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getclass") {
                node.projectors[projectorID].getClass(function(err, _class) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = _class;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "getpowerstate") {
                node.projectors[projectorID].getPowerState(function(err, state) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                    else {
                        msg.payload = state;
                        node.send([msg, null]);
                    }
                });
            }
            if (msg.payload == "muteon") {
                node.projectors[projectorID].setMute({'video': true, 'audio': true}, function(err) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                });
            }
            if (msg.payload == "muteoff") {
                node.projectors[projectorID].setMute({'video': false, 'audio': false}, function(err) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                });
            }
            if (typeof msg.payload == 'object') {
                node.projectors[projectorID].setInput(msg.payload, function(err) {
                    if (err) {
                        msg.payload = err;
                        node.send([null, msg]);
                    }
                });
            }
        });

        node.on('close', function() {
            for (let projector in node.projectors) {
                if (node.projectors[projector]) node.projectors[projector].disconnect();
            }
            node.projectors = {};
            node.status({});
            clearInterval(node.interval);
        });
    }
    RED.nodes.registerType("pjlink", PJLink_func, {
        credentials: {
            password: {
                type: "password"
            }
        }
    });
};
