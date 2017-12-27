/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const sass = require('node-sass-middleware');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const flash = require('express-flash');
const path = require('path');
const expressValidator = require('express-validator');
const fetch = require('node-fetch');
const expressStatusMonitor = require('express-status-monitor');
const socketIO = require('socket.io');
const scripts = require('./scripts');
const configPaths = require('./app/configPaths');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

/**
 * Create Express server.
 */

const app = express();
const server = require('http').createServer(app);
const io = socketIO(server);
app.io = io;

io.on('connection', (socket) => {
  let clientConnectedToAP = false;
  const listenClientsInterval = setInterval(() => {
    scripts.getApClientsList()
      .then((clientsList) => {
        if (!clientConnectedToAP && clientsList.length > 0) {
		  clientConnectedToAP = true;
		  socket.emit('init-event', { section: 'init-create-screen', data: {} });	
        }
      })
      .catch((err) => {
	    if (clientConnectedToAP) {
		  socket.emit('location', { location: 'init' });	
		  clientConnectedToAP = false;
	    }
      });
  }, 2000);
  
socket.on('connect-wifi', () => {
  let connectTimeout, checkInternetInterval;
  require('child_process').spawn('sh', [path.join(configPaths.appFolder, 'start_wifi_client.sh')], { stdio: 'inherit' });
  let hasInternet = false;
  connectTimeout = setTimeout(() => {
    if(!hasInternet) {
      require('child_process').spawn('sh', [path.join(configPaths.appFolder, 'start_wifi_ap.sh')], { stdio: 'inherit' });
    }
    clearInterval(checkInternetInterval);
    console.log('definitivamente no ha internet');
  }, 30000);
  checkInternetInterval = setInterval(() => {
    fetch('http://doihaveinternet.com')
      .then(res => {
         clearInterval(checkInternetInterval);
         clearTimeout(connectTimeout);
         console.log('yes');
       })
       .catch(() => {
          console.log('no');
       });
  }, 6000);
});
});

/**
 * Express configuration.
 */
app.set('host', '0.0.0.0');
app.set('port', 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(expressStatusMonitor());
app.use(compression());
app.use(sass({
  debug: true,
  src: path.join(__dirname, 'stylesheets'),
  dest: path.join(__dirname, 'public')
}));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
// app.use(flash());
app.use((req, res, next) => {
  // res.locals.user = req.user;
  next();
});
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
  next();
});
app.use((req, res, next) => {
  res.setHeader('Expires', '-1');
  res.setHeader('Cache-Control', 'no-cache');
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

// Add routes
require('./app/routes/index')(app);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
server.listen(app.get('port'), app.get('host'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});
