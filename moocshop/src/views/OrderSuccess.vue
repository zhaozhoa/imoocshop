<template>
<div>
  <NavHeader/>
  <NavBread>
    <span slot="bread">Check Out</span>
  </NavBread>
  <div class="container">
    <div class="page-title-normal">
      <h2 class="page-title-h2"><span>check out</span></h2>
    </div>
    <!-- 进度条 -->
    <div class="check-step">
      <ul>
        <li class="cur"><span>Confirm</span> address</li>
        <li class="cur"><span>View your</span> order</li>
        <li class="cur"><span>Make</span> payment</li>
        <li class="cur"><span>Order</span> confirmation</li>
      </ul>
    </div>

    <div class="order-create">
      <div class="order-create-pic"><img src="./../..//static/ok-2.png" alt=""></div>
      <div class="order-create-main">
        <h3>Congratulations! <br>Your order is under processing!</h3>
        <p>
        <span>Order ID：{{orderId}}</span>
          <span>Order total：{{orderTotal | currency('$')}}</span>
        </p>
        <div class="order-create-btn-wrap">
          <div class="btn-l-wrap">
            <router-link to="/cart" class="btn btn--m">Cart List</router-link>
          </div>
          <div class="btn-r-wrap">
            <router-link to="/" class="btn btn--m">Goods List</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
  <NavFooter/>
</div>
</template>
<script>
export default {
  data () {
    return {
      orderId: '',
      orderTotal: ''
    }
  },
  mounted () {
    this.getQueryParams()
  },
  methods: {
    getQueryParams () {
      let params = {}
      let paramsArr = location.hash.split('?')[1].split('&')
      paramsArr.forEach(item => {
        let TemArr = item.split('=')
        params[TemArr[0]] = TemArr[1]
      })
      this.orderId = params.orderId
      this.orderTotal = params.orderTotal
    }
  }
}
</script>
