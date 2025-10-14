<template>
  <el-dialog :close-on-click-modal="false" v-model="visible" title="合同详情" width="1400px" :destroy-on-close="true" @close="handleClose">
    <!-- 基本信息 -->
    <el-divider content-position="left" class="divider">基本信息</el-divider>
    <el-descriptions :column="2" border label-width="150px">
      <el-descriptions-item label="合同号">{{ data.contractId }}</el-descriptions-item>
      <el-descriptions-item label="合同标题">{{ data.contractTitle }}</el-descriptions-item>
      <el-descriptions-item label="合同状态">
        <DictTagMn :options="contractDicts.contractState" :value="data.contractState" />
      </el-descriptions-item>
      <el-descriptions-item label="付款状态">
        <DictTagMn :options="contractDicts.paymentState" :value="data.paymentState" />
      </el-descriptions-item>
      <el-descriptions-item label="币种">
        <DictTagMn :options="contractDicts.currencyType" :value="data.currencyType" />
      </el-descriptions-item>
      <el-descriptions-item label="询盘来源">
        <DictTagMn :options="contractDicts.customerSource" :value="data.customerSource" />
      </el-descriptions-item>      
    </el-descriptions>

    <!-- 跟进人信息 -->
    <el-divider content-position="left" class="divider">跟进人信息</el-divider>
    <el-descriptions :column="2" border label-width="150px">
      <el-descriptions-item label="跟进人名称">{{ data.userName }}</el-descriptions-item>
      <el-descriptions-item label="跟进人部门">{{ data.deptName }}</el-descriptions-item>
    </el-descriptions>

    <!-- 客户信息 -->
    <el-divider content-position="left" class="divider">客户信息</el-divider>
    <el-descriptions :column="2" border label-width="150px">
      <el-descriptions-item label="客户姓名">{{ data.customerName }}</el-descriptions-item>
      <el-descriptions-item label="客户公司">{{ data.customerCompany }}</el-descriptions-item>
      <el-descriptions-item label="客户电话">{{ data.phoneNumber }}</el-descriptions-item>
      <el-descriptions-item label="客户邮箱">{{ data.email }}</el-descriptions-item>
      <el-descriptions-item label="客户国家">{{ getCountryName(data.country) }}</el-descriptions-item>
      <el-descriptions-item label="客户地址">{{ data.companyAddress }}</el-descriptions-item>
    </el-descriptions>

    <!-- 物流信息 -->
    <el-divider content-position="left" class="divider">物流信息</el-divider>
    <el-descriptions :column="2" border label-width="150px">
      <el-descriptions-item label="运输方式">
        <DictTagMn :options="contractDicts.shipWay" :value="data.shipWay" />
      </el-descriptions-item>
      <el-descriptions-item label="贸易方式">
        <DictTagMn :options="contractDicts.tradingWay" :value="data.tradingWay" />
      </el-descriptions-item>
      <el-descriptions-item label="发货时间(天)">{{ data.deliveryTime }}</el-descriptions-item>
      <el-descriptions-item label="国内运费">{{ getCurrencySymbol(data.currencyType) }}{{ data.domesticFreight
        }}</el-descriptions-item>
      <el-descriptions-item label="国际运费">{{ getCurrencySymbol(data.currencyType) }}{{
        data.internationalFreight }}</el-descriptions-item>
      <el-descriptions-item label="物流保险费">{{ getCurrencySymbol(data.currencyType) }}{{
        data.logisticsInsurance }}</el-descriptions-item>
    </el-descriptions>

    <!-- 收款信息 -->
    <el-divider content-position="left" class="divider">收款信息</el-divider>
    <el-descriptions :column="2" border label-width="150px">
      <el-descriptions-item label="收款类型">
        <DictTagMn :options="contractDicts.benType" :value="data.benType" />
      </el-descriptions-item>
      <el-descriptions-item label="收款账户">{{ data.receivingAccount }}</el-descriptions-item>
      <el-descriptions-item label="收款账号">{{ data.accountCode }}</el-descriptions-item>
      <el-descriptions-item label="收款人名称">{{ data.accountName }}</el-descriptions-item>
      <el-descriptions-item label="收款人地址">{{ data.accountAddress }}</el-descriptions-item>
      <el-descriptions-item label="收款人银行">{{ data.accountBank }}</el-descriptions-item>
      <el-descriptions-item label="收款银行地址">{{ data.accountBankAddress }}</el-descriptions-item>
      <el-descriptions-item label="银行代号">{{ data.bankCode }}</el-descriptions-item>
      <el-descriptions-item label="分行代号">{{ data.branchCode }}</el-descriptions-item>
      <el-descriptions-item label="收款人国家">{{ data.accountCompany }}</el-descriptions-item>
      <el-descriptions-item label="SWIFT代码">{{ data.swiftCode }}</el-descriptions-item>
      <el-descriptions-item label="信保订单编号">{{ data.creditCode }}</el-descriptions-item>
    </el-descriptions>

    <!-- 金额信息 -->
    <el-divider content-position="left" class="divider">金额信息</el-divider>
    <el-descriptions :column="2" border label-width="150px">
      <el-descriptions-item label="合同总金额">{{ getCurrencySymbol(data.currencyType) }}{{ data.totalPrice
        }}</el-descriptions-item>
      <el-descriptions-item label="预付款金额">{{ getCurrencySymbol(data.currencyType) }}{{ data.beforehandPrice
        }}</el-descriptions-item>
      <el-descriptions-item label="尾款金额">{{ getCurrencySymbol(data.currencyType) }}{{ data.finallyPrice
        }}</el-descriptions-item>
      <el-descriptions-item label="暂估毛利">{{ getCurrencySymbol(data.currencyType) }}{{
        data.estimatedGrossProfit }}</el-descriptions-item>
      <el-descriptions-item label="实际毛利">{{ getCurrencySymbol(data.currencyType) }}{{ data.actualGrossProfit
        }}</el-descriptions-item>
    </el-descriptions>

    <!-- 文件信息 -->
    <el-divider content-position="left" class="divider">文件信息</el-divider>
    <el-form label-width="120px">
      <el-form-item label="提单">
        <FileUploadMn v-model="data.billOfLading" disabled />
      </el-form-item>
      <el-form-item label="清关单">
        <FileUploadMn v-model="data.customsClearanceForm" :limit="1"
          disabled />
      </el-form-item>
      <el-form-item label="真实合同">
        <FileUploadMn v-model="data.realContract" :limit="1"
          disabled />
      </el-form-item>
      <el-form-item label="委托报关单">
        <FileUploadMn v-model="data.customDeclarationForm" :limit="1"
          disabled />
      </el-form-item>
    </el-form>

    <!-- 备注信息 -->
    <el-divider content-position="left" class="divider">备注信息</el-divider>
    <el-descriptions :column="2" border label-width="150px">
      <el-descriptions-item label="备注" :span="24">{{ data.remark }}</el-descriptions-item>
    </el-descriptions>

    <!-- 商品信息 -->
    <el-divider content-position="left" class="divider">商品信息</el-divider>
    <el-table :data="data.products || []" border style="width: 100%">
      <el-table-column prop="mcpName" label="商品名称" width="180" />
      <el-table-column prop="mcpDescription" label="商品描述" min-width="200" />
      <el-table-column prop="mcpNum" label="数量" width="100" />
      <el-table-column prop="mcpPrice" label="价格" width="150" />
      <el-table-column prop="mcpImage" label="商品图片" width="200">
        <template #default="scope">
          <ImageUploadGrid v-model="scope.row.mcpImage" :isShowTip="false"
            disabled />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" min-width="150" />
    </el-table>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import FileUploadMn from '@/components/Website/FileUploadMn/index.vue';
import { getCurrencySymbol } from '@/utils/displayHelpers';

const props = defineProps({
  modelValue: Boolean,
  data: {
    type: Object,
    required: true
  },
  contractDicts: {
    type: Object,
    required: true
  },
  getCountryName: {
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