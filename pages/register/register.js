//login.js
const app = getApp()
const config = require('../../utils/config.js')
const url = config.config.host
const auth = require('../../utils/auth.js')
const requests = require('../../utils/requests.js')

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    codeImgUrl: '',
    phone: '',
    error_tips: '',
    phone_isok: false
  },
  onLoad: function () {
    let that = this;
    // 检查是否有token和用户信息
    let token = wx.getStorageSync('token') || '';
    let teacher_info = wx.getStorageSync('teacher_info') || {};

    if (token && (Object.keys(teacher_info).length != 0)) {
      //使用token获取用户信息
      requests.getTeacherInfoPromise().then(
        () => {
          if (teacher_info.register) {
            wx.redirectTo({
              url: '../asklist/asklist'
            })
          }
        }
      );

    } else {
      //登录换取token
      auth.beeLoginPromise().then(
        function () {
          let teacher_info = wx.getStorageSync('teacher_info') || {};
          if (teacher_info.register) {
            wx.redirectTo({
              url: '../asklist/asklist'
            })
          }
        }
      );
    };

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

  },
  inputPhone: function (e) {
    let that = this;
    console.log(e.detail.value)
    let phone = e.detail.value;
    that.setData({
      phone: phone
    });
    if (phone.length == 11) {
      const reg = /^((1[3-8][0-9])+\d{8})$/;
      if (reg.test(phone)) {
        requests.getPhoneExistPromise(phone).then(
          (data) => {
            that.setData({
              phone_isok: true,
              error_tips: ''
            })
          },
          (data) => {
            that.setData({
              error_tips: data.message
            })
          }
        );
      } else {
        that.setData({
          error_tips: '请输入正确的手机号'
        })
      }
    } else {
      that.setData({
        phone_isok: false,
        error_tips: ''
      })
    }
  },
  toNextStap: function(){
    let that = this;
    wx.navigateTo({
      url: '../regnext/regnext?phone=' + that.data.phone
    })
  },
  getUserInfo: function (e) {
    let that = this;
    let teacher_info = wx.getStorageSync('teacher_info') || []
    let teacher_id = teacher_info.id

    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    if (e.detail.userInfo) {
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })

      //交换敏感数据
      wx.request({
        url: url + '/v1/public/teacherwxsecret/' + teacher_id,
        method: 'PUT',
        data: {
          nickname: e.detail.userInfo.nickName,
          city: e.detail.userInfo.city,
          province: e.detail.userInfo.province,
          country: e.detail.userInfo.country,
          gender: e.detail.userInfo.gender,
          avatarUrl: e.detail.userInfo.avatarUrl,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        },
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1) {
            console.log('数据正常获取')
          } else {
            wx.showToast({
              title: '服务器开小差，请重试',
              icon: 'none',
              duration: 2000
            })
          }
        }
      })

    }else{
      wx.showToast({
        title: '允许授权可以获得更好的服务哦！',
        icon: 'none',
        duration: 2000
      })
    }



    
  }
})