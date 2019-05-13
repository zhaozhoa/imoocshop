const express = require('express')
const router = express.Router()
require('./../util/util')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


// 获取用户模型
let User = require('./../models/user')

// 登陆
router.post('/login', (req, res) => {
  let {userName,userPwd} = req.body
  let param = {
    userName,
    userPwd
  }
  User.findOne(param).then(data => {
    // 查询到
    if (data) {
      // 添加cookie
      res.cookie('userId', data.userId, {
        path: '/',
        maxAge: 1000 * 60 * 60
      }),
      res.cookie('userName', data.userName, {
        path: '/',
        maxAge: 1000 * 60 * 60
      })
      // req.session.user = data
      // console.log(data)
      res.json({
        status: '0',
        msg: '',
        result: {
          userName: data.userName,
          userPwd: data.userPwd
        }
      })
    } else {
      res.json({
        status: '1',
        msg: '用户名与密码不匹配'
      })
    }
  }).catch(err => {
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    }
  })
  
})

// 取消登陆
router.post('/logout', (req, res) => {
  res.cookie('userId', '', {
    maxAge: 0
  })
  res.json({
    status: '0',
    msg: '',
    result: ''
  })
})

// 登陆后用户状态的保存 
router.get('/checkLogin', (req, res) => {
  if (req.cookies.userId) {
    res.json({
      status: '0',
      msg: '',
      result: req.cookies.userName
    })
  } else { 
    res.json({
      status: '1',
      msg: '未登录',
      result: ''
    })
  }
})

// 获取购物车列表
router.get('/cartList', (req, res) => {
  let userId = req.cookies.userId
  User.findOne({userId}).then(data =>{
    if (data) {
      res.json({
        status: '0',
        msg: '',
        result: data.cartList
      })
    } 
  }).catch(err => {
    res.json({
      status: '1',
      msg: err.message,
      result: ''
    })
  })
})

// 获取商品数量
router.get('/goodsNum', (req, res) => {
  let userId = req.cookies.userId
  User.findOne({userId})
    .then(result => {
      let goodsNum = result.cartList.length
      res.json({
        status: '0',
        err: '',
        result: goodsNum
      })
    })
    .catch(err => {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    })
})

// 删除购物车商品
router.get('/delGoods', (req, res) => {
  let productId = req.query.productId
  let userId = req.cookies.userId
  // 删除商品
  User.update({userId}, {$pull: {'cartList': {productId}}}).then(() => {
    res.json({
      status: '0',
      msg: '',
      result: ''
    })
  }).catch(err => {
    res.json({
      status: '1',
      msg: err.message,
      result: ''
    })
  })
})

// 修改商品数量
router.post('/editGoodsNum', (req, res) => {
  let userId = req.cookies.userId
  let {productId, productNum, checked} = req.body
  User.update(
    {
      userId, 
      "cartList.productId": productId
    }, 
    {
      "cartList.$.productNum": productNum,
      "cartList.$.checked": checked
    }
  ).then(() => {
    res.json({
      status: '0',
      msg: '',
      result: 'ok'
    }).catch(err => {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    })
  })
})

// 全选商品
router.post('/editCheckAll', (req, res) => {
  let userId = req.cookies.userId
  let checkAll = req.body.checkAll === '1' ? '1' : '0'
  User.findOne({userId}).then(data => {
    data.cartList.forEach(item => {
      item.checked = checkAll
    })
    data.save().then(data => {
      res.json({
        status: '0',
        msg: 'ok',
        result: ''
      })
    })
  }).catch(err => {
    res.json({
      status: '1',
      msg: err.message,
      res: ''
    })
  })
})

// 查询用户地址接口
router.get('/addressList', (req, res) => {
  let userId = req.cookies.userId
  User.findOne({userId}).then(data => {
    res.json({
      status: '0',
      msg: 'ok',
      result: data.addressList
    }).catch(err => {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    })
  })
})

// 设置默认地址
router.post('/setDefaultAddress', (req, res) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  User.findOne({userId})
    .then(data => {
      let userAddressList = data.addressList
      userAddressList.forEach(item => {
        item.isDefault = false
        if (item.addressId == addressId) {
          item.isDefault = true
        }
      })
      data.save()
        .then(() => {
          res.json({
            status: '0',
            msg: 'ok',
            result: ''
          })
        })
        .catch(err => {
          res.json({
            status: '1',
            msg: err.message,
            result: ''
          })
        })
    })
    .catch(err => {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    })
})

// 删除地址接口
router.post('/delAddress', (req, res) => {
  let userId = req.cookies.userId
  let addressId = req.body.addressId
  // 删除 数据库子文档
  User.update({userId}, {
    $pull: {
      'addressList': {addressId}
    }
  })
    .then(data => {
      if (data) {
        res.json({
          status: 0,
          msg: 'ok',
          result: ''
        })
      }
    })
    .catch(err => {
      res.json({
        status: '1',
        msg: err.message,
        result: ''
      })
    })
})

// 获取用户需要支付的商品
router.get('/payGoods', (req, res) => {
  let userId = req.cookies.userId
  let goodsList = []
  User.findOne({userId}).then(data => {
    let cartList = data.cartList
    cartList.forEach(item => {
      if (item.checked == '1') {
        goodsList.push(item) 
      }
    })
    res.json({
      status: '0',
      msg: 'ok',
      result: goodsList
    })
  })
})

// 生成用户购买的订单信息
router.post('/payMent', (req, res) => {
  let userId = req.cookies.userId
  let goodsList = []
  let {orderTotal, addressId} = req.body
  User.findOne({userId})
    .then(data => {
      // 获取送货地址
      let address = ''
      data.addressList.forEach(item => {
        if (addressId = item.addressId) {
          address = item
        }
      })
      // 获取用户购买的商品
      data.cartList.filter(item => {
        if (item.checked == '1') {
          goodsList.push(item)
        }
      })
      // 生成随机的订单id
      let platList = '622'
      let r1 = Math.floor(Math.random() * 10)
      let r2 = Math.floor(Math.random() * 10)
      let sysDate = new Date().Format('yyyyMMddhhmmss')
      // 订单日期
      let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss')

      let orderId = platList + r1 + sysDate +r2


      // 订单信息
      let order = {
        orderId,
        orderTotal,
        addressInfo: address,
        goodsList,
        orderStatus: '1',
        createDate
      }
      data.orderList.push(order)
      data.save()
        .then(() => {
          res.json({
            status: '0',
            msg: 'ok',
            result: {
              orderId: order.orderId,
              orderTotal: order.orderTotal
            }
          })
        })
        .catch(err2 => {
          res.json({
            status: '1',
            msg: err2.msg,
            result: ''
          })
        })
    })
    .catch(err => {
      res.json({
        status: '1',
        msg: err.msg,
        result: ''
      })
    })
})
module.exports = router;
