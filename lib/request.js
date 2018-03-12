'use strict';

const rp = require('request-promise');
const UrlConfig = require('./url-config');
const HeaderFactory = require('./header-factory');

class Request {
    /**
     * 封装请求
     *
     * @param {Object} options
     * @param {Auth} auth
     * @param {number} expireTime
     * @returns {Promise<Object>}
     */
    request (options, auth, expireTime) {
        if (!options.hasOwnProperty('timeout')) {
            options.timeout = UrlConfig.timeout;
        }

        if (!options.hasOwnProperty('json')) {
            options.json = true;
        }

        if (!options.hasOwnProperty('headers')) {
            options.headers = HeaderFactory.buildHeader(auth, expireTime);
        }

        if (!options.hasOwnProperty('method')) {
            options.method = 'POST';
        }

        return rp(options)
            .then((data) => {
                return Promise.resolve(data);
            })
            .catch((err) => {
                if (err.response && err.response.body) {
                    return Promise.reject(err.response.body);
                }

                return Promise.reject(err);
            });
    }
}

const request = new Request();

module.exports = request;
