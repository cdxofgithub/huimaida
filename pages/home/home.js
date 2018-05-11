// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0,
    showCities: false
  },
  toMyOrder: function() {
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //选择类型
  chooseType: function(e) {
    let curr = e.currentTarget.dataset.curr
    this.setData({
      type: curr
    })
  },
  //选择价格
  choosePrice: function(e) {
    let curr = this.data.type
    if (curr == 1) {
      this.setData({
        type: 2
      })
    } else {
      this.setData({
        type: 1
      })
    }
  },
  // 展开城市
  showCities: function() {
    this.setData({
      showCities: !this.data.showCities,
    })
  },
  //关闭城市
  closeCities: function() {
    this.setData({
      showCities: !this.data.showCities,
    })
  },
  //进去详情
  toDeatil: function() {
    wx.navigateTo({
      url: '../detail/detail',
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})