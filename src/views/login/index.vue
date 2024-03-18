<script setup>
import { ref, reactive } from "vue";
import router from "@/router";
import { useRoute } from "vue-router";
import { registryApi, loginApi } from "@/api/user";
import { useUserStore } from "@/store/modules/user";
import { getUserInfo } from "@/hooks/useUserInfo";
import { showNotify } from "vant";
import "vant/es/notify/style";

const userStore = useUserStore();
const route = useRoute();
const pageType = ref("login"); // 页面类型 login | register | password
const loginInfo = reactive({
  phoneName: "",
  password: ""
});
const registerInfo = reactive({
  phoneName: "",
  email: "",
  nickName: "",
  password: ""
});

const gotoMainPage = () => {
  const query = route.query;

  const redirect = query.redirect ?? "/";

  const otherQueryParams = Object.keys(query).reduce((acc, cur) => {
    if (cur !== "redirect") {
      acc[cur] = query[cur];
    }
    return acc;
  }, {});

  router.push({ path: redirect, query: otherQueryParams });
};

const onSubmit = () => {
  loginApi(loginInfo)
    .then(async res => {
      const { code } = res;
      if (code === 0) {
        showNotify({ type: "success", message: "登录成功,即将跳转" });
        userStore.loginSuccess(res.data);
        // 请求信息
        const [, data] = await getUserInfo();
        const { code, data: userInfo } = data;
        if (code === 0) {
          userStore.setUserInfo(userInfo);
        }
        setTimeout(() => {
          // 存储数组，跳转页面
          gotoMainPage();
        }, 2000);
      } else {
        userStore.loginFail();
        // 登录失败
      }
    })
    .catch(() => {});
};

const onSubmitR = () => {
  registryApi(registerInfo)
    .then(res => {
      const { code } = res;
      if (code === 0) {
        showNotify({ type: "success", message: "注册成功" });
        switchTo("login");
      }
    })
    .catch(() => {});
};

const switchTo = mode => {
  pageType.value = mode;
};
</script>
<template>
  <div
    class="h-screen flex direction-column items-center justify-center box-border p-8"
  >
    <div
      class="border border-gray-100 rounded-md box-border w-full p-2"
      v-if="pageType === 'login'"
    >
      <van-form @submit="onSubmit">
        <div class="text-[20px] text-center">登录</div>
        <van-field
          v-model="loginInfo.phoneName"
          name="phoneName"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="loginInfo.password"
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            登录
          </van-button>
        </div>
        <div
          class="text-[12px] text-center text-blue-500"
          @click="switchTo('register')"
        >
          没有账号？立即注册
        </div>
      </van-form>
    </div>

    <div
      class="border border-gray-100 rounded-md box-border w-full p-2"
      v-if="pageType === 'register'"
    >
      <van-form @submit="onSubmitR">
        <div class="text-[20px] text-center">注册</div>
        <van-field
          v-model="registerInfo.phoneName"
          required
          name="phoneName"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="registerInfo.email"
          name="email"
          label="邮箱"
          placeholder="邮箱"
          :rules="[{ type: 'email', message: '请填写正确邮箱' }]"
        />
        <van-field
          v-model="registerInfo.nickName"
          name="nickName"
          label="昵称"
          placeholder="昵称"
        />
        <van-field
          v-model="registerInfo.password"
          required
          type="password"
          name="password"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
        <div style="margin: 16px">
          <van-button round block type="primary" native-type="submit">
            注册
          </van-button>
        </div>
      </van-form>
    </div>
    
  </div>
</template>
