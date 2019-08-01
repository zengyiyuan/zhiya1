const {host,api}=require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: ["简历", "面试", "实习","政策", "招聘会", "行业"],
    selectCur: 0,
    sorts: ["热播版", "新上线"],
    sortsCur:-1,
    show: false,
    shownavindex: 0,
    barCur: -1,
    flag: true,
    words: '',
    value: '',
    hotwords: ['英语', '开发', 'UI', '平面设计', '视觉设计', '华为', '小米'],
    swiper: ['../../image/swiper1'],
    userInfo: {},
    hasUserInfo: false,
    orderList: [],
    beginNum:0,
    pageSize: 8,
    content: [],
    city: [],
    videoList: [],
    shownavindex: '',
    cateId:'',
    sortType:'',
  },
  goBanner(e) {
    wx.navigateTo({
      url: '/pages/banner/banner?url=' + e.currentTarget.dataset.url,
    })
  },
  changeFlag(e) {
    // console.log(e.detail)
    this.setData({ flag: e.detail })
  },
  saveWords(e) {
    this.setData({ words: e.detail })
    this.getVideoList();
  },
  changeShow() {
    this.setData({ show: false })
  },
 
  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function (e) {
    this.setData({
      shownavindex: 0,
    })
  },
  selectEmpty() {
    this.setData({ selectCur: 0 })
  },
  // 更多筛选
  selectconfirm() {
    var that = this;
    this.setData({ 
      beginNum:0,
      show: false 
    })
    wx.request({
      url: host + 'searchDiscoveryVedio.json?beginNum=0&pageSize=8&sortType='+ '&keyWords=' + that.data.words + '&cateId=' + that.data.cateId,
      success(res) {
        that.setData({ 
          videoList: res.data.dataList
        })
      }
    })
  },
  changeCur(e) {
    this.setData({ barCur: e.currentTarget.dataset.id })
    // console.log(this.data.barCur);
    this.setData({ flag: true })
    this.setData({ words: this.data.hotwords[this.data.barCur] })
  },
  selectCur(e) {
    this.setData({ selectCur: e.currentTarget.dataset.id,cateId:e.currentTarget.dataset.id+1 })
    // console.log(this.data.selectCur);

  },
  // 获取排序
  getsort(e){
    var that =this;
    this.setData({
      beginNum:0,
      sortsCur:e.currentTarget.dataset.sort,
      show:false
    });
    wx.request({
      url: host + 'searchDiscoveryVedio.json?beginNum=0&pageSize=8&sortType=' + that.data.sortsCur + '&keyWords=' + that.data.words + '&cateId=',
      success(res) {
        that.setData({ 
          videoList: res.data.dataList
        })
      }
    })
  },
  searchDatas(e) {
    this.goSearchDatas(e.detail)
  },
  // 获取搜索结果
  goSearchDatas(key) {
    this.setData({
      beginNum:0,
      videoList:[]
    })
    wx.request({
      url: `${host}searchDiscoveryVedio.json?beginNum=0&pageSize=${this.data.pageSize}&sortType=${this.data.sortsCur}&keyWords=${key}&cateId=${this.data.cateId}`,
      success:(res)=>{
        this.setData({ 
          videoList: res.data.dataList
        });
      }
    })
  },
  goVideoDesc(e) {
    var videoId = e.currentTarget.dataset.videoid;
    wx.navigateTo({
      url: '/pages/videoDesc/videoDesc?videoId=' + videoId,
    })
  },
  swiper() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/querySysBannerList.json?channelType=2&bannerType=4',
      success(res) {
        // console.log(res.data)
        that.setData({
          swiper: res.data
        })
      }
    })
  },
  // 获取视频列表
  getVideoList() {
    var that = this;
    wx.request({
      url: host+'searchDiscoveryVedio.json?beginNum='+that.data.beginNum+'&pageSize='+that.data.pageSize+'&sortType='+that.data.sortsCur+'&keyWords='+that.data.words+'&cateId='+that.data.cateId,
      success(res) {
        that.setData({ videoList: that.data.videoList.concat(res.data.dataList) });
      }
    })
  },
  bindtap(e) {
    // console.log(e.detail)
  },
  showCity() {
    this.setData({ tabCur: 0, show: !this.data.show, shownavindex: 1 })
  },
  select() {
    this.setData({ tabCur: 2, show: !this.data.show, shownavindex: 3 })

  },
  getSelect(){
    var that = this;
    wx.request({
      url: host+'queryDiscoveryClassifyList.json',
      success(res){
        console.log(res)
        that.setData({select:res.data});
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.shareCustomerId){
      wx.setStorageSync("shareCustomerId", options.shareCustomerId)
    }
    this.getVideoList();
    this.getSelect();
    this.swiper();
    if (options) {
      console.log(options)
      var words = options.keywords;
      // 发送请求根据用户搜索的关键词给出数据
    }
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
    this.setData({beginNum:this.data.beginNum+this.data.pageSize})
    this.getVideoList();

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // share();
    var that = this;
    var shareObj = {
      title: "约面详情",
      path: "/pages/video/video?shareCustomerId=" + wx.getStorageSync("customerId"),
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

})