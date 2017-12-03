const spawn = require('child_process').spawn;

module.exports = () => new Promise((resolve, reject) => {
  const child = spawn('iw dev wlan0 station dump');
  child.stdout.on('data', resolve);
  child.on('error', reject);
});
