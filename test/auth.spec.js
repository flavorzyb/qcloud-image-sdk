'use strict';

const Auth = require('../lib/auth');
const assert = require('assert');

describe('Auth Class Test Case', function () {
    it('test auth sign', function () {
        const auth = new Auth('appId', 'secretId', 'secretKey');
        assert.strictEqual(auth.appId, 'appId');
        assert.strictEqual(auth.secretId, 'secretId');
        assert.strictEqual(auth.secretKey, 'secretKey');

        let result = auth.sign("test", 3600);
        assert.equal(160, result.length);

        result = auth.sign("test", 0);
        assert.equal(0, result.length);
    });
});
