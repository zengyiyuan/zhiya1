//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    barCur:-1,
    flag:true,
    words: '',
    value: '',
    swiper:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderList:[],
    videoList:[],
    pageSize:3,
    isOpen: true, //是否提示收费开关,默认打开
  },
  changeFlag(e){
    // console.log(e.detail)
    // this.setData({flag:e.detail})
  },
  goBanner(e){
    wx.navigateTo({
      url: '/pages/banner/banner?url='+e.currentTarget.dataset.url,
    })
  },
  saveWords(e){
    this.setData({words:e.detail})
  },
  goReservation(){
    wx.switchTab({
      url: '/pages/reservation/reservation',
    })
  },
  goVideo(){
    wx.switchTab({
      url: '/pages/video/video',
    })
  },
  fail(){
    wx.navigateTo({
      url: '/pages/fail/fail',
    })
  },
  searchDatas(e){
    this.goSearchDatas(e.detail)
  },
  // 获取搜索结果
  goSearchDatas(key){
    this.getOrderList(key)
    this.getVideoList(key)
  },
  // 去约面详细页
  goOrderDesc(e){
    var orderId = e.currentTarget.dataset.id;
    var customerId = e.currentTarget.dataset.customerid;
    wx.navigateTo({
      url: `/pages/orderDesc/orderDesc?orderId=${orderId}&customerId=${customerId}`,
    })
  },
  // 去视频详细页
  goVideoDesc(e){
    var videoId = e.currentTarget.dataset.videoid;  
    wx.navigateTo({
      url: '/pages/videoDesc/videoDesc?videoId=' + videoId,
    })
  },
  // 获取轮播图
  swiper(){
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/querySysBannerList.json?channelType=2&bannerType=4',
      success(res){
        console.log(res.data)
        that.setData({
          swiper:res.data
        })
      }
    })
  },
  // 获取热门面约
  getAbout() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/queryInterviewOrderList.json?interviewCustomerId=' + wx.getStorageSync("customerId") + '&beginNum=0&pageSize=' + that.data.pageSize,
      success(res) {
        that.setData({ orderList: res.data.dataList })
      }
    })
  },
  // 获取约面列表
  getOrderList(key=''){
    wx.request({
      url: `https://openapi.zhiyajob.com:8443/openapi/getRecommendInterviewOrderVedio.json?beginNum=0&pageSize=3&keyWords=${key}`,
      success: (res) => {
        console.log(res)
        this.setData({
          orderList: res.data.dataList || []
        })
      }
    })
  },
  // 获取视频推荐
  getVideoList(key=''){
    wx.request({
      url: `https://openapi.zhiyajob.com:8443/openapi/searchDiscoveryVedio.json?beginNum=0&pageSize=3&keyWords=${key}`,
      success:(res)=>{
        this.setData({
          videoList:res.data.dataList||[]
        });
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getIsOpen() {
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getSysConfig.json?sysConfigId=1',
      success: (res) => {
        const data = res.data;
        if (data.configValue !== '1') {
          this.setData({
            isOpen: false
          })
        }
      }
    })
  },
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    console.log("scene="+scene)
    if(options.shareCustomerId){
      wx.setStorageSync("shareCustomerId", options.shareCustomerId)
    }
    this.getAbout();
    this.getVideoList();
    this.swiper();
    this.getIsOpen();
    if(options) {
      console.log(options)
      var words = options.keywords;
      // 发送请求根据用户搜索的关键词给出数据
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShareAppMessage() {
    // share();
    var that = this;
    var shareObj = {
      title: "约面详情",
      path: "/pages/index/index?shareCustomerId=" + wx.getStorageSync("customerId"),
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {

        }
      },
      fail: function () {

        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
        }
      }
    }

    return shareObj
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
