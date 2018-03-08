'use strict';

const Auth = require('./auth');
const UrlConfig = require('./url-config');
const rp = require('request-promise');
const COS = require('cos-nodejs-sdk-v5');

class ImageClient {

    /**
     * 构造函数
     * @param {String} appId
     * @param {String} secretId
     * @param {String} secretKey
     * @param {String} bucket
     * @param {Number} expireTime
     */
    constructor(appId, secretId, secretKey, bucket, expireTime = 3600) {
        this.appId = appId;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.bucket = bucket;
        this.expireTime = expireTime;
        this.auth = new Auth(appId, secretId, secretKey);
    }

    idcardDetectFront(imagePath) {
    }

    idcardDetectBack(imagePath) {
    }

    /**
     * 活体检测—获取唇语验证码
     *
     * @return {Promise<Object>}
     */
    liveGet() {
        const options = {
            method: 'POST',
            uri: UrlConfig.liveGetUrl,
            json: true,
            headers: this.buildHeader(),
            body: {appid: this.appId},
        };
        return rp(options)
            .then((data) => {
                return Promise.resolve(data);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }

    idCardCompare(imagePath, idCardNumber, idCardName) {
    }

    idCardLiveDetect(videoPath, validateString, idCardNumber, idCardName) {
    }

    /**
     * 构造通用header头
     *
     * @return {{Host: string, Authorization: string}}
     */
    buildHeader() {
        return {
            'Host': UrlConfig.host,
            'Authorization': this.auth.sign(this.bucket, this.expireTime),
        };
    }

    uploadFile(filePath) {
        return new Promise((resolve, reject) => {
            const cos = new COS({AppId: this.appId, SecretId: this.secretId, SecretKey: this.secretKey});
            cos.sliceUploadFile({Bucket: this.bucket, Region:'', Key:'', FilePath: ''}, function (err, data) {
                if (err) {
                    return reject(err);
                }

                return resolve(data);
            });
        });

    }
}

module.exports = ImageClient;
