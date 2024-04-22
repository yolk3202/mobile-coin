<script setup>
import { reactive, watch } from "vue";
import { showDialog } from "vant";
import { getCoinApi } from "@/api/coin";

const emit = defineEmits(["changeUnit"]);
const props = defineProps({
  unitInfo: {
    type: Object,
    required: true
  },
  unitList: {
    type: Array,
    required: true,
  },
});

let realData = reactive({
  historyEarnings: 0, // 历史收益
  historyRatio: 0,
  monthEarnings: 0, // 本月收益
  monthRatio: 0,
  todayEarnings: 0, // 今日收益
  todayRatio: 0,
  totalAssetValuation: 0, // 总资产估值
});

const componentData = reactive({
  loading: true,
  srcData: {},
  flag: false,
  name: "",
  rate: 1,
  unit: "",
  show: false,
});

const onSelect = (item) => {
  emit("changeUnit", item);
  componentData.show = false;
};

const showModal = () => {
  componentData.show = true;
};

const changeData = () => {
  const { rate } = componentData;
  const { historyEarnings, monthEarnings, todayEarnings, totalAssetValuation } =
    componentData.srcData;
  // 保留两位小数
  realData.historyEarnings = (historyEarnings * rate).toFixed(2);
  realData.monthEarnings = (monthEarnings * rate).toFixed(2);
  realData.todayEarnings = (todayEarnings * rate).toFixed(2);
  realData.totalAssetValuation = (totalAssetValuation * rate).toFixed(2);
};

const getDataInfo = () => {
  // 请求实时数据
  getCoinApi()
    .then(res => {
      const { code } = res;
      if (code === 0) {
        realData = {
          ...res.data
        };
        componentData.srcData = res.data;
        changeData();
      }
    })
    .catch(() => {})
    .finally(() => {
      componentData.loading = false;
    });
};

watch(
  () => props.unitInfo,
  newVal => {
    if (!componentData.flag) {
      componentData.flag = true;
      getDataInfo();
    }
    componentData.rate = newVal.rate;
    componentData.name = newVal.name;
    componentData.unit = newVal.unit;
    if (newVal.rate) {
      changeData();
    }
  },
  {
    deep: true,
    immediate: true
  }
);

// 本月收益
const showTheMonthIncome = () => {
  showDialog({
    title: "本月收益",
    message:
      "本月第一个自然日00:00至今日 00:00(UTC+8)的累计收益，不包括今日收益"
  }).then(() => {
    // on close
  });
};
// 历史收益
const showTheHistoryIncome = () => {
  showDialog({
    title: "历史收益",
    message: "自账户创建至今日 00:00(UTC+8)的累计收益，不包括今日收益"
  }).then(() => {
    // on close
  });
};
</script>
<template>
  <div class="mb-[16px]">
    <div class="flex items-center justify-between">
      <div class="text-1xl font-bold mb-[10px] mt-[10px] pl-[8px]">总览</div>
    </div>
    <div class="border border-gray-300 rounded-md box-border min-h-[180px]">
      <div
        v-if="componentData.loading"
        class="min-h-[180px] flex items-center justify-center"
      >
        <van-loading type="spinner" />
      </div>
      <div v-else class="text-[14px] p-4">
        <div class="mb-[8px]">总资产估值</div>
        <div class="text-[20px] mb-[8px] flex items-center">
          <div>{{ realData.totalAssetValuation }}</div>
          <div class="text-[14px] ml-[10px] flex items-end" @click="showModal">
            <div>{{ componentData.name }}</div>
            <div><van-icon name="arrow-down" /></div>
          </div>
        </div>
        <div class="mb-[10px]">
          昨日收益
          <span
            class="ml-[4px]"
            :class="
              realData.todayEarnings.toString().indexOf('-') >= 0
                ? 'text-red-500'
                : 'text-green-500'
            "
          >
            {{ componentData.unit }}
            {{ realData.todayEarnings }}
            ({{ realData.todayRatio }})
          </span>
        </div>
        <van-row justify="space-around" :gutter="20">
          <van-col span="12">
            <div class="">
              <div class="mb-[6px]">
                本月收益
                <van-icon
                  @click="showTheMonthIncome"
                  class="ml-[4px] text-zinc-500"
                  name="info-o"
                />
              </div>
              <div
                :class="
                  realData.monthEarnings.toString().indexOf('-') >= 0
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                {{ componentData.unit }}
                {{ realData.monthEarnings }}
                ({{ realData.monthRatio }})
              </div>
            </div>
          </van-col>
          <van-col span="12">
            <div>
              <div class="mb-[6px]">
                历史收益
                <van-icon
                  @click="showTheHistoryIncome"
                  class="ml-[4px] text-zinc-500"
                  name="info-o"
                />
              </div>
              <div
                :class="
                  realData.historyEarnings.toString().indexOf('-') >= 0
                    ? 'text-red-500'
                    : 'text-green-500'
                "
              >
                {{ componentData.unit }}
                {{ realData.historyEarnings }}
                ({{ realData.historyRatio }})
              </div>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <van-action-sheet
      v-model:show="componentData.show"
      :actions="unitList"
      @select="onSelect"
    />
  </div>
</template>
