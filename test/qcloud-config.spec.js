'use strict';

const QCloudConfig = require('../lib/qcloud-config');
const assert = require('assert');

describe('QCloudConfig Class Test Case', function () {
    it('test options ', function () {
        const result = new QCloudConfig('appId', 'secretId', 'secretKey', 'bucket', 'region');
        assert.equal('appId', result.appId);
        assert.equal('secretId', result.secretId);
        assert.equal('secretKey', result.secretKey);
        assert.equal('bucket', result.bucket);
        assert.equal('region', result.region);
    });
});
