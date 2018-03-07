'use strict';
var CryptoJS = require('crypto-js');

class Auth {
    /**
     * 认证的构造函数
     *
     * @param {String} appId
     * @param {String} secretId
     * @param {String} secretKey
     */
    constructor(appId, secretId, secretKey) {
        this.appId = appId;
        this.secretId = secretId;
        this.secretKey = secretKey;
    }

    /**
     * 签名
     *
     * @param {String} bucket
     * @param {Number} expireTime
     * @return {String}
     */
    sign(bucket, expireTime = 3600) {
        if (expireTime < 1) {
            return '';
        }

        const now = Date.now() / 1000;
        const expiration = now + expireTime;
        const random = Math.random();
        //a=[appid]&b=[bucket]&k=[SecretID]&e=[expiredTime]&t=[currentTime]&r=[rand]&u=[userid]&f=[fileid]
        const plainText = `a=${this.appId}&b=${bucket}&k=${this.secretId}&e=${expiration}&t=${now}&r=${random}`;
        const res = CryptoJS.HmacSHA1(plainText, this.secretKey);
        let result = new Buffer(res.toString() + plainText, 'utf8');
        return result.toString('base64');
    }
}

module.exports = Auth;

