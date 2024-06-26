import {
  createRouter,
  createWebHashHistory,
  type RouteLocationNormalized
} from "vue-router";
import routes from "./routes";
import { useCachedViewStoreHook } from "@/store/modules/cachedView";
import NProgress from "@/utils/progress";
import setPageTitle from "@/utils/set-page-title";
import { getUserInfo, setUserInfo, checkIsLogin} from "@/hooks/useUserInfo";

const whiteList = ["/login"];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export interface toRouteType extends RouteLocationNormalized {
  meta: {
    title?: string;
    noCache?: boolean;
  };
}

router.beforeEach(async (to: toRouteType, from, next) => {
  NProgress.start();
  // 路由缓存
  useCachedViewStoreHook().addCachedView(to);
  // 页面 title
  setPageTitle(to.meta.title);
  if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    if (!checkIsLogin()) {
      const [err, data] = await getUserInfo();
      if (err || data.code !== 0) {
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
      if (data.code === 0) {
        setUserInfo(data.data);
        if (to.path === "/login") {
          // 如果已登录，跳转首页
          next({ path: "/" });
        } else {
          next();
        }
      }
    } else {
      next();
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
