'use strict';

const muk = require('muk');
const assert = require('assert');
const nock = require('nock');
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
        });
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

    // it('test idCardDetect fail', function (done) {
    //     this.timeout(100000);
    //     client.idCardDetect(__dirname + "/test.jpg")
    //         .then((data) => {
    //             done();
    //             assert.fail(data);
    //         })
    //         .catch((err) => {
    //             done();
    //             assert.notEqual(0, err.code);
    //         });
    // });
    //
    // it('test idCardLiveDetect success', function (done) {
    //     this.timeout(20000);
    //     client.idCardLiveDetect(__dirname + '/1520487845679.mp4', '1234', '张登宇', '510524198904100552')
    //         .then((data) => {
    //             done();
    //             assert.equal(0, data.code);
    //         })
    //         .catch((err) => {
    //             done();
    //             assert.fail(err);
    //         })
    // });
});
