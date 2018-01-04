const zmq = require('zeromq')
const logsock = zmq.socket('pub')
const { wsPort, stPort, logPort, levels } = require('../config/constants')

const execute = () => {
  logsock.bindSync('tcp://127.0.0.1:' + logPort)
  console.log('bound on port' + logPort)
  const log = (string, level, component) => {
    const payload = {
      string,
      level,
      component
    }
    logsock.send(['log', JSON.stringify(payload)])
  }
  return log
}

module.exports = {
  execute
}
