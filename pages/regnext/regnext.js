//login.js
const app = getApp()
const config = require('../../utils/config.js')
const url = config.config.host
const auth = require('../../utils/auth.js')
const requests = require('../../utils/requests.js')

Page({
  data:{
    phone: '',
    codeImgUrl: '',
    imgCode: '',
    imgUUID: '',
    canGetSMS: false,
    error_tips: '',
    getSMSBtnText: '获取验证码',
    smsUUID: '',
    smsCode: '',
    password: ''
  },
  onLoad: function(res){
    let that = this;
    console.log(res)
    that.setData({
      phone: res.phone
    });
    //获取图片验证码
    requests.getImgCodePromise().then(
      (data) => {
        let codeImgUrl = url + '/' + data.imgurl;
        that.setData({
          codeImgUrl: codeImgUrl,
          imgUUID: data.auuid
        })
      }
    );
  },
  ImgCodeInput: function(e){
    let that = this;
    console.log(e.detail.value)
    let code = e.detail.value;
    if (code.length == 4){
      that.setData({
        canGetSMS: true,
        imgCode: code
      })
    }else{
      that.setData({
        canGetSMS: false,
        imgCode: code
      }) 
    }

  },
  getSMScode: function(){
    let that = this;
    let uuid = that.data.imgUUID;
    let imgCode = that.data.imgCode;
    let phone = that.data.phone;
    requests.getSMScodePromise(uuid, imgCode, phone).then(
      // 短信接口调用成功
      (data) => {
        console.log('短信接口调用成功')
        console.log(data)
        let smsUUID = data.uuid;
        that.setData({
          smsUUID: smsUUID
        })
        wx.showToast({
          title: '短信已经发送',
          icon: 'none',
          duration: 2000
        });

        // 60s限制
        let n = 60;
        timer();
        function timer(){
          n -= 1;
          if (n > 0 ) {
            setTimeout(timer, 1000);
          }
          
          let getSMSBtnText = n + 's后再获取'
          console.log(n)
          that.setData({
            canGetSMS: false,
            getSMSBtnText: getSMSBtnText
          });

          if (n == 0) {
            that.setData({
              canGetSMS: true,
              getSMSBtnText: '获取验证码'
            })
          }
        }
      },
      // 短信接口调用失败
      (data) => {
        that.setData({
          error_tips: data.message,
          imgCode: '',
          canGetSMS: false
        });

        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 2000
        });

        //重新获取图片验证码
        requests.getImgCodePromise().then(
          (data) => {
            let codeImgUrl = url + '/' + data.imgurl;
            that.setData({
              codeImgUrl: codeImgUrl,
              imgUUID: data.auuid
            })
          }
        );
      },
    )
  },
  smsCodeInput: function(e){
    let that = this;
    console.log(e.detail.value)
    let code = e.detail.value;
    that.setData({
      smsCode: code
    })
  },
  passWordInput: function(e){
    let that = this;
    console.log(e.detail.value)
    let password = e.detail.value;
    that.setData({
      password: password
    })
  },
  submitRegister: function(){
    let that = this;
    let teacher_info = wx.getStorageSync('teacher_info')
    let teacher_id = teacher_info.id
    let phone = that.data.phone;
    let password = that.data.password;
    let uuid = that.data.smsUUID;
    let phonecode = that.data.smsCode;

    requests.registerTeacherPromise(teacher_id, phone, password, uuid, phonecode).then(
      // 注册成功
      (data) => {
        wx.showToast({
          title: '注册成功',
          icon: 'none',
          duration: 2000,
          complete: () => {
            wx.reLaunch({
              url: '../index/index'
            })
          }
        }); 
      },
      // 注册失败
      (data) => {
        wx.showToast({
          title: data.message,
          icon: 'none',
          duration: 2000
        });
        that.setData({
          error_tips: data.message,
          smsCode: '',
          smsUUID: ''
        })
      }
    );
  }

})