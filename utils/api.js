const categorys = 'categorys'//首页
const getOpenUserId = 'getOpenUserId?code='//获取用户OpenId
const addressSave = 'receiveAddress/save'//新增用户地址
const addressList = 'receiveAddressList'//用户地址列表
const upDataDefaultAddress = 'receiveAddress/updateIsDefault'//更新默认地址
const addressUpdate = 'receiveAddress/update'//更新用户地址 POST
const addressDelete = 'receiveAddress/delete'//删除用户地址 GET
const orderSave = 'order/save'//创建订单
const order = 'order'//获取订单详情orderId 
const orders = 'orders'//列表orderStatus
const updateLogistics = 'oeder/updateLogistics'//订单详情更新地址
const orderDelete = 'order/delete';//删除订单

module.exports = {
  categorys: categorys,
  getOpenUserId: getOpenUserId,
  addressSave: addressSave,
  addressList: addressList,
  addressUpdate: addressUpdate,
  addressDelete: addressDelete,
  orderSave: orderSave,
  order: order,
  orders: orders,
  updateLogistics: updateLogistics,
  upDataDefaultAddress: upDataDefaultAddress,
  orderDelete: orderDelete,
}