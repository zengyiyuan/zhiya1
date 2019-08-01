// pages/myEarnings/myEarnings.js
const date = new Date()
const years = []
const months = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    videoList:[],
    startMonth:'',
    pageSize:5,
    totalMoney:0,
    totalNum:0,
    monthMoney:0,
    monthNum:0,
    isPicking:false,
    years: years,
    year: date.getFullYear(),
    months: months,
    month: '',
    newYear:'',
    newMonth:'',
    value: [9999, 1],
  },
  bindChange: function (e) {
    const val = e.detail.value;
    this.setData({
      newYear: this.data.years[val[0]],
      newMonth: this.data.months[val[1]],
      value: [val[0], val[1]]
    })
  },
  prevent(){
    return
  },
  cancelPick(){
    this.setData({
      isPicking:false
    })
  },
  confirmPick(){
    var that = this;
    this.setData({
      year:that.data.newYear,
      month:that.data.newMonth,
      isPicking: false
    })
    var staticTime = that.data.newYear + '' + (that.data.newMonth < 10 ? '0' + that.data.newMonth : that.data.newMonth);
    this.getVideoList(staticTime,true);
    this.getIncomeCount(staticTime)
  },
  goOrderDesc(e) {
    var orderId = e.currentTarget.dataset.orderid;
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?orderId=' + orderId,
    })
  },
  getVideoList(staticTime,flag) {
    // flag表示是否重新查询
    var that = this;
    if(flag){
      this.setData({
        videoList:[]
      },function(){
        wx.request({
          url: `https://openapi.zhiyajob.com:8443/openapi/queryCustomerIncomeStaticList.json?incomeCustomerId=${wx.getStorageSync("customerId")}&beginNum=0&pageSize=${that.data.pageSize}&incomeType=1&staticTime=${staticTime}`,
          success(res) {
            that.setData({ videoList: res.data.dataList });
          }
        })
      })
    }else{
      var beginNum = this.data.videoList.length;
      wx.request({
        url: `https://openapi.zhiyajob.com:8443/openapi/queryCustomerIncomeStaticList.json?incomeCustomerId=${wx.getStorageSync("customerId")}&beginNum=${beginNum}&pageSize=${that.data.pageSize}&incomeType=1&staticTime=${staticTime}`,
        success(res) {
          that.setData({ videoList: that.data.videoList.concat(res.data.dataList) });
        }
      })
    }
  },
  // 获取收益金额
  getIncomeCount(staticTime){
    var that = this;
    wx.request({
      url: `https://openapi.zhiyajob.com:8443/openapi/queryCustomerSumIncomeStatic.json?incomeCustomerId=${wx.getStorageSync("customerId")}&incomeType=1&staticTime=${staticTime}`,
      success(res) {
        var data = res.data;
        that.setData({ 
          totalMoney: data.sumStatic&&data.sumStatic.sumPrice||0,
          totalNum: data.sumStatic&&data.sumStatic.sumNum||0
          });
        that.setData({
          monthMoney: data.monthStatic&&data.monthStatic.sumPrice||0,
          monthNum: data.monthStatic&&data.monthStatic.sumNum||0
        });
      }
    })
  },
  pickDate(){
    this.setData({
      isPicking:true
    })
  },
  // 查看观摩人数
  checkWatchList(e){
    var shareCustomerId = e.currentTarget.dataset.sharecustomerid;
    var orderId = e.currentTarget.dataset.orderid;
    var startMonth = this.data.startMonth;
    wx.navigateTo({
      url: `/pages/watchList/list?shareCustomerId=${shareCustomerId}&startMonth=${startMonth}&orderId=${orderId}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var currentTime = new Date();
    var currentY = currentTime.getFullYear();
    var currentM = currentTime.getMonth();
    if (currentM === 0) {
      currentM = 12;
      currentY--;
    }
    this.setData({
      year: currentY,
      month: currentM,
      newYear: currentY,
      newMonth: currentM,
      value:[999,currentM-1]
    })
    var staticTime = currentY + '' + (currentM < 10 ? '0' + currentM : currentM);
    this.setData({
      startMonth: staticTime
    })
    this.getVideoList(staticTime);
    this.getIncomeCount(staticTime);
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
    var staticTime = this.data.year + '' + (this.data.month < 10 ? '0' + this.data.month : this.data.month);
    this.getVideoList(staticTime);
  },
})