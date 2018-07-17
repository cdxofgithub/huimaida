// pages/charge/charge.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codeData: ''
  },
  codeInput: function(e) {
    this.setData({
      codeData: e.detail.value
    })
    console.log(this.data.codeData)
  },
  charge: function() {
    let that = this
    if (!that.data.codeData) {
      wx.showToast({
        icon: 'none',
        title: '请输入核销码'
      })
    } else {
      let data = {
        code: that.data.codeData
      }
      wx.showLoading({
        title: '检测中...',
      })
      var url = app.utils.URL + '/f/api/order/orderDetailByCode'
      app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
        wx.hideLoading()
        console.log(res)
        if (res.data.status == 0) {
          let result = res.data.data.detail
          let content = result.key ? (result.key + ' x 1') : ('默认套餐 x 1')
          console.log(result)
          wx.showModal({
            title: result.productName,
            content: content,
            confirmText: '确认核销',
            success: function (res) {
              if (res.confirm) {
                let data = {
                  code: that.data.codeData
                }
                wx.showLoading({
                  title: '核销中...',
                })
                var url = app.utils.URL + '/f/api/order/useCode'
                app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
                  wx.hideLoading()
                  console.log(res)
                  if (res.data.status == 0) {
                    wx.showToast({
                      icon: 'none',
                      title: '核销成功！'
                    })
                    that.setData({
                      codeData: ''
                    })
                  }
                })
              } else if (res.cancel) {
                wx.showToast({
                  icon: 'none',
                  title: '取消核销！'
                })
              }
            }
          })
          
        }
      })
    }
  },
  logout: function() {
    wx.removeStorageSync('login')
    wx.showToast({
      icon: 'none',
      title: '退出中...',
      duration: 1000
    })
    setTimeout(function() {
      wx.navigateTo({
        url: '../verification/verification',
      })
    }, 1000)
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