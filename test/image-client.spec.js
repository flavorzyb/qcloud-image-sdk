'use strict';

const ImageClient = require('../lib/image-client');
const Config = require('./config');
const assert = require('assert');

describe('Image Client Class Test Case',  () => {

    const client = new ImageClient(Config.appId, Config.secretId, Config.secretKey, Config.bucket, Config.region);

    it('test liveGet success', function(done) {
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
        let cl = new ImageClient('', '', '', '', '');
        cl.liveGet()
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
        this.timeout(100000);
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
        this.timeout(100000);
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
        this.timeout(100000);
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
        this.timeout(20000);
        client.idCardLiveDetect(__dirname + '/1520487845679.mp4', '1234', '张登宇', '510524198904100552')
            .then((data) => {
                done();
                assert.equal(0, data.code);
            })
            .catch((err) => {
                done();
                assert.fail(err);
            })
    });
});
