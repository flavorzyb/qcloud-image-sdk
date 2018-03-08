'use strict';
const crypto = require('crypto');

class Auth {
    /**
     * 认证的构造函数
     *
     * @param {string} appId
     * @param {string} secretId
     * @param {string} secretKey
     */
    constructor(appId, secretId, secretKey) {
        this.appId = appId;
        this.secretId = secretId;
        this.secretKey = secretKey;
    }

    /**
     * 签名
     *
     * @param {string} bucket
     * @param {number} expireTime
     * @return {string}
     */
    sign(bucket, expireTime = 3600) {
        if (expireTime < 1) {
            return '';
        }

        const now = Math.floor(Date.now() / 1000);
        const expiration = now + expireTime;
        const random = Math.floor(Math.random() * 100000);
        const plainText = `a=${this.appId}&b=${bucket}&k=${this.secretId}&t=${now}&e=${expiration}&r=${random}`;

        const data = new Buffer(plainText, 'utf8');
        const res = crypto.createHmac('sha1', this.secretKey).update(data).digest();
        const bin = Buffer.concat([res, data]);
        return bin.toString('base64');
    }
}

module.exports = Auth;

