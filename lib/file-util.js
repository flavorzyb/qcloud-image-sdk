'use strict';

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class FileUtil {
    /**
     * 计算文件的MD5
     * @param {string} filePath
     * @return {Promise<string>}
     */
    getFileMd5String (filePath) {
        return new Promise((resolve, reject) => {
            const md5Hash = crypto.createHash('md5');
            const stream = fs.createReadStream(filePath);

            stream.on('end', () => {
                return resolve(md5Hash.digest('hex'));
            });

            stream.on('error', (err) => {
                return reject(err);
            });

            stream.on('data', (data) => {
                md5Hash.update(data);
            });
        });
    }

    /**
     * 计算文件的MD5
     * @param {ReadStream} stream
     * @return {Promise<string>}
     */
    getStreamMd5String (stream) {
        return new Promise((resolve, reject) => {
            const md5Hash = crypto.createHash('md5');
            stream.on('end', () => {
                return resolve(md5Hash.digest('hex'));
            });

            stream.on('error', (err) => {
                return reject(err);
            });

            stream.on('data', (data) => {
                md5Hash.update(data);
            });
        });
    }

    /**
     * 获取MD5之后的文件路径
     *
     * @param filePath
     * @return {Promise<string>}
     */
    getMd5StringFilePath (filePath) {
        return this.getFileMd5String(filePath)
            .then((md5String) => {
                return md5String.substr(0, 2) + '/' + md5String.substr(2, 2) + '/' + md5String + path.extname(filePath);
            });
    }
}

const util = new FileUtil();

module.exports = util;
