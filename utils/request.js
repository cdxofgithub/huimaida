var wxToast = require('../toast/toast.js')

export const request = (url, data, method, callback) => {
  method = method.toUpperCase()
  wx.request({
    url: url,
    data: data,
    method: method,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res)
      if (res.data.status == '401') {
        wx.hideLoading()
        wx.showModal({
          title: '登陆已过期',
          content: '点击确定重新登录',
          success: function (res) {
            if (res.confirm) {
              login()
            } else if (res.cancel) {
              var pages = getCurrentPages();
              if (pages.length == 1) {
                return
              } else {
                wx.navigateBack()
              }
            }
          }
        })
      } else if (res.data.status == '001' || res.data.status == '002' || res.data.status == '003' || res.data.status == '004' || res.data.status == '005' || res.data.status == '006' || res.data.status == '007' || res.data.status == '011' || res.data.status == '008' || res.data.status == '1' || res.data.status == '010') {
        wxToast({
          title: res.data.message
        })
        wx.hideLoading()
      } else {
        return typeof callback == "function" && callback(res)
      }
      return typeof callback == "function" && callback(res)
    },
    fail: function (err) {
      wx.stopPullDownRefresh()
      wxToast({
        title: '网络超时'
      })
      wx.hideLoading()
    }
  })
}
function login() {
  // 登录
  wx.login({
    success: function (res) {
      wx.showLoading({
        title: '登录中~',
      })
      if (res.code) {
        var url = URL + '/f/api/user/login'
        var data = {
          code: res.code
        }
        request(url, JSON.stringify(data), 'POST', function (resa) {
          if (resa.data.status == '0') {
            wx.getUserInfo({
              success: function (resp) {
                var userInfo = resp.userInfo //用户基本信息
                var nickName = userInfo.nickName //用户名
                var avatarUrl = userInfo.avatarUrl //头像链接
                var gender = userInfo.gender //性别 0：未知、1：男、2：女

                //更新用户信息
                var url = URL + '/f/api/user/updateUserInfo'
                var data = {
                  nickName: nickName,
                  avatarUrl: avatarUrl,
                  gender: gender,
                  accesstoken: resa.data.data.accesstoken
                }
                request(url, JSON.stringify(data), 'POST', function (res) {
                  wx.hideLoading()
                  if (res.data.status == '0') {
                    wx.setStorageSync('accesstoken', resa.data.data.accesstoken)
                    wxToast({
                      title: '登录成功'
                    })
                    //获取页面栈
                    var pages = getCurrentPages();

                    if (pages.length == 1) {
                      return
                    } else {
                      setTimeout(function () {
                        wx.navigateBack()
                      }, 1000)
                    }
                  } else {
                    wxToast({
                      title: '服务器内部出错'
                    })
                  }
                })
              },
              fail: res => {
                wx.hideLoading()
                wxToast({
                  title: '登录需用户返回首页进行授权'
                })
              }
            })
          } else {
            wxToast({
              title: '服务器内部出错'
            })
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
        wxToast({
          title: res.errMsg
        })
      }
    },
    fail: function (res) {
      wxToast({
        title: '用户登录失败'
      })
    }
  });
}

export const URL = 'http://1t896460i2.iask.in:21058'


