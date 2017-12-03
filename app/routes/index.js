const express = require('express');
const changeCase = require('change-case');
const routes = require('require-dir')();

module.exports = (app) => {
  // Initialize all routes
  Object.keys(routes).forEach((routeName) => {
    const router = express.Router();
    // Initialize the route to add its functionality to router
    require('./' + routeName)(router);

    // Add router to the speficied route name in the app
    app.use(`/${changeCase.paramCase(routeName)}`, router);
  });
};
