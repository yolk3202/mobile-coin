<script setup lang="ts" name="Dashboard">
import moment from "moment";
import { reactive, ref, onMounted } from "vue";
import "vant/es/dialog/style";
import { getUnitListApi, getCoinApi } from "@/api/coin";
import { useDarkMode } from "@/hooks/useToggleDarkMode";
import OverallPanel from "./components/OverallPanel.vue";
import AccIncome from "./components/AccIncome.vue";
import DayIncome from "./components/DayIncome.vue";
import AssetsDeploy from "./components/AssetsDeploy.vue";
import AssetsTrend from "./components/AssetsTrend.vue";
import TotalIncomePopup from "./components/TotalIncomePopup.vue";
import { explainList } from "./model";

let unitInfo = reactive({
  defaultUnit: {},
  unit:" ",
  unitList: []
});
const getUnitListList = () =>{
  getUnitListApi()
    .then(res => {
      const { code } = res;
      if (code === 0) {
        const { data } = res;
        const { defaultUnit, unitList } = data;
        unitInfo.defaultUnit = defaultUnit;
        unitInfo.unitList = unitList;
        unitInfo.unit = defaultUnit.unit;
      }
    })
    .catch(() => {});
}
const onChangeUnitInfo = item => {
  unitInfo.defaultUnit = item;
  unitInfo.unit = item.unit;
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
const oneDayAgo = new Date();
oneDayAgo.setDate(oneDayAgo.getDate() - 1);

const calendarInfo = reactive({
  show: false,
  submitFlag: false,
  minDate: twoYearsAgo,
  maxDate: oneDayAgo
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
    calendarInfo.submitFlag = false;
    calendarInfo.show = true;
  } else {
    timeInfo.startDay = moment().subtract(value, "days").format(formatter);
    timeInfo.endDay = moment().subtract(1, "days").format(formatter);
  }
};
const onConfirmCustomTime = date => {
  timeInfo.startDay = moment(date[0]).format(formatter);
  timeInfo.endDay = moment(date[1]).format(formatter);
  calendarInfo.show = false;
  calendarInfo.submitFlag = true;
};

//
let totalIncomeInfo = reactive({
  show: false
});
// 总收益
const showTheTotalIncome = () => {
  totalIncomeInfo.show = true;
};



onMounted(() => {
  // 请求币种列表
  getUnitListList();
  // 初始化数据
  timeInfo.startDay = moment().subtract(7, "days").format(formatter);
  timeInfo.endDay = moment().subtract(1, "days").format(formatter);
});
</script>

<template>
  <div class="demo-content px-[12px]">
    <OverallPanel
      :unit-info="unitInfo.defaultUnit"
      :unit-list="unitInfo.unitList"
      @change-unit="onChangeUnitInfo"
    />
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
      <AccIncome
        :unit-info="unitInfo.defaultUnit"
        :filter-day="timeInfo"
        @show-modal="showTheTotalIncome"
      />
      <DayIncome :unit-info="unitInfo.defaultUnit" :filter-day="timeInfo" />
      <AssetsTrend :unit-info="unitInfo.defaultUnit" :filter-day="timeInfo" />
      <AssetsDeploy :unit-info="unitInfo.defaultUnit" :filter-day="timeInfo" />
      <TotalIncomePopup
        v-model="totalIncomeInfo.show"
        :unit-info="unitInfo.defaultUnit"
        :filter-day="timeInfo"
      />
    </div>
    <div>
      <div
        v-for="item in explainList"
        :key="item"
        class="text-neutral-500 mb-[10px] text-[13px]"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
