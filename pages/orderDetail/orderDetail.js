//获取应用实例
var app = getApp()

var network = require("../../utils/network.js")
var api = require("../../utils/api.js")

Page({
  data: {
    orderId: "",
    orderStatus: 0,
    orderStatusString: "",
    pageStatus: 0,
    orderInfo: {},
  },
  
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var s_string = options.orderStatus;
    if (s_string == 0) {
      s_string = '待付款'
    }
    if (s_string == 1) {
      s_string = '待发货'
    }
    if (s_string == 2) {
      s_string = '已发货'
    }
    this.setData({
      orderId: options.orderId,
      orderStatus: parseInt(options.orderStatus),
      orderStatusString: s_string
    })
  },
  
  // 获取订单详情
  getOrderDetail: function (orderId) {
    let that = this;
    var data = { 'userOpenId': getApp().globalData.userOpenId, 'orderId': orderId }
    network.GET(api.order, data,
      function (res) {
        that.setData({
          orderInfo: res.data
        })
      },
      function (err) {
        console.log(err)
      })
  },

  // 更新订单收货地址
  updateAddress: function () {
    // 判断是否是未付款订单
    wx.navigateTo({
      url: '/pages/address/address?bindTapType=' + 'callBack-orderDetail&orderId=' + this.data.orderId
    })
  },

  // 付款
  payOrder() {
    let that = this;
    var index = event.currentTarget.dataset.itemIndex;
    debugger
  },

  // 关闭订单
  cancelOrder () {
    let that = this;
    var data = { 'userOpenId': getApp().globalData.userOpenId, 'orderId': that.data.orderId }
    network.GET(api.orderDelete, data,
      function (res) {
        wx.navigateBack({
          url: '/pages/order/order'
        })
      },
      function (err) {
        console.log(err)
      })
  },
  
  // 查看物流
  btn_logistics () {
    let that = this;
    var index = event.currentTarget.dataset.itemIndex;
    debugger
  },

  onReady: function () {
    // 页面渲染完成
  },

  onShow: function () {
    // 页面显示
    this.getOrderDetail(this.data.orderId);
  },

  onHide: function () {
    // 页面隐藏
  },
  
  onUnload: function () {
    // 页面关闭
  }
})