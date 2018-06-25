// pages/detail/detail.js
var app = getApp();
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    again: false,
    hidden: true,
    id: '',
    parentId: ''
  },
  buy: function() {
    let data = {
      productId: this.data.detail.id,
      content: this.data.detail.subContent,
      nowPrice: this.data.detail.salePrice,
      parentId: this.data.parentId,
      attribute: this.data.detail.attribute
    }
    console.log(data)
    wx.navigateTo({
      url: '../order/order?data=' + JSON.stringify(data),
    })
  },
  previewImage: function() {
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      // urls: [app.utils.URL + this.data.detail.mainPic] // 需要预览的图片http链接列表
      urls: [this.data.detail.mainPic] // 需要预览的图片http链接列表
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
  openMap: function() {
    wx.openLocation({
      latitude: Number(this.data.detail.latitude),
      longitude: Number(this.data.detail.longitude),
      scale: 28
    })
  },
  openPhone: function() {
    wx.makePhoneCall({
      phoneNumber: this.data.detail.phone
    })
  },
  getDetail: function() {
    let that = this
    let data = {
      id: that.data.id
    }
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.utils.URL + '/f/api/product/detail'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      var res = res.data
      let tags = res.data.detail.tag.split(',')
      wx.setNavigationBarTitle({
        title: res.data.detail.name
      })
      that.setData({
        detail: res.data.detail,
        tags: tags
      })
      /**
      * WxParse.wxParse(bindName , type, data, target,imagePadding)
      * 1.bindName绑定的数据名(必填)
      * 2.type可以为html或者md(必填)
      * 3.data为传入的具体数据(必填)
      * 4.target为Page对象,一般为this(必填)
      * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
      */
      var article_1 = res.data.detail.detailContent
      var article_2 = res.data.detail.buyContent
      var article_3 = res.data.detail.packageContent
      that.setData({
        article_1: article_1,
        article_2: article_2,
        article_3: article_3
      })
      WxParse.wxParse('article_1', 'html', article_1, that, 0);
      WxParse.wxParse('article_2', 'html', article_2, that, 0);
      WxParse.wxParse('article_3', 'html', article_3, that, 0);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.again) {
      this.setData({
        again: options.again
      })
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
    }
    let id = options.productId;
    console.log(id)
    let url = app.utils.URL
    this.setData({
      id: id,
      url: url
    })
    if (options.parentId) {
      this.setData({
        parentId: options.parentId
      })
    }
    this.getDetail()
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