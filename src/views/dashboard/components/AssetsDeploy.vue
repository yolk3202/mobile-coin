<script setup>
import { ref, reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCoinDistributionChartApi } from "@/api/coin";
import { countDecimals } from "@/utils/common";

// const TYPE = "pie";
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
const pieOption = reactive({
  tooltip: {
    trigger: "item",
    showContent: false
  },
  legend: {
    left: "center",
    bottom: 10,
    formatter: function (name) {
      let tarValue;
      for (let i = 0; i < apiData.value.length; i += 1) {
        const cur = apiData.value[i];
        if (cur && cur.name === name) {
          tarValue = cur.bal;
        }
      }
      return `${name}: ${tarValue}`;
    }
  },
  series: [
    {
      type: "pie",
      minAngle: 5,
      radius: ["50%", "60%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: false,
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
        scaleSize: 10,
        label: {
          show: true,
          formatter: function (params) {
            let str = "≈";
            for (let i = 0; i < apiData.value.length; i += 1) {
              const cur = apiData.value[i];
              if (cur && cur.name === params.name) {
                str = "≈" + cur.unit + cur.valuation;
              }
            }
            return params.name + "\n" + params.value + "\n" + str;
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

const getChartData = ({ startDay, endDay }) => {
  getCoinDistributionChartApi({
    startDay,
    endDay
  }).then(res => {
    const { code, data } = res;
    if (code === 0) {
      apiData.value = [];
      apiData.value.push(...data.data);
      pieOption.series[0].data = [];
      data.data.forEach(item => {
        const data = {
          name: item.name,
          value: parseFloat(item.bal)
        };
        pieOption.series[0].data.push(data);
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
      <div>资产分布<van-icon name="info-o" /></div>
    </div>
    <Chart :option="refPieOption" :style="{ height: '330px' }" />
  </div>
</template>
