const homedir = require('homedir')
const path = require('path')

const home = '/home/pi'

module.exports = {
  // appFolder: path.join(homedir(), '.digitalpignage'),
  appFolder: path.join(home, '.digitalpignage'),
  tokenFile: path.join(home, '.digitalpignage', 'TOKEN'),
  wifiCredentialsFile: '/etc/wpa_supplicant/wpa_supplicant.conf'
}
