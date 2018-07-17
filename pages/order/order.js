// pages/order/order.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 0,
    num: 1,
    totalPrice: 0,
    phone: '',
    parentId: '',
    index: 0,
    array: [],
    attribute: [],
    attributeId: '',   //套餐id
  },
  bindPickerChange: function (e) {
    let that = this
    let index = e.detail.value
    that.setData({
      index: index,
      price: that.data.attribute[index].value,
      attributeId: that.data.attribute[index].id
    })
    that.computedValue()
  },
  reduce: function() {
    let num = this.data.num
    if (num > 1) {
      this.setData({
        num: num - 1
      })
      this.computedValue()
    }
  },
  add: function() {
    let num = this.data.num
    this.setData({
      num: num + 1
    })
    this.computedValue()
  },
  //价格计算
  computedValue: function() {
    let price = this.data.price
    let num = this.data.num
    this.setData({
      totalPrice: price * num
    })
  },
  pay: function() {
    let that = this
    if (!(/^1[123456789]\d{9}$/.test(that.data.phone))) {
      app.wxToast({
        title: '号码格式有误！'
      })
    } else {
      let data = {
        productId: that.data.id,
        
        accesstoken: wx.getStorageSync('accesstoken'),
        num: that.data.num,
        phone: that.data.phone,
        parentId: that.data.parentId,
        attributeId: that.data.attributeId
      }
      console.log(data)
      wx.showLoading({
        title: '加载中...',
      })
      var url = app.utils.URL + '/f/api/order/createOrder'
      app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
        wx.hideLoading()
        var result = res.data.data
        // wx.redirectTo({
        //   url: '../paySuccess/paySuccess?orderId=' + result.orderId,
        // })
        wx.requestPayment({
          'timeStamp': result.timeStamp,
          'nonceStr': result.nonceStr,
          'package': result.package,
          'signType': result.signType,
          'paySign': result.paySign,
          'success': function (res) {
            wx.redirectTo({
              url: '../paySuccess/paySuccess?orderId=' + result.orderId,
            })
          },
          'fail': function (res) {
            if (res.errMsg == 'requestPayment:fail cancel') {
              var url = app.utils.URL + '/f/api/order/cancelPay'
              var data = {
                orderId: result.orderId,
                accesstoken: wx.getStorageSync('accesstoken')
              }
              app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
                if (res.data.status == '0') {
                  app.wxToast({
                    title: '取消支付成功'
                  })
                }
              })
            } else {
              app.wxToast({
                title: '支付出错'
              })
            }
          }
        })
      })
    }
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getPhone: function() {
    wx.showLoading({
      title: '加载中...',
    })
    let that = this
    let data = {
      accesstoken: wx.getStorageSync('accesstoken')
    }
    var url = app.utils.URL + '/f/api/user/getPhone'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      var res = res.data
      that.setData({
        phone: res.data.phone ? res.data.phone : ''
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = JSON.parse(options.data);
    console.log(data)
    let arr = [{
      id: '',
      key: '默认套餐',
      value: data.nowPrice
    }]
    let array = []
    let attribute = arr.concat(data.attribute)
    attribute.forEach(function(e) {
      array.push(e.key)
    })
    this.setData({
      content: data.content,
      price: data.nowPrice,
      id: data.productId,
      attribute: attribute,
      array: array
    })
    
    if (data.parentId) {
      this.setData({
        parentId: data.parentId
      })
    }
    console.log('parentId' + this.data.parentId)
    this.computedValue()
    this.getPhone()
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