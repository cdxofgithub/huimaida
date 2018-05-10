// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    again: false,
    img: "../../images/gobg.png",
    wechat: "../../images/wechat.png",
    quan: "../../images/quan.png",
    code: "E7AI98",
    inputValue: "",
    maskHidden: false,
    name: "",
    touxiang: "",
    code: "E7A93C"
  },
  buy: function() {
    wx.navigateTo({
      url: '../order/order',
    })
  },
  //生成海报
  createPoster: function (e) {
    var that = this;
    this.setData({
      maskHidden: false
    });
    wx.showToast({
      title: '生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  },
  //点击保存到相册
  baocun: function () {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧晒一下吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
  },
  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function () {
    var that = this;
    var context = wx.createCanvasContext('mycanvas');
    context.setFillStyle("#6a6a64")
    context.fillRect(0, 0, 376, 668)
    var avatar = "../../images/test.jpg";
    var avatar = that.data.touxiang;
    var codeBg = "/images/ma.png";
    var code = "/images/ma.png";
    //绘制名字
    // context.setFontSize(24);
    // context.setFillStyle('#333333');
    // context.setTextAlign('center');
    // context.fillText(name, 185, 340);
    // context.stroke();
    //绘制一起吃面标语
    // context.setFontSize(14);
    // context.setFillStyle('#333333');
    // context.setTextAlign('center');
    // context.fillText("商品测试名称", 185, 370);
    // context.stroke();
    //绘制验证码背景
    // context.drawImage(path3, 48, 390, 280, 84);
    //绘制code码
    // context.setFontSize(40);
    // context.setFillStyle('#ffe200');
    // context.setTextAlign('center');
    // context.fillText(that.data.code, 185, 435);
    // context.stroke();
    //绘制左下角文字背景图
    // context.drawImage(path4, 30, 510, 184, 82);
    // context.setFontSize(14);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("邀您来扫码", 50, 530);
    // context.stroke();
    // context.setFontSize(14);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("立享优惠哦~", 50, 550);
    // context.stroke();
    // context.setFontSize(14);
    // context.setFillStyle('#333');
    // context.setTextAlign('left');
    // context.fillText("享受生活 分享生活", 50, 570);
    // context.stroke();
    //绘制右下角扫码提示语
    // context.drawImage(path5, 258, 578, 90, 25);
    //绘制头像
    context.drawImage(codeBg, 88, 330, 200, 297); //二维码背景

    context.arc(194, 357, 27, 0, Math.PI * 2);  //圆
    context.clip(); //裁剪上面的圆形
    context.drawImage(avatar, 166, 330, 54, 54); // 头像

    context.drawImage(avatar, 164, 330, 54, 54); // 小程序码
    context.draw();

    
    
    
    //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
    setTimeout(function () {
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: function (res) {
          var tempFilePath = res.tempFilePath;
          that.setData({
            imagePath: tempFilePath,
            canvasHidden: true
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    }, 200);
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
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
          touxiang: res.userInfo.avatarUrl
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
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
    var that = this;
    wx.getUserInfo({
      success: res => {
        console.log(res.userInfo, "huoqudao le ")
        this.setData({
          name: res.userInfo.nickName,
        })
        wx.downloadFile({
          url: res.userInfo.avatarUrl, //仅为示例，并非真实的资源
          success: function (res) {
            // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
            if (res.statusCode === 200) {
              console.log(res, "reererererer")
              that.setData({
                touxiang: res.tempFilePath
              })
            }
          }
        })
      }
    })
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