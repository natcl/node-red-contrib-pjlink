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
        RED.nodes.createNode(this,config);
        this.ip = config.ip;
        this.port = config.port;
        var node = this;

        node.beamer = new pjlink(node.ip, node.port, node.credentials.password);
        refreshNodeStatus();

        node.interval = setInterval(refreshNodeStatus, 60 * 1000);

        function refreshNodeStatus() {
            node.beamer.getPowerState(function(err, state) {
                if (state === 0)
                    node.status({fill:"red",shape:"dot",text:"off"});
                if (state == 1)
                    node.status({fill:"green",shape:"dot",text:"on"});
                if (state == 2)
                    node.status({fill:"blue",shape:"dot",text:"cooling down..."});
                if (state == 3)
                    node.status({fill:"yellow",shape:"dot",text:"warming up..."});
                if (err)
                    node.status({fill:"red",shape:"dot",text:"error"});
            });
        }

        node.on('input', function(msg) {
            if (msg.payload == "on") {
                node.beamer.powerOn(function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                    else {
                        node.status({fill:"grey",shape:"dot",text:"updating..."});
                        setTimeout(refreshNodeStatus, 15000);
                    }
                });
            }
            if (msg.payload == "off") {
                node.beamer.powerOff(function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.status({fill:"grey",shape:"dot",text:"updating..."});
                        setTimeout(refreshNodeStatus, 5000);
                });
            }
            if (msg.payload == "getname") {
                node.beamer.getName(function(err, name){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: name}, null]);
                });
            }
            if (msg.payload == "getmanufacturer") {
                node.beamer.getManufacturer(function(err, manufacturer){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: manufacturer}, null]);
                });
            }
            if (msg.payload == "getmodel") {
                node.beamer.getModel(function(err, model){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: model}, null]);
                });
            }
            if (msg.payload == "getmute") {
                node.beamer.getMute(function(err, mute){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: mute}, null]);
                });
            }
            if (msg.payload == "geterrors") {
                node.beamer.getErrors(function(err, errors){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: errors}, null]);
                });
            }
            if (msg.payload == "getlamps") {
                node.beamer.getLamps(function(err, lamps){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: lamps}, null]);
                });
            }
            if (msg.payload == "getinput") {
                node.beamer.getInput(function(err, input){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: input}, null]);
                });
            }
            if (msg.payload == "getinputs") {
                node.beamer.getInputs(function(err, inputs){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: inputs}, null]);
                });
            }
            if (msg.payload == "getinfo") {
                node.beamer.getInfo(function(err, info){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: info}, null]);
                });
            }
            if (msg.payload == "getclass") {
                node.beamer.getClass(function(err, _class){
                    if (err)
                        node.send([null, {payload: err}]);
                    else
                        node.send([{payload: _class}, null]);
                });
            }
            if (msg.payload == "getpowerstate") {
                node.beamer.getPowerState(function(err, state){
                    if (err)
                        node.send([null, {payload: err}]);
                    else {
                        node.send([{payload: state}, null]);
                        refreshNodeStatus();
                    }
                });
            }
            if (msg.payload == "muteon") {
                node.beamer.setMute(true, function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                });
            }
            if (msg.payload == "muteoff") {
                node.beamer.setMute(false, function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                });
            }
            if (msg.payload.setinput != null) {
                node.beamer.setInput(msg.payload.setinput, function(err){
                    if (err)
                        node.send([null, {payload: err}]);
                });
            }
        });

        node.on('close', function() {
            node.beamer.disconnect();
            clearInterval(node.interval);
        });
    }
    RED.nodes.registerType("pjlink",PJLink_func,{
        credentials: {
        password: {type:"password"}
        }
    });
}
