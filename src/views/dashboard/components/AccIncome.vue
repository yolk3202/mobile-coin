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
let apiData = ref([]);
// 初始化时间是 最近一天数据
let curInfo = reactive({
  time: "",
  vals: []
});

const checked = ref("value");
const lineOption = reactive({
  legend: {
    left: "center",
    icon: "circle"
  },
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
const setChartsData = checkedVal => {
  // 选择 type 与 checkedVal 相同的数据
  lineOption.series = [];
  curInfo.vals = [];
  apiData.value.forEach(item => {
    if (item.type === checkedVal) {
      const data = {
        name: item.name,
        type: TYPE,
        data: item.value
      };
      curInfo.vals.push(item.value[item.value.length - 1]);
      lineOption.series.push(data);
    }
  });
};
const getChartData = ({ startDay, endDay }) => {
  getCoinChartApi({
    startDay,
    endDay
  }).then(res => {
    const { code, data } = res;
    if (code === 0) {
      apiData.value = [];
      apiData.value.push(...data.data);
      curInfo.time = data.xdata[data.xdata.length - 1];
      lineOption.xAxis.data = data.xdata;
      setChartsData(checked.value);
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

watch(
  () => checked.value,
  newVal => {
    setChartsData(newVal);
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
      <van-switch
        v-model="checked"
        :active-value="'value'"
        :inactive-value="'ratio'"
      >
        <template #node>
          <div class="leading-8 text-center h-full">
            {{ checked === "value" ? "$" : "%" }}
          </div>
        </template>
      </van-switch>
    </div>
    <div>
      <div>{{ curInfo.time }}</div>
      <div class="flex justify-between">
        <div class="flex-1" v-for="item in curInfo.vals" :key="item">
          {{ item }}
        </div>
      </div>
    </div>
    <Chart :option="refLineOption" :style="{ height: '330px' }" />
  </div>
</template>
