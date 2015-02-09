# node-red-contrib-pjlink
A PJLink node for Node-RED

## Installation

```bash 
npm install node-red-contrib-pjlink
```

## Usage

The first output sends data from queries, the second output sends errors.

You can send the following commands as a text string in <code>msg.payload</code>

- on
- off
- getname
- getmanufacturer
- getmodel
- getlamps
- getinputs
- getinput
- getinfo
- getpowerstate
- getmute
- getclass
- geterrors


You can also set the mute status and set the inputs by sending this object as <code>msg.payload</code>

<code>{"setinput": {"source": 3, "channel": 3}}</code>

<code>{"setmute": true}</code> or <code>{"setmute": false}</code>

See <a href="http://flows.nodered.org/flow/f9b28307c3841f6ef1e6">this flow </a>for an example of all the commands.