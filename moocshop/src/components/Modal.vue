<template>
  <div>
    <div class="md-modal modal-msg md-modal-transition" v-bind:class="{'md-show':mdShow}">
          <div class="md-modal-inner">
            <div class="md-top">
              <!-- 关闭按钮 -->
              <button class="md-close" @click="closeModal">Close</button>
            </div>
            <div class="md-content">
              <div class="confirm-tips">
               <slot name="message"></slot>
              </div>
              <div class="btn-wrap">
                <slot name="btnGroup"></slot>
              </div>
            </div>
          </div>
        </div>
        <!-- 遮罩 -->
        <div class="md-overlay" v-if="mdShow" @click="closeModal"></div>
  </div>
</template>
<script>
export default {
  name: 'Modal',
  // 获取父组件传递的数据
  props: ['mdShow'],
  data () {
    return {}
  },
  methods: {
    // 关闭模态框
    closeModal () {
      // 子组件触发 父组件的 close 事件
      this.$emit('close')
    }
  }
}
</script>
