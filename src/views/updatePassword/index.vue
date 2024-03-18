<script setup>
import { reactive } from "vue";
import { showNotify } from "vant";
import CommonNavBar from "@/components/CommonNavBar/index.vue";
import router from "@/router";
import { changePasswordApi } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import "vant/es/notify/style";

const userStore = useUserStore();

const passwordInfo = reactive({
  password: "",
  newPassword: ""
});
const gotoLoginPage = () => {
  router.push({ name: "Login" });
};

const onSubmitU = () => {
  changePasswordApi(passwordInfo)
    .then(res => {
      console.log("res=>:", res);
      const { code } = res;
      if (code === 0) {
        showNotify({ type: "success", message: "修改成功,请重新登录" });
        userStore.updatePassword();
        setTimeout(() => {
          // 存储数组，跳转页面
          gotoLoginPage();
        }, 1000);
      } else {
        // 登录失败
      }
    })
    .catch(() => {});
};
</script>
<template>
  <div
    class="h-screen flex direction-column items-center justify-center box-border p-8"
  >
    <CommonNavBar title="修改密码" leftArrow />
    <div class="border border-gray-100 rounded-md box-border w-full p-2">
      <van-form @submit="onSubmitU">
        <van-field
          v-model="passwordInfo.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <van-field
          v-model="passwordInfo.newPassword"
          type="password"
          name="newPassword"
          label="新密码"
          placeholder="新密码"
          :rules="[{ required: true, message: '请填写新密码' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            确认修改密码
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>
