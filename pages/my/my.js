// pages/my/my.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:[],
    nickName:wx.getStorageSync('nickName')

  },
  getUserInfo(){
    wx.navigateTo({
      url: '/pages/user/user',
    })
  },
  goOrder(){
    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })
  },
  goCoupon(){
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },
  // 收益
  goEarnings() {
    wx.navigateTo({
      url: '/pages/myEarnings/myEarnings',
    })
  },
  goMyFavor(){
    wx.navigateTo({
      url: '/pages/myfavor/myfavor',
    })
  },
  // 约面安排
  goAbout() {
    wx.navigateTo({
      url: '/pages/myAbout/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(1)
    var that = this;
    app.cb = function(res){
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


})