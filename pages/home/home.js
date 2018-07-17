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
        index: 0
      }
    ],
    currSelectCity: 0,  //当前默认城市是第一个高亮
    currType: 1,
    url: '',
    goodList: [],  //产品列表
    refresh: true,   //是否允许上拉
    noMore: false
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
    this.getGoodList(true)
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
    this.getGoodList(true)
  },
  // 点击高亮
  selectCity: function(e) {
    let index = e.currentTarget.dataset.index
    this.setData({
      currSelectCity: index,
      showCities: false
    })
    this.getGoodList(true)
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
  //overloaded 切换listFlag是否重载 start, size
  //top 上拉刷新
  getGoodList: function (overloaded) {
    if (overloaded) {
      this.setData({
        start: 0,
        size: 10,
        goodList: [],
        noMore: false
      })
    }
    let currType = this.data.currType
    let that = this
    let data = {
      start: that.data.start,
      size: that.data.size,
      listFlag: currType
    }
    console.log(data)
    wx.showLoading({
      title: '加载中...',
    })
    var url = app.utils.URL + '/f/api/product/list'
    app.utils.request(url, JSON.stringify(data), 'POST', function (res) {
      wx.hideLoading()
      var res = res.data.data.products
      if (res.length < that.data.size) {
        that.setData({
          noMore: true,
          refresh: false
        })
      } else {
        that.setData({
          noMore: false,
          refresh: true
        })
      }
      let goodList = that.data.goodList.concat(res)
      that.setData({
        goodList: goodList
      })
      
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

  userinfo: function (e) {
    var url = app.utils.URL + '/f/api/user/updateUserInfo'
    var data = {
      nickName: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl,
      gender: e.detail.userInfo.gender,
      accesstoken: wx.getStorageSync('accesstoken')
    }
    wx.setStorageSync('nickName', e.detail.userInfo.nickName)
    wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl)
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
    console.log('上拉触底了')
    if (this.data.refresh) {
      let start = this.data.start + this.data.size
      this.setData({
        start: start
      })
      this.getGoodList(false)
    }

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})