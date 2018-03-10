'use strict';

class UrlConfig {

    /**
     * 超时时间
     * @returns {number}
     */
    get timeout () {
        return 30000;
    }

    /**
     * 智能图像服务器域名
     * @return {string}
     */
    get host () {
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
