// pages/order/order.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    price: 5888,
    num: 1,
    totalPrice: 5888
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