const {host,api} = require("../../config.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumerHeight: 10,
    orderLen: 0,
    classifyName: ['全部', '待支付', '待观摩', '已完成'],
    classifyCur: 0,
    navlist: ['全部', '待支付', '待观摩', '已完成'],
    orderList: [],
    list:[],
    tabCur: 0,
    status: ["待支付", "待观摩","已完成"]
  },
  // tabSelect: function (e) {
  //   if (e.currentTarget) {
  //     this.setData({ tabCur: e.currentTarget.dataset.id })
  //     this.getOrdersClassify();
  //   }else {
  //     this.setData({tabCur:0})
  //   }

  // },
  // 取消订单
  // cancelInspect(e){
  //   var that = this;
  //   var inspectId = e.currentTarget.dataset.inspect;
  //   wx.request({
  //     url: host+'updateInterviewInspect.json',
  //     method:'post',
  //     data: { "inspectId": inspectId, "inspectStatus": "3" },
  //     success(res){
  //       if(res.msg==1){
  //         that.getOrderList();
  //       }
  //     }
  //   })
  // },
  goOrderDesc(e){
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?orderId='+e.currentTarget.dataset.orderid,
    })
  },
  // 去支付
  // goOrderPay(e){
  //   var orderInfo
  //    this.data.orderList.forEach(item=>{
  //     if (item.inspectId == e.currentTarget.dataset.orderid){
  //       orderInfo=item;
  //       wx.navigateTo({
  //         url: '/pages/orderPay/orderPay?orderId=' + JSON.stringify(item),
  //       })
  //     }
  //   })
  //   console.log(orderInfo)
    
  // },
  //订单数量标题小圆点，使高度=宽度
  roundNumber: function () {
    var that = this
    //如果订单数量大于99，显示99
    var orderLen = that.data.orderLen
    if (Number(orderLen) > 99) {
      orderLen = 99
    }
    that.setData({ orderLen: orderLen })
    // console.log(that.data.orderLen)
  },
  //根据用户id调取其订单列表(全部、待付款、待发货、待收货)
  getOrdersClassify: function () {
    var that = this
    var newarr = [];
    //全部
    if (that.data.tabCur == 0) {
      newarr = this.data.list;
    }
    //待付款
    if (that.data.tabCur== 1) {
      this.data.list.forEach(item => { item.inspectStatus == 0 ? newarr.push(item) : '' })
    }
    //待观摩
    if (that.data.tabCur == 2) {
      this.data.list.forEach(item => { item.inspectStatus == 1 || item.orderStatus == 2 ? newarr.push(item) : '' })
    }
    //已完成
    if (that.data.tabCur== 3) {
      this.data.list.forEach(item => { item.inspectStatus == 2 || item.orderStatus == 3 ? newarr.push(item) : '' })
    }
    this.setData({ orderList: newarr })
    console.log(this.data.orderList)
  },
  // 获取列表页数据
  
  //转化时间
  formatTime: function (value) {
    var date = new Date(parseInt(value));
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var h = date.getHours() + ':';
    var m = date.getMinutes() + ':';
    var s = date.getSeconds();

    var result = Y + M + D + h + m + s;
    return result;
  },
  getOrderList(){
    var that = this;
    wx.request({
      url: host+'queryInterviewInspectList.json?inspectStatus=1&customerId='+wx.getStorageSync('customerId'),
      success(res) {
        that.setData({orderList:res.data.dataList,list:res.data.dataList})
      }
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // console.log(options.index)
    // var classifyCur = Number(options.index) + 1
    // this.setData({ classifyCur: classifyCur })
    //订单数量标题小圆点，使高度=宽度
    // this.roundNumber()
    this.getOrderList()

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
    // var that = this
    //根据用户id调取其订单列表(全部、待付款、待发货、待收货)
    // this.getqdorder(0);
    // this.tabSelect(0);
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