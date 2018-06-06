// pages/myOrder/myOrder.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    empty: false
  },
  getOrderList: function() {
    let that = this
    that.setData({
      orderList: []
    })
    let data = {
      start: 0,
      size: 10000,
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
      let empty;
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
      if (!res.orders.length) {
        empty = true
      } else {
        empty = false
      }
      let winHeight = res.orders.length * 400 + res.orders.length * 20
      that.setData({
        orderList: res.orders,
        winHeight: winHeight,
        empty: empty
      })
    })
  },

  getDistribution: function() {
    let that = this
    that.setData({
      orderList: []
    })
    let data = {
      start: 0,
      size: 10000,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.utils.URL + '/f/api/distribution/list'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      var res = res.data.data
      console.log(res)
      res.orders.forEach(function (e) {
        if (e.status == 0) {
          e.orderStatus = ' 未处理'
        } else if (e.status == 1) {
          e.orderStatus = '处理中'
        } else if (e.status == 2) {
          e.orderStatus = '处理成功',
            e.mainColor = true
        } else if (e.status == 3) {
          e.orderStatus = '处理失败'
        }
      })
      let empty;
      if (!res.orders.length) {
        empty = true
      } else {
        empty = false
      }
      let winHeight = res.orders.length * 400 + res.orders.length * 20
      that.setData({
        orderList: res.orders,
        winHeight: winHeight,
        empty: empty
      })
    })
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
    if (that.data.currentTab == 0) {
      that.getOrderList()
    } else {
      that.getDistribution()
    }
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    if (this.data.currentTab == e.currentTarget.dataset.current) {
      return false;
    } else {
      this.setData({
        currentTab: e.currentTarget.dataset.current
      })
    }
    // if (this.data.currentTab == 0) {
    //   this.getOrderList()
    // } else {
    //   this.getDistribution()
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getOrderList()
  },
  toOrderDetail: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../paySuccess/paySuccess?orderId=' + id,
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