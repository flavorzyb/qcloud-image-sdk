'use strict';

class QCloudConfig {
    /**
     * 构造函数
     * @param {string} appId
     * @param {string} secretId
     * @param {string} secretKey
     * @param {string} bucket
     * @param {string} region
     */
    constructor (appId, secretId, secretKey, bucket, region) {
        this._appId = appId;
        this._secretId = secretId;
        this._secretKey = secretKey;
        this._bucket = bucket;
        this._region = region;
    }

    /**
     * app id
     * @return {string}
     */
    get appId () {
        return this._appId;
    }

    /**
     * secret Id
     * @return {string}
     */
    get secretId () {
        return this._secretId;
    }

    /**
     * secretKey
     * @return {string}
     */
    get secretKey () {
        return this._secretKey;
    }

    /**
     * bucket
     * @return {string}
     */
    get bucket () {
        return this._bucket;
    }

    /**
     * region
     * @return {string}
     */
    get region () {
        return this._region;
    }
}

module.exports = QCloudConfig;
