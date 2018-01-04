const api = require('../api')

module.exports = (router) => {
  router.get('/screen', api.init.getScreen)
  router.post('/init/wifi', api.init.setWifiDetails)
  router.post('/init/auth', api.init.setAuth)
}
