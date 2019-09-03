// 导入公用类
var commonCityData = require('../../utils/city.js')
var network = require("../../utils/network.js")
var api = require("../../utils/api.js")
//获取应用实例
var app = getApp()

Page({
  data: {
    //地址id
    addressId: "",
    //用户手输的信息
    addressData: null,
    //1修改 2新增
    addressType: "1",
    provinces: [],
    citys: [],
    districts: [],
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0
  },
  bindCancel: function () {
    wx.navigateBack({})
  },

  // 保存地址
  bindSave: function (e) {
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;

    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (this.data.selProvince == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (this.data.selCity == "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    var cityId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].id;
    var districtId;
    if (this.data.selDistrict == "请选择" || !this.data.selDistrict) {
      districtId = '';
    } else {
      districtId = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[this.data.selDistrictIndex].id;
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel: false
      })
      return
    }

    var openid = getApp().globalData.userOpenId;

    var districtArray = that.data.districts;
    var districtIndex = that.data.selDistrictIndex;
    var district = districtArray[districtIndex];
    var receiveAddressContent;
    if (district) {
      // 省市区
      receiveAddressContent = that.data.selProvince + that.data.selCity + district + address;
    }else {
      receiveAddressContent = that.data.selProvince + that.data.selCity + address;
    }
    
    var params = {
      'receiveAddressId': that.data.addressId,
      'receiveAddressZipCode': code,
      'receiveAddressContactName': linkMan,
      'receiveAddressContactPhone': mobile,
      'userOpenId': openid,
      'receiveAddressContent': receiveAddressContent,
      'receiveAddressProvince': that.data.selProvince,
      'receiveAddressCity': that.data.selCity,
      'receiveAddressArea': district,
      'receiveAddressStreet': address,
    }
    //根据类型 新增或者修改地址
    network.POST(this.data.addressType == "1" ? api.addressUpdate : api.addressSave, params,
      function (res) {
        wx.navigateBack({
          url: '/pages/address/address?bindTapType=' + 'add-address'
        })
      },
      function (err) {
        console.log(err)
      })
  },

  // 初始化城市数据
  initCityData: function (level, obj) {
    if (level == 1) {
      var pinkArray = [];
      for (var i = 0; i < commonCityData.cityData.length; i++) {
        pinkArray.push(commonCityData.cityData[i].name);
      }
      this.setData({
        provinces: pinkArray
      });
    } else if (level == 2) {
      var pinkArray = [];
      var dataArray = obj.cityList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        citys: pinkArray
      });
    } else if (level == 3) {
      var pinkArray = [];
      var dataArray = obj.districtList
      for (var i = 0; i < dataArray.length; i++) {
        pinkArray.push(dataArray[i].name);
      }
      this.setData({
        districts: pinkArray
      });
    }
  },
  //选择器的省级变换
  bindPickerProvinceChange: function (event) {
    var selIterm = commonCityData.cityData[event.detail.value];
    this.setData({
      selProvince: selIterm.name,
      selProvinceIndex: event.detail.value,
      selCity: '请选择',
      selCityIndex: 0,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(2, selIterm)
  },
//选择器市级变换
  bindPickerCityChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[event.detail.value];
    this.setData({
      selCity: selIterm.name,
      selCityIndex: event.detail.value,
      selDistrict: '请选择',
      selDistrictIndex: 0
    })
    this.initCityData(3, selIterm)
  },
  //不想看了
  bindPickerChange: function (event) {
    var selIterm = commonCityData.cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value];
    if (selIterm && selIterm.name && event.detail.value) {
      this.setData({
        selDistrict: selIterm.name,
        selDistrictIndex: event.detail.value
      })
    }
  },
  //加载生命周期
  onLoad: function (e) {
    var that = this;
    this.initCityData(1);
    //获取携带的数据
    var jsonQueryBean = e.queryBean;
    //如果为空就是新增 不为空就是修改
    if (jsonQueryBean != null) {
      //json数据转换为对象
      var queryBean = JSON.parse(jsonQueryBean);
      wx.setNavigationBarTitle({
        title: '修改地址',
      })
      //设置地址选择器
      this.setPackerData(queryBean.receiveAddressProvince, queryBean.receiveAddressCity, queryBean.receiveAddressArea);
      that.setData({
        addressData: {
          //设置表单数据 除了地址选择器其他都走这里
          linkMan: queryBean.receiveAddressContactName,
          mobile: queryBean.receiveAddressContactPhone,
          address: queryBean.receiveAddressStreet,
          code: queryBean.receiveAddressZipCode
        },
        //设置地址id
        addressId: queryBean.receiveAddressId,
        //设置类型 修改
        addressType: "1"
      })
    } else {
      wx.setNavigationBarTitle({
        title: '新增地址',
      })
      this.setData({
      //设置类型 新增
        addressType: "2"
      })
    }
  },
  
  //重置收货地址
  resetAddress: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要重置该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            addressData: null,
            selProvince: '请选择',
            selCity: '请选择',
            selDistrict: '请选择',
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //从微信读取数据
  readFromWx: function () {
    let that = this;
    wx.chooseAddress({
      success: function (res) {
        //设置地址选择器的值
        that.setPackerData(res.provinceName, res.cityName, res.countyName);
        that.setData({
          wxaddress: res,
        });
      }
    })
  },
   //回填关联省市区
  setPackerData: function (province, city, area) {
    let that = this;
    let provinceName = province;
    let cityName = city;
    let diatrictName = area;
    let retSelIdx = 0;

    for (var i = 0; i < commonCityData.cityData.length; i++) {
      if (provinceName == commonCityData.cityData[i].name) {
        let eventJ = { detail: { value: i } };
        that.bindPickerProvinceChange(eventJ);
        that.data.selProvinceIndex = i;
        for (var j = 0; j < commonCityData.cityData[i].cityList.length; j++) {
          if (cityName == commonCityData.cityData[i].cityList[j].name) {
            //that.data.selCityIndex = j;
            eventJ = { detail: { value: j } };
            that.bindPickerCityChange(eventJ);
            for (var k = 0; k < commonCityData.cityData[i].cityList[j].districtList.length; k++) {
              if (diatrictName == commonCityData.cityData[i].cityList[j].districtList[k].name) {
                //that.data.selDistrictIndex = k;
                eventJ = { detail: { value: k } };
                that.bindPickerChange(eventJ);
              }
            }
          }
        }
      }
    }
  }
})
