//app.js
import { request, URL } from './utils/request.js'
var wxToast = require('toast/toast.js')
App({
  onLaunch: function () {
    var that = this
    wx.checkSession({ 
      success: function () { 

      },
      fail: function () {
        console.log('过期')
        //登录态过期
        that.login()
      }
    })
  }, 
  login: function() {
    let that = this
    // 登录
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          var url = getApp().utils.URL + '/f/api/user/login'
          console.log(url)
          var data = {
            code: res.code
          }
          console.log(data)
          request(url, JSON.stringify(data), 'POST', function (resa) {
            console.log(resa)
            that.globalData.accesstoken = resa.data.data.accesstoken
            if (resa.data.status == '0') {
              wx.getUserInfo({
                success: function (resp) {
                  console.log('允许授权')
                  console.log(resp)
                  var userInfo = resp.userInfo //用户基本信息
                  var nickName = userInfo.nickName //用户名
                  var avatarUrl = userInfo.avatarUrl //头像链接
                  var gender = userInfo.gender //性别 0：未知、1：男、2：女
                  //更新用户信息
                  var url = getApp().utils.URL + '/f/api/user/updateUserInfo'
                  var data = {
                    nickName: nickName,
                    avatarUrl: avatarUrl,
                    gender: gender,
                    accesstoken: resa.data.data.accesstoken
                  }
                  request(url, JSON.stringify(data), 'POST', function (res) {
                    wx.setStorageSync('accesstoken', resa.data.data.accesstoken)
                    if (res.data.status == '0') {
                      wx.setStorageSync('accesstoken', resa.data.data.accesstoken)
                      wx.showToast({
                        icon: 'none',
                        title: '登录成功',
                      })
                    }
                  })
                },
                fail: res => {
                  console.log('取消授权')
                  wx.showModal({
                    title: '用户未授权',
                    content: '如需正常使用校园小叮当的服务功能，请按确定并在授权管理中选中“用户信息”，最后再重新进入小程序即可正常使用。',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        wx.openSetting({
                          success: function success(res) {
                            console.log('openSetting success', res.authSetting);
                          }
                        });
                      }
                      if (res.cancel) {
                        return
                      }
                    }
                  })
                },
                complete: res => {
                  console.log('进入了complete')
                }
              })
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail: function (res) {
        wxToast({
          title: '用户登录失败'
        })
      }
    })
  },
  globalData: {
    userInfo: null
  },
  utils: {
    request: request,
    URL: URL
  },
  wxToast
})