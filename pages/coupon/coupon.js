// pages/coupon/coupon.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navlist: ['未使用', '已使用', '已过期'],
    tabCur: 0,
    coupon1:[],
    coupon2:[],
    coupon3:[]
  },
  tabSelect: function (e) {
    if (e.currentTarget) {
      this.setData({ tabCur: e.currentTarget.dataset.id })
      this.getCouponList();
    } else {
      this.setData({ tabCur: 0 })
    }

  },
  getCouponList() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/queryMemberCouponList.json?filterType=&couponStatus='+that.data.tabCur+'&customerId='+wx.getStorageSync("customerId"),
      success(res) {
        if(that.data.tabCur==0){
          that.setData({ coupon1: res.data.dataList })
        }else if(that.data.tabCur==1){
          that.setData({ coupon2: res.data.dataList })
        }else {
          that.setData({ coupon3: res.data.dataList })
        }
        
      }
    })
  },
  goOrderDesc(e){
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?orderId='+e.currentTarget.dataset.orderid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCouponList();
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