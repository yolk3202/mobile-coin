<script setup>
import { ref, reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCoinDayChartApi } from "@/api/coin";

const TYPE = "bar";
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
      curInfo.incomeVal = params[0].value;
      curInfo.incomeName = params[0].seriesName;
      return;
    }
  },
  xAxis: {
    data: []
  },
  yAxis: {},
  series: []
});

const getChartData = ({ startDay, endDay }) => {
  getCoinDayChartApi({
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
    if (newVal.startDay && newVal.endDay) {
      getChartData({ startDay: newVal.startDay, endDay: newVal.endDay });
    }
  },
  {
    deep: true,
    immediate: true
  }
);

const refBarOption = ref(lineOption);
</script>
<template>
  <div>
    <div class="flex justify-between">
      <div>每日收益<van-icon name="info-o" /></div>
    </div>
    <div>
      <div>{{ curInfo.time }}</div>
      <div>当日收益</div>
      <div class="flex justify-between">
        <div class="flex-1">{{ curInfo.incomeVal }}</div>
      </div>
    </div>
    <Chart :option="refBarOption" :style="{ height: '330px' }" />
  </div>
</template>
