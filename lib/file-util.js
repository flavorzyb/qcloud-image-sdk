'use strict';

const crypto = require('crypto');
const fs = require('fs');

class FileUtil {
    /**
     * 计算文件的MD5
     * @param filePath
     * @return {Promise<string>}
     */
    getFileMd5String(filePath) {
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
     * 获取文件扩展名
     *
     * @param {string} filePath
     * @return {string}
     */
    getFileExtName(filePath) {
        if (filePath && filePath.length > 0) {
            const index = filePath.lastIndexOf('.');
            if (index >= 0 && filePath.length > 1) {
                return filePath.substr(index + 1);
            }
        }

        return '';
    }
}

const util = new FileUtil();

module.exports = util;
