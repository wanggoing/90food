//获取应用实例
var app = getApp()

var network = require("../../utils/network.js")
var api = require("../../utils/api.js")

Page({
  data: {
    orderList: [],
    statusType: ["待付款", "待发货", "待收货"],
    currentType: 0,
    tabClass: ["", "", ""],
    pageNum: "1",
    pageSize: "10",
    isLoadMore: false
  },
  
  // 点击TopBar切换
  statusTap: function (e) {
    var curType = e.currentTarget.dataset.index;
    this.setData({
      currentType: curType
    });
    this.getOrderList(curType);
  },

  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    
  },

  // 获取订单列表
  getOrderList: function (currentType) {
    let that = this;
    // 当前订单状态
    var status = parseInt(currentType)+1;
    // 回到第一页
    that.data.pageNum = '1';
    // 参数
    var data = { 'userOpenId': getApp().globalData.userOpenId, 'orderStatus': status.toString(), 'pageNum': that.data.pageNum, 'pageSize': that.data.pageSize }
    network.GET(api.orders, data,
      function (res) {
        if (res.data.total > 10) {
          that.data.isLoadMore = true
        } else {
          that.data.isLoadMore = false
        }
        that.setData({
          orderList: res.data.list
        })
        // 停止下拉动作  
        wx.stopPullDownRefresh();
      },
      function (err) {
        that.setData({
          orderList: []
        })
        console.log(err)
      })
  },
  
  // 获取更多订单列表
  getMoreAddressList: function (currentType) {
    let that = this;
    // 获取订单列表状态
    var status = parseInt(currentType) + 1;
    // 判断是否有更多数据
    if (that.data.isLoadMore == false) {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
      return;
    }
    // 页码+1
    that.data.pageNum = parseInt(that.data.pageNum) + 1;
    // 参数
    var data = { 'userOpenId': getApp().globalData.userOpenId, 'orderStatus': status.toString(), 'pageNum': String(that.data.pageNum), 'pageSize': that.data.pageSize }
    network.GET(api.orders, data,
      function (res) {
        var newOrderList = that.data.orderList;
        for (var i = 0; i < res.data.list.length; i++) {
          var dic = res.data.list[i];
          newOrderList.push(dic)
        }
        that.setData({
          orderList: newOrderList
        })
        if (that.data.pageNum >= res.data.pages) {
          that.data.isLoadMore = false
        } else {
          that.data.isLoadMore = true
        }
      },
      function (err) {
        that.setData({
          orderList: []
        })
        console.log(err)
      })
  },
  
  // 订单详情
  orderInfo: function (e) {
    var that = this
    var index = e.currentTarget.dataset.itemIndex;

    var info = that.data.orderList[index];
    var infoString = info.orderInfo.orderId;

    var status = that.data.currentType;
    
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?orderId=' + infoString + '&orderStatus=' + status
    })
  },

  // 支付订单
  payOrder(event) {
    var that = this
    var index = event.currentTarget.dataset.itemIndex;
    debugger
  },
  
  // 查看物流
  toLogistics(event) {
    var that = this
    var index = event.currentTarget.dataset.itemIndex;
    
    var orderInfo = that.data.orderList[index];
    var logisticCode = orderInfo.orderInfo.logisticsConsignNo;// 快递编号
    var shipperCode = orderInfo.orderInfo.logisticsName;// 公司编号
    wx.navigateTo({
      url: '/pages/logistics/logistics?logisticsNO=' + logisticCode + '&logisticsName=' + shipperCode
    })
  },

  onReady: function () {
    // 页面渲染完成
  },

  onShow: function () {
    // 页面显示
    this.getOrderList(this.data.currentType);
  },

  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭
  },

  // 上拉加载
  onReachBottom: function () {
    this.getMoreAddressList(this.data.currentType);
  },
})