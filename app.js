//app.js
App({
  onLaunch: function (options) {
    // console.log(options.shareCustomerId)
    var that = this;

    wx.login({
      success(res) {
        console.log('code:'+res.code)
        // 获取openId
        wx.request({
          url: "https://openapi.zhiyajob.com:8443/openapi/wxMpLogin.json",
          data: {
            code: res.code
          },
          success(res) {
            console.log(res)
            console.log('openId:'+res.data);
            that.globalData.openId = res.data;
            wx.setStorageSync('openId',res.data );
            wx.getSetting({
              success: res => {
                console.log(res)
                if (res.authSetting['scope.userInfo']) {
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                  
                     var  userInfo = JSON.parse(res.rawData)
                      
                      
                        that.globalData.userInfo = JSON.parse(res.rawData);
                      that.cb = function (res) {
                        // console.log(.globalData.userInfo)
                        // that.setData({ userInfo: app.globalData.userInfo })
                      }
                      if (that.cb()){
                        that.cb(JSON.parse(res.rawData))
                      };
                      wx.request({
                        url: 'https://openapi.zhiyajob.com:8443/openapi/addCustomerWithMpOpenId?openId=' + that.globalData.openId + '&nickname='+ userInfo.nickName + '&imgUrl='+ userInfo.avatarUrl,
                        success(res) {
                          console.log(res)
                          wx.setStorageSync('customerId', res.data);
                        }
                      })
                    }

                  })
                }else {
                  wx.reLaunch({
                    url: '/pages/authorize/authorize',
                  })
                }
              }
            })
          }
        })
      }
    }) 
  },
  globalData: {
    userInfo: {},
    openId:''
  }
})