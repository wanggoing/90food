// pages/home/home.js

// 导入公共请求js
var network = require("../../utils/network.js")
var api = require("../../utils/api.js")

// 获取应用实例
const app = getApp()

Page({
  data: {
    toView: 'order0',// 记录种类菜单下标
    totalPrice: 0,// 总价格
    totalCount: 0,// 总商品数
    carArray: [],// 用来存放购物车中的商品数据
    minPrice: 30,// 声明初始化 起送价格
    payDesc: '',// 差多少起送
    fold: true,// 购物车是否弹起
    cartShow: 'none',
    status: 0,
    goods: [],//商品列表
    goodsDetail: {},//详情信息
    movies: [],//详情图
  },

  // 种类(菜单)选择点击事件
  selectMenu: function (e) {
    // 获取数组下标
    var index = e.currentTarget.dataset.itemIndex;
    // 记录菜单下标 为 order+数字 保存至本地
    this.setData({
      toView: 'order' + index.toString()
    })
  },

  // 从购物车移除商品 首页商品列表的 减少按钮 点击事件
  decreaseCart: function (e) {
    // 获取商品下标
    var index = e.currentTarget.dataset.itemIndex;
    // 获取种类下标
    var parentIndex = e.currentTarget.dataset.parentindex;
    // 本地数据 goods中的该商品已经购数量 减1
    this.data.goods[parentIndex].goodsList[index].goodsCount--
    // 获取商品销售数量
    var num = this.data.goods[parentIndex].goodsList[index].goodsCount;
    // 获取坐标 商品在 goods中的坐标 
    var mark = 'a' + index + 'b' + parentIndex;
    // 获取商品名称
    var name = this.data.goods[parentIndex].goodsList[index].goodsName;
    // 商品Id
    var goodsId = this.data.goods[parentIndex].goodsList[index].goodsId;
    // 获取商品价格
    var price = this.data.goods[parentIndex].goodsList[index].goodsPrice;
    // 商品描述
    var des = this.data.goods[parentIndex].goodsList[index].goodsDesc;
    // 商品图片
    var image = this.data.goods[parentIndex].goodsList[index].goodsSmallImageUrl;
    // 组装数据
    var obj = { price: price, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex, goodsId: goodsId, des: des, image: image };

    // var carArray1 = this.data.carArray.filter(item => item.mark != mark);

    // /**
    //  * filter() 方法创建一个新的数组，新数组中的元素是通过检查指定数组中符合条件的所有元素。
    //  * 注意： filter() 不会对空数组进行检测。
    //  * 注意： filter() 不会改变原始数组。 
    //  * */

    // // 添加新的元素 obj就是被移除的购物车商品，更新购物车商品数据条件为该商品当前数量必须大于0
    // if (obj.num > 0) {
    //   carArray1.splice(index, 0, obj);
    // }


//减法
    var carArray1 = this.data.carArray
    var hasChanged = false;
    for (var i = 0; i < carArray1.length; i++) {
      if (carArray1[i].mark == mark) {
        if (obj.num == 0) {
          carArray1.splice(i, 1);
        }else{
          carArray1[i] = obj;
        }
        hasChanged = true;
        break;
      }
    }


    // 保存购物车数据 并修改商品认购数量（即修改goods数据）
    this.setData({
      carArray: carArray1,
      goods: this.data.goods
    })
    // 计算购物车的总价
    this.calTotalPrice()
    // 计算差几元起送
    this.setData({
      payDesc: this.payDesc(),
    })
    // 关闭弹起
    var count1 = 0
    for (let i = 0; i < carArray1.length; i++) {
      if (carArray1[i].num == 0) {// 如果购物车中所有元素的数量都为0
        count1++;
      }
    }
    // 控制购物车详情页面 是否展示
    if (count1 == carArray1.length) {
      if (num == 0) {
        this.setData({
          cartShow: 'none'
        })
      }
    }
  },

  // 购物车页面里的 减少按钮 点击事件
  decreaseShopCart: function (e) {
    this.decreaseCart(e);
  },

  // 添加到购物车  首页商品列表的 添加按钮 点击事件
  addCart(e) {
    var that = this
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    that.data.goods[parentIndex].goodsList[index].goodsCount++;
    var mark = 'a' + index + 'b' + parentIndex
    var goodsId = this.data.goods[parentIndex].goodsList[index].goodsId;
    var price = this.data.goods[parentIndex].goodsList[index].goodsPrice;
    var num = this.data.goods[parentIndex].goodsList[index].goodsCount;
    var name = this.data.goods[parentIndex].goodsList[index].goodsName;
    var des = this.data.goods[parentIndex].goodsList[index].goodsDesc;
    var image = this.data.goods[parentIndex].goodsList[index].goodsSmallImageUrl;

    var obj = { price: price, num: num, mark: mark, name: name, index: index, parentIndex: parentIndex, goodsId: goodsId, des: des, image: image };
    // var carArray1 = this.data.carArray.filter(item => item.mark != mark)
    
    // 加法
    var carArray1 = this.data.carArray
    var hasChanged = false;
    for (var i = 0; i < carArray1.length; i++) {
      if (carArray1[i].mark == mark) {
        carArray1[i] = obj;
        hasChanged = true;
        break;
      }
    }
    if (!hasChanged) {
      carArray1.splice(carArray1.length, 0, obj);
    }

    // carArray1.splice(index, 0, obj);

    that.setData({
      carArray: carArray1,
      goods: that.data.goods
    })
    this.calTotalPrice();

    that.setData({
      payDesc: that.payDesc()
    })
  },

  // 购物车页面里的 增加按钮 点击事件
  addShopCart: function (e) {
    this.addCart(e);
  },

  // 购物车清空事件
  empty: function () {
    this.setData({
      carArray: []
    })
    this.setData({
      totalPrice: 0,
      totalCount: 0,
    })
    this.calTotalPrice();
    this.setData({
      payDesc: this.payDesc()
    })
    for (let i = 0; i < this.data.goods.length; i++) {
      for (let j = 0; j < this.data.goods[i].goodsList.length; j++) {
        this.data.goods[i].goodsList[j].goodsCount = 0;
      }
    }
    this.setData({
      goods: this.data.goods,
      cartShow: 'none'
    })
  },

  // 计算购物车的总价
  calTotalPrice: function () {
    // 获取储存在本地的购物车数据
    var carArray = this.data.carArray;
    var totalPrice = 0;
    var totalCount = 0;
    // 遍历购物车数据 求出总数以及总价
    for (var i = 0; i < carArray.length; i++) {
      totalPrice += carArray[i].price * carArray[i].num;
      totalCount += carArray[i].num
    }
    // 将总数以及总价 保存至本地
    this.setData({
      totalPrice: totalPrice,
      totalCount: totalCount,
      // 计算差几元起送
      payDesc: this.payDesc()
    });
  },

  // 差几元起送
  payDesc() {
    if (this.data.totalPrice === 0) {
      return `￥${this.data.minPrice}元起`;
    } else if (this.data.totalPrice < this.data.minPrice) {
      let diff = this.data.minPrice - this.data.totalPrice;
      return '还差' + diff + '元起';
    } else {
      return '去结算';
    }
  },
  /**！！！！！！！！！
   * 在JavaScript中有三种声明变量的方式：var、let、const。 var：声明全局变量，换句话理解就是，声明在for循环中的变量，跳出for循环同样可以使      * 用。 [JavaScript] 纯文本查看 复制代码 ? 1 2 3 4 5 for(var i=0;i<=1000;i++){ var sum=0; sum+=i; } alert(sum); 声明在for循环内部的     * sum，跳出for循环一样可以使用，不会报错正常弹出结果 let：声明块级变量，即局部变量。 在上面的例子中，跳出for循环，再使用sum变量就会报错 注    * 意：必须声明'use strict'后才能使用let声明变量否则浏览并不能显示结果 const：用于声明常量，也具有块级作用域 const PI=3.14;
   */

  // 结算
  pay() {
    if (this.data.totalPrice < this.data.minPrice) {
      return;
    }
    // 确认支付逻辑
    var that = this;
    var totalNum = 0;
    var goodsList = [];//创建订单数组
    for (var i = 0; i < that.data.carArray.length; i++) {
      var d = that.data.carArray[i];
      var nd = { 'goodsId': d.goodsId, 'goodsNum': d.num };
      totalNum += d.num
      goodsList.push(nd);
    };

    // 组装订单确认页面参数
    var userOpenId = getApp().globalData.userOpenId;
    var params = { 'userOpenId': userOpenId, 'goodsList': goodsList, 'totalNum': totalNum };

    // 创建订单
    network.POST(api.orderSave, params,
      function (res) {
        // 跳转到结算页面 + 参数
        wx.navigateTo({
          url: '/pages/balance/balance?orderId=' + res.data.orderId
        })
        // 清空购物车
        that.empty();
      },
      function (err) {
        console.log(err)
      })
  },

  // 弹起购物车
  toggleList: function () {
    if (!this.data.totalCount) {
      return;
    }
    this.setData({
      fold: !this.data.fold,
    })
    var fold = this.data.fold
    this.cartShow(fold)
  },

  cartShow: function (fold) {
    if (fold == false) {
      this.setData({
        cartShow: 'block',
      })
    } else {
      this.setData({
        cartShow: 'none',
      })
    }
  },

  tabChange: function (e) {
    var showtype = e.target.dataset.type;
    this.setData({
      status: showtype,
    });
  },

  // 页面初始化 options为页面跳转所带来的参数
  onLoad: function (options) {
    this.setData({
      payDesc: this.payDesc()
    });

    this.getGoodsList();
  },

  // 请求种类以及商品列表数据
  getGoodsList: function () {
    var that = this
    network.GET(api.categorys, null,
      function (res) {
        that.setData({
          goods: res.data
        })
      }, function (res) {

      })
  },

  //显示对话框
  showModal: function (e) {
    var that = this
    var index = e.currentTarget.dataset.itemIndex;
    var parentIndex = e.currentTarget.dataset.parentindex;
    // 通过当前index 父级index 在数据中找到对应的商品详情信息
    var mark = 'a' + index + 'b' + parentIndex
    var price = this.data.goods[parentIndex].goodsList[index].goodsPrice;
    var num = this.data.goods[parentIndex].goodsList[index].goodsCount;
    var name = this.data.goods[parentIndex].goodsList[index].goodsName;
    var desc = this.data.goods[parentIndex].goodsList[index].goodsDesc;
    var image1 = { url: this.data.goods[parentIndex].goodsList[index].goodsBig1ImageUrl };
    var image2 = { url: this.data.goods[parentIndex].goodsList[index].goodsBig2ImageUrl };
    var image3 = { url: this.data.goods[parentIndex].goodsList[index].goodsBig3ImageUrl };

    var imagesArray = [image1, image2, image3];

    var obj = { price, num, mark, name, desc, index, parentIndex };
    that.setData({
      movies: imagesArray,
      goodsDetail: obj
    })

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 300)
  },

  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 300)
  },

  onReady: function () {
    // 页面渲染完成
  },

  onShow: function () {
    // 页面显示
  },

  onHide: function () {
    // 页面隐藏
  },

  onUnload: function () {
    // 页面关闭
  },
})
