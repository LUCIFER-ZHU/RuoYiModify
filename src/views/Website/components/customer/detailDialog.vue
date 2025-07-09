<template>
  <el-dialog v-model="visible" title="客户详情" width="1200px" :destroy-on-close="true" @close="handleClose">
    <el-descriptions :column="2" border>
      <el-descriptions-item label="公司名称" width="200">{{ data.companyName }}</el-descriptions-item>
      <el-descriptions-item label="国家" width="200">{{ getCountryName(data.country) }}</el-descriptions-item>
      <el-descriptions-item label="地区" width="200">{{ getRegionName(data.region) }}</el-descriptions-item>
      <el-descriptions-item label="联系人">{{ data.contactPerson }}</el-descriptions-item>
      <el-descriptions-item label="性别">
        <DictTagMn :options="customerDicts.gender" :value="data.gender" />
      </el-descriptions-item>
      <el-descriptions-item label="客户来源">
        <DictTagMn :options="customerDicts.customerSource" :value="data.customerSource" />
      </el-descriptions-item>
      <el-descriptions-item label="分配人">{{ data.assigner }}</el-descriptions-item>
      <el-descriptions-item label="tm">{{ data.tm }}</el-descriptions-item>
      <el-descriptions-item label="邮箱">{{ data.email }}</el-descriptions-item>
      <el-descriptions-item label="国际电话区号">{{ data.countryCode }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ data.phoneNumber }}</el-descriptions-item>
      <el-descriptions-item label="公司地址">{{ data.companyAddress }}</el-descriptions-item>
      <el-descriptions-item label="社交平台">
        <DictTagMn :options="customerDicts.socialPlatform" :value="data.socialPlatform" />
      </el-descriptions-item>
      <el-descriptions-item label="社交平台账号">{{ data.spAccount }}</el-descriptions-item>
      <el-descriptions-item label="客户背调">{{ data.backgroundCheck }}</el-descriptions-item>
      <el-descriptions-item label="客户类型">
        <DictTagMn :options="customerDicts.customerType" :value="data.customerType" />
      </el-descriptions-item>
      <el-descriptions-item label="意向产品">{{ data.intentionProduct }}</el-descriptions-item>
      <el-descriptions-item label="客户星级">{{ data.customerStars }}</el-descriptions-item>
      <el-descriptions-item label="币种">
        <DictTagMn :options="customerDicts.currencyType" :value="data.currencyType" />
      </el-descriptions-item>
      <el-descriptions-item label="意向采购金额">{{ data.purchaseAmount }}</el-descriptions-item>
      <el-descriptions-item label="客户分组">
        <DictTagMn :options="customerDicts.customerGroup" :value="data.customerGroup" />
      </el-descriptions-item>
      <el-descriptions-item label="客户状态">
        <DictTagMn :options="customerDicts.customerState" :value="data.customerState" />
      </el-descriptions-item>
      <el-descriptions-item label="采购周期">
        <DictTagMn :options="customerDicts.purchaseCycle" :value="data.purchaseCycle" />
      </el-descriptions-item>
      <el-descriptions-item label="距离进入子公海日期">{{ data.toGroupSea }}</el-descriptions-item>
      <el-descriptions-item label="贸易类型">
        <DictTagMn :options="customerDicts.tradeType" :value="data.tradeType" />
      </el-descriptions-item>
      <el-descriptions-item label="备注">{{ data.remark }}</el-descriptions-item>
      <el-descriptions-item label="首次录入时间">{{ parseTime(data.firstInputTime) }}</el-descriptions-item>
      <el-descriptions-item label="最近联系时间">{{ parseTime(data.lastContactTime) }}</el-descriptions-item>
      <el-descriptions-item label="创建人">{{ data.createBy }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ parseTime(data.createTime) }}</el-descriptions-item>
      <el-descriptions-item label="更新人">{{ data.updateBy }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ parseTime(data.updateTime) }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElDivider } from 'element-plus';

const props = defineProps({
  modelValue: Boolean,
  data: {
    type: Object,
    required: true
  },
  customerDicts: {
    type: Object,
    required: true
  },
  getCountryName: {
    type: Function,
    required: true
  },
  getRegionName: {
    type: Function,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const visible = ref(props.modelValue);

watch(() => props.modelValue, (val) => {
  visible.value = val;
});

function handleClose() {
  emit('update:modelValue', false);
}
</script>

<style scoped>
.divider {
  margin: 20px 0;
}
</style>