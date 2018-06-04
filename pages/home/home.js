// pages/home/home.js
var app = getApp();
Page({

  /*
    页面的初始数据
    currType: 当前的排序类型
              @param currType = 1 : 默认排序
              @param currType = 2 : 按价格从低到高排序
              @param currType = 3 : 按价格从高到低排序
              @param currType = 4 : 按距离排序
  */
  data: {
    type: 0,
    showCities: false,
    start: 0,    //加载的初始位置
    size: 10,   //加载的条数
    cities: [
      {
        city: '海口',
        city_num: 1,
        index: 0
      }
    ],
    currSelectCity: 0,  //当前默认城市是第一个高亮
    currType: 1,
    url: '',
    goodList: [],  //产品列表
    refresh: false,   //是否允许下拉
  },
  toMyOrder: function () {
    wx.navigateTo({
      url: '../myOrder/myOrder',
    })
  },
  //选择类型
  chooseType: function (e) {
    let curr = e.currentTarget.dataset.curr
    let currType
    if (curr == 0) {
      currType = 1
    } else {
      currType = 4
    }
    this.setData({
      type: curr,
      currType: currType
    })
    this.getGoodList()
  },
  //选择价格
  choosePrice: function (e) {
    let curr = this.data.type
    if (curr == 1) {
      this.setData({
        type: 2,
        currType: 2
      })
    } else {
      this.setData({
        type: 1,
        currType: 3
      })
    }
    this.getGoodList()
  },
  // 点击高亮
  selectCity: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currSelectCity: index
    })
  },
  // 展开城市
  showCities: function () {
    this.setData({
      showCities: !this.data.showCities,
    })
  },
  //关闭城市
  closeCities: function () {
    this.setData({
      showCities: !this.data.showCities,
    })
  },
  //进去详情
  toDeatil: function (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../detail/detail?productId=' + id,
    })
  },
  //加载商品列表
  getGoodList: function () {
    let currType = this.data.currType
    let that = this
    let data = {
      start: that.data.start,
      size: that.data.size,
      listFlag: currType
    }
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.utils.URL + '/f/api/product/list'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      var res = res.data.data.products
      let goodList = that.data.goodList.concat(res)
      that.setData({
        goodList: goodList
      })
    })
  },
  // 检测授权状态
  checkSettingStatu: function (cb) {
    // 是否为空对象
    function isEmptyObject(e) {
      var t;
      for (t in e)
        return !1;
      return !0
    }
    var that = this;
    // 判断是否是第一次授权，非第一次授权且授权失败则进行提醒
    wx.getSetting({
      success: function success(res) {
        console.log(res)
        var authSetting = res.authSetting;
        if (isEmptyObject(authSetting)) {
          console.log('首次授权');
        } else {
          // 没有授权的提醒
          if (authSetting['scope.userInfo'] == false) {
            wx.showModal({
              title: '用户未授权',
              content: '如需正常使用校园小叮当的服务功能，请按确定并在授权管理中选中“用户信息”，最后再重新进入小程序即可正常使用。',
              success: function (res) {
                if (res.confirm) {
                  wx.openSetting({
                    success: function success(res) {

                    }
                  });
                }
              },
              fail: function () {
                return
              }
            })
          }
        }
      }
    });
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

  userinfo: function (e) {
    console.log(e)
    console.log(e.detail.userInfo.nickName)
    var url = app.utils.URL + '/f/api/user/updateUserInfo'
    var data = {
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
      gender: e.detail.userInfo.gender,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      if (res.data.status == '0') {
        app.wxToast({
          title: '登录成功'
        })
      }
    })
  },
  //检查是否授权了
  checkAuthorization: function() {
    let that = this
    wx.getSetting({
      success: function success(res) {
        console.log(res)
        var authSetting = res.authSetting;
        console.log(authSetting)
          if (!authSetting['scope.userInfo']) {
            console.log('用户没有授权')
            that.powerDrawer('open')
          } else {
            console.log('用户授权了')
          } 
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGoodList()
    this.setData({
      url: app.utils.URL
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
    this.checkAuthorization()
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
    this.getGoodList('down')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})