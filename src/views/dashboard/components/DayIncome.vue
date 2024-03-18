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
      curInfo.vals = [];
      params.forEach(item => {
        curInfo.vals.push(item.value);
      });
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
    const { code, data } = res;
    if (code === 0) {
      apiData.value = [];
      apiData.value.push(...data.data);
      curInfo.time = data.xdata[data.xdata.length - 1];
      lineOption.xAxis.data = data.xdata;
      lineOption.series = [];
      curInfo.vals = [];
      data.data.forEach(item => {
        const data = {
          name: item.name,
          type: TYPE,
          data: item.value
        };
        curInfo.vals.push(item.value[item.value.length - 1]);
        lineOption.series.push(data);
      });
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
        <div class="flex-1" v-for="item in curInfo.vals" :key="item">
          {{ item }}
        </div>
      </div>
    </div>
    <Chart :option="refBarOption" :style="{ height: '330px' }" />
  </div>
</template>
