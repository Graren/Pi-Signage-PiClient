/**
 * Module dependencies.
 */
const express = require('express')
const compression = require('compression')
const session = require('express-session')
const bodyParser = require('body-parser')
const sass = require('node-sass-middleware')
const logger = require('morgan')
const chalk = require('chalk')
const errorHandler = require('errorhandler')
const dotenv = require('dotenv')
const flash = require('express-flash')
const path = require('path')
const expressValidator = require('express-validator')
const fetch = require('node-fetch')
const expressStatusMonitor = require('express-status-monitor')
const socketIO = require('socket.io')
const scripts = require('./scripts')
const configPaths = require('./app/configPaths')
const fs = require('fs')
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' })

/**
 * Create Express server.
 */

const host = process.env.REMOTE_SIGNAGE_SERVER || '192.168.1.114:8000'
const app = express()
const server = require('http').createServer(app)

const io = socketIO(server)
app.io = io

const startWifiMode = () => {
  require('child_process').spawn(
    'sh',
    [path.join(configPaths.appFolder, 'start_wifi_client.sh')],
    {
      stdio: 'inherit'
    }
  )
}

const startApMode = () => {
  require('child_process').spawn(
    'sh',
    [path.join(configPaths.appFolder, 'start_wifi_ap.sh')],
    {
      stdio: 'inherit'
    }
  )
}

const readToken = () =>
  new Promise((resolve, reject) => {
    fs.readFile(configPaths.tokenFile, 'utf8', (err, token) => {
      if (err) {
        reject(err)
      }

      resolve(token.replace('\n', ''))
    })
  })

const getDeviceInfo = () =>
  readToken()
    .then(token => {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      return fetch(`http://${host}/api/v1/dispositivo/info`, { headers })
    })
    .then(res => res.json())

const initApp = () => {
  readToken()
    .then(token => {
      if (!token) {
        throw new Error('No token')
      }
      startWifiMode()
      return new Promise(resolve => setTimeout(resolve, 15000))
    })
    .then(() => getDeviceInfo())
    .then(() => {
      io.emit('location', { location: 'signage' })
    })
    .catch(e => {
      console.log(e)
      startApMode()
      io.emit('location', { location: 'init' })
    })
}

const initSignage = () => {
  io.emit('location', { location: 'signage' })
}

io.on('connection', socket => {
  let clientConnectedToAP = false
  const listenClientsInterval = setInterval(() => {
    scripts
      .getApClientsList()
      .then(clientsList => {
        if (!clientConnectedToAP && clientsList.length > 0) {
          clientConnectedToAP = true
          socket.emit('init-event', {
            section: 'init-create-screen',
            data: {}
          })
        }
      })
      .catch(err => {
        if (clientConnectedToAP) {
          // socket.emit('location', { location: 'init' })
          clientConnectedToAP = false
        }
      })
  }, 2000)

  socket.on('request-saved-state', () => {
    fs.readFile(
      path.join(__dirname, 'test', 'store', 'store', 'state.json'),
      'utf8',
      function (err, data) {
        if (err) return
        const state = JSON.parse(data)
        socket.emit('current-state', state)
      }
    )
  })

  socket.on('connect-wifi', () => {
    let connectTimeout = null
    let checkInternetInterval = null
    const hasInternet = false
    clientConnectedToAP = false

    startWifiMode()
    readToken()
      .then(token => {
        connectTimeout = setTimeout(() => {
          if (!hasInternet) {
            startApMode()
          }
          clearInterval(checkInternetInterval)
          console.log('definitivamente no hay internet')
        }, 30000)
        checkInternetInterval = setInterval(() => {
          const opts = {
            method: 'post',
            body: JSON.stringify({ token })
          }
          fetch(`http://${host}/api/v1/dispositivo/activar/`, opts)
            .then(res => {
              if (res.status === 200) {
                clearInterval(checkInternetInterval)
                clearTimeout(connectTimeout)
                initSignage()
              } else {
                console.log('no')
              }
            })
            .catch(() => {
              console.log('no')
            })
        }, 6000)
      })
      .catch(console.log)
  })
})

const zmq = require('zeromq')

const subsock = zmq.socket('sub')
const { wbPort } = require('./test/config/constants')

subsock.connect(`tcp://127.0.0.1:${wbPort}`)
subsock.subscribe('client')

subsock.on('message', (topic, message) => {
  const state = JSON.parse(message)
  io.emit('current-state', state)
})

/**
 * Express configuration.
 */
app.set('host', '0.0.0.0')
app.set('port', 8080)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.use(expressStatusMonitor())
app.use(compression())
app.use(
  sass({
    debug: true,
    src: path.join(__dirname, 'stylesheets'),
    dest: path.join(__dirname, 'public')
  })
)
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(expressValidator())
// app.use(flash());
app.use((req, res, next) => {
  // res.locals.user = req.user;
  next()
})
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  // if (!req.user &&
  //     req.path !== '/login' &&
  //     req.path !== '/signup' &&
  //     !req.path.match(/^\/auth/) &&
  //     !req.path.match(/\./)) {
  //   req.session.returnTo = req.path;
  // } else if (req.user &&
  //     req.path === '/account') {
  //   req.session.returnTo = req.path;
  // }
  next()
})
app.use((req, res, next) => {
  res.setHeader('Expires', '-1')
  res.setHeader('Cache-Control', 'no-cache')
  next()
})
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }))
app.use('/static', express.static(path.join(__dirname, 'test', 'A', 'static')))

// Add routes
require('./app/routes/index')(app)

/**
 * Error Handler.
 */
app.use(errorHandler())

/**
 * Start Express server.
 */
server.listen(app.get('port'), app.get('host'), () => {
  console.log(
    '%s App is running at http://localhost:%d in %s mode',
    chalk.green('✓'),
    app.get('port'),
    app.get('env')
  )
  console.log('  Press CTRL-C to stop\n')
  initApp()
})
