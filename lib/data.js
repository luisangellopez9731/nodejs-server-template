const fs = require('fs')

const lib = { }

lib.readFile = (path, callback) => {
    try {
        fs.readFile(path, (error, data) => {
            if(error != null) {
                callback('nofile')
            }else {
                callback(null, data)
            }
        })
    } catch (error) {
        callback(error)
    }
}

module.exports = lib