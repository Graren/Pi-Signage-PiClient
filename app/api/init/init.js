const screenCode = require('../../init/screenCode').code
const fs = require('fs')
const path = require('path')
const socket = require('socket.io-client')('http://localhost:8080', {transports: ['websocket']})
const configPaths = require('../../configPaths')

const generateWpaSupplicant = (ssid, password) => {
  return `ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1

network={
        ssid="${ssid}"
        ${password ? `
        psk="${password}"
        key_mgmt=WPA-PSK` : ''}
}
`
}

exports.getScreen = (req, res) => {
  res.status(200).send({
    code: screenCode
  })
}

exports.setAuth = (req, res) => {
  const token = req.body.token

  if (!token) {
    return res.status(400).send()
  }

  fs.writeFile(configPaths.tokenFile, token, (err) => {
    if (err) {
      console.log(err)
      return res.status(400).send()
    }

    return res.status(200).send({
      message: 'Auth set up',
      token
    })
  })
}

exports.setWifiDetails = (req, res) => {
  const ssid = req.body.ssid
  const password = req.body.password

  if (!ssid) {
    return res.status(400).send()
  }

  fs.writeFile(configPaths.wifiCredentialsFile, generateWpaSupplicant(ssid, password), (err) => {
    if (err) {
      console.log(err)
      return res.status(400).send()
    }

    res.status(200).send({
      message: 'WiFi set up'
    })

    socket.emit('connect-wifi')
  })
}
