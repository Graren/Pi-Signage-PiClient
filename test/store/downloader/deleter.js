const fs = require('fs');
const path = require('path')

const deleteFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath,(error) => {
            if(error){
                reject( new Error({error}) )
            }
            resolve({})
        })
    })
}

module.exports = deleteFile;
