const {
  api,
  host
} = require("../../config.js");
// const share = require("../../utils/share.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollLeft: 0,
    orderId: 0,
    orderList: [],
    orderDesc: {},
    pageVideoSize: 4,
    pageCommentSize: 3,
    defaultValue: '',
    screenHeight: 300,
    screenWidth: 450,
    userInfo:{}
  },
  // 获取相关面约
  getAbout() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/queryInterviewOrderList.json?interviewCustomerId=' + wx.getStorageSync("customerId") + '&beginNum=0&pageSize=' + that.data.pageVideoSize,
      success(res) {
        that.setData({
          orderList: res.data.dataList
        })
      }
    })
  },
  // 去相关面约商品详情
  goOrderDesc(e) {
    var orderId = e.currentTarget.dataset.id;
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?orderId=' + orderId,
    })
  },
  // 获取用户详情
  getUserDetail(id) {
    var _this = this
    wx.request({
      url: `${host}getCustomer.json?customerId=${id}`,
      success(res){
        _this.setData({
          userInfo:res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var userId = options.userId;
    this.getUserDetail(userId);
    this.getAbout();
      wx.getSystemInfo({
      success: function(res) {
        that.setData({
          screenWidth: res.screenWidth * 0.8,
          screenHeight: res.screenHeight * 0.6
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    console.log('到页面底部了')
    this.data.pageVideoSize+=2;
    this.getAbout();
  }
})