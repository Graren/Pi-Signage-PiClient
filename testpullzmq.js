const zmq = require('zeromq');
const socket = zmq.socket('push')

const addr = 'tcp://127.0.0.1:3000';
socket.bindSync(addr);

setInterval(() => {
    console.log("wagnaria")
    const a = {
        papa: "sex"
    }
    socket.send(JSON.stringify(a))
},1000)