import { useUserStoreHook } from "@/store/modules/user";
import { getUserInfoApi } from "@/api/user";
import { to } from "@/utils/common";

export function getUserInfo() {
  return to(getUserInfoApi());
}

export function setUserInfo(userInfo) {
  useUserStoreHook().setUserInfo(userInfo);
}

export function checkIsLogin() {
  return useUserStoreHook().isLogin && useUserStoreHook().token;
}
