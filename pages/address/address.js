// pages/address/address.js

//获取应用实例
var app = getApp()

var network = require("../../utils/network.js")
var api = require("../../utils/api.js")

Page({
  data: {
    addressList: [],
    bindTapType: "",
    orderId: "",
    pageNum: '0',
    pageSize: '10',
    isLoadMore: false,
    pageNum: '1',
    pageSize: '10',
    isLastPage: false
  },
  
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    // 设置点击事件类型
    this.setData({
      orderId: options.orderId == null ?"": options.orderId,
      bindTapType: options.bindTapType
    })
  },

  // 获取地址列表
  getAddressList: function () {
    var that = this;
    if (that.data.isLastPage) {
      wx.showToast({
        title: '没有更多数据了',
        icon: "none"
      })
      return;
    }
    var data = { 'userOpenId': getApp().globalData.userOpenId, 'pageNum': that.data.pageNum, 'pageSize': that.data.pageSize }
    network.GET(api.addressList, data,
      function (res) {
        var newAddressList = that.data.addressList;
        if (res.data.isFirstPage) {
          // 停止下拉动作  
          newAddressList = res.data.list
          wx.stopPullDownRefresh();
        }else{
          newAddressList = newAddressList.concat(res.data.list)
        }
        that.setData({
          isLastPage : res.data.isLastPage,
          addressList: newAddressList
        });
      },
      function (err) {
        that.setData({
          orderList: []
        })
        console.log(err)
      })
  },

  // 新增/更新地址/回调地址
  addressSelectedOrUpdate: function (event) {
    var that = this
    // 拿到点击的index下标
    var index = parseInt(event.currentTarget.dataset.index);
    var queryObj = that.data.addressList[index];
    // 将对象转为string
    var queryBean = JSON.stringify(queryObj);
    
    // 更新订单地址
    var params = {
      'receiveAddressId': queryObj.receiveAddressId,
      'userOpenId': getApp().globalData.userOpenId,
      'orderId': that.data.orderId
    }
    
    if (that.data.bindTapType == 'callBack-orderDetail') {
      // 修改订单地址
      network.POST(api.updateLogistics, params,
        function (res) {
          // 回调地址
          wx.navigateBack({
            url: '/pages/orderDetail/orderDetail'
          })
        },
        function (err) {
          console.log(err)
        })
    } else if (that.data.bindTapType == 'callBack-balance'){
      // 修改订单地址
      network.POST(api.updateLogistics, params,
        function (res) {
          // 回调地址
          wx.navigateBack({
            url: '/pages/balance/balance'
          })
        },
        function (err) {
          console.log(err)
        })
    }else {
      // 新增/更新地址
      wx.navigateTo({
        url: '/pages/address-add/address?queryBean=' + queryBean,
      })
    }
  },

  // 新增地址
  address: function () {
    wx.navigateTo({
      url: '/pages/address-add/address',
    })
  },

  // 删除收货地址
  deleteAddress: function (event) {
    let that = this;
    if(this.data.addressList.length <= 1){
      wx.showToast({
        image: "/pages/images/icon_fail.png",
        title: "至少留一个地址",
      });
      return;
    }
    wx.showModal({
      title: '',
      content: '确定要删除地址？',
      success: function (res) {
        if (res.confirm) {
          let addressId = event.target.dataset.addressId;
          var data = { 'receiveAddressId': addressId, 'userOpenId': getApp().globalData.userOpenId}
          network.GET(api.addressDelete, data,
            function (res) {
              console.log("删除成功：" + res)
              that.onShow()
            },
            function (err) {
              console.log("删除失败："+ err.msg)
            })
        }
      }
    })
    return false;
  },


  // 设为默认地址
  setDefaultAddress: function (event) {
    var that = this;
    let addressId = event.target.dataset.addressId;
    var data = { 'receiveAddressId': ""+addressId, 'userOpenId': getApp().globalData.userOpenId }
    network.POST(api.upDataDefaultAddress, data,
      function (res) {
        console.log("设为默认地址成功")
        that.onShow()
      },
      function (err) {
        console.log("设为默认地址失败" + err.msg)
        wx.showToast({
          image: "/pages/images/icon_fail.png",
          title: "设置地址失败",
        })
      });
  },

  // 页面渲染完成
  onReady: function () {
    
  },

  // 页面显示
  onShow: function () {
    var that = this;
    that.setData({
      pageNum: 1,
      isLastPage: false
    });
    this.getAddressList()
  },
  
  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭
  },
  
  // 上拉加载
  onReachBottom: function () {
    var that = this;
    console.log("加载更多")
    that.setData({
      pageNum : parseInt(that.data.pageNum) + 1
    });
    this.getAddressList()
  },
})