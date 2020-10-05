import * as fs from 'fs';

export const readFile = (path: string, callback: (error: string | null, data?: Buffer) => void) => {
    try {
        fs.readFile(path, (error, data) => {
            if (error != null) {
                callback('nofile')
            } else {
                callback(null, data)
            }
        })
    } catch (error) {
        callback(error)
    }
}