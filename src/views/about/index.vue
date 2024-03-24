<script setup lang="ts" name="About">
import { storeToRefs } from "pinia";
import router from "@/router";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);

const logout = () => {
  userStore.logout();
  router.push({ name: "Login" });
};
</script>

<template>
  <div>
    <div class="px-[16px] py-[30px]">
      <!-- <van-image round width="100" height="100" :src="userInfo.avatar" /> -->
      <div class="text-[16px] font-bold mb-[10px]">我的</div>
      <div>
        <div class="leading-[30px]">
          账号
          <span class="ml-[8px]">{{ userInfo.phoneName }}</span>
        </div>
        <div class="leading-[30px]">
          昵称
          <span class="ml-[8px]">{{ userInfo.nickName }}</span>
        </div>
      </div>
    </div>
    <van-cell-group>
      <van-cell title="修改密码" is-link to="updatePassword" />
    </van-cell-group>
    <div style="margin: 16px">
      <van-button round block type="primary" @click="logout">
        退出登录
      </van-button>
    </div>
  </div>
</template>
