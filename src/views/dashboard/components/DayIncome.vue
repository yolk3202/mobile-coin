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
    data: [],
    axisTick: {
      show: false
    }
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
          data: item.value,
          itemStyle: {
            color: function (params) {
              return params.data >= 0 ? "#22c55e" : "#ef4444";
            }
          }
        };
        curInfo.vals.push(`${item.unit}${item.value[item.value.length - 1]}`);
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
      <div class="text-[16px]">
        每日收益<van-icon class="ml-[4px] text-zinc-500" name="info-o" />
      </div>
    </div>
    <div>
      <div class="text-zinc-500">{{ curInfo.time }}</div>
      <div class="text-zinc-500">当日收益</div>
      <div class="flex justify-between text-[16px]">
        <div
          class="flex-1"
          v-for="item in curInfo.vals"
          :key="item"
          :class="
            item.toString().indexOf('-') >= 0
              ? 'text-red-500'
              : 'text-green-500'
          "
        >
          {{ item }}
        </div>
      </div>
    </div>
    <Chart :option="refBarOption" :style="{ height: '330px' }" />
  </div>
</template>
