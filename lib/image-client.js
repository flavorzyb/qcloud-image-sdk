'use strict';

const rp = require('request-promise');
const fs = require('fs');
const Auth = require('./auth');
const UrlConfig = require('./url-config');
const FileUtil = require('./file-util');
const COSFactory = require('./cos-factory');

class ImageClient {

    /**
     * 构造函数
     * @param {QCloudConfig} config
     * @param {number} expireTime
     */
    constructor (config, expireTime = 3600) {
        this.config = config;
        this.expireTime = expireTime;
        this.auth = new Auth(config);
    }

    /**
     * 身份证识别
     *
     * @param {string} imagePath
     * @return {Promise<Object>}
     */
    idCardDetect (imagePath) {
        return FileUtil.getMd5StringFilePath(imagePath)
            .then((key) => {
                return this.uploadFile(key, imagePath)
                    .then((url) => {
                        const options = {
                            uri: UrlConfig.idcardDetectUrl,
                            body: {appid: this.config.appId, bucket: this.config.bucket, url_list:[url]},
                        };

                        return this.request(options)
                            .then((result) => {
                                return Promise.resolve(result.result_list[0]);
                            });
                    });
            });
    }

    /**
     * 活体检测—获取唇语验证码
     *
     * @return {Promise<Object>}
     */
    liveGet () {
        const options = {
            uri: UrlConfig.liveGetUrl,
            body: {appid: this.config.appId},
        };
        return this.request(options);
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
    idCardLiveDetect (videoPath, validateString, idCardName, idCardNumber) {
        return FileUtil.getMd5StringFilePath(videoPath)
            .then((filePath) => {
                const formData = {
                    appid: this.config.appId,
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
                    uri: UrlConfig.idCardLiveDetectUrl,
                    formData: formData,
                };

                return this.request(options);
            });
    }

    /**
     * 构造通用header头
     *
     * @return {{Host: string, Authorization: string}}
     */
    buildHeader () {
        return {
            'Host': UrlConfig.host,
            'Authorization': this.auth.sign(this.expireTime),
        };
    }

    /**
     * 上传文件到bucket
     *
     * @param {string} fileName
     * @param {string} filePath
     * @return {Promise<string>}
     */
    uploadFile (fileName, filePath) {
        return new Promise((resolve, reject) => {
            const cos = COSFactory.builder({SecretId: this.config.secretId, SecretKey: this.config.secretKey});
            const options = {
                Bucket: this.config.bucket + '-' + this.config.appId,
                Region: this.config.region,
                Key: fileName,
                FilePath: filePath
            };
            cos.sliceUploadFile(options, function (err, data) {
                if (err) {
                    return reject(err);
                }
                return resolve(data.Location);
            });
        });
    }

    /**
     * 封装请求
     *
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    request (options) {
        if (!options.hasOwnProperty('timeout')) {
            options.timeout = UrlConfig.timeout;
        }

        if (!options.hasOwnProperty('json')) {
            options.json = true;
        }

        if (!options.hasOwnProperty('headers')) {
            options.headers = this.buildHeader();
        }

        if (!options.hasOwnProperty('method')) {
            options.method = 'POST';
        }

        return rp(options)
            .then((data) => {
                return Promise.resolve(data);
            })
            .catch((err) => {
                if (err.response && err.response.body) {
                    return Promise.reject(err.response.body);
                }

                return Promise.reject(err);
            });
    }
}

module.exports = ImageClient;
