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
    shareShow: false,
    canShare:false,
    src: '',
    pic: '',
    tab: ['详情', '评论'],
    TabCur: 0,
    scrollLeft: 0,
    orderId: 0,
    orderList: [],
    isbuy: 0,
    isPlay: false,
    isEnd:false,
    orderDesc: {},
    pageVideoSize: 4,
    pageCommentSize: 4,
    isFavor: false,
    isZan: false,
    defaultValue: '',
    commentList: [],
    isMore: false,
    screenHeight: 300,
    screenWidth: 450,
    modalName: '',
    bioStatus:false,
    isOpen:true, //是否提示收费开关,默认打开
    isIos:true
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  changeshare() {
    var that = this;
    that.setData({
      shareShow: true
    })    
  },
  previewImg() {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.openSetting()    
        }else{
          wx.canvasToTempFilePath({
            canvasId: 'share',
            success: function (res) {
              var tempFilePath = res.tempFilePath;
              console.log(res);
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success: function (res) {
                  wx.showToast({
                    title: '保存成功',
                  })
                  that.setData({
                    shareShow: false
                  })
                },
                fail: function (res) {
                  console.log(res)
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
    this.setData({
      shareShow: false
    })
  },
  doCanvas() {
    var that = this;
    console.log('docanvas')
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
      if (pic.measureText(temp).width < (that.data.screenWidth-20)) {
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
      pic.fillText(row[b], 10, that.data.screenHeight * 0.4 + 20 * (b + 1), that.data.screenWidth-20);
    }
    // pic.fillText('' + that.data.orderDesc.title, 10, that.data.screenHeight * 0.4 + 20);
    pic.setFontSize(16);
    pic.setFillStyle("#999");
    pic.fillText('' + that.data.orderDesc.keyWords, 10, that.data.screenHeight * 0.4 + 20 * (row.length+1));
    pic.drawImage(wx.getStorageSync("imgUrl"), that.data.screenWidth * 0.5 - 65,                            that.data.screenHeight - 159, 129, 129)
    pic.draw(false,function(){
      that.setData({
        canShare: true
      })
    });
    setTimeout(function () {
      that.setData({
        canShare: true
      })
    }, 500)
  },
  showMore() {
    this.setData({
      isMore: !this.data.isMore
    })
  },
  toPlay() {
    this.setData({
      isPlay: true,
      isEnd:false
    })
  },
  handlePlayEnd() {
    this.setData({
      isPlay: false,
      isEnd:true
    })
  },
  // 去订单支付页
  toOrderPay() {
    console.log(this.data.orderId)
    var orderId = this.data.orderId;
    wx.navigateTo({
      url: '/pages/orderPay/orderPay?orderId=' + orderId,
    })
  },
  // 评论
  setValue(e) {
    this.setData({
      defaultValue: e.detail.value
    })
  },
  // 评论
  toComment() {
    var that = this;
    if (!this.data.defaultValue) {
      return this.showModal()
    }
    wx.request({
      url: api + 'addWxInterviewOrderEvaluate.json"',
      method: 'post',
      data: {
        "parentId": 0,
        "orderId": that.data.orderId,
        "evaluateContent": that.data.defaultValue
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        "cookie": "customerId=" + wx.getStorageSync("customerId")
      },
      success(res) {
        var newArr = that.data.commentList;
        newArr.unshift(res.data.evaluate)
        that.setData({
          defaultValue: '',
          commentList: newArr
        });
        wx.showToast({
          title: '评论成功',

        })
      }
    })


  },
  // 获取相关面约
  getAbout() {
    var that = this;
    var begainNum = this.data.orderList.length;
    wx.request({
      url: `https://openapi.zhiyajob.com:8443/openapi/queryInterviewOrderList.json?interviewCustomerId=${wx.getStorageSync("customerId")}&beginNum=${begainNum}&pageSize=${that.data.pageVideoSize}`,
      success(res) {
        that.setData({
          orderList: res.data.dataList.concat(that.data.orderList)
        })
      }
    })
  },
  // 去相关面约商品详情
  goOrderDesc(e) {
    var orderId = e.currentTarget.dataset.id;
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?orderId=' + orderId,
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
        data: {
          dataId: this.data.orderId,
          type: "1"
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "cookie": 'customerId=' + wx.getStorageSync('customerId')
        },
        success(res) {
          console.log(res);
          if (res.errMsg == "request:ok") {
            that.setData({
              isFavor: false
            })
          }
        }
      })
    } else {
      // 添加收藏
      wx.request({
        url: api + 'addCustomerCollect.json',
        method: 'post',
        data: {
          dataId: this.data.orderId,
          type: "1"
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "cookie": 'customerId=' + wx.getStorageSync('customerId')
        },
        success(res) {
          console.log(res);
          if (res.errMsg == "request:ok") {
            that.setData({
              isFavor: true
            })
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
        data: {
          dataId: this.data.orderId,
          type: "1"
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "cookie": 'customerId=' + wx.getStorageSync('customerId')
        },
        success(res) {
          console.log(res);
          if (res.errMsg == "request:ok") {
            that.setData({
              isZan: false
            })
          }
        }
      })
    } else {
      wx.request({
        url: api + 'addCustomerPraise.json',
        method: 'post',
        data: {
          dataId: this.data.orderId,
          type: "1"
        },
        header: {
          "content-type": "application/x-www-form-urlencoded",
          "cookie": 'customerId=' + wx.getStorageSync('customerId')
        },
        success(res) {
          console.log(res);
          if (res.errMsg == "request:ok") {
            that.setData({
              isZan: true
            })
          }
        }
      })
    }

  },
  getComment() {
    var that = this;
    var begainNum = this.data.commentList.length;
    wx.request({
      url: `${host}queryInterviewEvaluateList.json?orderId=${that.data.orderId}&beginNum=${begainNum}&pageSize=${this.data.pageCommentSize}&parentId=0`,
      success(res) {
        that.setData({
          commentList: res.data.dataList.concat(that.data.commentList)
        })
      }
    })
  },
  changeFocus() {
    this.setData({
      isFocus: true
    })
  },
  // 二维码图片
  erweima(){
    var that = this;
    let params = that.data.orderId+'_'+wx.getStorageSync("customerId")
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getMiniCode.json?page=pages/orderDesc/orderDesc&scene='+params +'&width=100',
      method:"post",
      header:{"content-type":"application/json" ,"cookie":"customerId="+wx.getStorageSync("customerId")},
      success(res){
        wx.downloadFile({
          url: res.data.imgUrl,
          success: function (res) {
            wx.setStorageSync("imgUrl", res.tempFilePath);
            that.doCanvas()
          },
          fail: function (res) {
            that.setData({
              tab:[1,2]
            })
            console.log("fail" + res.errMsg)
          }
        })
      }
    })
  },
  // 查看用户详情
  checkUserDetail(e){
    var userId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/userDetail/detail?userId=${userId}`
    })
  },
  getIsOpen(){
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getSysConfig.json?sysConfigId=1',
      success:(res)=>{
        const data = res.data;
        if (data.configValue!=='1'){
          this.setData({
            isOpen:false
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var orderId = options.orderId;
    if (options.scene) {
      let arr = decodeURIComponent(options.scene).split('_');
      wx.setStorageSync("shareCustomerId", arr[1])
      orderId = arr[0];
    }
    this.getIsOpen();
    wx.getSystemInfo({
      success: function (res) {
        const sys = res.system
        console.log(sys)
        if(!/ios/i.test(sys)){
          that.setData({
            isIos:false
          })
        }
        that.setData({
          screenWidth: res.screenWidth * 0.8,
          screenHeight: res.screenHeight * 0.6
        })
      },
    })
    this.setData({
      orderId: orderId,
    });
    //  约面详情
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getInterviewOrder.json?interviewOrderId=' + orderId,
      success(res) {
        that.setData({
          orderDesc: res.data
        },function(){
          wx.getImageInfo({
            src: res.data.orderImg,
            success(res) {
              wx.setStorageSync("orderImg", res.path);
            },
            complete(){
              that.erweima();
            }
          })
        })
      }
    })
   
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/checkCustomerIsInspect.json',
      data: {
        orderId: this.data.orderId,
        customerId: wx.getStorageSync('customerId')
      },
      success(res) {
        that.setData({
          isbuy: res.data
        })
        if(res.data===1){
          // 已购买
          that.setData({
            src: that.data.orderDesc && that.data.orderDesc.resumeUrl
          })
        }else{
          // 未购买
          that.setData({
            src: that.data.orderDesc && that.data.orderDesc.resumeUrl
          })
        }
      }
    })

    wx.request({
      url: api + 'getCustomerCollectAndPraise.json?dataId=' + that.data.orderId + '&type=1',
      success(res) {
        if (res.data.praiseFlag == 1) {
          that.setData({
            isFavor: true
          });
        }
        if (res.data.collectFlag == 1) {
          that.setData({
            isZan: true
          })
        }
      }
    })
    this.getAbout();
    this.getComment();
  },
  // 查看简历
  viewBio(){
    this.setData({
      bioStatus: !this.data.bioStatus
    })
  },
  // checkBio(e){
  //   var url =  e.currentTarget.dataset.url
  //   wx.navigateTo({
  //     url: `/pages/bioDetail/detail?bioUrl=${url}`
  //   })
  // },
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

    if (this.data.TabCur == 0) {
      this.getAbout();
    }
    if (this.data.TabCur == 1) {
      this.getComment();
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // share();
    var that = this;
    var shareObj = {
      title: "约面详情",
      path: "/pages/orderDesc/orderDesc?shareCustomerId=" + wx.getStorageSync("customerId") + "&orderId=" + that.data.orderId,
      success: function(res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {

        }
      },
      fail: function() {

        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {}
      }
    }

    return shareObj
  },
 
})