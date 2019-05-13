<template>
  <div>
    <NavHeader/>
    <NavBread>
      <span slot="bread">Goods</span>
    </NavBread>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">Sort by:</span>
          <a href="javascript:void(0)" class="default cur">Default</a>
          <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short" :class="{'sort-up': sortFlag}"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
        </div>
        <div class="accessory-result">
          <!-- 价格过滤器 -->
          <div class="filter stopPop" id="filter" v-bind:class="{'filterby-show':filterBy}">
            <dl class="filter-price">
              <dt>Price:</dt>
              <dd><a href="javascript:void(0)" @click="setPriceFilter('all')" v-bind:class="{'cur':priceChecked=='all'}">All</a></dd>
              <dd v-for="(item,index) in priceFilter" :key="index">
                <a href="javascript:void(0)" @click="setPriceFilter(index)" v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <!-- search result accessories list -->
          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in GoodsList" :key="item._id">
                  <div class="pic">
                    <a href="#"><img :src="`/static/${item.productImage}`" alt=""></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>
              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30">
                <img src="./../assets/loading-spinning-bubbles.svg" v-show="loading" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 提示登陆的模态框 -->
    <Modal :mdShow='mdShow' @close="closeModal">
      <p slot="message">
        请先登录，否则无法加入到购物车
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="closeModal">关闭</a>
      </div>
    </Modal>
    <!-- 商品添加成功的模态框 -->
    <Modal :mdShow='mdShowCart' @close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
       </svg>
       <span>加入成功</span>
      </p>
      <div slot="btnGroup">
        <a href="javascript:;" class="btn btn--m" @click="mdShowCart = false">继续看看</a>
        <router-link href="javascript:;" class="btn btn--m" to='/cart'>查看购物车</router-link>
      </div>
    </Modal>
    <NavFooter/>
  </div>
</template>
<style>
.load-more {
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.sort-up {
  transform: rotate(180deg);
  transition: all .3s ease-out;
}
</style>

<script>
export default {
  name: 'GoodsList',
  data () {
    return {
      // 存储请求的商品数据
      GoodsList: [],
      // 商品是否价格升序排列
      sortFlag: true,
      // 请求页码
      page: 1,
      // 请求数量
      pageSize: 8,
      // 是否禁止滚动加载
      busy: true,
      // 控制加载图标是否显示
      loading: false,
      // 控制模态框是否显示
      mdShow: false,
      // 是否显示商品添加成功模态框
      mdShowCart: false,
      // 存储价格区间
      priceFilter: [
        {
          startPrice: '0.00',
          endPrice: '100.00'
        },
        {
          startPrice: '100.00',
          endPrice: '500.00'
        },
        {
          startPrice: '500.00',
          endPrice: '1000.00'
        },
        {
          startPrice: '1000.00',
          endPrice: '5000.00'
        }
      ],
      // 全部价格区间的商品
      priceChecked: 'all',
      filterBy: false,
      overLayFlag: false
    }
  },
  mounted () {
    this.getGoodsList()
  },
  methods: {
    // 请求商品数据
    getGoodsList (flag) {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        sort: this.sortFlag ? 1 : -1,
        priceLevel: this.priceChecked
      }
      this.loading = true
      this.Axios.get('/goods/list', {
        params
      }).then(result => {
        // 取消加载显示
        this.loading = false
        let res = result.data
        if (res.status === '0') {
          if (flag === true) {
            // 请求数据累加
            this.GoodsList = this.GoodsList.concat(res.result.list)
            // 没有数据
            if (res.result.count < 8) {
              this.busy = true
            } else {
              this.busy = false
            }
          } else {
            this.GoodsList = res.result.list
            // 滚动请求开启
            this.busy = false
          }
        } else {
          this.GoodsList = []
        }
      })
    },
    // 排序请求
    sortGoods () {
      this.sortFlag = !this.sortFlag
      this.page = 1
      this.getGoodsList()
    },
    // 滚动加载
    loadMore () {
      // 滚动加载失效
      this.busy = true
      setTimeout(() => {
        this.page++
        this.getGoodsList(true)
      }, 1000)
    },
    // 价格过滤
    setPriceFilter (index) {
      this.priceChecked = index
      this.page = 1
      this.getGoodsList()
    },
    // 加入购物车
    addCart (productId) {
      this.Axios.post('/goods/addCart', {
        productId
      }).then(res => {
        if (res.data.status === '0') {
          this.mdShowCart = true
          this.$store.commit('updateCartCount', 1)
        } else if (res.data.status === '10001') {
          this.mdShow = true
        } else {
          alert('服务器忙，请稍后')
        }
      }).catch(err => {
        alert(err)
      })
    },
    // 关闭模态框
    closeModal () {
      this.mdShow = false
    }
  }
}
</script>
