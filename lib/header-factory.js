'use strict';
const UrlConfig = require('./url-config');

class HeaderFactory {
    /**
     * 构造通用header头
     *
     * @param {Auth} auth
     * @param {number} expireTime
     * @return {{Host: string, Authorization: string}}
     */
    buildHeader (auth, expireTime) {
        return {
            'Host': UrlConfig.host,
            'Authorization': auth.sign(expireTime),
        };
    }
}

const factory = new HeaderFactory();

module.exports = factory;
