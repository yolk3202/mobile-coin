import { http } from "@/utils/http";

// 注册用户
export const registryApi = data => {
  return http.request({
    url: "/api/user/registry",
    method: "post",
    data
  });
};

// 登录
export const loginApi = data => {
  console.log('data', data)
  return http.request({
    url: "/api/user/login",
    method: "post",
    data
  });
};

// 修改密码
export const changePasswordApi = data => {
  return http.request({
    url: "/api/user/change_password",
    method: "post",
    data
  });
};

// 获取用户信息
export const getUserInfoApi = () => {
  return http.request({
    url: "/api/user",
    method: "get"
  });
};
