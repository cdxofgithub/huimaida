// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    again: false,
    hidden: true
  },
  buy: function() {
    wx.navigateTo({
      url: '../order/order',
    })
  },

  /**
  * 生成分享图
 */
  createPoster: function () {
    var that = this
    wx.showLoading({
      title: '努力生成中...'
    })
    setTimeout(function() {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 545,
        height: 800,
        destWidth: 545,
        destHeight: 800,
        canvasId: 'shareImg',
        success: function (res) {
          console.log(res.tempFilePath);
          that.setData({
            prurl: res.tempFilePath,
            hidden: false
          })
          wx.hideLoading()
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }, 1000)
    
  },

  /**
   * 保存到相册
  */
  save: function () {
    var that = this
    //生产环境时 记得这里要加入获取相册授权的代码
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              that.setData({
                hidden: true
              })
            }
          }
        })
      }
    })

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.again) {
      this.setData({
        again: options.again
      })
    }
    let promise1 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../images/qrcode.jpg',
        success: function (res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    let promise2 = new Promise(function (resolve, reject) {
      wx.getImageInfo({
        src: '../../images/qrbg.png',
        success: function (res) {
          console.log(res)
          resolve(res);
        }
      })
    });
    Promise.all([
      promise1, promise2
    ]).then(res => {
      console.log(res)
      const ctx = wx.createCanvasContext('shareImg')

      //主要就是计算好各个图文的位置
      ctx.drawImage('../../' + res[0].path, 158, 190, 210, 210)
      ctx.drawImage('../../' + res[1].path, 0, 0, 545, 800)

      ctx.setTextAlign('center')
      ctx.setFillStyle('#ffffff')
      ctx.setFontSize(24)
      ctx.fillText('邀您扫码', 545 / 2, 120)
      ctx.fillText('立享优惠', 545 / 2, 160)

      ctx.stroke()
      ctx.draw()
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