const auth = require('../../utils/auth.js')
Page({
  data:{

  },
  onLoad:function(){
    let that = this;
    // 检查是否有token和用户信息
    let token = wx.getStorageSync('token') || '';
    let teacher_info = wx.getStorageSync('teacher_info') || {};
    if (token && (Object.keys(teacher_info).length != 0) ) {
      //使用token获取用户信息
      

      if (teacher_info.register) {
        wx.redirectTo({
          url: '../asklist/asklist'
        })
      }

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


  }

})