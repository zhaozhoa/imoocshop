const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/db_demo')
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected success');
})
mongoose.connection.on('error', () => {
  console.log('Mongoose connected fail');
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connected disconnected')
})

// 获取商品模型
let Goods = require('../models/goods')

// 请求商品
router.get('/list', (req, res, next) => {
  // 分页
  let page = parseInt(req.query.page)
  let pageSize = parseInt(req.query.pageSize)
  
  // 排序
  // sort = 1 升序，-1 降序
  let sort = req.query.sort
  let params = {}
  
  // 获取价格区间参数
  let priceLevel = req.query.priceLevel
  let priceGt , priceLte 
  if (priceLevel != 'all') {
    switch (priceLevel) {
      case '0': priceGt = 0; priceLte = 100; break;
      case '1': priceGt = 100; priceLte = 500; break;
      case '2': priceGt = 500; priceLte = 1000; break;
      case '3': priceGt = 1000; priceLte = 5000; break;
    }
    params = {
      // 查询条件
      salePrice: {
        $gt: priceGt,
        $lte: priceLte
      }
    }
  }
  // 跳过 skip 条查找 查找 pageSize条
  let skip = (page - 1) * pageSize

  // 数据库 操作
  let goodsModel = Goods.find(params).skip(skip).limit(pageSize)

  goodsModel.sort({'salePrice': sort})
  goodsModel.exec((err, doc) =>{
    // 跨域
    res.setHeader("Access-Control-Allow-Origin", "*")
    if (err) {
      res.json({
        status: '1',
        msg: err.message
      })
    } else {
      // res.setHeader("Access-Control-Allow-Origin", "*")
      res.json ({
        status: '0',
        msg: '',
        result: {
          count:doc.length,
          list: doc
        }
      })
    }
  })
})

// 添加购物车
// 先查找商品信息, 然后将商品信息插入到购物车
router.post('/addCart', async (req, res, next) => {

  let userId = '100000077'
  // 获取商品 id
  let productId = req.body.productId
  // 获取用户模型
  let User = require('./../models/user')
  // 通过 userid 查询用户信息
  res.setHeader("Access-Control-Allow-Origin", "*")


  try {
    let userDoc = await User.findOne({ userId })
    if (userDoc) {
      let goodsItem = false
      userDoc.cartList.forEach(item => {
        // 购物车中商品已经存在, 数量++
        if (item.productId === productId) {
          goodsItem = true
          item.productNum++
        }
      })
      // 商品存在, 保存
      if (goodsItem) {
        try {
          await userDoc.save()
          res.json({
            status: '0',
            msg: '',
            result: 'suc'
          })
        } catch (err2) {
          res.json({
            status: '1',
            msg: err2.message
          })
        }
      }
      // 商品添加购物车
      else {
        // 查询商品信息
        try {
          let doc = await Goods.findOne({ productId })
          if (doc) {
            doc.productNum = 1
            doc.checked = 1
            // 将商品加入用户的购物车
            userDoc.cartList.push(doc)
            // 保存插入后的用户信息
            try {
              await userDoc.save()
              res.json({
                status: '0',
                msg: '',
                result: 'suc'
              })
            } catch (error) {
              res.json({
                status: '1',
                msg: err2.message
              })
            }
          }
        } catch (err1) {
          res.json({
            status: '1',
            msg: err1.message
          })
        }
      }
    }
  } catch (err) {
    res.json({
      status: '1',
      msg: err.message
    })
  }
})
module.exports = router
