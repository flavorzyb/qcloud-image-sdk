# 腾讯云智能图像服务 SDK for NodeJs

[![npm](https://img.shields.io/npm/v/qcloud-image-sdk.svg)](https://www.npmjs.com/package/qcloud-image-sdk)
[![npm](https://img.shields.io/npm/dm/qcloud-image-sdk.svg)](https://www.npmjs.com/package/qcloud-image-sdk)
[![Build Status](https://travis-ci.org/flavorzyb/qcloud-image-sdk.svg?branch=master)](https://travis-ci.org/flavorzyb/qcloud-image-sdk)
[![Coverage Status](https://coveralls.io/repos/github/flavorzyb/qcloud-image-sdk/badge.svg?branch=master)](https://coveralls.io/github/flavorzyb/qcloud-image-sdk?branch=master)
[![npm](https://img.shields.io/npm/l/express.svg)](https://opensource.org/licenses/MIT)

## 安装

```bash
npm install qcloud-image-sdk
```

## 运行单元测试

```bash
npm run test
```

## 生成覆盖率报告

```bash
npm run coverage
```

## 运行单元测试并生成覆盖率报告

```bash
npm run test-coverage
```

## 范例

```javascript
const sdk = require('qcloud-image-sdk');
const fs = require('fs');
const path = require('path');

const config = new sdk.QCloudConfig('appId', 'secretId', 'secretKey', 'bucket', 'region');
const client = new sdk.ImageClient(config);

/**
 * 获取唇语字符串
 */
client.liveGet()
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });

/**
 * 检测身份证
 */
client.idCardDetect(path.join(__dirname, 'test.jpg'))
    .then((data) => {
        console.log(data);
    })
    .catch((err)=>{
        console.error(err);
    });

/**
 * 活体检测
 */
client.idCardLiveDetect(path.join(__dirname, 'test.mp4'), '8603', '艾米', '4522876121211222222')
    .then((data) => {
        console.log(data);
    })
    .catch((err)=>{
        console.error(err);
    });

/**
 * 计算文件的md5值，例如：60924334a39ea59142317320e86fcda2
 */
sdk.FileUtil.getFileMd5String(path.join(__dirname, 'test.js'))
    .then((data) => {
        console.log(data);
    })
    .catch((err)=>{
        console.error(err);
    });

/**
 * 获取文件的完整md5路径
 * 例如：
 *      60/92/60924334a39ea59142317320e86fcda2.js
 */
sdk.FileUtil.getMd5StringFilePath(path.join(__dirname, 'test.js'))
    .then((data) => {
        console.log(data);
    })
    .catch((err)=>{
        console.error(err);
    });

/**
 * 获取流文件的MD5值
 */
sdk.FileUtil.getStreamMd5String(fs.createReadStream(path.join(__dirname, 'test.js')))
    .then((data) => {
        console.log(data);
    })
    .catch((err)=>{
        console.error(err);
    });

```
