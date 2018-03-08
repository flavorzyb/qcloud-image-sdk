'use strict';

class UrlConfig {
    /**
     * 智能图像服务器域名
     * @return {string}
     */
    get host() {
        return 'service.image.myqcloud.com';
    }

    /**
     * 身份证识别地址
     *
     * @return {string}
     */
    get idcardDetectUrl () {
        return 'https://recognition.image.myqcloud.com/ocr/idcard';
    }

    /**
     * 活体检测—获取唇语验证码
     *
     * @return {string}
     */
    get liveGetUrl () {
        return 'https://service.image.myqcloud.com/face/livegetfour';
    }

    /**
     * 用户上传照片身份信息核验
     *
     * @return {string}
     */
    get idCardCompareUrl () {
        return 'https://service.image.myqcloud.com/face/idcardcompare';
    }

    /**
     * 唇语活体检测视频身份信息核验
     *
     * @return {string}
     */
    get idCardLiveDetectUrl () {
        return 'https://service.image.myqcloud.com/face/idcardlivedetectfour';
    }
}

const config = new UrlConfig();
module.exports = config;
