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
    getSMSBtnText: '获取验证码'
  },
  onLoad: function(res){
    let that = this;
    console.log(res)
    that.setData({
      phone: '13720333159'
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
      (data) => {
        console.log('发送了')
        wx.showToast({
          title: '短信已经发送',
          icon: 'none',
          duration: 2000
        });

        let n = 10;
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
      (data) => {
        that.setData({
          error_tips: data.message,
          imgCode: '',
          canGetSMS: false
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
  }
  
})