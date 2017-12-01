/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.render('signage', {
    title: 'Home'
  });
};
