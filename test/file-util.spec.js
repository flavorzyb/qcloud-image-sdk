'use strict';
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const FileUtil = require('../lib/file-util');


describe('FileUtil Class Test Case', function () {
    it('test getFileMd5String success', function (done) {
        FileUtil.getFileMd5String(path.join(__dirname, 'test.jpg'))
            .then((data) => {
                done();
                assert.equal(32, data.length);
            })
            .catch((err)=>{
                done();
                assert.fail(err);
            });
    });

    it('test getFileMd5String fail', function (done) {
        FileUtil.getFileMd5String(path.join(__dirname, 'test_no_exist.jpg'))
            .then((data) => {
                done();
                assert.fail(data);
            })
            .catch((err)=>{
                done();
                assert.notEqual(null, err);
            });
    });

    it('test getMd5StringFilePath success', function (done) {
        FileUtil.getMd5StringFilePath(path.join(__dirname, 'test.jpg'))
            .then((result) => {
                done();
                assert.equal(true, result.length > 32);
            })
            .catch((err) => {
                done();
                assert.fail(err);
            });
    });

    it('test getMd5StringFilePath fail', function (done) {
        FileUtil.getMd5StringFilePath(path.join(__dirname, 'test_no_exist.jpg'))
            .then((result) => {
                done();
                assert.fail(result);
            })
            .catch((err) => {
                done();
                assert.notEqual(null, err);
            });
    });

    it('test getStreamMd5String success', function (done) {
        FileUtil.getStreamMd5String(fs.createReadStream(path.join(__dirname, 'test.jpg')))
            .then((result) => {
                done();
                assert.equal(true, result.length === 32);
            })
            .catch((err) => {
                done();
                assert.fail(err);
            });
    });

    it('test getStreamMd5String fail', function (done) {
        FileUtil.getStreamMd5String(fs.createReadStream(path.join(__dirname, 'test_no_exist.jpg')))
            .then((result) => {
                done();
                assert.fail(result);
            })
            .catch((err) => {
                done();
                assert.notEqual(null, err);
            });
    });
});
