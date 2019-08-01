const { api, host } = require("../../config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareShow: false,
    canShare:false,
    src: '',
    pic: '',
    isFocus:false,
    tab: ['详情', '评论'],
    TabCur: 0,
    scrollLeft: 0,
    orderId: '',
    orderList: [],
    isbuy: false,
    isPlay:false,
    isEnd: false,
    orderDesc: {},
    hasOrderId:false,
    orderInfo:{},
    pageVideoSize: 3,
    pageCommentSize: 3,
    isFavor: false,
    isZan: false,
    defaultValue: '',
    commentList: [],
    videoList:[],
    screenHeight: 300,
    screenWidth: 450,
    modalName:''
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  changeFocus(){
    this.setData({isFocus:true})
  },
  changeshare() {
    this.setData({ shareShow: true })
  },
  previewImg() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.openSetting()
        } else {
          wx.canvasToTempFilePath({
            canvasId: 'share',
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              console.log(tempFilePath);
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success: function (res) {
                  wx.showToast({
                    title: '保存成功',
                  })
                  that.setData({ shareShow: false })
                }
              })
            },
            fail: function (res) {
              console.log(res);
            }
          });
        }
      }
    })
  },
  hideshare() {
    this.setData({ shareShow: false })
  },
  doCanvas() {
    var that = this;
    const pic = wx.createCanvasContext("share", this);
    pic.setFillStyle("#fff");
    pic.fillRect(0, 0, that.data.screenWidth, that.data.screenHeight);
    pic.drawImage(wx.getStorageSync("orderImg"), 0, 0, that.data.screenWidth, that.data.screenHeight * 0.4)
    pic.setFontSize(18);
    pic.setFillStyle("#000");
    let title = this.data.orderDesc.title;
    let chr = title.split("");
    let temp = "";
    let row = [];
    for (let a = 0; a < chr.length; a++) {
      if (pic.measureText(temp).width < (that.data.screenWidth - 20)) {
        temp += chr[a];
      }
      else {
        a--;
        row.push(temp);
        temp = "";
      }
    }
    row.push(temp);
    for (let b = 0; b < row.length; b++) {
      pic.fillText(row[b], 10, that.data.screenHeight * 0.4 + 20 * (b + 1), that.data.screenWidth - 20);
    }
    // pic.fillText('' + that.data.orderDesc.title, 10, that.data.screenHeight * 0.4 + 20);
    pic.setFontSize(16);
    pic.setFillStyle("#999");
    pic.fillText('' + that.data.orderDesc.keyWords, 10, that.data.screenHeight * 0.4 + 20 * (row.length + 1));
    pic.drawImage(wx.getStorageSync("imgUrl"), that.data.screenWidth * 0.5 - 65, that.data.screenHeight - 159, 129, 129)
    pic.draw(false, function () {
      that.setData({
        canShare: true
      })
    });
    setTimeout(function(){
      that.setData({
        canShare: true
      })
    },500)
  },
  // 获取视频详情
  getVideoDetail(id) {
    var that = this;
    wx.request({
      url: `https://openapi.zhiyajob.com:8443/openapi/getDiscoveryVedioDetail.json?discoveryVedioId=${id}`,
      success(res) {
        var item = res.data||{};
        wx.getImageInfo({
          src: item.vedioImg,
          success(res) {
            wx.setStorageSync("orderImg", res.path);
          },
          complete() {
            that.erweima();
          }
        })
        wx.getSystemInfo({
          success: function (res) {
            that.setData({
              screenWidth: res.screenWidth * 0.8,
              screenHeight: res.screenHeight * 0.6
            })
          },
        })
        that.setData({ 
          orderDesc: item,
          src: item.vedioUrl||''
        },function(){
            var orderId = item.orderId;
            // 已购买的会有orderId
            if(orderId) {
              that.setData({
                orderId
              })
              this.getOrderDesc(orderId)
              that.getComment();
              that.getParise();
            }
            that.getVideoList();
            that.getAbout();  
        })    
      }
    })
  },
  toPlay() {
    this.setData({ 
      isPlay: true,
      isEnd:false
    })
  },
  handlePlayEnd(){
    this.setData({
      isPlay:false,
      isEnd:true
    })
  },
  // 获取约面详情
  getOrderDesc(orderId){
    //  约面详情
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getInterviewOrder.json?interviewOrderId=' + orderId,
      success:(res)=>{
        this.setData({
          hasOrderId:true,
          orderInfo: res.data
        })
      }
    })
  },
  // 去约面详细页
  goOrderDesc(e) {
    var orderId = e.currentTarget.dataset.id;
    console.log(orderId)
    wx.navigateTo({
      url: `/pages/orderDesc/orderDesc?orderId=${orderId}`,
    })
  },
  // 去订单支付页
  toOrderPay() {
    var orderId = this.data.orderId;
    wx.navigateTo({
      url: '/pages/orderPay/orderPay?orderId=' + orderId + '',
    })
  },
  setValue(e){
    this.setData({defaultValue:e.detail.value})
  },
  // 评论
  toComment() {
    var that = this;
    if (!this.data.defaultValue){
      return this.showModal()
    }
    wx.request({
      url: api + 'addWxDiscoveryEvaluate.json',
      method: 'post',
      data: { "parentId": 0, "vedioId": that.data.orderId, "evaluateContent": that.data.defaultValue },
      header: { 'content-type': 'application/x-www-form-urlencoded' ,"cookie": "customerId=" + wx.getStorageSync("customerId") },
      success(res) {
        var newArr = that.data.commentList;
        newArr.unshift(res.data.evaluate)
        that.setData({ defaultValue: '', commentList: newArr });
        wx.showToast({
          title: '评论成功',

        })
      }
    })


  },
  // 获取相关面约
  getAbout() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/queryInterviewOrderList.json?interviewCustomerId=' + wx.getStorageSync("customerId") + '&beginNum=0&pageSize=' + that.data.pageVideoSize,
      success(res) {
        that.setData({ orderList: res.data.dataList })
      }
    })
  },
  // 设置收藏
  setFavor() {
    var that = this;
    if (this.data.isFavor) {
      // 取消收藏
      wx.request({
        url: api + 'cancelCustomerCollect.json',
        method: 'post',
        data: { dataId: this.data.orderId, type: "2" },
        header: { "content-type": "application/x-www-form-urlencoded","cookie": 'customerId=' + wx.getStorageSync('customerId') },
        success(res) {
          if (res.errMsg == "request:ok") {
            that.setData({ isFavor: false })
          }
        }
      })
    } else {
      // 添加收藏
      wx.request({
        url: api + 'addCustomerCollect.json',
        method: 'post',
        data: { dataId: this.data.orderId, type: "2" },
        header: { "content-type": "application/x-www-form-urlencoded","cookie": 'customerId=' + wx.getStorageSync('customerId') },
        success(res) {
          if (res.errMsg == "request:ok") {
            that.setData({ isFavor: true })
          }
        }
      })
    }

  },
  // 点赞
  setZan() {
    var that = this;
    if (this.data.isZan) {
      wx.request({
        url: api + 'cancelCustomerPraise.json',
        method: 'post',
        data: { dataId: this.data.orderId, type: "2" },
        header: { "content-type": "application/x-www-form-urlencoded", "cookie": 'customerId=' + wx.getStorageSync('customerId') },
        success(res) {
          if (res.errMsg == "request:ok") {
            that.setData({ isZan: false })
          }
        }
      })
    } else {
      wx.request({
        url: api + 'addCustomerPraise.json',
        method: 'post',
        data: { dataId: this.data.orderId, type: "2" },
        header: { "content-type": "application/x-www-form-urlencoded","cookie": 'customerId=' + wx.getStorageSync('customerId') },
        success(res) {
          if (res.errMsg == "request:ok") {
            that.setData({ isZan: true })
          }
        }
      })
    }

  },
  // 获取评论
  getComment() {
    var that = this;
    wx.request({
      url: host + "queryDiscoveryVedioEvaluateList.json?vedioId="+that.data.orderDesc.vedioId+"&beginNum=0&pageSize="+that.data.pageCommentSize,
      success(res) {
        that.setData({ commentList: res.data.dataList||[] })
      }
    })
  },
  // 获取推荐视频
  getVideoList() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/searchDiscoveryVedio.json',
      success(res) {
        that.setData({ videoList: res.data.dataList });
      }
    })
  },
  goVideoDesc(e) {
    var videoId = e.currentTarget.dataset.videoid;
    wx.navigateTo({
      url: '/pages/videoDesc/videoDesc?videoId=' + videoId,
    })
  },
  erweima() {
    var that = this;
    let params = that.data.orderId + '_' + wx.getStorageSync("customerId")
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getMiniCode.json?page=pages/orderDesc/orderDesc&scene=' + params + '&width=100',
      method: "post",
      header: { "content-type": "application/json", "cookie": "customerId=" + wx.getStorageSync("customerId") },
      success(res) {
        wx.downloadFile({
          url: res.data.imgUrl,
          success: function (res) {
            wx.setStorageSync("imgUrl", res.tempFilePath);
            that.doCanvas()
          },
          fail: function (res) {
            console.log("fail" + res.errMsg)
          }
        })
      }
    })
  },
  // 获取点赞
  getParise(){
    var that = this;
    wx.request({
      url: api + 'getCustomerCollectAndPraise.json?dataId=' + that.data.orderId + '&type=2',
      success(res) {
        if (res.data.praiseFlag == 1) {
          that.setData({ isFavor: true });
        }
        if (res.data.collectFlag == 1) {
          that.setData({ isZan: true })
        }
      }
    })
  },
  // 弹框
  showModal() {
    this.setData({
      modalName: 'Modal'
    })
  },
  hideModal() {
    this.setData({
      modalName: null
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var videoId = options.videoId;
    if (videoId){
      this.getVideoDetail(videoId);
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

    if (this.data.TabCur == 0) {
      this.data.pageVideoSize++;
      this.getAbout();
    }
    if (this.data.TabCur == 1) {
      this.data.pageCommentSize++;
      this.getComment();
    }


  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {
  //   // share();
  //   var that = this;
  //   var shareObj = {
  //     title: "约面详情",
  //     path: "/pages/videoDesc/videoDesc?shareCustomerId=" + wx.getStorageSync("customerId") + "&orderId=" + that.data.orderId,
  //     success: function (res) {
  //       // 转发成功之后的回调
  //       if (res.errMsg == 'shareAppMessage:ok') {

  //       }
  //     },
  //     fail: function () {

  //       if (res.errMsg == 'shareAppMessage:fail cancel') {
  //         // 用户取消转发
  //       } else if (res.errMsg == 'shareAppMessage:fail') {
  //       }
  //     }
  //   }

  //   return shareObj
  // },
})