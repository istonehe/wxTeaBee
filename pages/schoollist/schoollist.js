Page({
  data:{},
  onLoad: function(){
    let teacher = wx.getStorageSync('teacher') || {};
    if (!teacher){
      //登录
      console.log('yes')
    }
  }
})