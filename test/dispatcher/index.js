const zmq = require('zeromq')
const pubsock = zmq.socket('pub')
const subsock = zmq.socket('sub')
const stsock = zmq.socket('sub')
const { wsPort, stPort, logPort, stSock, levels } = require('../config/constants')
const logger = require('./logger_proxy')

const bindDispatcher = () => {
  return new Promise((resolve, reject) => {
    try {
      pubsock.bindSync('tcp://127.0.0.1:' + stPort)
      subsock.connect('tcp://127.0.0.1:' + wsPort)
      subsock.subscribe('websocket')
      stsock.connect('tcp://127.0.0.1:' + stSock)
      stsock.subscribe('startup')
      resolve({ pubsock, subsock, stsock})
    } catch (e) {
      reject(e)
    }
  })
}

module.exports = {
  log: logger,
  ...levels,
  bindDispatcher
}
