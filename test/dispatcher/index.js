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
            resolve({ pubsock, subsock })
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

