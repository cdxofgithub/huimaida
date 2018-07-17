// pages/deposit/deposit.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    accountData: '',
    passwordData: ''
  },
  accountInput: function (e) {
    this.setData({
      accountData: e.detail.value
    })
    console.log(this.data.accountData)
  },
  passwordInput: function (e) {
    this.setData({
      passwordData: e.detail.value
    })
  },
  login: function () {
    let that = this
    if (!that.data.accountData) {
      wx.showToast({
        icon: 'none',
        title: '账号不能为空！',
      })
    } else if (!that.data.passwordData) {
      wx.showToast({
        icon: 'none',
        title: '姓名不能为空！',
      })
    } else {
      let data = {
        userName: that.data.accountData,
        realName: that.data.passwordData,
        accesstoken: wx.getStorageSync('accesstoken')
      }
      wx.showLoading({
        title: '提现中...',
      })
      var url = app.utils.URL + '/f/api/distribution/cash'
      app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status == 0) {
          wx.showToast({
            icon: 'success',
            title: '提现成功',
            duration: 1000
          })
          that.setData({
            userName: '',
            realName: ''
          })
        }
      })
    }
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