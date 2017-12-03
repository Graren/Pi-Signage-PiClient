const screenCode = require('../../init/screenCode').code;

exports.getScreen = (req, res) => {
  res.status(200).send({
    code: screenCode
  });
};

exports.setAuth = (req, res) => {
  const token = req.body.token;

  if (!token) {
    return res.status(400).send();
  }

  res.status(200).send({
    message: 'Auth set up',
    token
  });
};

exports.setWifiDetails = (req, res) => {
  const ssid = req.body.ssid;
  const password = req.body.password;

  if (!ssid || !password) {
    return res.status(400).send();
  }

  res.status(200).send({
    message: 'Wifi set up',
    ssid,
    password
  });
};
