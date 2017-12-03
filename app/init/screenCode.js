const randomstring = require('randomstring');

const code = randomstring.generate({
  length: 4,
  charset: 'alphanumeric'
});

module.exports = {
  code
};
