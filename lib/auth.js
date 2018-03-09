'use strict';

const Crypto = require('crypto');
const QCloudConfig = require('./qcloud-config');

class Auth {
    /**
     * 认证的构造函数
     *
     * @param {QCloudConfig} config
     */
    constructor(config) {
        this.config = config;
    }

    /**
     * 签名
     *
     * @param {number} expireTime
     * @return {string}
     */
    sign(expireTime = 3600) {
        if (expireTime < 1) {
            return '';
        }

        const now = Math.floor(Date.now() / 1000);
        const expiration = now + expireTime;
        const random = Math.floor(Math.random() * 100000);
        const plainText = `a=${this.config.appId}&b=${this.config.bucket}&k=${this.config.secretId}&t=${now}&e=${expiration}&r=${random}`;

        const data = new Buffer(plainText, 'utf8');
        const res = Crypto.createHmac('sha1', this.config.secretKey).update(data).digest();
        const bin = Buffer.concat([res, data]);
        return bin.toString('base64');
    }
}

module.exports = Auth;

