// URL
const API_URL = 'https://www.kar98.com.cn/';

//测试请求url
const ReqURL = "http://testapi.kdniao.cc:8081/api/dist";
//正式请求url
// const ReqURL = "http://api.kdniao.cc/api/dist";

/*
展示进度条的网络请求
url:网络请求的url
success:成功的回调函数
fail：失败的回调
*/
function GET(url, params, success, fail) {

  let message = '数据加载中'

  console.log('requestURL:' + API_URL + url)

  wx.showLoading({
    title: message,
  })

  wx.request({
    url: API_URL + url,
    data: params,
    // header: {
      // 'Content-Type': 'application/json'
      // 'content-type': 'application/x-www-form-urlencoded'
    // },
    method: 'GET',
    success: function (res) {
      // log
      console.log(res.data)

      if (res.statusCode == 200) {
        if (res.data.code == '0000') {
          success(res.data)
        } else {
          fail(res.data)
        }
      } else {
        wx.showToast({
          image: "/pages/images/icon_fail.png",
          title: "网络错误",
        })
        fail(res.data)
      }
    },
    fail: function (res) {
      wx.showToast({
        image: "/pages/images/icon_fail.png",
        title: "网络错误",
      })
      fail(res)
    },
    complete: function (res) {
      wx.hideLoading()
    }
  })
};

/*
展示进度条的网络请求
url:网络请求的url
params:请求参数
success:成功的回调函数
fail：失败的回调
*/
function POST(url, params, success, fail) {

  let message = '数据加载中'

  console.log('requestURL:' + API_URL + url)

  wx.showLoading({
    title: message,
  })
  wx.request({
    url: API_URL + url,
    data: params,
    // header: {
      // 'Content-Type': 'application/json'
      // 'content-type': 'application/x-www-form-urlencoded'
    // },
    method: 'POST',
    success: function (res) {

      // log
      console.log(res.data)

      if (res.statusCode == 200) {
        if (res.data.code == '0000') {
          success(res.data)
        } else {
          fail({ code: res.data.code, msg: res.data.msg})
        }
      } else {
        wx.showToast({
          image: "/pages/images/icon_fail.png",
          title: "网络错误",
        })
        fail({code: res.statusCode, msg: "网络错误" })
      }
    },
    fail: function (res) {
      wx.showToast({
        image: "/pages/images/icon_fail.png",
        title: "网络错误",
      })
      fail({ code: res.statusCode, msg: "网络错误" })
    },
    complete: function (res) {
      wx.hideLoading()
    }
  })
};

function POST_LOGISTICS(params, success, fail) {
  let message = '数据加载中'
  console.log('requestURL:' + API_URL + url)
  wx.showLoading({
    title: message,
  })
  wx.request({
    url: ReqURL,
    data: params,
    header: {
      // 'Content-Type': 'application/json'
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      if (res.statusCode == 200) {
        success(res.data)
      }else {
        wx.showToast({
          image: "/pages/images/icon_fail.png",
          title: "网络错误",
        })
        fail({ code: res.statusCode, msg: "网络错误" })
      }
    },
    fail: function (res) {
      wx.showToast({
        image: "/pages/images/icon_fail.png",
        title: "网络错误",
      })
      fail({ code: res.statusCode, msg: "网络错误" })
    },
    complete: function (res) {
      wx.hideLoading()
    }
  })
};

module.exports = {
  GET: GET,
  POST: POST,
  POST_LOGISTICS: POST_LOGISTICS
}