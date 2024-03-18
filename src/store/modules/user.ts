import { defineStore } from "pinia";
import { store } from "@/store";

export const useUserStore = defineStore({
  id: "user",
  state: () => ({
    token: localStorage.getItem("token"),
    hasLogin: false,
    userInfo: {
      phoneName: "",
      nickName: "",
      avatar: "",
      email: ""
    }
  }),
  actions: {
    // 登录成功，更新信息
    loginSuccess(token: string) {
      localStorage.setItem("token", token);
      this.token = token;
      this.hasLogin = true;
    },
    // 登录失败，清空信息
    loginFailed() {
      this.token = "";
      this.hasLogin = false;
    },
    // 修改密码，清空信息
    updatePassword() {
      this.token = "";
      this.hasLogin = false;
    },

    setUserInfo(userInfo: any) {
      this.userInfo = userInfo;
      this.hasLogin = true;
    },

    logout() {
      localStorage.removeItem("token");
      this.token = "";
      this.hasLogin = false;
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
