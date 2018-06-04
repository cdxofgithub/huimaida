// pages/myOrder/myOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  getOrderList: function() {
    let that = this
    let data = {
      start: 0,
      size: 10,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.utils.URL + '/f/api/order/list'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      var res = res.data.data
      console.log(res)
      res.orders.forEach(function(e) {
        if (e.orderStatus == 0) {
          e.orderStatus = '待使用',
          e.mainColor = true
        } else if (e.orderStatus == 1) {
          e.orderStatus = '已核销'
        } else if (e.orderStatus == 1) {
          e.orderStatus = '已过期'
        }
      })
      that.setData({
        orderList: res.orders
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOrderList()
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