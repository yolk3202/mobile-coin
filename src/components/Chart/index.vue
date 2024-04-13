<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref, watch, onMounted, onUnmounted } from "vue";
import type { ECharts } from "echarts";
import * as echarts from "echarts";
import { debounce } from "lodash-es";
import { useDarkModeStore } from "@/store/modules/darkMode";
import { addListener, removeListener } from "resize-detector";
import dark from "./dark";
import light from "./light";

const darkModeStore = useDarkModeStore();
const { darkMode } = storeToRefs(darkModeStore);

const emit = defineEmits(["clickCallback"]);

const props = defineProps({
  option: Object
});
echarts.registerTheme("light-chart", light);
echarts.registerTheme("dark-chart", dark);

const chartDom = ref<HTMLDivElement>();
let chart: ECharts | null = null;
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
      darkMode.value ? "dark-chart" : "light-chart"
    );
    chart.setOption(props.option);
    chart.on("click", params => {
      emit("clickCallback", { eventType: "click", params });
    });
    chart.on("mouseover", params => {
      emit("clickCallback", { eventType: "mouseover", params });
    });

    chart.on("mouseout", params => {
      emit("clickCallback", { eventType: "mouseout", params });
    });
    addListener(chartDom.value, resize);
  }
}

watch(
  darkMode,
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
