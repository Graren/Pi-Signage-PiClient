const spawn = require('child_process').spawn

module.exports = () => new Promise((resolve, reject) => {
  const child = spawn('iw', ['dev', 'wlan0', 'station', 'dump'])
  child.stdout.on('data', data => {
    const stationsInfo = data.toString()
    const stationsRegex = /Station ((?:.)+?) /g
    let match = stationsRegex.exec(stationsInfo)
    const apClientsList = []
    while (match != null) {
      apClientsList.push(match[1])
      match = stationsRegex.exec(stationsInfo)
    }
	  resolve(apClientsList)
  })
  child.on('error', reject)
  child.on('exit', reject)
})
