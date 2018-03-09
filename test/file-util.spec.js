'use strict';
const assert = require('assert');
const FileUtil = require('../lib/file-util');

describe('FileUtil Class Test Case', function () {
    it('test getFileMd5String success', function (done) {
        FileUtil.getFileMd5String(__dirname + '/test.jpg')
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
        FileUtil.getFileMd5String(__dirname + '/test_no_exist.jpg')
            .then((data) => {
                done();
                assert.fail(data);
            })
            .catch((err)=>{
                done();
                assert.notEqual(null, err);
            });
    });

    it('test getFileExtName success', function () {
        assert.equal('', FileUtil.getFileExtName(''));
        assert.equal('', FileUtil.getFileExtName('.'));
        assert.equal('ext', FileUtil.getFileExtName('.ext'));
        assert.equal('png', FileUtil.getFileExtName('test.png'));
        assert.equal('png', FileUtil.getFileExtName('/tmp/aaa/bbb.test.png'));
    });

    it('test getMd5StringFilePath success', function (done) {
        FileUtil.getMd5StringFilePath(__dirname + '/test.jpg')
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
        FileUtil.getMd5StringFilePath(__dirname + '/test_no_exist.jpg')
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
