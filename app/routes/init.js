const screenCode = require('../init/screenCode').code

const index = (req, res) => {
  res.render('init', {
    code: screenCode
  })
}

module.exports = (router) => {
  router.route('/')
    .get(index)
}
