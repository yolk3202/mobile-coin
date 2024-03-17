<script setup>
import { ref, reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCoinTrendChartApi } from "@/api/coin";

const TYPE = 'line';
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
let apiData = reactive({});
// 初始化时间是 最近一天数据
const curInfo = reactive({
  time: "",
  incomeVal: "",
  incomeName: ""
});
const lineOption = reactive({
  tooltip: {
    trigger: "axis",
    triggerOn: "mousemove",
    axisPointer: { type: "line" },
    formatter: function (params) {
      curInfo.time = params[0].name;
      curInfo.accVal = params[0].value;
      return;
    }
  },
  xAxis: {
    type: "category",
    data: []
  },
  yAxis: {
    type: "value"
  },
  series: []
});

const getChartData = ({ startDay, endDay }) => {
  getCoinTrendChartApi({
    startDay,
    endDay
  }).then(res => {
    console.log("getCoinDayChartApi===>:", res);
    const { code, data } = res;
    if (code === 0) {
      apiData = reactive({ ...data });
      curInfo.time = data.xdata[data.xdata.length - 1];
      curInfo.incomeVal = data.data[0].value[data.data[0].value.length - 1];
      curInfo.incomeName = data.data[0].name;
      lineOption.xAxis.data = data.xdata;
      data.data.forEach((item, index) => {
        const data = {
          name: item.name,
          type: TYPE,
          data: item.value
        };
        lineOption.series.push(data);
      });
    }
  });
};
watch(
  () => props.filterDay,
  (newVal, oldVal) => {
    console.log("filterDay===>:", newVal, oldVal);
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
        <div class="flex-1">{{ curInfo.accVal }}</div>
      </div>
    </div>
    <Chart :option="refLineOption" :style="{ height: '330px' }" />
  </div>
</template>
