'use strict';

/**
 * @type {QCloudConfig}
 */
const QCloudConfig = require('./lib/qcloud-config');

/**
 * @type {ImageClient}
 */
const ImageClient = require('./lib/image-client');
/**
 *
 * @type {FileUtil}
 */
exports.FileUtil = require('./lib/file-util');

/**
 * @type {QCloudConfig}
 */
exports.QCloudConfig = QCloudConfig;

/**
 * @type {ImageClient}
 */
exports.ImageClient = ImageClient;
