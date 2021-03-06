// pages/verification/verification.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    accountData: '',
    passwordData: ''
  },
  accountInput: function(e) {
    this.setData({
      accountData: e.detail.value
    })
    console.log(this.data.accountData)
  },
  passwordInput: function(e) {
    this.setData({
      passwordData: e.detail.value
    })
  },
  login: function() {
    if (!this.data.accountData) {
      wx.showToast({
        icon: 'none',
        title: '账号不能为空！',
      })
    } else if (!this.data.passwordData) {
      wx.showToast({
        icon: 'none',
        title: '密码不能为空！',
      })
    } else {
      let data = {
        userName: this.data.accountData,
        passWord: this.data.passwordData
      }
      wx.showLoading({
        title: '登录中...',
      })
      var url = app.utils.URL + '/f/api/sys/login'
      app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status == 0) {
          wx.setStorageSync('login', true)
          wx.showToast({
            icon: 'none',
            title: '登录成功',
            duration: 1000
          })
          setTimeout(function() {
            wx.navigateTo({
              url: '../charge/charge',
            })
          }, 1000)
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getStorageSync('login')) {
      wx.showLoading({
        title: '登录中...',
      })
      setTimeout(function() {
        wx.hideLoading()
        wx.navigateTo({
          url: '../charge/charge',
        })
      }, 1000)
    }

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