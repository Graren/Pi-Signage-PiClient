const paths = require('path')
const fs = require('fs')
const colors = require('colors')
const zmq = require('zeromq')
const subsock = zmq.socket('sub')
const { logPort } = require('../config/constants')
const { levels } = require('../config/constants')

class Logger {
  constructor (config) {
    let { path, useConsole } = config
    path = path || paths.resolve('.', 'log', (new Date()).toISOString().replace(/T(\D|\.|\S)*/, '') + '.log')
    if (!fs.existsSync(paths.resolve('.', 'log'))) {
      fs.mkdirSync(paths.resolve('.', 'log'))
    }
    this.path = path
    this.useConsole = useConsole || false
  }

  static getInstance (config) {
    if (!this.instance) {
      this.instance = new Logger(config)
    }
    return this.instance
  }

  log (string, level, component) {
    component = component || ''
    if (this.useConsole) {
      switch (level) {
        case levels.DEBUG:
          console.log(string.green)
          break
        case levels.WARNING:
          console.log(string.yellow)
          break
        case levels.ERROR:
          console.log(string.red)
          break
        default:
          console.log(string.blue)
          break
      }
    }

    try {
      const printLevel = level === levels.DEBUG ? 'DEBUG' : level === levels.WARNING ? 'WARNING' : level = levels.ERROR ? 'ERROR' : 'LOG'
      const message = `${printLevel} : ${component} - ${(new Date()).toISOString()}: ${string}  \n`
      fs.appendFile(this.path, message, function (err) {
        if (err) throw err
      })
    } catch (e) {
      this.log(e.toString(), levels.ERROR)
    }
  }
}

const test = () => {
  const config = {
    useConsole: true
  }
  const log = Logger.getInstance(config)
  const { DEBUG, WARNING, ERROR } = levels
  log.log('hello', DEBUG)
  log.log('helloWarning', WARNING)
  log.log('helloError', ERROR)
  const log2 = Logger.getInstance()
  log2.log('hello', DEBUG)
  log2.log('helloWarning', WARNING)
  log2.log('helloError', ERROR)
}

const config = {
  useConsole: true
}

const logger = Logger.getInstance(config)

subsock.connect('tcp://127.0.0.1:' + logPort)
subsock.subscribe('log')

console.log('logger on ' + logPort)

subsock.on('message', function (topic, message) {
  const { string, level, component } = JSON.parse(message)
  logger.log(string, level || levels.DEBUG, component)
})

module.exports = {
  Logger,
  ...levels
}
