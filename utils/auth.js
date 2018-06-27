//auth.js
const config = require('config.js')
const url = config.config.host

//Promise封装登录模块
function beeLoginPromise() {
  var LoginPromise = new Promise((resolve, reject) => {
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: url + '/v1/public/wxteacherlogin',
            data: {
              code: res.code
            },
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              if (res.data.code == 1) {
                console.log("登录成功")
                let token = res.data.token;
                wx.setStorageSync('token', token);
                let user_info = res.data.teacher;
                wx.setStorageSync('teacher_info', user_info);
                resolve()
              } else {
                console.log('登录失败！' + res.data.message)
                reject(res.data.message);
              }
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          reject(res.errMsg);
        }
      }
    });
  });
  return LoginPromise;
}


module.exports = {
  beeLoginPromise: beeLoginPromise
}


