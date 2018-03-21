'use strict';

const fs = require('fs');
const Auth = require('./auth');
const UrlConfig = require('./url-config');
const FileUtil = require('./file-util');
const COSFactory = require('./cos-factory');
const Request = require('./request');

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
     * @param {boolean} isFront
     * @return {Promise<Object>}
     */
    idCardDetect (imagePath, isFront = true) {
        return FileUtil.getMd5StringFilePath(imagePath)
            .then((key) => {
                return this.uploadFile(key, imagePath)
                    .then((url) => {
                        const options = {
                            uri: UrlConfig.idcardDetectUrl,
                            body: {
                                appid: this.config.appId,
                                bucket: this.config.bucket,
                                card_type: isFront ? 0 : 1,
                                url_list:[url]},
                        };

                        if (this.config.proxy) {
                            options.proxy = this.config.proxy;
                        }

                        return Request.request(options, this.auth, this.expireTime)
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
        if (this.config.proxy) {
            options.proxy = this.config.proxy;
        }
        return Request.request(options, this.auth, this.expireTime);
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

                if (this.config.proxy) {
                    options.proxy = this.config.proxy;
                }

                return Request.request(options, this.auth, this.expireTime);
            });
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
            const cos = COSFactory.builder({SecretId: this.config.secretId, SecretKey: this.config.secretKey, Proxy: this.config.proxy});
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
}

module.exports = ImageClient;
