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
    cities: [
      {
        city: '全国',
        city_num: 100,
        index: 0
      },
      {
        city: '海南',
        city_num: 100,
        index: 1
      },
      {
        city: '海口',
        city_num: 100,
        index: 2
      },
    ],
    currSelectCity: 0,  //当前默认城市是第一个高亮
    currType: 1,
    url: ''
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
  toDeatil: function () {
    wx.navigateTo({
      url: '../detail/detail',
    })
  },
  //加载商品列表
  getGoodList: function () {
    let currType = this.data.currType
    let that = this
    let data = {
      start: 0,
      size: 15,
      listFlag: currType
    }
    console.log(data)
    var url = app.utils.URL + '/f/api/product/list'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      var res = res.data
      that.setData({
        goodList: res.data.products
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getGoodList()
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
    this.checkSettingStatu()
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