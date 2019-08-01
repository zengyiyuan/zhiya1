// component/search-page/searchPage.js
Component({
  // externalClasses: ['outer-title', 'bolded'],
  properties: {
   flag: { // 属性名
      type: Boolean,
      value: true,
      observe:function(newV,oldV){
        console.log(newV)
        this.triggerEvent('changeFlag', newV);
      }
    },
  },
  data: {
    barCur: -1,
    flag: true,
    words: '',
    value: '',
    hotwords: ['英语', '开发', 'UI', '平面设计', '视觉设计', '华为', '小米'],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  observers: { // 属性名
    'flag': function (newV, oldV) {
      // console.log(newV)
      // this.triggerEvent('changeFlag', newV);
    },
    'words':function (newV,oldV){
      // console.log(newV)
      // this.triggerEvent('saveWords',newV)
    }
  },
  methods:{
    changeCur(e) {
      this.setData({ barCur: e.currentTarget.dataset.id, flag: true, words: this.data.hotwords[e.currentTarget.dataset.id] })
      this.triggerEvent('emitSearch', this.data.hotwords[e.currentTarget.dataset.id])
    },
    onChange(e) {
      this.setData({
        words: e.detail.value,
      })
    },
    // 点击搜索框进入搜索页面
    onFocus(e) {
      this.setData({ flag: false })
    },
    cancel() {
      this.setData({ words: '', flag: true })
      this.triggerEvent('emitSearch', '')
    },
    // 去搜索
    gosearch(e) {
      this.setData({ words: this.data.words ,flag:true})
      this.triggerEvent('emitSearch', this.data.words)
    },
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
  onShareAppMessage: function () {

  }
})