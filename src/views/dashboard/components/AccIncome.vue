<script setup>
import { ref, reactive, watch } from "vue";
import { useDarkMode } from "@/hooks/useToggleDarkMode";
import Chart from "@/components/Chart/index.vue";
import { getCoinChartApi } from "@/api/coin";

const TYPE = "line";
const emit = defineEmits(["showModal"]);
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
      let unit = "";
      for (let i = 0; i < apiData.value.length; i += 1) {
        const item = apiData.value[i];
        if (item.name === params[0].seriesName) {
          unit = item.unit;
        }
      }
      curInfo.vals = [];
      if (unit === "%") {
        params.forEach(item => {
          curInfo.vals.push(`${item.value}${unit}`);
        });
      } else {
        params.forEach(item => {
          curInfo.vals.push(`${unit}${item.value}`);
        });
      }
      return;
    }
  },
  xAxis: {
    type: "category",
    data: [],
    triggerEvent: true,
    axisTick: {
      show: false
    }
  },
  yAxis: {
    type: "value",
    min: "auto",
    max: "auto"
  },
  grid: {
    left: "3%",
    right: "3%",
    bottom: "3%",
    containLabel: true
  },
  series: []
});
const setChartsData = checkedVal => {
  // 选择 type 与 checkedVal 相同的数据
  lineOption.series = [];
  curInfo.vals = [];
  // 收集所有数据
  let arr = [];
  apiData.value.forEach(item => {
    if (item.type === checkedVal) {
      const data = {
        name: item.name,
        type: TYPE,
        data: item.value,
        smooth: true,
        symbol: "none"
      };
      arr.push(...item.value);
      if (item.unit === "%") {
        curInfo.vals.push(`${item.value[item.value.length - 1]}${item.unit}`);
      } else {
        curInfo.vals.push(`${item.unit}${item.value[item.value.length - 1]}`);
      }
      lineOption.series.push(data);
    }
    lineOption.yAxis.min = Math.min(...arr);
    lineOption.yAxis.max = Math.max(...arr);
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
      <div class="text-[16px]">
        累计收益
        <van-icon
          @click="
            () => {
              emit('showModal');
            }
          "
          class="ml-[4px] text-zinc-500"
          name="info-o"
        />
      </div>
      <van-switch
        v-model="checked"
        :active-value="'value'"
        :inactive-value="'ratio'"
      >
        <template #node>
          <div
            class="leading-8 text-center h-full"
            :class="useDarkMode() ? 'text-slate-400' : 'text-slate-800'"
          >
            {{ checked === "value" ? "₮" : "%" }}
          </div>
        </template>
      </van-switch>
    </div>
    <div>
      <div class="text-zinc-500">{{ curInfo.time }}</div>
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
    <Chart :option="refLineOption" :style="{ height: '330px' }" />
  </div>
</template>
