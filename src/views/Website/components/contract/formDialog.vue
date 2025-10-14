<template>
  <el-dialog :close-on-click-modal="false" :title="dialogTitle" v-model="dialogVisible" width="1400px"
    @close="handleClose">
    <!-- 返单模式提示 -->
    <el-alert v-if="isBackOrder" title="返单模式：基于现有合同创建新合同，系统将自动去除ID字段并简化商品信息" type="info" :closable="false" show-icon
      style="margin-bottom: 20px;" />

    <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
      <el-row>
        <!-- 合同信息 -->
        <el-divider content-position="left" class="divider">合同信息</el-divider>
        <el-col :span="8">
          <el-form-item label="合同模板" prop="templateId">
            <el-select v-model="formData.templateId" placeholder="请选择合同模板" clearable style="width: 100%"
              @change="handleTemplateChange">
              <el-option v-for="item in templateList" :key="item.templateId" :label="item.templateTitle"
                :value="item.templateId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同标题" prop="contractTitle">
            <el-input v-model="formData.contractTitle" placeholder="请输入合同标题" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同状态" prop="contractState">
            <el-select v-model="formData.contractState" clearable style="width: 100%" disabled>
              <el-option v-for="dict in contractDicts?.contractState || []" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="币种" prop="currencyType">
            <el-select v-model="formData.currencyType" clearable style="width: 100%">
              <el-option v-for="dict in contractDicts?.currencyType || []" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="暂估毛利" prop="estimatedGrossProfit">
            <el-input-number v-model="formData.estimatedGrossProfit" placeholder="请输入暂估毛利" style="width: 100%" :min="0"
              :precision="4" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="实际毛利" prop="actualGrossProfit">
            <el-input-number v-model="formData.actualGrossProfit" placeholder="请输入实际毛利" style="width: 100%" :min="0"
              :precision="4" />
          </el-form-item>
        </el-col>

        <!-- 客户信息 -->
        <el-divider content-position="left" class="divider">客户信息</el-divider>
        <el-col :span="8">
          <el-form-item label="客户姓名" prop="customerId">
            <el-select v-model="formData.customerId" placeholder="请选择客户" filterable clearable
              @change="handleCustomerChange" style="width: 100%">
              <el-option v-for="item in customerList" :key="item.customerId" :label="item.contactPerson"
                :value="item.customerId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户公司" prop="customerCompany">
            <el-input v-model="formData.customerCompany" placeholder="请输入客户公司" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="询盘来源" prop="customerSource">
            <el-select v-model="formData.customerSource" clearable style="width: 100%">
              <el-option v-for="dict in contractDicts?.customerSource || []" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户电话" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" placeholder="请输入客户电话" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户国家" prop="country">
            <el-select v-model="formData.country" filterable clearable style="width: 100%">
              <el-option v-for="item in contractDicts?.country" :key="item.id" :label="item.chineseName"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入客户邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户地址" prop="companyAddress">
            <el-input v-model="formData.companyAddress" placeholder="请输入客户地址" />
          </el-form-item>
        </el-col>

        <!-- 运输条款 -->
        <el-divider content-position="left" class="divider">运输条款</el-divider>
        <el-col :span="8">
          <el-form-item label="运输方式" prop="shipWay">
            <el-select v-model="formData.shipWay" clearable style="width: 100%">
              <el-option v-for="dict in contractDicts?.shipWay || []" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="贸易方式" prop="tradingWay">
            <el-select v-model="formData.tradingWay" clearable style="width: 100%">
              <el-option v-for="dict in contractDicts?.tradingWay || []" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="发货时间" prop="deliveryTime">
            <el-input-number v-model="formData.deliveryTime" placeholder="请输入" style="width: 100%" :min="0"
              :controls-position="'right'">
              <template #prefix>
                <span>预付款到账</span>
              </template>
              <template #suffix>
                <span>自然日后发货</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="报价有效天数" prop="priceValidity">
            <el-input-number v-model="formData.priceValidity" placeholder="请输入报价有效天数" style="width: 100%" :min="0"
              :controls-position="'right'">
              <template #suffix>
                <span>天</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国内运费" prop="domesticFreight">
            <el-input-number v-model="formData.domesticFreight" placeholder="请输入国内运费" style="width: 100%" :min="0"
              :precision="4" :controls-position="'right'">
              <template #prefix>
                <span>{{ currencyPrefix }}</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国际运费" prop="internationalFreight">
            <el-input-number v-model="formData.internationalFreight" placeholder="请输入国际运费" style="width: 100%" :min="0"
              :precision="4" :controls-position="'right'">
              <template #prefix>
                <span>{{ currencyPrefix }}</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="物流保险费" prop="logisticsInsurance">
            <el-input-number v-model="formData.logisticsInsurance" placeholder="请输入物流保险费" style="width: 100%" :min="0"
              :precision="4" :controls-position="'right'">
              <template #prefix>
                <span>{{ currencyPrefix }}</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>

        <!-- 支付条款 -->
        <el-divider content-position="left" class="divider">支付条款</el-divider>
        <el-col :span="8">
          <el-form-item label="收款类型" prop="benType">
            <el-select v-model="formData.benType" clearable style="width: 100%" @change="handleBenTypeChange">
              <el-option v-for="dict in contractDicts?.benType || []" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款账户" prop="mraId">
            <el-select v-model="formData.mraId" placeholder="请选择收款账户" filterable clearable
              @change="handleReceivingAccountChange" style="width: 100%" :disabled="formData.benType === 2">
              <el-option v-for="item in receivingAccountList" :key="item.mraId" :label="item.receivingAccount"
                :value="item.mraId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款账号" prop="accountCode">
            <el-input v-model="formData.accountCode" placeholder="请输入收款账号" :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款人名称" prop="accountName">
            <el-input v-model="formData.accountName" placeholder="请输入收款人名称" :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款人地址" prop="accountAddress">
            <el-input v-model="formData.accountAddress" placeholder="请输入收款人地址" :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款人银行" prop="accountBank">
            <el-input v-model="formData.accountBank" placeholder="请输入收款人银行" :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款银行地址" prop="accountBankAddress">
            <el-input v-model="formData.accountBankAddress" placeholder="请输入收款银行地址"
              :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行代号" prop="bankCode">
            <el-input v-model="formData.bankCode" placeholder="请输入银行代号" :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分行代号" prop="branchCode">
            <el-input v-model="formData.branchCode" placeholder="请输入分行代号" :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="收款人国家" prop="accountCompany">
            <el-input v-model="formData.accountCompany" placeholder="请输入收款人国家" :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="SWIFT代码" prop="swiftCode">
            <el-input v-model="formData.swiftCode" placeholder="请输入SWIFT代码" :disabled="formData.benType !== 2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="信保订单编号" prop="creditCode">
            <el-input v-model="formData.creditCode" placeholder="请输入信保订单编号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同总金额" prop="totalPrice">
            <el-input-number v-model="formData.totalPrice" placeholder="请输入合同总金额" style="width: 100%" :min="0"
              :precision="4" :controls-position="'right'">
              <template #prefix>
                <span>{{ currencyPrefix }}</span>
              </template>
            </el-input-number>
            <div class="form-tip">
              <el-icon>
                <InfoFilled />
              </el-icon>
              <span>总金额 = 商品总价 + 国内运费 + 国际运费 + 物流保险费</span>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="预付款金额" prop="beforehandPrice">
            <el-input-number v-model="formData.beforehandPrice" placeholder="请输入预付款金额" style="width: 100%" :min="0"
              :precision="4" :controls-position="'right'" @change="handleBeforehandPriceChange">
              <template #prefix>
                <span>{{ currencyPrefix }}</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="尾款金额" prop="finallyPrice">
            <el-input-number v-model="formData.finallyPrice" placeholder="请输入尾款金额" style="width: 100%" :min="0"
              :precision="4" :controls-position="'right'" disabled>
              <template #prefix>
                <span>{{ currencyPrefix }}</span>
              </template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <!-- 备注 -->
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider content-position="left" class="divider">商品信息</el-divider>
      <div class="product-area">
        <div class="add-btn">
          <el-button type="primary" size="small" @click="addTableRow('products')">添加商品</el-button>
        </div>
        <el-table :data="formData.products" border style="width: 100%">
          <el-table-column prop="mcpName" label="商品名称" width="180">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].mcpName`"
                :rules="rules.products[0].defaultField.mcpName">
                <el-input v-model="scope.row.mcpName" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="mcpNum" label="数量" width="150">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].mcpNum`">
                <el-input-number v-model="scope.row.mcpNum" :min="1" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="mcpPrice" label="价格" width="300">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].mcpPrice`">
                <el-input-number v-model="scope.row.mcpPrice" :min="0" :precision="4" :controls-position="'right'"
                  style="width: 100%">
                  <template #prefix>
                    <span>{{ currencyPrefix }}</span>
                  </template>
                </el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="mcpDescription" label="商品描述" min-width="200">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].mcpDescription`">
                <el-input type="textarea" v-model="scope.row.mcpDescription" :rows="5" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="mcpImage" label="商品图片" width="180">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].mcpImage`">
                <ImageUploadGrid v-model="scope.row.mcpImage" :limit="1" :isShowTip="false" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注" min-width="120">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].remark`">
                <el-input v-model="scope.row.remark" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button type="danger" size="small" @click="deleteTableRow('products', scope.$index)"
                v-if="formData.products.length > 0">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 文件信息 -->
      <el-divider content-position="left" class="divider">文件信息</el-divider>
      <el-col :span="24">
        <el-form-item label="提单" prop="billOfLading">
          <FileUploadMn v-model="formData.billOfLading" :fileType="['application/pdf', 'image/png', 'image/jpeg']" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="清关单" prop="customsClearanceForm">
          <FileUploadMn v-model="formData.customsClearanceForm"
            :fileType="['application/pdf', 'image/png', 'image/jpeg']" :limit="1" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="真实合同" prop="realContract">
          <FileUploadMn v-model="formData.realContract" :fileType="['application/pdf', 'image/png', 'image/jpeg']"
            :limit="1" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="委托报关单" prop="customDeclarationForm">
          <FileUploadMn v-model="formData.customDeclarationForm"
            :fileType="['application/pdf', 'image/png', 'image/jpeg']" :limit="1" />
        </el-form-item>
      </el-col>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="success" :loading="saveTemplateLoading"
          @click="handleSaveAsTemplateDebounced">保存为模板</el-button>
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmitDebounced">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { InfoFilled } from '@element-plus/icons-vue';
import { addContract, updateContract, getCustomerList, saveAsTemplate, getTemplateList, delContractProduct } from "@/api/Website/contract";
import { getReceivingAccountList } from "@/api/Website/receivingAccount";
import { computed, reactive, ref, watch, onMounted, watchEffect } from "vue";
import { cloneDeep, debounce } from 'lodash-es';
import { validateAndCollect } from '@/utils/validate';
import { useRoute, useRouter } from 'vue-router';
import { add, subtract, multiply } from '@/utils/calculate';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  editData: {
    type: Object,
    default: null,
  },
  contractDicts: {
    type: Object,
    required: true
  },
  isBackOrder: {
    type: Boolean,
    default: false,
  }
});

const emit = defineEmits(["update:visible", "submit-success"]);

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});

// 表单
const formRef = ref(null);

// 合同模板列表
const templateList = ref([]);

// 提交loading状态
const submitLoading = ref(false);
// 保存为模板loading状态
const saveTemplateLoading = ref(false);

// 计算对话框标题
const dialogTitle = computed(() => {
  if (props.isBackOrder) {
    return "返单合同";
  }
  return props.editData ? "修改合同信息" : "新建合同信息";
});

// 定义表单初始值生成函数
const getInitialFormData = () => ({
  // 合同模板ID
  templateId: null,
  // 合同标题
  contractTitle: '',
  // 合同状态(0-草稿、1-审核中、2-成功完结、3-失败完结)
  contractState: 0,
  // 客户ID
  customerId: '',
  // 客户姓名
  customerName: '',
  // 客户公司
  customerCompany: '',
  // 询盘来源
  customerSource: null,
  // 客户电话
  phoneNumber: '',
  // 客户邮箱
  email: '',
  // 客户国家
  country: null,
  // 客户地址
  companyAddress: '',
  // 运输方式(0=>快递,1=>海运,2=>空运,3=>陆运,4=>邮政)
  shipWay: null,
  // 贸易方式(0=>EXW,1=>FOB,2=>CFR,3=>CIF,4=>DAP,5=>DDP,6=>FCA)
  tradingWay: null,
  // 发货时间(天数)
  deliveryTime: null,
  // 报价有效天数
  priceValidity: null,
  // 国内运费
  domesticFreight: null,
  // 国际运费
  internationalFreight: null,
  // 物流保险费
  logisticsInsurance: null,
  // 收款类型(0=>线下公账,1=>私账,2=>信保账单)
  benType: 0,
  // 收款账户ID
  mraId: '',
  // 收款账户
  receivingAccount: '',
  // 收款账号
  accountCode: '',
  // 收款人名称
  accountName: '',
  // 收款人地址
  accountAddress: '',
  // 收款人银行
  accountBank: '',
  // 收款银行地址
  accountBankAddress: '',
  // 银行代号
  bankCode: '',
  // 分行代号
  branchCode: '',
  // 收款人国家
  accountCompany: '',
  // swift code
  swiftCode: '',
  // 信保订单编号
  creditCode: '',
  // 币种
  currencyType: null,
  // 合同总金额
  totalPrice: null,
  // 预付款金额
  beforehandPrice: null,
  // 尾款金额
  finallyPrice: null,
  // 暂估毛利
  estimatedGrossProfit: null,
  // 实际毛利
  actualGrossProfit: null,
  // 提单
  billOfLading: [],
  // 清关单
  customsClearanceForm: [],
  // 真实合同
  realContract: [],
  // 委托报关单
  customDeclarationForm: [],
  // 备注
  remark: '',
  // 商品信息
  products: [],
});

// 表单数据
const formData = ref(getInitialFormData());

// 路由与路由器实例（用于读取并清理预填参数）
const route = useRoute();
const router = useRouter();

/**
 * 计算合同总金额（商品总价 + 国内运费 + 国际运费 + 物流保险费）
 * @param {Array} products - 商品列表
 * @param {number} domesticFreight - 国内运费
 * @param {number} internationalFreight - 国际运费
 * @param {number} logisticsInsurance - 物流保险费
 * @returns {number} 合同总金额
 */
const calculateTotalPrice = (products, domesticFreight = 0, internationalFreight = 0, logisticsInsurance = 0) => {
  // 计算商品总价（使用精确计算）
  const productsTotal = products.reduce((total, product) => {
    const itemTotal = multiply(product.mcpNum || 0, product.mcpPrice || 0);
    return add(total, itemTotal);
  }, 0);

  // 商品总价 + 各项费用（使用精确计算）
  return add(productsTotal, domesticFreight || 0, internationalFreight || 0, logisticsInsurance || 0);
};

/**
 * 计算尾款金额（合同总金额 - 预付款金额）
 * @param {number} totalPrice - 合同总金额
 * @param {number} beforehandPrice - 预付款金额
 * @returns {number} 尾款金额
 */
const calculateFinallyPrice = (totalPrice, beforehandPrice) => {
  return subtract(totalPrice || 0, beforehandPrice || 0);
};

// 监听商品列表、运费、保险费变化，更新合同总金额
watch(
  [
    () => formData.value.products,
    () => formData.value.domesticFreight,
    () => formData.value.internationalFreight,
    () => formData.value.logisticsInsurance
  ],
  ([newProducts, newDomesticFreight, newInternationalFreight, newLogisticsInsurance]) => {
    if (newProducts) {
      formData.value.totalPrice = calculateTotalPrice(
        newProducts,
        newDomesticFreight,
        newInternationalFreight,
        newLogisticsInsurance
      );
    }
  },
  { deep: true }
);

// 监听合同总金额和预付款金额变化，更新尾款金额
watch(
  [
    () => formData.value.totalPrice,
    () => formData.value.beforehandPrice
  ],
  ([newTotalPrice, newBeforehandPrice]) => {
    formData.value.finallyPrice = calculateFinallyPrice(newTotalPrice, newBeforehandPrice);
  }
);

// 表单校验
const rules = reactive({
  contractTitle: [
    { required: true, message: '请输入合同标题', trigger: 'blur' }
  ],
  customerId: [
    { required: true, message: '请输入客户姓名', trigger: 'blur' }
  ],
  currencyType: [
    { required: true, message: '请选择币种', trigger: 'blur' }
  ],
  customerCompany: [
    { required: true, message: '请输入客户公司', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入客户电话', trigger: 'blur' }
  ],
  country: [
    { required: true, message: '请输入国家', trigger: 'blur' }
  ],
  shipWay: [
    { required: true, message: '请选择运输方式', trigger: 'blur' }
  ],
  tradingWay: [
    { required: true, message: '请选择贸易方式', trigger: 'blur' }
  ],
  benType: [
    { required: true, message: '请选择收款类型', trigger: 'blur' }
  ],
  products: [
    {
      type: 'array',
      defaultField: {
        mcpName: [{ required: true, message: '必填项', trigger: 'blur' }]
      }
    }
  ]
});

/**
 * 新增表格行
 * @param {string} field - 表格字段名
 */
function addTableRow(field) {
  if (field === 'products') {
    formData.value.products.push({
      mcpName: '',
      mcpNum: 1,
      mcpPrice: 0,
      mcpDescription: '',
      mcpImage: '',
      remark: '',
    });
  }
}
/**
 * 删除表格行
 * @param {string} field - 表格字段名
 * @param {number} index - 行索引
 */
async function deleteTableRow(field, index) {
  try {
    if (field === 'products') {
      const row = formData.value.products[index];

      // 判断是否有id，有id说明是后端数据，需要调用接口删除
      if (row.id) {
        // 调用删除合同产品接口
        await delContractProduct(row.id);
        ElMessage.success('删除成功');
      }

      // 无论是否有id，都从本地数组中移除该行
      formData.value.products.splice(index, 1);
    }
  } catch (error) {
    console.error('删除失败', error);
    ElMessage.error(error.response?.data?.message || '删除失败');
  }
}

/**
 * 重置表单
 */
function resetForm() {
  formData.value = getInitialFormData()
  formRef.value?.resetFields()
}

// 关闭对话框
const handleClose = () => {
  dialogVisible.value = false
};

// 提交表单
const handleSubmit = async () => {
  // 防止重复提交
  if (submitLoading.value) return;

  try {
    submitLoading.value = true;
    // 先进行前端校验：未通过则提示具体字段信息并中断
    const { valid, joined } = await validateAndCollect(formRef.value, '、');
    if (!valid) {
      ElMessage.error(joined || '请检查必填项或格式错误');
      submitLoading.value = false;
      return;
    }

    if (props.isBackOrder) {
      // 返单模式：处理数据后调用新增接口
      const backOrderData = processBackOrderData(formData.value);
      await addContract(backOrderData);
      ElMessage.success("返单成功");
    } else if (props.editData) {
      // 编辑操作
      await updateContract(formData.value);
      ElMessage.success("修改成功");
    } else {
      // 新增操作
      await addContract(formData.value);
      ElMessage.success("新增成功");
    }

    emit("submit-success");
    dialogVisible.value = false;
  } catch (error) {
    console.error(error);
    ElMessage.error(error.response?.message || "提交失败");
  } finally {
    submitLoading.value = false;
  }
};

/**
 * 客户选择后联动更新客户相关信息
 * @param {string|number} customerId - 客户ID
 * @returns {void}
 * @throws {Error} 当 customerList 未加载或结构异常时可能抛出
 */
const handleCustomerChange = (customerId) => {
  const customer = customerList.value.find(item => item.customerId === customerId);
  if (customer) {
    // 基础标识
    formData.value.customerId = customer.customerId || '';
    formData.value.customerName = customer.contactPerson || '';
    // 关联信息（与客户字段一一映射）
    formData.value.customerCompany = customer.companyName || '';
    formData.value.customerSource = customer.customerSource ?? null;
    formData.value.phoneNumber = customer.phoneNumber || '';
    formData.value.email = customer.email || '';
    formData.value.country = customer.country ?? null;
    formData.value.companyAddress = customer.companyAddress || '';
  } else {
    // 清空相关字段
    formData.value.customerId = '';
    formData.value.customerName = '';
    formData.value.customerCompany = '';
    formData.value.customerSource = null;
    formData.value.phoneNumber = '';
    formData.value.email = '';
    formData.value.country = null;
    formData.value.companyAddress = '';
  }
};

// 处理收款账户选择
const handleReceivingAccountChange = (mraId) => {
  const account = receivingAccountList.value.find(item => item.mraId === mraId);
  if (account) {
    formData.value.receivingAccount = account.receivingAccount;
    formData.value.accountCode = account.accountCode;
    formData.value.accountName = account.accountName;
    formData.value.accountAddress = account.accountAddress;
    formData.value.accountBank = account.accountBank;
    formData.value.accountBankAddress = account.accountBankAddress;
    formData.value.bankCode = account.bankCode;
    formData.value.branchCode = account.branchCode;
    formData.value.accountCompany = account.accountCompany;
    formData.value.swiftCode = account.swiftCode;
  } else {
    formData.value.receivingAccount = '';
    formData.value.accountCode = '';
    formData.value.accountName = '';
    formData.value.accountAddress = '';
    formData.value.accountBank = '';
    formData.value.accountBankAddress = '';
    formData.value.bankCode = '';
    formData.value.branchCode = '';
    formData.value.accountCompany = '';
    formData.value.swiftCode = '';
  }
};

// 处理收款类型变化
const handleBenTypeChange = () => {
  // 先清空收款账户相关字段
  if ([0, 1, 2].includes(formData.value.benType)) { // 私账或信保账单
    formData.value.mraId = '';
    formData.value.receivingAccount = '';
    formData.value.accountCode = '';
    formData.value.accountName = '';
    formData.value.accountAddress = '';
    formData.value.accountBank = '';
    formData.value.accountBankAddress = '';
    formData.value.bankCode = '';
    formData.value.branchCode = '';
    formData.value.accountCompany = '';
    formData.value.swiftCode = '';
  }

  // 只有非信保账单时才请求收款账户列表
  if (formData.value.benType !== 2) {
    getReceivingAccount();
  }
};

// 处理预付款金额变化
const handleBeforehandPriceChange = (value) => {
  // 确保预付款不超过合同总金额
  if (value > formData.value.totalPrice) {
    ElMessage.warning('预付款金额不能超过合同总金额');
    formData.value.beforehandPrice = formData.value.totalPrice;
  }
  // 更新尾款金额
  formData.value.finallyPrice = calculateFinallyPrice(formData.value.totalPrice, formData.value.beforehandPrice);
};

/**
 * 处理返单数据，去除ID字段并简化商品信息
 * @param {Object} formData - 原始表单数据
 * @returns {Object} 处理后的返单数据
 */
const processBackOrderData = (formData) => {
  // 深拷贝数据，避免修改原始数据
  const backOrderData = cloneDeep(formData);

  // 处理商品信息，只保留指定字段
  if (backOrderData.products && backOrderData.products.length > 0) {
    backOrderData.products = backOrderData.products.map(product => ({
      mcpName: product.mcpName,
      mcpNum: product.mcpNum,
      mcpPrice: product.mcpPrice,
      mcpDescription: product.mcpDescription,
      mcpImage: product.mcpImage,
      remark: product.remark
    }));
  }

  // 只保留需要的字段，过滤掉不需要的字段
  const allowedFields = [
    'accountAddress', 'accountBank', 'accountBankAddress', 'accountCode',
    'accountCompany', 'accountName', 'actualGrossProfit', 'bankCode',
    'beforehandPrice', 'benType', 'billOfLading', 'branchCode',
    'companyAddress', 'contractTitle', 'country', 'countryName',
    'creditCode', 'currencyType', 'customDeclarationForm', 'customerCompany',
    'customerId', 'customerName', 'customerSource', 'customsClearanceForm',
    'deliveryTime', 'deptId', 'deptName', 'domesticFreight', 'email',
    'estimatedGrossProfit', 'finallyPrice', 'finishedState', 'fullName',
    'internationalFreight', 'logisticsInsurance', 'mraId', 'nickName',
    'phoneNumber', 'priceValidity', 'realContract', 'receivingAccount',
    'remark', 'shipWay', 'swiftCode', 'totalPrice', 'tradingWay', 'products'
  ];

  // 过滤数据，只保留允许的字段
  const filteredData = {};
  allowedFields.forEach(field => {
    if (backOrderData.hasOwnProperty(field)) {
      filteredData[field] = backOrderData[field];
    }
  });

  return filteredData;
};

// 监听对话框显示状态，处理表单的初始化和重置
watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      // 对话框打开时，根据editData状态初始化表单
      if (props.editData) {
        formData.value = {
          ...props.editData,
        };
      } else {
        // 新增场景：先使用初始表单，再合并路由上的预填参数
        const base = getInitialFormData();
        try {
          const prefillParam = route.query?.prefill;
          if (prefillParam) {
            const prefill = JSON.parse(decodeURIComponent(String(prefillParam)) || '{}');
            formData.value = { ...base, ...prefill };
            // 合并完成后清除 URL 上的 prefill 参数，避免重复
            router.replace({
              path: route.path,
              query: { ...route.query, prefill: undefined }
            });
          } else {
            formData.value = base;
          }
        } catch (error) {
          // 解析失败时回退到基础初始值
          console.error('解析预填合同数据失败:', error);
          formData.value = base;
        }
      }
    } else {
      // 对话框关闭时，重置表单
      resetForm();
    }
  },
  { immediate: true } // 确保组件初始化时也会执行
);

// 客户列表
const customerList = ref([]);
// 获取客户列表
const getCustomer = async () => {
  try {
    const res = await getCustomerList();
    if (res.code === 200) {
      customerList.value = res.data || [];
    }
  } catch (error) {
    console.error("获取客户列表失败", error);
    ElMessage.error(error.response?.message || "获取客户列表失败");
  }
}


// 收款账户列表
const receivingAccountList = ref([]);
// 获取收款账户列表
const getReceivingAccount = async () => {
  try {
    const res = await getReceivingAccountList(formData.value.benType);
    if (res.code === 200) {
      receivingAccountList.value = res.data || [];
    }
  } catch (error) {
    console.error("获取收款账户列表失败", error);
    ElMessage.error(error.response?.message || "获取收款账户列表失败");
  }
}
onMounted(() => {
  // 获取收款账户列表
  getReceivingAccount();

  // 获取合同模板列表
  getContractTemplates();

  // 获取客户列表
  getCustomer()
});

// 保存为模板
async function handleSaveAsTemplate() {
  // 防止重复提交
  if (saveTemplateLoading.value) return;

  try {
    saveTemplateLoading.value = true;

    let templateTitle = '';
    let templateId = formData.value.templateId;

    // 如果已有模板ID，说明是更新现有模板
    if (templateId) {
      // 查找现有模板标题
      const existingTemplate = templateList.value.find(item => item.templateId === templateId);
      if (existingTemplate) {
        templateTitle = existingTemplate.templateTitle;
      } else {
        // 模板ID存在但找不到对应模板，可能是数据不一致，需要重新输入标题
        templateId = null;
      }
    }

    // 如果没有模板ID，需要输入新的模板标题
    if (!templateId) {
      const result = await ElMessageBox.prompt('请输入模板标题', '保存为模板', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: formData.value.contractTitle || '',
        inputValidator: (value) => {
          if (!value) {
            return '模板标题不能为空';
          }
          return true;
        }
      });

      templateTitle = result.value;
    }

    // 准备模板数据
    const templateData = {
      templateTitle: templateTitle,
      templateText: formData.value,
      templateId: templateId
    };

    // 调用保存模板接口
    const res = await saveAsTemplate(templateData);

    if (res.code === 200) {
      // 如果是新模板，更新模板ID
      if (!templateId && res.data) {
        formData.value.templateId = res.data;
      }
      // 刷新模板列表
      getContractTemplates();

      ElMessage.success(templateId ? '更新模板成功' : '保存模板成功');
    } else {
      ElMessage.error(res.msg || '保存模板失败');
    }
  } catch (error) {
    // 用户取消操作不提示错误
    if (error !== 'cancel') {
      console.error('保存模板失败', error);
      ElMessage.error('保存模板失败');
    }
  } finally {
    saveTemplateLoading.value = false;
  }
}

// 获取合同模板列表
const getContractTemplates = async () => {
  try {
    const res = await getTemplateList();
    if (res.code === 200) {
      templateList.value = res.data || [];
    }
  } catch (error) {
    console.error("获取合同模板列表失败", error);
    ElMessage.error(error.response?.message || "获取合同模板列表失败");
  }
};

// 处理模板选择
const handleTemplateChange = (templateId) => {
  if (!templateId) return;

  const selectedTemplate = templateList.value.find(item => item.templateId === templateId);
  if (!selectedTemplate) return;

  ElMessageBox.confirm('确定要使用该模板内容吗？当前表单数据将被替换', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 保留ID等关键字段
    const currentId = formData.value.contractId;
    const currentTemplateId = formData.value.templateId;
    const base = getInitialFormData();
    // 替换表单数据
    formData.value = {
      ...base,
      ...selectedTemplate.templateText,
      contractId: currentId,
      templateId: currentTemplateId,
    };

    ElMessage.success('已加载模板内容');
  }).catch(() => {
    // 用户取消，重置选择
    formData.value.templateId = null;
  });
};

const currencyPrefix = computed(() => {
  const dict = props.contractDicts?.currencyType?.find(item => item.value === formData.value.currencyType);
  return dict ? dict.label : '';
});

/**
 * 防抖提交函数
 * 使用lodash-es的debounce，延迟500ms，防止重复点击
 */
const handleSubmitDebounced = debounce(handleSubmit, 500, {
  leading: true,  // 第一次点击立即执行
  trailing: false // 后续点击在延迟期间内不执行
});

/**
 * 防抖保存为模板函数
 * 使用lodash-es的debounce，延迟500ms，防止重复点击
 */
const handleSaveAsTemplateDebounced = debounce(handleSaveAsTemplate, 500, {
  leading: true,  // 第一次点击立即执行
  trailing: false // 后续点击在延迟期间内不执行
});
</script>

<style scoped lang="scss">
.product-area {
  .add-btn {
    float: right;
    margin-bottom: 5px;
  }
}

// .el-table {
//   .el-form-item {
//     margin: 0 !important;

//     :deep(.el-form-item__error) {
//       position: absolute;
//       top: 50%;
//       left: 5px;
//       transform: translateY(-50%);
//     }
//   }
// }

.form-tip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
  font-size: 12px;
  color: #909399;

  .el-icon {
    font-size: 14px;
    color: #409eff;
  }
}
</style>