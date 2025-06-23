<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="900px" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="100px" :rule="rules">
      <el-divider content-position="left">基本信息</el-divider>
      <el-row>
        <el-col :span="12">
          <el-form-item label="供应商名称" prop="supplierName" :rules="rules.supplierName">
            <el-input v-model="formData.supplierName" placeholder="请输入供应商名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对接人" prop="approver" :rules="rules.approver">
            <el-input v-model="formData.approver" placeholder="请输入对接人姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="国家" prop="country" :rules="rules.country">
            <el-select v-model="formData.country" filterable :filter-method="filterCountry">
              <el-option v-for="(item, index) in UICountrys" :key="index" :label="item.chineseName"
                :value="item.chineseName" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="formData.country === '中国'">
          <el-form-item label="地区" prop="region">
            <el-cascader class="cascader-region" v-model="formData.region" :options="formDicts.cnRegions" clearable />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="详细地址" prop="address" :rules="rules.address">
            <el-input v-model="formData.address" placeholder="请输入详细地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商类型" prop="supplierType" :rules="rules.supplierType">
            <el-select v-model="formData.supplierType">
              <el-option v-for="(item, index) in supplierDicts.supplierTypeList" :key="index" :label="item"
                :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主营业务" prop="mainBusiness" :rules="rules.mainBusiness">
            <el-input v-model="formData.mainBusiness" placeholder="请输入主营业务" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="业务区域" prop="businessRegion" :rules="rules.businessRegion">
            <el-input v-model="formData.businessRegion" placeholder="请输入业务区域" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商模式" prop="supplierModel">
            <el-select v-model="formData.supplierModel">
              <el-option v-for="(item, index) in filteredSupplierModelList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否签订协议" prop="agreementSigned">
            <el-select v-model="formData.agreementSigned">
              <el-option v-for="(item, index) in supplierDicts.agreementSignedList" :key="index" :label="item"
                :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="供应商来源" prop="source">
            <el-select v-model="formData.source">
              <el-option v-for="(item, index) in supplierDicts.sourceList" :key="index" :label="item" :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="交易币种" prop="currencyType">
            <el-select v-model="formData.currencyType">
              <el-option v-for="(item, index) in formDicts.currency" :key="index" :label="item.englishName"
                :value="index" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="级别" prop="level">
            <el-select v-model="formData.level">
              <el-option label="A" value="A" />
              <el-option label="B" value="B" />
              <el-option label="C" value="C" />
              <el-option label="D" value="D" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="公司网址" prop="companyWeb">
            <el-input v-model="formData.companyWeb" placeholder="请输入公司网址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注信息" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left" class="divider">联系人信息</el-divider>
      <div class="contact-area">
        <div class="add-btn">
          <el-button type="primary" size="small" @click="addTableRow('contacts')">添加联系人</el-button>
        </div>
        <el-table :data="formData.contacts" border style="width: 100%">
          <!-- 操作列：添加行按钮 -->
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button type="danger" size="small" @click="deleteTableRow('contacts', scope.$index)"
                v-if="formData.contacts.length > 0">删除</el-button>
            </template>
          </el-table-column>
          <!-- 表格列定义 -->
          <el-table-column prop="supContactName" label="联系人姓名">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`contacts[${scope.$index}].supContactName`"
                :rules="rules.contacts[0].defaultField.supContactName">
                <el-input v-model="scope.row.supContactName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="telephone" label="联系电话">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`contacts[${scope.$index}].telephone`"
                :rules="rules.contacts[0].defaultField.telephone">
                <el-input v-model="scope.row.telephone"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="position" label="职位">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`contacts[${scope.$index}].position`">
                <el-input v-model="scope.row.position"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`contacts[${scope.$index}].remark`">
                <el-input v-model="scope.row.remark"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider content-position="left" class="divider">账户信息</el-divider>
      <div class="accounts-area">
        <div class="add-btn">
          <el-button type="primary" size="small" @click="addTableRow('accounts')">添加账户</el-button>
        </div>
        <el-table :data="formData.accounts" border style="width: 100%">
          <!-- 操作列：添加行按钮 -->
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="deleteTableRow('accounts', scope.$index)"
                v-if="formData.accounts.length > 0">删除</el-button>
            </template>
          </el-table-column>
          <!-- 表格列定义 -->
          <el-table-column prop="supAccountName" label="收款单位">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`accounts[${scope.$index}].supAccountName`"
                :rules="rules.accounts[0].defaultField.supAccountName">
                <el-input v-model="scope.row.supAccountName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="supAccountCode" label="收款账号">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`accounts[${scope.$index}].supAccountCode`"
                :rules="rules.accounts[0].defaultField.supAccountCode">
                <el-input v-model="scope.row.supAccountCode"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="bankName" label="开户行">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`accounts[${scope.$index}].bankName`"
                :rules="rules.accounts[0].defaultField.bankName">
                <el-input v-model="scope.row.bankName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="bankAddress" label="开户地址">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`accounts[${scope.$index}].bankAddress`"
                :rules="rules.accounts[0].defaultField.bankAddress">
                <el-input v-model="scope.row.bankAddress"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`accounts[${scope.$index}].remark`">
                <el-input v-model="scope.row.remark"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-divider content-position="left" class="divider">产品信息</el-divider>
      <div class="product-area">
        <div class="add-btn">
          <el-button type="primary" size="small" @click="addTableRow('products')">添加产品</el-button>
        </div>
        <el-table :data="formData.products" border style="width: 100%">
          <!-- 操作列：添加行按钮 -->
          <el-table-column fixed="right" label="操作" width="120">
            <template #default="scope">
              <el-button type="danger" size="small" @click="deleteTableRow('products', scope.$index)"
                v-if="formData.products.length > 0">删除</el-button>
            </template>
          </el-table-column>
          <!-- 表格列定义 -->
          <el-table-column prop="supplierName" label="产品名称">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].supplierName`"
                :rules="rules.products[0].defaultField.supplierName">
                <el-input v-model="scope.row.supplierName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="supProductName" label="商品名称">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].supProductName`"
                :rules="rules.products[0].defaultField.supProductName">
                <el-input v-model="scope.row.supProductName"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="specification" label="规格">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].specification`">
                <el-input v-model="scope.row.specification"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unit" label="单位">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].unit`">
                <el-input v-model="scope.row.unit"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="texture" label="材质">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].texture`">
                <el-input v-model="scope.row.texture"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="minNum" label="最小起订量">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].minNum`">
                <el-input v-model="scope.row.minNum"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="image" label="图片" width="200">
            <template #default="scope">
              <el-form-item label-width="0" :prop="`products[${scope.$index}].image`">
                <ImageUploadGrid v-model="scope.row.image" action="/ossUpload/upload" :fileType="['png', 'jpg', 'jpeg']"
                  :limit="1" :isShowTip="false" baseUrl="https://minnuo-test.oss-cn-qingdao.aliyuncs.com/">
                </ImageUploadGrid>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">返回</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </span>
    </template>
  </el-dialog>
</template>


<script setup>
import { ElMessage } from "element-plus";
import { addSupplier, editSupplier } from "@/api/Website/supplier";
import { getCurrencyDict, getCountryDict, getCNRegionsDict } from "@/api/Website/dict";
import { computed, getCurrentInstance, reactive, ref, watch } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  editData: {
    type: Object,
    default: null,
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

const emit = defineEmits(["update:visible", "submit"]);
const proxy = getCurrentInstance()

// 表单
const formRef = ref(null);

// 表单数据
const formData = ref({
  supplierId: "",
  supplierName: "",
  source: 0,
  currencyType: 0,
  level: "",
  status: 0,
  approver: "",
  country: "",
  region: "",
  address: "",
  companyWeb: "",
  remark: "",
  supplierType: props.supplierTag === 'products' ? 0 : 1,
  // 账户
  accounts: [],
  // 联系人
  contacts: [],
  // 产品
  products: [],
});

if (props.supplierTag === 'logistics') {
  Object.assign(formData.value, {
    supplierModel: 0,
    mainBusiness: "",
    businessRegion: "",
    agreementSigned: 0
  })
}

// 表单所用字典
const formDicts = ref({
  currency: [],
  country: [],
  cnRegions: [],
})

// 国家列表
const UICountrys = ref([]);

// 监听编辑数据变化
watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      formData.value = {
        ...newVal,
      };
      // 回显 特殊处理
      if ((newVal.region)) {
        formData.value.region = newVal.region.split('-');
      }
    } else {
      formData.value = {
        supplierId: "",
        supplierName: "",
        source: 0,
        currencyType: 0,
        level: "",
        status: 0,
        approver: '',
        country: "",
        region: "",
        address: "",
        companyWeb: "",
        remark: "",
        supplierType: props.supplierTag === 'products' ? 0 : 1,
        // 账户
        accounts: [],
        // 联系人
        contacts: [],
        // 产品
        products: [],
      };
      if (props.supplierTag === 'logistics') {
        Object.assign(formData.value, {
          supplierModel: 0,
          mainBusiness: "",
          businessRegion: "",
          agreementSigned: 0
        })
      }
    }
  },
  { immediate: true }
);

// 表单校验规则
const rules = reactive({
  supplierName: { required: true, message: '必填项', trigger: 'blur' },
  supplierType: { required: true, message: '必填项', trigger: 'blur' },
  mainBusiness: { required: true, message: '必填项', trigger: 'blur' },
  approver: { required: true, message: '必填项', trigger: 'blur' },
  country: { required: true, message: '必填项', trigger: 'blur' },
  address: { required: true, message: '必填项', trigger: 'blur' },
  accounts: [
    {
      type: 'array',
      defaultField: {
        supAccountName: [{ required: true, message: '必填项', trigger: 'blur' }],
        supAccountCode: [{ required: true, message: '必填项', trigger: 'blur' }],
        bankName: [{ required: true, message: '必填项', trigger: 'blur' }],
        bankAddress: [{ required: true, message: '必填项', trigger: 'blur' }],
      }
    }
  ],
  contacts: [
    {
      type: 'array',
      defaultField: {
        supContactName: [{ required: true, message: '必填项', trigger: 'blur' }],
        telephone: [{ required: true, message: '必填项', trigger: 'blur' }],
      }
    }
  ],
  products: [
    {
      type: 'array',
      defaultField: {
        supplierName: [{ required: true, message: '必填项', trigger: 'blur' }],
        supProductName: [{ required: true, message: '必填项', trigger: 'blur' }],
      }
    }
  ]
})

// 计算对话框标题
const dialogTitle = computed(() => {
  return props.editData ? "修改供应商信息" : "新建供应商信息";
});

// 过滤后的供应商模式列表
const filteredSupplierModelList = computed(() => {
  // 根据条件变量动态返回不同范围的数组
  if (props.supplierTag === 'products') {
    return props.supplierDicts.supplierModelList.slice(0, 2); // 前两项
  } else if (props.supplierTag === 'logistics') {
    return props.supplierDicts.supplierModelList.slice(2, 3); // 第三项
  }
  return []; // 默认返回空  
})

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});

// 过滤国家
const filterCountry = (query) => {
  if (query) {
    UICountrys.value = formDicts.value.country.filter((item) =>
      item.chineseName.toLowerCase().includes(query.toLowerCase())
    )
  } else {
    UICountrys.value = formDicts.value.country;
  }
}

onMounted(() => {
  getCurrencyDict().then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取交易货币列表字典失败");
      return;
    }
    formDicts.value.currency = response.data
  });

  getCountryDict().then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取国家列表字典失败");
      return;
    }
    formDicts.value.country = response.data
    UICountrys.value = response.data
  });

  getCNRegionsDict().then(response => {
    if (response.code !== 200) {
      proxy.$modal.msgError("获取地区列表字典失败");
      return;
    }
    formDicts.value.cnRegions = response.data.map(item => {
      const children = item.children.map(it => {
        return { label: it.regionName, value: it.regionName, children: [] }
      });
      return { label: item.regionName, value: item.regionName, children: children }
    })
  });
})

// 关闭对话框
const handleClose = () => {
  formRef.value.resetFields();
};

// 转换后台所需数据
const revertData = (formData) => {
  const tempFormData = { ...formData }
  if (formData.region?.length > 0) {
    tempFormData.region = formData.region.join('-');
  } else if (formData.region === undefined) {
    tempFormData.region = '';
  }
  return tempFormData
}

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    if (props.editData) {
      // 编辑操作
      const tempData = revertData(formData.value);
      await editSupplier(tempData);
      ElMessage.success("修改成功");
    } else {
      // 新增操作
      const tempData = revertData(formData.value);
      await addSupplier(tempData);
      ElMessage.success("新增成功");
    }

    emit("submit-success");
    dialogVisible.value = false;
  } catch (error) {
    console.error("操作失败", error);
    ElMessage.error(error.response?.data?.message || "操作失败");
  }
};

// 新建行
const addTableRow = (key) => {
  // formData.value[key].push({});
  switch (key) {
    case 'contacts':
      formData.value[key].push({ supplierId: '', supContactId: '', id: '' });
      break;
    case 'accounts':
      formData.value[key].push({ supplierId: '', supAccountId: '', id: '' });
      break;
    case 'products':
      formData.value[key].push({ supplierId: '', supProductId: '', id: '' });
      break;
  }

}

// 删除行
const deleteTableRow = (key, index) => {
  formData.value[key].splice(index, 1);
}

</script>

<style scoped lang="scss">
.product-area,
.contact-area,
.accounts-area {
  margin-bottom: 10px;

  .add-btn {
    float: right;
    margin-bottom: 5px;
  }
}

.el-table {
  .el-form-item {
    margin: 0 !important;

    ::v-deep .el-form-item__error {
      position: absolute;
      top: 50%;
      left: 5px;
      transform: translateY(-50%);
    }
  }
}

:deep(.cascader-region) {
  width: 100%;
}
</style>