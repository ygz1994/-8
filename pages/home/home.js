const { post } = require("../../utils/api");

// pages/home/home.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isFront: true,
        image: '',
        faceInfo: null
    },

    // 翻转摄像头事件处理函数。
    reverse() {
        this.setData({ isFront: !this.data.isFront });
    },

    // 拍事件的处理函数。
    async takePhoto() {
        // 拿到相机功能对应的上下文对象。
        const cam = wx.createCameraContext();

        try {
            const res = await cam.$takePhoto();

            this.setData({ image: res.tempImagePath }, () => this.detectFace());
        } catch (error) {
            wx.showToast({
                title: '拍照失败了~',
            });
            this.setData({ image: '' })
        }

        // 基于相机上下文对象进行拍照操作。
        // cam.takePhoto({
        //     quality: 'low',
        //     success: res => {
        //         this.setData({image: res.tempImagePath})
        //     },
        //     fail(){
        //         wx.showToast({
        //           title: '拍照失败了~',
        //         })
        //     }
        // })
    },

    async chooseImage() {
        const { tempFilePaths } = await wx.$chooseImage();
        this.setData({ image: tempFilePaths.length ? tempFilePaths[0] : '' }, () => this.detectFace());
    },

    // 重选照片。
    reChoose() {
        this.setData({ image: '' });
    },

    // 测试颜值的函数。
    async detectFace(){
        console.log('开始测试颜值')
        if (app.token) {
            // 拿到文件管理器。
            const fm = wx.getFileSystemManager();
            // 拿到图片，并转换为 BASE64 字符串。
            const base64 = fm.readFileSync(this.data.image, 'base64');

            // 请求人脸检测 API。
            const res = await post('https://aip.baidubce.com/rest/2.0/face/v3/detect', {
                image: base64, image_type: 'BASE64', face_field: 'age,beauty,expression,gender,glasses,emotion'
            }, {access_token: app.token});

            // 判断有没有人脸信息。
            if (res.data.result && res.data.result.face_num) {
                this.setData({faceInfo: res.data.result.face_list[0]})
            } else wx.showToast({
              title: '没有检测到人脸数据！', icon: 'none'
            })
        } else {
            wx.showToast({
              title: '登录失败，请重新运行小程序！',
              icon: 'none'
            })
        }
    }
})