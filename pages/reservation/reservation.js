var cityData = require('../../utils/city.js');
let {host,api} = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:["不限","免费","付费"],
    selectCur:0,
    show:false,
    shownavindex:0,
    barCur: -1,
    flag: true,
    swiper: [],
    hasUserInfo: false,
    orderList: [],
    beginNum:0,
    pageSize: 3,
    content: [],
    sorts:[],
    sortsCur:-1,
    cityleft: [], //获取区域的下拉框筛选项内容
    citycenter: {}, //选择区域左边筛选框后的显示的中间内容部分
    cityright: {}, //选择区域的中间内容部分后显示的右边内容
    select1: '', //区域选中后的第二个子菜单，默认显示地铁下的子菜单
    select2: '', //区域选择部分的中间
    select3: '', //区域选择部分的右边
    shownavindex: '',
    words:'',
    isCharge:'',
    cityId:'',
    industryId:'',
    positionId:'',
    isOpen: true, //是否提示收费开关,默认打开
  },
  goBanner(e) {
    wx.navigateTo({
      url: '/pages/banner/banner?url=' + e.currentTarget.dataset.url,
    })
  },
  // 改变热门搜索页面显示隐藏
  changeFlag(e) {
    console.log(e.detail)
    this.setData({ flag: e.detail })
  },
  // 保存搜索词
  saveWords(e) {
    this.setData({ words: e.detail })
    this.getAbout();
  },
  // 改变现实
  changeShow(){
    this.setData({show:false})
  },
  // 筛选
  selectCur(e) {
    this.setData({ 
      selectCur: e.currentTarget.dataset.id, 
      cateId: e.currentTarget.dataset.id + 1 
    })
    console.log(this.data.selectCur);

  },
  selectleft: function (e) {
    var that = this;
    console.log('用户选中左边菜单栏的索引值是：' + e.target.dataset.city);
    wx.request({
      url: host+'querySysIndustryList.json?industryId='+e.currentTarget.dataset.city,
      success(res){
        console.log(res.data);
        that.setData({
          citycenter:res.data,
          select1:e.currentTarget.dataset.city
        })
      }
    })
  },
  // 区域中间栏选择的内容
  selectcenter: function (e) {
    var that = this;
    wx.request({
      url: host+'querySysPositionList.json?industryId='+e.currentTarget.dataset.city,
      success(res){
        console.log(res.data);
        that.setData({select2:e.currentTarget.dataset.city,cityright:res.data})
      }
    })
  },
  // 区域右边栏选择的内容
  selectright: function (e) {
    console.log(e.currentTarget.dataset.city);
    this.setData({
      select3: e.currentTarget.dataset.position,
      positionId:e.currentTarget.dataset.position,
      industryId:e.currentTarget.dataset.city
    });
    this.submitFilter();
  },
  // 区域清空筛选项
  quyuEmpty: function () {
    this.setData({
      select1: '',
      select2: '',
      select3: '-1'
    })
  },
  selectEmpty(){
    this.setData({selectCur:0})
  },
  // 确认按钮
  selectconfirm(){
    var that = this;
    console.log(this.data.selectCur)
    this.setData({show:false})
    if(this.data.setData!=0){
      this.setData({ isCharge: this.data.selectCur ? this.data.selectCur-1:''});
    }
    wx.request({
      url: host +'getRecommendInterviewOrderVedio.json?beginNum=0&pageSize=3&cityId=&industryId=&positionId=&isCharge='+that.data.isCharge+'&timeType=&keyWords=',
      success(res){
        console.log(res.data)
        that.setData({
          orderList:res.data.dataList,
          beginNum:0
        })
      }
    })
    
  },
  // 区域选择筛选项后，点击提交
  submitFilter: function () {
    var that = this;
    console.log('选择的一级选项是：' + this.data.select1);
    console.log('选择的二级选项是：' + this.data.select2);
    console.log('选择的三级选项是：' + this.data.select3);
    // 隐藏区域下拉框
    wx.request({
      url: host+'getRecommendInterviewOrderVedio.json?beginNum=0&pageSize=3&cityId=&industryId='+that.data.industryId+'&positionId='+this.data.positionId+'&isCharge=&timeType=&keyWords=',
      success(res){
        console.log(res.data);
        that.setData({orderList:res.data.dataList,show:false})
      }
    })
  },
  searchDatas(e) {
    console.log(e.detail)
    this.goSearchDatas(e.detail)
  },
  // 获取搜索结果
  goSearchDatas(key) {
    this.getOrderList(key)
  },
  // 获取约面列表
  getOrderList(key = '') {
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
  // 去商品详情页
  goOrderDesc(e) {
    var orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?orderId=' + orderId,
    })
  },
  // 获取轮播图
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
  // 获取更多约面
  getAbout() {
    var that = this;
    wx.request({
      url: host+'getRecommendInterviewOrderVedio.json?beginNum='+that.data.beginNum+'&pageSize='+that.data.pageSize+'&cityId='+that.data.cityId+'&industryId='+that.data.industryId+'&positionId='+that.data.positionId+'&isCharge='+that.data.isCharge+'&timeType=&keyWords='+that.data.words,
      success(res) {
        console.log(res)
        that.setData({ orderList: that.data.orderList.concat(res.data.dataList) })
      }
    })
  },
  detail(e) {
    console.log(e.detail);
    this.setData({show:false})
    wx.request({
      url: host +'getRecommendInterviewOrderVedio.json?beginNum=0&pageSize=3&cityId=3&industryId=&positionId=&isCharge=&timeType=&keyWords=',
    })
  },
  getsort(e) {
    var that = this;
    this.setData({ sortsCur: e.currentTarget.dataset.index, cityId: e.currentTarget.dataset.sort,show:false});
    console.log(this.data.sortsCur);
    wx.request({
      url: host + 'getRecommendInterviewOrderVedio.json?beginNum=0&pageSize=' + that.data.pageSize + '&cityId='+e.currentTarget.dataset.sort+'&industryId=&positionId=&isCharge=&timeType=&keyWords=' + that.data.words,
      success(res) {
        that.setData({ orderList: res.data.dataList,beginNum:0 })
      }
    })
  },
  showCity(){
    this.setData({tabCur:0,show:!this.data.show,shownavindex:1})
  },
  select(){
    this.setData({ tabCur: 2, show: !this.data.show, shownavindex: 3 })

  },
  job(e) {
    this.setData({ tabCur: 1, show: !this.data.show, shownavindex: 2 })
    if (this.data.qyopen) {
      this.setData({
        shownavindex: 2
      })
    } else {
      this.setData({
        shownavindex: e.currentTarget.dataset.nav
      })
    }
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if(options.shareCustomerId){
      wx.setStorageSync("shareCustomerId", options.shareCustomerId)
    }
    this.getAbout();
    this.swiper();
    this.getIsOpen();
    // if (options) {
    // console.log(options)
     
    // }
    wx.request({
      url: host +'querySysCityList.json',
      success(res){
        // console.log(res.data)
        that.setData({sorts:res.data})
      }
    })
    wx.request({
      url: host +'querySysIndustryList.json?industryId=0',
      success(res){
        console.log(res.data)
        that.setData({cityleft:res.data})
      }
    })

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
    this.setData({beginNum:this.data.beginNum+this.data.pageSize});
    this.getAbout();

  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // share();
    var that = this;
    var shareObj = {
      title: "约面详情",
      path: "/pages/reservation/reservation?shareCustomerId=" + wx.getStorageSync("customerId"),
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