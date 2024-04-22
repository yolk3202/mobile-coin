import { http } from "@/utils/http";

// 获取单位列表
export const getUnitListApi = () => {
  return http.request({
    url: "/api/asset_analysis/unit_list",
    method: "get"
  });
};

// 获取实时资产
export const getCoinApi = () => {
  return http.request({
    url: "/api/asset_analysis/lastassets",
    method: "get"
  });
};

// 获取累计资产图表
export const getCoinChartApi = ({ startDay, endDay }) => {
  return http.request({
    url: "/api/asset_analysis/total_earnings_chart",
    method: "post",
    data: {
      startDay,
      endDay
    }
  });
};
// 获取累计资产tips
export const getCoinTipsApi = ({ startDay, endDay }) => {
  return http.request({
    url: "/api/asset_analysis/total_earnings_tips",
    method: "post",
    data: {
      startDay,
      endDay
    }
  });
};

// 获取每日资产图表
export const getCoinDayChartApi = ({ startDay, endDay }) => {
  return http.request({
    url: "/api/asset_analysis/daily_earnings_chart",
    method: "post",
    data: {
      startDay,
      endDay
    }
  });
};

// 获取资产走势图表
export const getCoinTrendChartApi = ({ startDay, endDay }) => {
  return http.request({
    url: "/api/asset_analysis/trend_chart",
    method: "post",
    data: {
      startDay,
      endDay
    }
  });
};

// 获取资产分布图表
export const getCoinDistributionChartApi = ({ startDay, endDay }) => {
  return http.request({
    url: "/api/asset_analysis/distirbut_chart",
    method: "post",
    data: {
      startDay,
      endDay
    }
  });
};
