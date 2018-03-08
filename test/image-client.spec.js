'use strict';

const ImageClient = require('../lib/image-client');
const Config = require('./config');
const assert = require('assert');

describe('Image Client Class Test Case',  () => {
    let client = new ImageClient(Config.appId, Config.secretId, Config.secretKey, Config.bucket);

    it('test liveGet success', function(done) {
        client.liveGet()
            .then((data) => {
                assert.equal(true, data.data.validate_data.length > 1);
                done();
            })
            .catch((error) => {
                assert.fail(error);
                done();
            });
    });
});
