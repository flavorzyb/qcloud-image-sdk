'use strict';

const Auth = require('./auth');
const UrlConfig = require('./url-config');
const rp = require('request-promise');
const COS = require('cos-nodejs-sdk-v5');
const FileUtil = require('./file-util');
const fs = require('fs');

class ImageClient {

    /**
     * 构造函数
     * @param {string} appId
     * @param {string} secretId
     * @param {string} secretKey
     * @param {string} bucket
     * @param {string} region
     * @param {number} expireTime
     */
    constructor(appId, secretId, secretKey, bucket, region, expireTime = 3600) {
        this.appId = appId;
        this.secretId = secretId;
        this.secretKey = secretKey;
        this.bucket = bucket;
        this.region = region;
        this.expireTime = expireTime;
        this.auth = new Auth(appId, secretId, secretKey);
    }

    /**
     * 身份证识别
     *
     * @param {string} imagePath
     * @return {Promise<Object>}
     */
    idCardDetect(imagePath) {
        return this.getMd5StringFilePath(imagePath)
            .then((key) => {
                return this.uploadFile(key, imagePath)
                    .then((url) => {
                        const options = {
                            method: 'POST',
                            uri: UrlConfig.idcardDetectUrl,
                            json: true,
                            headers: this.buildHeader(),
                            body: {appid: this.appId, bucket: this.bucket, url_list:[url]},
                        };

                        return rp(options)
                            .then((data) => {
                                return Promise.resolve(data.result_list[0]);
                            })
                            .catch((error) => {
                                return Promise.reject(error.response.body);
                            });
                    });
            });
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
                return Promise.reject(error.response.body);
            });
    }

    /**
     * 唇语活体检测视频身份信息核验
     *
     * @param {string} videoPath
     * @param {string} validateString
     * @param {string} idCardNumber
     * @param {string} idCardName
     * @return {Promise<Object>}
     */
    idCardLiveDetect(videoPath, validateString, idCardName, idCardNumber) {
        return this.getMd5StringFilePath(videoPath)
            .then((filePath) => {
                const formData = {
                    appid: this.appId,
                    validate_data: validateString,
                    video: {
                        value: fs.createReadStream(videoPath),
                        options: {
                            filename: filePath,
                        }
                    },
                    idcard_number: idCardNumber,
                    idcard_name: idCardName,
                };

                const options = {
                    method: 'POST',
                    json: true,
                    uri: UrlConfig.idCardLiveDetectUrl,
                    headers: this.buildHeader(),
                    formData: formData,
                };

                return rp(options)
                    .then((data) => {
                        return Promise.resolve(data);
                    })
                    .catch((error) => {
                        return Promise.reject(error.response.body);
                    });
            });
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

    /**
     * 上传文件到bucket
     *
     * @param {string} fileName
     * @param {string} filePath
     * @return {Promise<string>}
     */
    uploadFile(fileName, filePath) {
        return new Promise((resolve, reject) => {
            const cos = new COS({SecretId: this.secretId, SecretKey: this.secretKey});
            cos.sliceUploadFile({Bucket: this.bucket + "-" + this.appId, Region: this.region, Key: fileName, FilePath: filePath}, function (err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(data.Location);
            });
        });
    }

    /**
     * 获取MD5之后的文件路径
     *
     * @param filePath
     * @return {Promise<string>}
     */
    getMd5StringFilePath(filePath) {
        return FileUtil.getFileMd5String(filePath)
            .then((md5String) => {
                return md5String.substr(0, 2) + '/' + md5String.substr(2, 2) + '/' + md5String + '.' + FileUtil.getFileExtName(filePath);
            });
    }
}

module.exports = ImageClient;
