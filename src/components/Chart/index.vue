<script setup lang="ts">
import { useDarkMode } from "@/hooks/useToggleDarkMode";
import { ref, watch, onMounted, onUnmounted } from "vue";
import type { ECharts } from "echarts";
import * as echarts from "echarts";
import { debounce } from "lodash-es";
import { addListener, removeListener } from "resize-detector";
import dark from "./dark";
import light from "./light";

const props = defineProps({
  option: Object
});
echarts.registerTheme("light-chart", light);
echarts.registerTheme("dark-chart", dark);

const chartDom = ref<HTMLDivElement>();
let chart: ECharts | null = null;
const isRealDark = ref(useDarkMode());
function resizeChart() {
  chart?.resize();
}

const resize = debounce(resizeChart, 300);

function disposeChart() {
  if (chartDom.value) removeListener(chartDom.value, resize);

  chart?.dispose();
  chart = null;
}
function initChart() {
  disposeChart();
  if (chartDom.value) {
    // init echarts
    chart = echarts.init(
      chartDom.value,
      isRealDark.value ? "dark-chart" : "light-chart"
    );
    chart.setOption(props.option);
    chart.on("click", function (params) {
      // 控制台打印数据的名称
      console.log("点击", params, params.name);
    });
    addListener(chartDom.value, resize);
  }
}

watch(
  isRealDark,
  () => {
    initChart();
  },
  {
    flush: "post"
  }
);

onMounted(() => {
  watch(
    () => props.option,
    () => {
      chart?.setOption(props.option);
    },
    {
      deep: true,
      flush: "post"
    }
  );

  initChart();
});

onUnmounted(() => {
  disposeChart();
});
</script>

<template>
  <div ref="chartDom" />
</template>
