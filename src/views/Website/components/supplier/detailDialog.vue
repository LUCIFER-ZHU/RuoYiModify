<template>
  <el-dialog v-model="visible" title="供应商详情" width="900px" :destroy-on-close="true" @close="handleClose">
    <el-divider content-position="left">基本信息</el-divider>
    <el-descriptions :column="2" border>
      <el-descriptions-item min-width="150px" label="供应商名称">{{ data.supplierName }}</el-descriptions-item>
      <el-descriptions-item label="供应商类型">
        {{ supplierDicts.supplierTypeList[data.supplierType] }}
      </el-descriptions-item>
      <el-descriptions-item label="供应商来源">{{ supplierDicts.sourceList[data.source] }}</el-descriptions-item>
      <el-descriptions-item label="供应商模式">
        {{ supplierDicts.supplierModelList[data.supplierModel] }}
      </el-descriptions-item>
      <el-descriptions-item label="主营业务">{{ data.mainBusiness }}</el-descriptions-item>
      <el-descriptions-item label="业务区域">{{ data.businessRegion }}</el-descriptions-item>
      <el-descriptions-item label="是否签订协议">
        {{ supplierDicts.agreementSignedList[data.agreementSigned] }}
      </el-descriptions-item>
      <el-descriptions-item label="交易币种">{{ supplierDicts.currencyTypeList[data.currencyType] }}</el-descriptions-item>
      <el-descriptions-item label="供应商级别">{{ data.level }}</el-descriptions-item>
      <el-descriptions-item label="合作状态">
        {{ supplierDicts.statusList[data.status] }}
      </el-descriptions-item>
      <el-descriptions-item label="对接人">{{ data.approver }}</el-descriptions-item>
      <el-descriptions-item label="国家">{{ data.country }}</el-descriptions-item>
      <el-descriptions-item label="地区">{{ data.region }}</el-descriptions-item>
      <el-descriptions-item label="详细地址">{{ data.address }}</el-descriptions-item>
      <el-descriptions-item label="公司网址">{{ data.companyWeb }}</el-descriptions-item>
      <el-descriptions-item label="备注">{{ data.remark }}</el-descriptions-item>
      <el-descriptions-item label="创建人">{{ data.createBy }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ parseTime(data.createTime) }}</el-descriptions-item>
      <el-descriptions-item label="更新人">{{ data.updateBy }}</el-descriptions-item>
      <el-descriptions-item label="更新时间">{{ parseTime(data.updateTime) }}</el-descriptions-item>
    </el-descriptions>

    <div v-if="data.contacts?.length > 0" class="contact-info">
      <el-divider content-position="left" class="divider">联系人信息</el-divider>
      <el-table :data="data.contacts" style="width: 100%">
        <el-table-column prop="supContactName" label="联系人" />
        <el-table-column prop="telephone" label="联系电话" />
        <el-table-column prop="position" label="职位" />
        <el-table-column prop="remark" label="备注" />
      </el-table>
    </div>

    <div v-if="data.accounts?.length > 0" class="account-info">
      <el-divider content-position="left" class="divider">账户信息</el-divider>
      <el-table :data="data.accounts" style="width: 100%">
        <el-table-column prop="supAccountName" label="收款单位" />
        <el-table-column label="收款类型">
          <template #default="scope">
            {{ supplierDicts.supAccountTypeList[scope.row.supAccountType] }}
          </template>
        </el-table-column>
        <el-table-column prop="supAccountCode" label="收款账号" />
        <el-table-column prop="bankName" label="开户行" />
        <el-table-column prop="bankAddress" label="开户地址" />
      </el-table>
    </div>

    <div v-if="data.products?.length > 0" class="product-info">
      <el-divider content-position="left" class="divider">产品信息</el-divider>
      <el-table :data="data.products" style="width: 100%">
        <el-table-column prop="supplierName" label="供应商名称" />
        <el-table-column prop="supProductName" label="商品名称" />
        <el-table-column prop="specification" label="规格" />
        <el-table-column prop="unit" label="单位" />
        <el-table-column prop="texture" label="材质" />
        <el-table-column prop="minNum" label="最小起订量" />
        <el-table-column label="产品图片" width="200">
          <template #default="scope">
            <ImageUploadGrid v-model="scope.row.image" action="/ossUpload/upload" :fileType="['png', 'jpg', 'jpeg']"
              :limit="1" :isShowTip="false" baseUrl="https://minnuo-test.oss-cn-qingdao.aliyuncs.com/" :disabled="true">
            </ImageUploadGrid>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { ElDialog, ElDescriptions, ElDescriptionsItem, ElTag, ElImage } from 'element-plus';
const props = defineProps({
  modelValue: Boolean,
  data: {
    type: Object,
    required: true
  },
  supplierDicts: {
    type: Object,
    required: true
  },
  supplierTag: {
    type: String,
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
.contact-info,
.account-info,
.product-info {
  margin-top: 30px;
}
</style>