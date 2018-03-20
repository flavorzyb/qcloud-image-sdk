'use strict';

const assert = require('assert');
const COSFactory = require('../lib/cos-factory');

describe('COSFactory Class Test Case', function () {
    it('test builder', function () {
        const result = COSFactory.builder({SecretId: 'SecretId', SecretKey: 'SecretKey', Proxy: 'proxy'});
        assert.notEqual(null, result);
    });
});
