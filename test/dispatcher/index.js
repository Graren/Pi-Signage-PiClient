const zmq = require('zeromq')
const { wsPort, stPort, stSock, levels } = require('../config/constants')

const pubsock = zmq.socket('pub') // statePublisher
const subsock = zmq.socket('sub') // websocketSubscriber
const stsock = zmq.socket('sub') // storeSockSubscriber
const logger = require('./logger_proxy')

const bindDispatcher = () => {
  return new Promise((resolve, reject) => {
    try {
      pubsock.bindSync('tcp://127.0.0.1:' + stPort)
      subsock.connect('tcp://127.0.0.1:' + wsPort)
      subsock.subscribe('websocket')
      stsock.connect('tcp://127.0.0.1:' + stSock)
      stsock.subscribe('startup')
      resolve({ pubsock, subsock, stsock })
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
