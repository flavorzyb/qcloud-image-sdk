'use strict';

class Config {
    /**
     * app id
     * @return {string}
     */
    get appId() {
        return '';
    }

    /**
     * secret id
     * @return {string}
     */
    get secretId() {
        return '';
    }

    /**
     * secret key
     * @return {string}
     */
    get secretKey() {
        return '';
    }

    /**
     * bucket
     * @return {string}
     */
    get bucket() {
        return '';
    }

    /**
     * region
     * @return {string}
     */
    get region() {
        return '';
    }
}

const config = new Config();
module.exports = config;
