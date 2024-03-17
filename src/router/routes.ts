import Layout from "@/layout/index.vue";
import type { RouteRecordRaw } from "vue-router";
import Dashboard from "@/views/dashboard/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/index.vue")
  },
  {
    path: "/updatePassword",
    name: "UpdatePassword",
    component: () => import("@/views/updatePassword/index.vue")
  },
  {
    path: "/",
    name: "root",
    component: Layout,
    redirect: { name: "Dashboard" },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
        meta: {
          title: "首页"
        }
      },
      {
        path: "demo",
        name: "Demo",
        component: () => import("@/views/demo/index.vue"),
        meta: {
          title: "主页"
        }
      },
      {
        path: "tools",
        name: "Tools",
        component: () => import("@/views/tools/index.vue"),
        meta: {
          title: "工具"
        }
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/about/index.vue"),
        meta: {
          title: "关于",
          noCache: true
        }
      }
    ]
  }
];

export default routes;
