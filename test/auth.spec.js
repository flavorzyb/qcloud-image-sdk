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
        assert.equal(true, result.length >= 0);

        result = auth.sign("test", 0);
        assert.equal(0, result.length);
    });
});
