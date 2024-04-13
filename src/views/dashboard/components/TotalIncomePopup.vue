<script setup>
import { ref, watchEffect, watch, reactive } from "vue";
import { getCoinTipsApi } from "@/api/coin";
import { useDarkMode } from "@/hooks/useToggleDarkMode";

const props = defineProps({
  modelValue: {
    type: Boolean
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

const emit = defineEmits(["update:modelValue"]);

const show = ref(props.modelValue);
let dataInfo = reactive({
  startDay: "",
  endDay: "",
  startIncome: "",
  endIncome: "",
  clearIncome: "",
  totalIncome: "",
  unit: ""
});
watchEffect(() => {
  show.value = props.modelValue;
});

const closeHandler = () => {
  show.value = false;
  emit("update:modelValue", show.value);
};
const getChartData = async ({ startDay, endDay }) => {
  getCoinTipsApi({ startDay, endDay }).then(res => {
    const { code, data } = res;
    if (code === 0) {
      dataInfo = {
        ...data
      };
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
</script>
<template>
  <van-popup
    v-model:show="show"
    closeable
    safe-area-inset-bottom
    position="bottom"
    :style="{ height: '34%' }"
    @click-overlay="closeHandler"
    @click-close-icon="closeHandler"
  >
    <div class="box-border">
      <div
        class="px-[16px] py-[10px] text-[16px] font-bold border-b"
        :class="useDarkMode() ? 'border-neutral-700' : 'border-neutral-300'"
      >
        累计收益
      </div>
      <div
        class="px-[16px] py-[10px] border-b"
        :class="useDarkMode() ? 'border-neutral-700' : 'border-neutral-300'"
      >
        <div class="flex justify-between text-[14px] leading-[30px]">
          <div class="text-neutral-500">期末资产({{ dataInfo.endDay }})</div>
          <div>{{ dataInfo.unit }}{{ dataInfo.endIncome }}</div>
        </div>
        <div class="flex justify-between text-[14px] leading-[30px]">
          <div class="text-neutral-500">期初资产({{ dataInfo.startDay }})</div>
          <div>{{ dataInfo.unit }}{{ dataInfo.startIncome }}</div>
        </div>
        <div class="flex justify-between text-[14px] leading-[30px]">
          <div class="text-neutral-500">净划入资产</div>
          <div>{{ dataInfo.unit }}{{ dataInfo.clearIncome }}</div>
        </div>
      </div>
      <div class="px-[16px] py-[10px]">
        <div class="flex justify-between text-[14px] leading-[30px]">
          <div class="text-neutral-500">累计收益</div>
          <div
            :class="
              dataInfo.totalIncome.toString().indexOf('-') >= 0
                ? 'text-red-500'
                : 'text-green-500'
            "
          >
            {{ dataInfo.unit }}{{ dataInfo.totalIncome }}
          </div>
        </div>
        <div class="flex justify-between text-[12px] leading-[30px]">
          <div class="text-neutral-500">
            累计收益= 期末资产-期初资产-净划入资产
          </div>
        </div>
        <div class="flex justify-between text-[12px] leading-[30px]">
          <div class="text-neutral-500">
            展示数值受汇率及币价波动影响，以上数据仅供参考
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
