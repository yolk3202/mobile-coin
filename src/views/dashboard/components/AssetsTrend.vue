<script setup>
import { ref, reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCoinTrendChartApi } from "@/api/coin";

const TYPE = "line";
const props = defineProps({
  filterDay: {
    type: Object,
    required: true,
    default: () => {
      return {
        startDay: "",
        endDay: ""
      };
    }
  }
});
let apiData = ref([]);
// 初始化时间是 最近一天数据
const curInfo = reactive({
  time: "",
  vals: []
});
const lineOption = reactive({
  tooltip: {
    trigger: "axis",
    triggerOn: "mousemove",
    axisPointer: { type: "line" },
    formatter: function (params) {
      curInfo.time = params[0].name;
      let unit = "";
      for (let i = 0; i < apiData.value.length; i += 1) {
        const item = apiData.value[i];
        if (item.name === params[0].seriesName) {
          unit = item.unit;
        }
      }
      curInfo.vals = [];
      params.forEach(item => {
        curInfo.vals.push(`${unit}${item.value}`);
      });
      return;
    }
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    type: "value",
    min: "auto",
    max: "auto"
  },
  series: []
});

const getChartData = ({ startDay, endDay }) => {
  getCoinTrendChartApi({
    startDay,
    endDay
  }).then(res => {
    const { code, data } = res;
    if (code === 0) {
      apiData.value = [];
      apiData.value.push(...data.data);
      curInfo.time = data.xdata[data.xdata.length - 1];
      lineOption.xAxis.data = data.xdata;
      lineOption.series = [];
      curInfo.vals = [];
      // 收集所有数据
      let arr = [];
      data.data.forEach(item => {
        const data = {
          name: item.name,
          type: TYPE,
          data: item.value
        };
        arr.push(...item.value);
        curInfo.vals.push(`${item.unit}${item.value[item.value.length - 1]}`);
        lineOption.series.push(data);
      });
      lineOption.yAxis.min = Math.min(...arr);
      lineOption.yAxis.max = Math.max(...arr);
    }
  });
};
watch(
  () => props.filterDay,
  newVal => {
    if (newVal.startDay && newVal.endDay) {
      getChartData({ startDay: newVal.startDay, endDay: newVal.endDay });
    }
  },
  {
    deep: true,
    immediate: true
  }
);
const refLineOption = ref(lineOption);
</script>
<template>
  <div>
    <div class="flex justify-between">
      <div>资产走势<van-icon name="info-o" /></div>
    </div>
    <div>
      <div>{{ curInfo.time }}</div>
      <div>总资产</div>
      <div class="flex justify-between">
        <div class="flex-1" v-for="item in curInfo.vals" :key="item">
          {{ item }}
        </div>
      </div>
    </div>
    <Chart :option="refLineOption" :style="{ height: '330px' }" />
  </div>
</template>
