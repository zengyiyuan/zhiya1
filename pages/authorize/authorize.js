// pages/authorize/authorize.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
		title:'职芽欢迎你',
		des:"请使用微信登录后放心使用职芽\n您的信息和数据将受到保护"
  },
	bindGetUserInfo: function (e) {
		console.log(e.detail.errMsg)
		console.log(e.detail.iv)
		console.log(e.detail.encryptedData)
		// 查看是否授权
		wx.getSetting({
			success: function (res) {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称
					console.log('已经授权，可以直接调用 getUserInfo 获取头像昵称')
					wx.getUserInfo({
						success: function (res) {
							console.log('res.userInfo=', res.userInfo)
              app.globalData.userInfo = res.userInfo;
              
							app.globalData.nickName = res.userInfo.nickName
							app.globalData.avatarUrl = res.userInfo.avatarUrl
              app.cb = function (res) {
                // console.log(.globalData.userInfo)
                // that.setData({ userInfo: app.globalData.userInfo })
              }
              wx.request({
                url: 'https://openapi.zhiyajob.com:8443/openapi/addCustomerWithMpOpenId?openId=' + app.globalData.openId + '&nickname=' + res.userInfo.nickName + '&imgUrl=' + res.userInfo.avatarUrl,
                success(res) {
                  console.log(res.data)
                  wx.setStorageSync('customerId', res.data);
                }
              })
						}
					})
					wx.reLaunch({
						url: '/pages/index/index',
					})
				}
			}
		})
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		
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

  /**
   * 用户点击右上角分享
   */
})