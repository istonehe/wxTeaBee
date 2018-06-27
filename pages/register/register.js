//login.js
const app = getApp()
const auth = require('../../utils/auth.js')
const requests = require('../../utils/requests.js')
Page({
  data:{
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad:function(){
    let that = this;
    // 检查是否有token和用户信息
    let token = wx.getStorageSync('token') || '';
    let teacher_info = wx.getStorageSync('teacher_info') || {};

    if (token && (Object.keys(teacher_info).length != 0) ) {
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
          if (teacher_info.register){
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})