const {host,api} = require('../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    userInfo:[],
    btn:false,
    nameInput:false,
    nickName:wx.getStorageSync('nickName'),
  },
  // 获取头像
  getAvatar(){
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths);
        that.setData({ "userInfo.avatarUrl": tempFilePaths[0] })
      },
    })
  },
  getNickName(){
    this.setData({nameInput:true})
  },
  // 显示图片
  showAvatar(){
    this.setData({show:true})
  },
  // 保存图片
  savePic(){
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功')
            }
          })
        }
      }
    }),
    console.log(JSON.stringify(this.data.userInfo.avatarUrl))
    wx.downloadFile({
      url: ''+that.data.userInfo.avatarUrl,
      success: function (res) {
        console.log(res);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail(res) {
            console.log(res)
            wx.showToast({
              title: '保存失败',
              icon:none,
              duration: 2000
            })
          },
          complete() {
            that.setData({ btn: false })
          }
        })
      }
    })
    
  },
  // 保存名字
  saveName(){
    var that = this;
    
   wx.request({
     url: api+'updateCustomer.htm',
     data: { customerNickname: that.data.nickName},
     method:'post',
     header: { 'content-type':'application/x-www-form-urlencoded','cookie': 'customerId=' + wx.getStorageSync('customerId') },
     success(res){
       app.globalData.userInfo.nickName = that.data.nickName;
       wx.setStorageSync("nickName", that.data.nickName);
       if(res.statusCode ==200){
         wx.showToast({
           title: '更新成功',
         })
       }
       console.log(app.globalData.userInfo)
     }
   })
    this.setData({ nameInput: false })
  },
  changeBtn(){
    console.log(111)
    this.setData({btn:true})
  },
  changeValue(e){
    console.log(e.detail.value);
    this.setData({ nickName: e.detail.value})
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.cb = function (res) {
      console.log(app.globalData.userInfo)
      that.setData({userInfo:app.globalData.userInfo})
    }
    app.cb();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  
})