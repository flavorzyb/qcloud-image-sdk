'use strict';

const COS = require('cos-nodejs-sdk-v5');

class COSFactory {
    /**
     *
     * @param {{SecretId: string, SecretKey: string, Proxy: string}} options
     * @return {COS}
     */
    builder (options) {
        return new COS(options);
    }
}

const factory = new COSFactory();

module.exports = factory;
