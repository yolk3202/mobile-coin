<script setup>
import { ref, reactive, watch } from "vue";
import Chart from "@/components/Chart/index.vue";
import { getCoinDistributionChartApi } from "@/api/coin";

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
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2
      },
      label: {
        show: false,
        position: "center"
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          formatter: function (params) {
            return params.name + "\n =" + params.value;
          },
          fontWeight: "bold"
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
