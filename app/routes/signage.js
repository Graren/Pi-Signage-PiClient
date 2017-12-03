const index = (req, res) => {
  res.render('signage', {
    title: 'Digital Signage'
  });
};

module.exports = (router) => {
  router.route('/')
    .get(index);
};
