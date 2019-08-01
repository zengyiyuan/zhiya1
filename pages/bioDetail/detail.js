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
    bioUrl:'',
    userInfo:{}
  },
  // 获取用户详情
  getUserDetail(id) {
    var _this = this
    wx.request({
      url: `${host}getCustomer.json?customerId=${wx.getStorageSync("customerId")}&beginNum=0&pageSize=5&interviewerId=${id}`,
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
    var bioUrl = options.bioUrl;
    // var userId = options.userId;
    // this.getUserDetail(userId);
    this.setData({
      bioUrl
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