const zmq = require('zeromq')
 
const pubsock = zmq.socket('pub')
const subsock = zmq.socket('sub')
const { wsPort, stPort, logPort, levels } = require('../config/constants')
const logger = require('./logger_proxy')

const bindDispatcher = () => {
    return new Promise((resolve, reject) => {
        try{
            pubsock.bindSync('tcp://127.0.0.1:' + stPort);
            subsock.connect('tcp://127.0.0.1:'+ wsPort);
            subsock.subscribe('websocket');
        
            subsock.on('message', function(topic, message) {
                console.log('received a message related to:', topic.toString(), 'containing message:', message.toString());
                const action = JSON.parse(message)
                console.log(action)
            });
            resolve(pubsock)
        }
        catch(e){
            reject(e)
        }
    })
}


module.exports = {
    log: logger,
    ...levels,
    bindDispatcher
}

