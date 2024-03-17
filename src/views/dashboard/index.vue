<script setup lang="ts" name="Dashboard">
import { reactive, ref, onMounted } from "vue";
import { getCoinApi } from "@/api/coin";
import { useDarkMode } from "@/hooks/useToggleDarkMode";
import AccIncome from "./components/AccIncome.vue";
import DayIncome from "./components/DayIncome.vue";
import AssetsDeploy from "./components/AssetsDeploy.vue";
import AssetsTrend from "./components/AssetsTrend.vue";
import moment from "moment";

const actions = [{ name: "总揽" }, { name: "总揽1" }, { name: "总揽2" }];
const value1 = ref("总揽");
const show = ref(false);
const onSelect = item => {
  // 默认情况下点击选项时不会自动收起
  // 可以通过 close-on-click-action 属性开启自动收起
  show.value = false;
  value1.value = item.name;
};
let realData = reactive({
  historyEarnings: 0,
  historyRatio: 0,
  monthEarnings: 0,
  monthRatio: 0,
  todayEarnings: 0,
  todayRatio: 0,
  totalAssetValuation: 0,
  unit: ""
});
const realLoading = ref(false);

const getRealSrcData = () => {
  // 请求实时数据
  realLoading.value = true;
  console.log("请求实时数据");
  getCoinApi()
    .then(res => {
      console.log("请求实时数据", res);
      const { code } = res;
      if (code === 0) {
        realData = {
          ...res.data
        };
      }
    })
    .catch(err => {
      console.log("请求实时数据", err);
    })
    .finally(() => {
      realLoading.value = false;
    });
};

const formatter = "YYYY-MM-DD";
const timeList = reactive([
  { name: "1 周", value: 7 },
  { name: "1 月", value: 30 },
  { name: "3 月", value: 90 },
  { name: "6 月", value: 180 },
  { name: "自定义", value: -1 }
]);
const twoYearsAgo = new Date();
twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

const calendarInfo = reactive({
  show: false,
  submitFlag: false,
  minDate: twoYearsAgo,
  maxDate: new Date()
});
const curTime = ref(7);
const timeInfo = reactive({
  startDay: "",
  endDay: ""
});

const chooseTime = item => {
  const { value } = item;
  curTime.value = value;
  if (value === -1) {
    // 自定义
    console.log("自定义");
    calendarInfo.submitFlag = false;
    calendarInfo.show = true;
  } else {
    timeInfo.startDay = moment().subtract(value, "days").format(formatter);
    timeInfo.endDay = moment().format(formatter);
  }
};
const onConfirmCustomTime = date => {
  timeInfo.startDay = moment(date[0]).format(formatter);
  timeInfo.endDay = moment(date[1]).format(formatter);
  calendarInfo.show = false;
  calendarInfo.submitFlag = true;
};

onMounted(() => {
  // 请求实时数据
  getRealSrcData();
  // 初始化数据
  timeInfo.startDay = moment().subtract(7, "days").format(formatter);
  timeInfo.endDay = moment().format(formatter);
});
</script>

<template>
  <div class="demo-content px-[12px]">
    <!-- 面板区域 -->
    <!-- @click="show = true" -->
    <div class="mb-[16px]">
      <div class="flex items-center justify-between">
        <div class="text-1xl font-bold mb-[10px] mt-[10px] pl-[8px]">
          {{ value1 }}<van-icon class="pl-[4px]" name="arrow-down" />
        </div>
      </div>
      <van-action-sheet
        v-model:show="show"
        :actions="actions"
        @select="onSelect"
      />
      <div class="border border-gray-300 rounded-md h-[180px] box-border">
        <div v-if="realLoading" class="h-full flex items-center justify-center">
          <van-loading type="spinner" />
        </div>
        <div v-else class="text-[14px] p-4">
          <div class="mb-[8px]">总资产估值</div>
          <div class="text-[20px] mb-[8px]">
            {{ realData.totalAssetValuation }}
            <span class="text-[14px]">USDT</span>
          </div>
          <div class="mb-[10px]">
            今日收益
            <span
              :class="
                realData.todayEarnings.toString().indexOf('-') >= 0
                  ? 'text-red-500'
                  : 'text-green-500'
              "
            >
              {{ realData.unit }}
              {{ realData.todayEarnings }}
              ({{ realData.todayRatio }})
            </span>
          </div>
          <van-row justify="space-around" :gutter="20">
            <van-col span="12">
              <div class="">
                <div class="mb-[6px]">本月收益<van-icon name="info-o" /></div>
                <div
                  :class="
                    realData.monthEarnings.toString().indexOf('-') >= 0
                      ? 'text-red-500'
                      : 'text-green-500'
                  "
                >
                  {{ realData.unit }}
                  {{ realData.monthEarnings }}
                  ({{ realData.monthRatio }})
                </div>
              </div>
            </van-col>
            <van-col span="12">
              <div>
                <div class="mb-[6px]">
                  历史收益
                  <van-icon name="info-o" />
                </div>
                <div
                  :class="
                    realData.historyEarnings.toString().indexOf('-') >= 0
                      ? 'text-red-500'
                      : 'text-green-500'
                  "
                >
                  {{ realData.unit }}
                  {{ realData.historyEarnings }}
                  ({{ realData.historyRatio }})
                </div>
              </div>
            </van-col>
          </van-row>
        </div>
      </div>
    </div>
    <div>
      <van-sticky :offset-top="53">
        <div
          class="flex flex-nowrap py-[10px]"
          :class="useDarkMode() ? 'bg-[#1c1c1c]' : 'bg-white'"
        >
          <div
            class="mr-[6px] px-[4px] rounded-sm"
            v-for="item in timeList"
            :key="item.value"
            :class="
              curTime === item.value
                ? useDarkMode()
                  ? 'bg-[#3c3c3c]'
                  : 'bg-[#dedede]'
                : ''
            "
            @click="chooseTime(item)"
          >
            <span v-if="item.value !== -1">{{ item.name }}</span>
            <span v-else>
              {{
                curTime === -1 &&
                timeInfo.startDay &&
                timeInfo.endDay &&
                calendarInfo.submitFlag
                  ? timeInfo.startDay + " - " + timeInfo.endDay
                  : item.name
              }}
            </span>
          </div>
        </div>
      </van-sticky>
      <van-calendar
        v-model:show="calendarInfo.show"
        type="range"
        :show-confirm="false"
        :min-date="calendarInfo.minDate"
        :max-date="calendarInfo.maxDate"
        @confirm="onConfirmCustomTime"
      />
      <AccIncome :filter-day="timeInfo" />
      <DayIncome :filter-day="timeInfo" />
      <AssetsTrend :filter-day="timeInfo" />
      <AssetsDeploy :filter-day="timeInfo" />
      <!-- <Chart :option="refLineOption" :style="{ height: '330px' }" />
      <Chart :option="refScoreOption" :style="{ height: '330px' }" />
      <Chart :option="refPieOption" :style="{ height: '330px' }" /> -->
    </div>
  </div>
</template>
