<script setup>
defineProps({
  title: {
    type: String,
    default: "标题"
  },
  leftText: {
    type: String,
    default: ""
  },
  leftArrow: {
    type: Boolean,
    default: true
  },
  rightText: {
    type: String,
    default: ""
  },
  rightArrow: {
    type: Boolean,
    default: false
  },
  fixed: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: Boolean,
    default: false
  },
  border: {
    type: Boolean,
    default: true
  },
  safeAreaInsetTop: {
    type: Boolean,
    default: false
  }
})
const onClickLeft = () => history.back();
</script>
<template>
  <van-nav-bar
    :title="title"
    :left-text="leftText"
    :right-text="rightText"
    :left-arrow="leftArrow"
    :right-arrow="rightArrow"
    :fixed="fixed"
    :placeholder="placeholder"
    :border="border"
    :safe-area-inset-top="safeAreaInsetTop"
    @click-left="onClickLeft"
  />
</template>
