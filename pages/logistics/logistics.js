// pages/logistics/logistics.js
//获取应用实例
var app = getApp()

var network = require("../../utils/network.js")
var api = require("../../utils/api.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    wuliu: ['已接收', '哈哈哈', '呵呵呵', '抵达深圳', '抵达广州']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var params = { 'ShipperCode': 'ZTO', 'LogisticCode': '498910811156' };
    network.POST_LOGISTICS(params,
      function (res) {
        debugger
      },
      function (err) {
        console.log(err)
      })
  },

  // getLogistics: function ()  {
    
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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