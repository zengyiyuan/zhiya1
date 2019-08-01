Page({

  /**
   * 页面的初始数据
   */
  data: {
    pushLiveUrl:'',
    playLiveUrl:'',
    ctx:'',
    sdkAppID:'1400221781',
    publicKey:'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAE13HfqfdZTylxYvtw5pil9gtT95NYCDPDeQ5MfintajKal8+2JHRjHlj7pO1pS9JgGmF0FuL9qYn47rsDLwYH6A==',
    privateKey: 'MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgiTJrDLY8chVSH1L3nw55k2S80h+xKW2KaIDHjn + f / 4GhRANCAATXcd+p91lPKXFi + 3DmmKX2C1P3k1gIM8N5Dkx +Ke1qMpqXz7YkdGMeWPuk7WlL0mAaYXQW4v2pifjuuwMvBgfo',
    canPlay:true,
    canPush:true
  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  error(e) {
    console.error('live-pusher error:', e.detail.errMsg)
  },
  statechange2(e) {
    console.log('live-player code:', e.detail.code)
  },
  error2(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  goBack(){
    wx.navigateBack()
  },
  pushLive(id){
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/createLivePusherUrlForInterview.json?orderCode=2019060510074311',
      success: (res) => {
        if (res.data.result === '1') {
          this.setData({
            pushLiveUrl: res.data.pusherUrl
          }, () => {
            this.setData({
              canPush: true
            })
          })
        }
      }
    })
  },
  playLive(id){
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/createLivePlayUrlForInterview.json?orderCode=2019060510074311',
      success: (res) => {
        if (res.data.result === '1') {
          this.setData({
            playLiveUrl: res.data.pusherUrl
          }, () => {
            this.setData({
              canPlay: true
            })
          })
        }
      }
    })
  },
  bindPause() {
    this.data.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  bindStop() {
    this.data.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  bindResume() {
    this.data.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    const id = options.id;
    const isPush = options.isPush === '1'?true:false;
    // isPush?this.pushLive():this.playLive()
    this.pushLive()
    this.playLive()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      ctx: wx.createLivePusherContext('pusher')
    }, () => {
      this.data.ctx.start({
        success: function () {
          console.log('push success')
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})