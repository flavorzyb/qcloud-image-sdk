'use strict';

const assert = require('assert');
const nock = require('nock');
const Request = require('../lib/request');
const Auth = require('../lib/auth');
const QCloudConfig = require('../lib/qcloud-config');

describe('Request Class Test Case', function () {
    const auth = new Auth(new QCloudConfig('appId', 'secretId', 'secretKey', 'bucket', 'region'));
    const expireTime = 3600;

    it('test request success', function (done) {
        nock('https://service.image.myqcloud.com').post('/face/idcardlivedetectfour').delay(10).reply(200, {message:'ok'});
        const options = {
            uri: 'https://service.image.myqcloud.com/face/idcardlivedetectfour',
            body: {appId: 'appId'},
            timeout: 100,
            json: true,
            method: 'POST',
            headers: {host: 'service.image.myqcloud.com'},
        };
        Request.request(options, auth, expireTime)
            .then((data) => {
                done();
                assert.strictEqual('ok', data.message);
            })
            .catch((err) => {
                done();
                assert.fail(err);
            });
    });


    it('test request timeout', function (done) {
        nock('https://service.image.myqcloud.com').post('/face/idcardlivedetectfour').delay(20).reply(400, {});
        const options = {
            uri: 'https://service.image.myqcloud.com/face/idcardlivedetectfour',
            body: {appId: 'appId'},
            timeout: 10,
            json: true,
            method: 'POST',
            headers: {host: 'service.image.myqcloud.com'},
        };
        Request.request(options, auth, expireTime)
            .then((data) => {
                done();
                assert.fail(data);
            })
            .catch((err) => {
                done();
                assert.notEqual(null, err);
            });
    });
});
