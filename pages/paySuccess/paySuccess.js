// pages/paySuccess/paySuccess.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['卡片分享', '海报分享'],
    hidden: true,
    orderDetail: ''
  },
  bindPickerChange: function (e) {
    let index = e.detail.value
    console.log(index)
    this.setData({
      index: index
    })
    if (index == 0) {
      this.powerDrawer('open')
    } else {
      this.getHaibao()
    }
  },
  toggleHidden: function() {
    this.setData({
      hidden: true
    })
  },
  getHaibao: function() {
    let that = this
    let data = {
      orderId: that.data.orderId,
      path: 'pages/detail/detail',
      accesstoken: wx.getStorageSync('accesstoken')
    }
    console.log(data)
    wx.showLoading({
      title: '努力生成中...',
    })
    var url = app.utils.URL + '/f/api/order/sharePic'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      var res = res.data.data
      console.log(res)
      // let qrPath = app.utils.URL + res.qrPath
      let qrPath = res.qrPath
      let localPath
      that.setData({
        qrPath: qrPath
      })
      const ctx = wx.createCanvasContext('shareImg')

      //主要就是计算好各个图文的位置
      ctx.drawImage('../../images/qrbg.png', 0, 0, 545, 800)
      
      ctx.setTextAlign('center')
      ctx.setFillStyle('#ffffff')
      ctx.setFontSize(24)
      ctx.fillText('邀您扫码', 545 / 2, 120)
      ctx.fillText('立享优惠', 545 / 2, 160)
      wx.downloadFile({
        url: qrPath, //仅为示例，并非真实的资源
        success: function (res) {
          console.log(res)
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            ctx.drawImage(res.tempFilePath, 158, 190, 210, 210)
            ctx.stroke()
            ctx.draw()
            that.createPoster()
          }
          
        }
      })
      
      
    })
  },
  backHome: function() {
    wx.reLaunch({
      url: '../home/home'
    })
  },
  lookDetail: function() {
    let data = {
      productName: this.data.orderDetail.productName,
      address: this.data.orderDetail.address,
      vaildStartTime: this.data.orderDetail.vaildStartTime,
      vaildEndTime: this.data.orderDetail.vaildEndTime,
      num: this.data.orderDetail.num
    }
    wx.navigateTo({
      url: '../orderDetail/orderDetail?data=' + JSON.stringify(data),
    })
  },
  // 自定义弹框
  powerDrawer: function (e) {
    if (e == 'open') {
      this.util(e)
    } else {
      var currentStatu = e.currentTarget.dataset.statu;
      this.util(currentStatu)
    }


  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  getOrderDetail: function() {
    let that = this
    let data = {
      orderId: that.data.orderId,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.utils.URL + '/f/api/order/orderDetail'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      console.log(res)
      wx.hideLoading()
      var res = res.data
      that.setData({
        orderDetail: res.data.detail
      })
    })
  },
  openMap: function() {
    wx.openLocation({
      latitude: Number(this.data.orderDetail.latitude),
      longitude: Number(this.data.orderDetail.longitude),
      scale: 28
    })
  },
  openPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.orderDetail.phone
    })
  },
  /**
* 生成分享图
*/
  createPoster: function () {
    var that = this
    setTimeout(function () {
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
    this.setData({
      orderId: options.orderId
    })
    this.getOrderDetail()
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      // imageUrl: app.utils.URL + this.data.orderDetail.mainPic,
      imageUrl: this.data.orderDetail.mainPic,
      title: this.data.orderDetail.productName,
      path: '/pages/detail/detail?parentId=' + this.data.orderDetail.parentId + '&productId=' + this.data.orderDetail.productId
    }
  }
})