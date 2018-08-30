// pages/paySuccess/paySuccess.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['卡片分享', '海报分享'],
    hidden: true,
    orderDetail: '',
    isHide: true,
    showCode: true,
  },
  closeCode: function() {
    this.setData({
      showCode: false
    })
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
      productId: that.data.orderDetail.productId,
      path: 'pages/detail/detail',
      accesstoken: wx.getStorageSync('accesstoken')
    }
    console.log(data)
    wx.showLoading({
      title: '努力生成中...',
    })
    var url = app.utils.URL + '/f/api/product/sharePic'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      let localPath = res.data.data.qrPath
      that.setData({
        qrPath: localPath
      })
      const ctx = wx.createCanvasContext('shareImg')

      //主要就是计算好各个图文的位置
      let bgImg = that.data.orderDetail.mainPic
      let name = that.data.orderDetail.productName
      let phone = that.data.orderDetail.phone
      let address = that.data.orderDetail.address
      let originPrice = that.data.orderDetail.originProce + '元'
      let salePrice = that.data.orderDetail.salePrice + '元'
      let validStartTime = that.data.orderDetail.validStartTime
      let vaildEndTime = that.data.orderDetail.vaildEndTime
      let saleNumber = that.data.orderDetail.saleNumber
      let avatarUrl = wx.getStorageSync('avatarUrl') ? wx.getStorageSync('avatarUrl') : '../../images/logo.png'
      let nickName = wx.getStorageSync('nickName') ? wx.getStorageSync('nickName') : ''

      let promise1 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: bgImg,
          success: function (res) {
            console.log(res)
            resolve(res);
          }
        })
      });
      let promise2 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: avatarUrl,
          success: function (res) {
            console.log(res)
            resolve(res);
          }
        })
      });
      let promise3 = new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: localPath,
          success: function (res) {
            console.log(res)
            resolve(res);
          }
        })
      });

      Promise.all([
        promise1, promise2, promise3
      ]).then(res => {
        console.log(res)
        const ctx = wx.createCanvasContext('shareImg')

        ctx.drawImage(res[0].path, 0, 0, 545, 500)
        // ctx.setFillStyle('rgba(0, 0, 0, 0.7)')
        // ctx.fillRect(0, 0, 545, 500)
        ctx.setFillStyle('#ffffff')
        ctx.fillRect(0, 500, 545, 300)

        // ctx.setTextAlign('center')
        // ctx.font = 'normal bold 90px sans-serif'
        // ctx.setFillStyle('#f96e6d')
        // ctx.setFontSize(60)
        // ctx.fillText(name, 273, 120)


        // ctx.setTextAlign('left')
        // ctx.setFillStyle('#fde842')
        // ctx.setFontSize(50)
        // ctx.fillText('现', 80, 240)

        // ctx.setFillStyle('#fde842')
        // ctx.setFontSize(50)
        // ctx.fillText('价', 80, 300)

        // ctx.setFillStyle('#fde842')
        // ctx.setFontSize(110)
        // ctx.fillText(salePrice, 150, 294)

        // ctx.font = 'normal normal 36px sans-serif'
        // ctx.setFillStyle('#d2c78d')
        // ctx.setFontSize(36)
        // ctx.fillText('原价:', 320, 370)

        // ctx.setFillStyle('#d2c78d')
        // ctx.setFontSize(36)
        // ctx.fillText(originPrice, 420, 370)

        // ctx.setStrokeStyle('#d2c78d');//设置线条的样式
        // ctx.moveTo(320, 358);//设置线条的起始路径坐标
        // ctx.lineTo(524, 358);//设置线条的终点路径坐标
        // ctx.stroke();//对当前路径进行描边
        // ctx.closePath();//关闭当前路径

        // ctx.setFillStyle('#ffffff')
        // ctx.setFontSize(36)
        // ctx.fillText('惠麦达', 20, 440)

        // ctx.setFillStyle('#ffffff')
        // ctx.setFontSize(36)
        // ctx.fillText('/乐享生活', 132, 440)

        ctx.setTextAlign('center');
        ctx.setFillStyle('#333')
        ctx.setFontSize(28)
        ctx.fillText(nickName, 273, 560)

        ctx.setTextAlign('center');
        ctx.setFillStyle('#a3a3a3')
        ctx.setFontSize(30)
        ctx.fillText('邀请您识别小程序码享受优惠！', 273, 600)
        ctx.stroke()

        ctx.drawImage(res[2].path, 20, 610, 180, 180)


        ctx.setTextAlign('left');
        // ctx.setFillStyle('#333333')
        // ctx.setFontSize(30)
        // ctx.fillText(name, 220, 650)

        ctx.setFillStyle('#a3a3a3')
        ctx.setFontSize(26)
        ctx.fillText('截止日期', 220, 650)

        ctx.setFillStyle('#333333')
        ctx.setFontSize(26)
        ctx.fillText(vaildEndTime, 220, 690)

        ctx.setFillStyle('#a3a3a3')
        ctx.setFontSize(26)
        ctx.fillText('地址', 220, 740)

        ctx.setFillStyle('#333333')
        ctx.setFontSize(22)
        ctx.fillText(address, 220, 780, 310)

        //头像
        ctx.arc(273, 500, 30, 0, Math.PI * 2);  //圆
        ctx.fill()
        ctx.clip(); //裁剪上面的圆形
        ctx.drawImage(res[1].path, 243, 470, 60, 60)

        ctx.stroke()
        ctx.draw()
        that.createPoster()
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
      let data = {
        productId: res.data.detail.productId,
        path: '/pages/detail/detail',
        accesstoken: wx.getStorageSync('accesstoken')
      }
      var url = app.utils.URL + '/f/api/product/shareCard'
      app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
        console.log(res)
        wx.hideLoading()
        var result = res.data.data.pagePath
        console.log(result)
        that.setData({
          pagePath: result
        })
      })
    })
  },
  openMap: function () {
    let that = this
    // 引入SDK核心类
    var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');

    // 实例化API核心类
    var demo = new QQMapWX({
      key: 'BHKBZ-5UNYU-4ALVZ-27TEO-DKELZ-2KFBI' // 必填
    });

    // 调用接口
    demo.reverseGeocoder({
      coord_type: 3,
      location: {
        latitude: that.data.orderDetail.latitude,
        longitude: that.data.orderDetail.longitude
      },
      success: function (res) {
        console.log(res);
        wx.openLocation({
          latitude: Number(res.result.location.lat),
          longitude: Number(res.result.location.lng),
          scale: 28,
          name: that.data.orderDetail.address
        })
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        console.log(res);
      }
    });
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
    }, 100)

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
    console.log(options)
    this.setData({
      orderId: options.orderId
    })
    this.getOrderDetail()
    console.log()
    if (options.isHide == 1) {
      this.setData({
        showCode: false
      })
    } else {
      this.setData({
        showCode: true
      })
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
  onShareAppMessage: function (res) {
    let path = this.data.pagePath
    console.log(typeof path)
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      // imageUrl: app.utils.URL + this.data.orderDetail.mainPic,
      imageUrl: this.data.orderDetail.mainPic,
      title: this.data.orderDetail.productName,
      path: path
    }
  }
})