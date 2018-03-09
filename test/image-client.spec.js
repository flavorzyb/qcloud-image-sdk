'use strict';

const muk = require('muk');
const assert = require('assert');
const nock = require('nock');
const fs = require('fs');
const ImageClient = require('../lib/image-client');
const QCloudConfig = require('../lib/qcloud-config');
const COSFactory = require('../lib/cos-factory');
const FileUtil = require('../lib/file-util');

describe('Image Client Class Test Case',  () => {
    const config = new QCloudConfig('appId', 'secretId', 'secretKey', 'bucket', 'region');
    const client = new ImageClient(config);

    afterEach(function () {
        muk.restore();
    });

    it('test liveGet success', function(done) {
        const result = {
            "data":{
                "validate_data": "9532",
            },
            "code":0,
            "message":"OK"
        };
        nock('https://service.image.myqcloud.com').post('/face/livegetfour').reply(200, result);
        client.liveGet()
            .then((data) => {
                done();
                assert.equal(true, data.data.validate_data.length > 1);
            })
            .catch((error) => {
                done();
                assert.fail(error);
            });
    });

    it('test liveGet fail', function(done) {
        const result = {
            "code": 4,
            "message": "has no sign or sign is empty",
            "data": {}
        };
        nock('https://service.image.myqcloud.com').post('/face/livegetfour').reply(400, result);
        client.liveGet()
            .then((data) => {
                done();
                assert.fail(data);

            })
            .catch((error) => {
                done();
                assert.notEqual(null, error);
            });
    });

    it('test upload file success', function (done) {
        muk(COSFactory, 'builder', function () {
            return {
                sliceUploadFile(body, cb) {
                    cb(null, {Location: 'test'});
                }
            };
        });
        client.uploadFile("test", __dirname + "/test.jpg")
            .then((data) => {
                done();
                assert.equal(true, data.length > 0);
            })
            .catch((err) => {
                done();
                assert.fail(err);
            });
    });

    it('test upload file fail', function (done) {
        muk(COSFactory, 'builder', function () {
            return {
                sliceUploadFile(body, cb) {
                    cb(new Error('error'), {});
                }
            };
        });
        client.uploadFile("test", __dirname + "/test_no_exist.jpg")
            .then((data) => {
                done();
                assert.fail(data);
            })
            .catch((err) => {
                done();
                assert.notEqual(null, err);
            });
    });

    it('test idCardDetect success', function (done) {
        muk(FileUtil, 'getMd5StringFilePath', function () {
            return Promise.resolve('ob/n9/obn9hw5pzgf0346i80lu9rwglfxuoa7j.jpg');
        });

        muk(client, 'uploadFile', function () {
            return Promise.resolve('http://www.test.com');
        });

        const result = {
            "result_list": [
                {
                    "code": 0,
                    "message": "OK",
                    "url": " http://www.test.com/bbb.jpg",
                    "data": {
                        "name": "某某某",
                        "sex": "女",
                        "nation": "汉",
                        "birth": "2001/1/1",
                        "address": "某地",
                        "id": "123456200101011234",
                        "name_confidence_all": [
                            38,28,55
                        ],
                        "sex_confidence_all": [
                            28
                        ],
                        "nation_confidence_all": [
                            34
                        ],
                        "birth_confidence_all": [
                            38, 38, 20, 46, 50, 49
                        ],
                        "address_confidence_all": [
                            13, 30,
                        ],
                        "id_confidence_all": [
                            49, 50, 58, 63, 51, 52, 55, 48, 48, 47, 58, 47, 48, 56,
                            45, 55, 54, 47
                        ]
                    }
                }
            ]
        };

        nock('https://recognition.image.myqcloud.com').post('/ocr/idcard').reply(200, result);

        client.idCardDetect(__dirname + "/id_card_front.jpg")
            .then((data) => {
                done();
                assert.equal(0, data.code);
            })
            .catch((err) => {
                done();
                assert.fail(err);
            });
    });

    it('test idCardDetect fail', function (done) {
        muk(FileUtil, 'getMd5StringFilePath', function () {
            return Promise.resolve('ob/n9/obn9hw5pzgf0346i80lu9rwglfxuoa7j.jpg');
        });

        muk(client, 'uploadFile', function () {
            return Promise.resolve('http://www.test.com');
        });

        const result = {
            "code": 4,
            "message": "has no sign or sign is empty",
            "data": {}
        };
        nock('https://recognition.image.myqcloud.com').post('/ocr/idcard').reply(400, result);

        client.idCardDetect(__dirname + "/test.jpg")
            .then((data) => {
                done();
                assert.fail(data);
            })
            .catch((err) => {
                done();
                assert.notEqual(0, err.code);
            });
    });

    it('test idCardLiveDetect success', function (done) {
        muk(FileUtil, 'getMd5StringFilePath', function () {
            return Promise.resolve('ob/n9/obn9hw5pzgf0346i80lu9rwglfxuoa7j.mp4');
        });

        muk(fs, 'createReadStream', function () {
            return new Buffer("test", 'utf8');
        });

        const result = {
            "data":{
                "live_status":0,
                "live_msg":"OK",
                "compare_status":0,
                "compare_msg":"OK",
                "sim":90,
                "video_photo":"xxxxxxxxxxxxxx",
            },
            "code":0,
            "message":"OK"
        };
        nock('https://service.image.myqcloud.com').post('/face/idcardlivedetectfour').reply(200, result);

        client.idCardLiveDetect(__dirname + '/1520487845679.mp4', '1234', '艾米', '12345677899')
            .then((data) => {
                done();
                assert.equal(0, data.code);
            })
            .catch((err) => {
                done();
                assert.fail(err);
            })
    });

    it('test idCardLiveDetect fail', function (done) {
        muk(FileUtil, 'getMd5StringFilePath', function () {
            return Promise.resolve('ob/n9/obn9hw5pzgf0346i80lu9rwglfxuoa7j.mp4');
        });

        muk(fs, 'createReadStream', function () {
            return new Buffer("test", 'utf8');
        });

        const result = {
            "code": 4,
            "message": "has no sign or sign is empty",
            "data": {}
        };
        nock('https://service.image.myqcloud.com').post('/face/idcardlivedetectfour').reply(400, result);

        client.idCardLiveDetect(__dirname + '/1520487845679.mp4', '1234', '艾米', '12345677899')
            .then((data) => {
                done();
                assert.fail(data);
            })
            .catch((err) => {
                done();
                assert.notEqual(null, err);
            })
    });
});
