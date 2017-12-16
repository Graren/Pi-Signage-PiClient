const zmq = require('zeromq')
, pubsock = zmq.socket('pub'),
subsock = zmq.socket('sub'),
{ wsPort, stPort } = require('../config/constants')


pubsock.bindSync('tcp://127.0.0.1:' + stPort);
console.log('Publisher for state bound to port ' + stPort);

setTimeout(function(){
    console.log('sending a multipart message envelope');
    const action = {
        type: 'B_FETCH',
        url: 'https://i.pinimg.com/236x/05/a2/73/05a2736deebc8e5e2a88c0a6a897a997.jpg',
        name: "EPIC_PENIS",
        format: 'jpg'
    }

    const action2 = {
        type: 'B_FETCH',
        url: 'https://i.pinimg.com/236x/05/a2/73/05a2736deebc8e5e2a88c0a6a897a997.jpg',
        name: "ANDEPICPENIS2",
        format: 'jpg'
    }

    pubsock.send(['state', JSON.stringify(action)]);
    setTimeout(() => {
        pubsock.send(['state', JSON.stringify(action2)]);
    },10000)
}, 3000);

subsock.connect('tcp://127.0.0.1:'+ wsPort);
subsock.subscribe('websocket');
console.log('Subscriber for : websocket connected to port '+ wsPort);

subsock.on('message', function(topic, message) {
    console.log('received a message related to:', topic, 'containing message:', message);
    const action = JSON.parse(message)
    console.log(action)
});