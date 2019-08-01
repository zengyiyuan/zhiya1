const { host, api } = require('../../config.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList:[],
    pageSize: 10,
    startMonth:'',
    shareCustomerId:'',
    orderId:''
  },
  getWatchList(startMonth, shareCustomerId,orderId){
    var that = this;
    var beginNum = this.data.dataList.length;
    wx.request({
      url: `https://openapi.zhiyajob.com:8443/openapi/queryInterviewInspectIncomeDetailList.json
?shareCustomerId=${shareCustomerId}&beginNum=${beginNum}&pageSize=${that.data.pageSize}&orderId=${orderId}&startMonth=${startMonth}`,
      success(res) {
        that.setData({ dataList: that.data.dataList.concat(res.data.dataList) });
        wx.setNavigationBarTitle({
          title: `${res.data&&res.data.count||0}人观摩`
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var startMonth = options.startMonth;
    var shareCustomerId = options.shareCustomerId;
    var orderId = options.orderId;
    this.setData({
      startMonth,
      shareCustomerId,
      orderId
    })
    this.getWatchList(startMonth, shareCustomerId, orderId)
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
    console.log('到页面底部了')
    this.getWatchList(this.data.startMonth,
      this.data.shareCustomerId,
      this.data.orderId);
  },

})