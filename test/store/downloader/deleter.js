const fs = require('fs');
const path = require('path')

const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath,(err) => {
            if(err){
                reject({error: 'Could not delete file'})
            }
            resolve({})
        })
    })
}

module.exports = deleteFile;
