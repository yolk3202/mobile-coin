<script setup>
import { ref, reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCoinChartApi } from "@/api/coin";

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
let apiData = reactive({});
// 初始化时间是 最近一天数据
let curInfo = reactive({
  time: "",
  accVal: "",
  btcVal: ""
});

const checked = ref(false);
const lineOption = reactive({
  legend: {
    right: 10,
    icon: "circle"
  },
  tooltip: {
    trigger: "axis",
    triggerOn: "mousemove",
    axisPointer: { type: "line" },
    formatter: function (params) {
      curInfo.time = params[0].name;
      curInfo.accVal = params[0].value;
      curInfo.btcVal = params[1].value;
      return;
    }
  },
  xAxis: {
    type: "category",
    data: [],
    triggerEvent: true,
    axisTick: {
      alignWithLabel: true
    }
  },
  yAxis: {
    type: "value"
  },
  series: []
});

const getChartData = ({ startDay, endDay }) => {
  getCoinChartApi({
    startDay,
    endDay
  }).then(res => {
    console.log("getChartData===>:", res);
    const { code, data } = res;
    if (code === 0) {
      apiData = reactive({ ...data });
      curInfo.time = data.xdata[data.xdata.length - 1];
      curInfo.accVal = data.data[0].value[data.data[0].value.length - 1];
      curInfo.btcVal = data.data[1].value[data.data[1].value.length - 1];
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

// 折线图，柱状图
// const data = {
//   xdata: [
//     "2024-03-10",
//     "2024-03-11",
//     "2024-03-12",
//     "2024-03-13",
//     "2024-03-14",
//     "2024-03-15",
//     "2024-03-16"
//   ],
//   data: [
//     {
//       name: "累计收益率",
//       value: [150, 230, 224, 218, 135, 147, 260]
//     },
//     {
//       name: "BTC跌涨幅",
//       value: [154, 220, 220, 218, 125, 157, 230]
//     }
//   ]
// };

const refLineOption = ref(lineOption);
</script>
<template>
  <div>
    <div class="flex justify-between">
      <div>累计收益<van-icon name="info-o" /></div>
      <van-switch v-model="checked">
        <template #node>
          <div class="leading-8 text-center h-full">
            {{ checked ? "%" : "$" }}
          </div>
        </template>
      </van-switch>
    </div>
    <div>
      <div>{{ curInfo.time }}</div>
      <div class="flex justify-between">
        <div class="flex-1">{{ curInfo.accVal }}</div>
        <div class="flex-1">{{ curInfo.btcVal }}</div>
      </div>
    </div>
    <Chart :option="refLineOption" :style="{ height: '330px' }" />
  </div>
</template>
