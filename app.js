import { post } from './utils/api'

// cam.constructor.prototype.fn = () => console.log('123')
wx.createCameraContext().constructor.prototype.$takePhoto =
    function (options = { qulity: 'low' }) {
        return new Promise((success, fail) =>
            this.takePhoto({
                ...options,
                success, fail
            })
        );
    };

wx.$chooseImage = function (options = {
    count: 1, sizeType: ['compressed'], sourceType: ['album']
}) {
    return new Promise((success, fail) =>
        wx.chooseImage({
            ...options,
            success, fail
        })
    );
};

App({
    token: '',

    // 小程序运行时。
    onLaunch(){
        // 调用获取 Token 的方法。
        this.getToken();
    },

    // 获取 Token 的方法。
    async getToken(){
        const res = await post('https://aip.baidubce.com/oauth/2.0/token', undefined, {
            grant_type: 'client_credentials',
            client_id: 'QAuiqYnaai1ylsxx7Yl8ZXis',
            client_secret: 'cMS26vNCrHcmGZ2L9eGsYvtfVoLVPG6m'
        });

        // 将拿到的 token 存储到小程序大对象根部。
        this.token = res.data.access_token;
    },
});