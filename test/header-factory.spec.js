'use strict';

const assert = require('assert');
const HeaderFactory = require('../lib/header-factory');
const Auth = require('../lib/auth');
const QCloudConfig = require('../lib/qcloud-config');

describe('HeaderFactory Class Test Case', function () {
    it('test buildHeader success', function () {
        const result = HeaderFactory.buildHeader(new Auth(new QCloudConfig('appId', 'secretId', 'secretKey', 'bucket', 'region')), 3600);
        assert.equal(true, result.hasOwnProperty('Host'));
        assert.equal(true, result.hasOwnProperty('Authorization'));
    });
});
