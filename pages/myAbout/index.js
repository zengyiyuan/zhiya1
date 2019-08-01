// pages/myAbout/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navlist: ['未开始', '已结束'],
    orderList: [],
    videoList:[],
    list: [],
    tabCur: 0,
    pageSize:5,
    orderDesc: { "orderId": 105, "orderImg": "http://zhiyajob.oss-cn-hangzhou.aliyuncs.com/zhiya/1559700463115.png", "customerId": 93, "customerName": "孙文迪", "customerType": "1", "customerHeadPortrait": "http://zhiyajob.oss-cn-hangzhou.aliyuncs.com/zhiya/1559540986833.png", "university": "南京信息工程大学", "profession": "软件工程", "industry": "", "position": "", "industryId": 3, "positionId": 1, "cityId": 1, "cityName": null, "interviewerCustomerId": 97, "scheduleId": null, "interviewerIndustry": "互联网", "interviewerPosition": "产品总监", "interviewerCompany": "华图教育南京研发部", "applicationIndustry": "互联网", "applicationPosition": "技术总监", "jianliUrl": "http://zhiyajob.oss-cn-hangzhou.aliyuncs.com/zhiya/1560086515228.jpg", "resumeUrl": "http://zhiyajob.oss-cn-hangzhou.aliyuncs.com/yanjiang.mp4", "status": "4", "inspectPrice": 10.00, "watchNum": 0, "inspectNum": 0, "collectNum": 0, "evaluateNum": 0, "createDate": "2019-06-09 21:21:55", "updateDate": "2019-06-09 21:21:55", "interviewerHeadPortrait": "http://zhiyajob.oss-cn-hangzhou.aliyuncs.com/zhiya/1559543230498.png", "interviewerName": "陈晓辉", "departure": null, "orderCode": "2019060510074311", "beginTime": null, "actualBeginTime": "2019-06-09 21:21:55", "actualEndTime": "2019-06-09 21:21:55", "interviewPrice": 0.00, "title": "产品助理面试安排 时间：6月20日 地址：软件谷科创城", "keyWords": "华图 产品助理", "detail": "p华图教育全称为a target=_blank href=https://baike.baidu.com/item/E58C97E4BAACE58D8EE59BBEE5AE8FE998B3E69599E882B2E69687E58C96E58F91E5B195E882A1E4BBBDE69C89E99990E585ACE58FB8/19976982 data-lemmaid=19976982北京华图宏阳教育文化发展股份有限公司/a，由创始人易定宏先生2001年来京创业发展壮大而来。华图教育秉承“以教育推动社会进步”的使命，以职业教育为核心，主营a target=_blank href=https://baike.baidu.com/item/E585ACE58AA1E59198/24131 data-lemmaid=24131公务员/a，a target=_blank href=https://baike.baidu.com/item/E4BA8BE4B89AE58D95E4BD8D/1186611 data-lemmaid=1186611事业单位/a、a target=_blank href=https://baike.baidu.com/item/E69599E5B888/75720 data-lemmaid=75720教师/a、医疗、a target=_blank href=https://baike.baidu.com/item/E98791E89E8D/860 data-lemmaid=860金融/a、部队转业干部等各类职业招录考试培训和职业技能培训业务。/p", "experVedioUrl": "http://zhiyajob.oss-cn-hangzhou.aliyuncs.com/yanjiang.mp4", "isOpen": "1", "livePushId": null, "payType": null, "payTime": "2019-06-09 21:21:55" }
  },
  tabSelect: function (e) {
    if (e.currentTarget) {
      this.setData({ tabCur: e.currentTarget.dataset.id })
    } else {
      this.setData({ tabCur: 0 })
    }

  },
  getAbout() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/queryInterviewOrderList.json?interviewCustomerId=' + wx.getStorageSync("customerId") + '&beginNum=0&pageSize=' + that.data.pageSize,
      success(res) {
        that.setData({ orderList: res.data.dataList })
      }
    })
  },
  getVideoList() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/searchDiscoveryVedio.json',
      success(res) {
        that.setData({ videoList: res.data.dataList });
      }
    })
  },
  goLiveRoom(e){
    const dataset = e.currentTarget.dataset;
    let isPush = 0
    dataset.push && (isPush = 1)
    wx.navigateTo({
      // url: `/pages/liveRoom/live?id=${dataset.id}&isPush=${isPush}`
      url: `/pages/room/room?id=${dataset.id}&isPush=${isPush}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAbout();
    this.getVideoList();
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