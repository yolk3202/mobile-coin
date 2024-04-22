<script setup>
import { ref, reactive, watch } from "vue";
import { showDialog } from "vant";
import Chart from "@/components/Chart/index.vue";
import { getCoinDayChartApi } from "@/api/coin";

const TYPE = "bar";
const props = defineProps({
  unitInfo: {
    type: Object,
    required: true
  },
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
const componentData = reactive({
  loading: true,
  srcData: {},
  flag: false,
  rate: 1,
  unit: ""
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
        curInfo.vals.push(`${componentData.unit}${item.value}`);
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
  grid: {
    left: "2%",
    right: "5%",
    containLabel: true
  },
  series: []
});
const setChartsData = () => {
  const { rate, unit } = componentData;
  lineOption.series = [];
  curInfo.vals = [];
  apiData.value.forEach(item => {
    let dataValues = item.value.map(val=>(val * rate).toFixed(2));
    const data = {
      name: item.name,
      type: TYPE,
      data: dataValues,
      itemStyle: {
        color: function (params) {
          return params.data >= 0 ? "#22c55e" : "#ef4444";
        }
      }
    };
    curInfo.vals.push(`${unit}${dataValues[dataValues.length - 1]}`);
    lineOption.series.push(data);
  });
}
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
      setChartsData()
      componentData.flag = true;
    }
  });
};
watch(
  () => props.unitInfo,
  newVal => {
    componentData.rate = newVal.rate;
    componentData.unit = newVal.unit;
    if (componentData.flag) {
      setChartsData();
    }
  },
  {
    deep: true,
    immediate: true
  }
);

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


// 每日收益
const showTheDayIncome = () => {
  showDialog({
    title: "每日收益",
    message: "每日收益 = 当日结束时资产-当日初始资产-当日净划入资产"
  }).then(() => {
    // on close
  });
};

const refBarOption = ref(lineOption);
</script>
<template>
  <div>
    <div class="flex justify-between">
      <div class="text-[16px]">
        每日收益
        <van-icon
          @click="showTheDayIncome"
          class="ml-[4px] text-zinc-500"
          name="info-o"
        />
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
