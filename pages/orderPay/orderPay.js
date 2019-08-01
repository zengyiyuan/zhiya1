// pages/orderPay/orderPay.js
const {host,api} = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    customerId: '',
    openId: '',
    inspectId: null,
    inspectPrice: 0,
    title: '',
    keyWords: '',
    count:0,
  },
  checkChange(e){

  },
  goPay() {
    var that = this;
    if (!this.data.inspectId) {
      console.log("shareId"+wx.getStorageSync("shareCustomerId"))
      let shareCustomerId = wx.getStorageSync("shareCustomerId")?wx.getStorageSync("shareCustomerId"):'';
      wx.request({
        url: host + 'addInterviewInspectForWeb.json?orderId=' + that.data.orderId + '&payType=2&customerId=' + wx.getStorageSync("customerId") +'&shareCustomerId='+shareCustomerId,
        header:{"cookie": "shareCustomerId="+shareCustomerId},
        success(res) {
          console.log(res)
          var inspectId = res.data.inspectId;
          that.setData({
            inspectId: inspectId
          });
          that.okPay(that.data.inspectId, that.data.openId)
        }
      })
    } else {
      this.okPay(this.data.inspectId, this.data.openId)
    }
  },
  okPay(inspectId, openId) {
    //1微信支付
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getMiniProgramParamInspect.json',
      methods: 'get',
      data: {
        openId: openId,
        inspectId: inspectId
      },
      success(msg) {
        console.log(msg)
        if (msg.data.status == "SUCCESS") {
          console.log(msg);
          that.callpay(msg.data.appId, msg.data.timeStamp, msg.data.nonceStr, msg.data.package, msg.data.sign);
        }
      }
    })

  },
  callpay(appId, timeStamp, nonceStr, mypackage, sign) {
    var that = this;
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': mypackage,
      'signType': 'MD5',
      'paySign': sign,
      'success': function(res) {
        wx.navigateTo({
          url: '/pages/success/success?orderId=' + that.data.orderId,
        })
      },
      'fail': function(res) {
        // var that = this;
        console.log(res.errMsg)
        wx.navigateTo({
          url: '/pages/fail/fail?err=' + res.errMsg + '&orderId=' + that.data.orderId,
        })
      }
    })
  },
  checkCoupon () { 
    var that = this;
    wx.request({
      url: host+'queryMemberCouponList.json?filterType=1&couponStatus=0&customerId='+wx.getStorageSync("customerId"),
      success(res){
        that.setData({coupon:res.data.count})
      }
    })
  },
  getOrderDesc(orderId){
    //  约面详情
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getInterviewOrder.json?interviewOrderId=' + orderId,
      success(res) {
        var item = res.data||{};
        that.setData({
          pic: item.orderImg,
          orderId: item.orderId,
          openId: wx.getStorageSync("openId"),
          inspectPrice: item.inspectPrice,
          title: item.title,
          keyWords: item.keyWords
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var orderId = options.orderId;
    this.checkCoupon();
    this.getOrderDesc(orderId);
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

  },

})