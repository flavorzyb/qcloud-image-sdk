'use strict';

const Auth = require('../lib/auth');
const assert = require('assert');
const QCloudConfig = require('../lib/qcloud-config');

describe('Auth Class Test Case', function () {
    it('test auth sign', function () {
        const config = new QCloudConfig('appId', 'secretId', 'secretKey', 'bucket', 'region');
        const auth = new Auth(config);

        assert.strictEqual(auth.config, config);

        let result = auth.sign();
        assert.equal(true, result.length >= 0);

        result = auth.sign(0);
        assert.equal(0, result.length);
    });
});
