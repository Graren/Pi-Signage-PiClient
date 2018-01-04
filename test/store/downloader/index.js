const url = require('url');
const http = require('http');
const fs = require('fs');
const path = require('path')


const download = (fileUrl, name, format, cwd) => {
    const file = fs.createWriteStream(path.join(__dirname, '..', '..', 'C', 'static', `${name}.${format}`));
    var options = {
        host: url.parse(fileUrl).host,
        path: url.parse(fileUrl).pathname
    };
    console.log(fileUrl)

    return new Promise((resolve, reject) => {
        http.get(fileUrl, function(res) {
            res.on('data', function(data) {
                    file.write(data);
                }).on('end', function() {
                    file.end();
                    resolve({
                        data: file.path
                    })
                }).on('error', () => {
                    reject({
                        error: "Something ocurred"
                    })
                }) ;
            });
    })
}

module.exports = download

// Function to download file using HTTP.get



