// requests.js

const config = require('config.js');
const url = config.config.host;
const base64 = require('base64.min.js').Base64;
const auth = require('auth.js')

function getTeacherInfoPromise(){
  let teacher_info = wx.getStorageSync('teacher_info')
  let teacher_id = teacher_info.id
  let token = wx.getStorageSync('token')
  let getTeacherInfo = new Promise((resolve, reject) => {
    wx.request({
      url: url + '/v1/school/teacher/' + teacher_id,
      header: {'Authorization': 'Basic ' + base64.encode(token + ':x')},
      success: (res) => {
        console.log(res.data)
        let data = res.data
        if (data.code == 4) {
          auth.beeLoginPromise();
        } else if (data.code == 1) {
          resolve(data);
          let user_info = data.teacher;
          wx.setStorageSync('teacher_info', user_info);
        } else {
          wx.showToast({
            title: data.message || '服务器开小差了',
            icon: 'none',
            duration: 2000
          });
          reject();
        }
      }
    })
  })
  return getTeacherInfo;
}

module.exports = {
  getTeacherInfoPromise: getTeacherInfoPromise
}