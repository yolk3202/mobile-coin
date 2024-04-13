<script setup>
import { ref, reactive, watch, computed } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCoinDistributionChartApi } from "@/api/coin";
import { countDecimals } from "@/utils/common";

// const TYPE = "pie";
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
let chartDom = ref(null);
let apiData = ref([]);
let numberInfo = reactive({
  total: 0, // valuation 总值
  decimal: 0, // 小数位数
  unit: "" // 单位
});
const pieOption = reactive({
  legend: {
    textStyle: {
      fontWeight: "bold", // 设置图例文本为粗体
      fontSize: 12
    },
    formatter: function (name) {
      let val;
      for (let i = 0; i < apiData.value.length; i += 1) {
        const cur = apiData.value[i];
        if (cur && cur.name === name) {
          val = parseFloat(cur.valuation);
          break;
        }
      }
      const percentage = ((val / numberInfo.total) * 100).toFixed(2);
      return `${name}: (${percentage}%)`;
    }
  },
  series: [
    {
      type: "pie",
      selectedMode: "selectedMode",
      selectedOffset: 0,
      minAngle: 1,
      radius: ["50%", "65%"],
      avoidLabelOverlap: true,
      itemStyle: {
        borderRadius: 2,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: true,
        position: "center",
        fontSize: 16,
        fontWeight: "bold",
        formatter: function () {
          let str = "≈";
          let acc = 0;
          let unit = "";
          let decimals = 0;
          // 计算总和
          apiData.value.forEach(item => {
            decimals = Math.max(decimals, countDecimals(item.valuation));
            acc = parseFloat(acc + parseFloat(item.valuation));
            unit = item.unit;
          });
          str = "≈" + unit + acc.toFixed(decimals);
          return "总额" + "\n" + str;
        }
      },
      emphasis: {
        scaleSize: 8,
        label: {
          show: true,
          formatter: function (params) {
            let str = "≈";
            let bal = "";
            for (let i = 0; i < apiData.value.length; i += 1) {
              const cur = apiData.value[i];
              if (cur && cur.name === params.name) {
                str = "≈" + cur.unit + cur.valuation;
                bal = cur.bal;
              }
            }
            return params.name + "\n" + bal + "\n" + str;
          }
        }
      },
      labelLine: {
        show: false
      },
      data: []
    }
  ]
});
const clickCallback = ({ eventType }) => {
  if (eventType === "mouseover") {
    pieOption.series[0].label.show = false;
  }
  if (eventType === "mouseout") {
    pieOption.series[0].label.show = true;
  }
};
const setNumberInfo = data => {
  let total = 0;
  let decimal = 0;
  let unit = "";
  data.forEach(item => {
    total += parseFloat(item.valuation);
    decimal = Math.max(decimal, countDecimals(item.valuation));
    unit = item.unit;
  });
  numberInfo.total = parseFloat(total.toFixed(decimal));
  numberInfo.decimal = decimal;
  numberInfo.unit = unit;
};
const getChartData = ({ startDay, endDay }) => {
  getCoinDistributionChartApi({
    startDay,
    endDay
  }).then(res => {
    const { code, data } = res;
    if (code === 0) {
      const datas = data.data || [];
      apiData.value = [];
      pieOption.series[0].data = [];
      const list = datas
        .filter(item => parseFloat(item.valuation) >= 0.001) // 过滤掉 valuation 值小于 0.001 的元素
        .sort((a, b) => parseFloat(b.valuation) - parseFloat(a.valuation)); // 按照 valuation 属性进行排序
      setNumberInfo(list);
      apiData.value.push(...list);
      list.forEach(item => {
        const data = {
          name: item.name,
          value: parseFloat(item.valuation)
        };
        pieOption.series[0].data.push(data);
      });
      if (datas.length > 2) {
        pieOption.legend.orient = "vertical";
        pieOption.legend.right = "right";
        pieOption.legend.top = "center";
        pieOption.series[0].center = ["32%", "50%"];
      } else {
        pieOption.legend.orient = "horizontal";
        pieOption.legend.top = "bottom";
      }
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

const chartHeight = computed(() => {
  let baseHeight = 270;
  let increment = 30;
  let dataCount = apiData.value.length;

  if (dataCount <= 10) {
    return baseHeight + 'px';
  } else {
    let extraHeight = Math.floor(dataCount - 10) * increment;
    return baseHeight + extraHeight + "px";
  }
});

// 饼图
// const data = [
//   { value: 1048, name: "USTD" },
//   { value: 735, name: "ETH" }
// ];
const refPieOption = ref(pieOption);
</script>
<template>
  <div>
    <div class="flex justify-between">
      <div class="text-[16px]">
        资产分布
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
    </div>
    <Chart
      ref="chartDom"
      :option="refPieOption"
      @click-callback="clickCallback"
      :style="{ height: chartHeight }"
    />
  </div>
</template>
