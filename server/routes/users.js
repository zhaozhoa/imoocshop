const express = require('express')
const router = express.Router()

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
}),
module.exports = router;
