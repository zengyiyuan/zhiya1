const share =function(){
  var that = this;
  var shareObj = {
    title: "约面详情",
    path: getCurrentPages()[getCurrentPages().length - 1] + "?shareCustomerId=" + wx.getStorageSync("customerId") + "&orderId=" + that.data.orderId,
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
}

module.export = share;