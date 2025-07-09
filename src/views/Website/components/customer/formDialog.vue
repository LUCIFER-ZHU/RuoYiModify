<template>
  <el-dialog :title="dialogTitle" v-model="dialogVisible" width="1200px" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="公司名称" prop="companyName">
            <el-input v-model="formData.companyName" placeholder="请输入公司名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国家" prop="country">
            <el-select v-model="formData.country" filterable :filter-method="filterCountry">
              <el-option v-for="(item, index) in UICountrys" :key="index" :label="item.chineseName" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="formData.country === 36">
          <el-form-item label="地区" prop="region">
            <el-cascader class="cascader-region" v-model="formData.region" :options="customerDicts?.cnRegions || []"
              :props="{ value: 'regionCode' }" clearable style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系人" prop="contactPerson">
            <el-input v-model="formData.contactPerson" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="贸易类型" prop="tradeType">
            <el-select v-model="formData.tradeType" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.tradeType || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="流转状态" prop="destination">
            <el-select v-model="formData.destination" disabled clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.destination || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户分组" prop="customerGroup">
            <el-select v-model="formData.customerGroup" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.customerGroup || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户来源" prop="customerSource">
            <el-select v-model="formData.customerSource" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.customerSource || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户类型" prop="customerType">
            <el-select v-model="formData.customerType" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.customerType || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户状态" prop="customerState">
            <el-select v-model="formData.customerState" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.customerState || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="gender">
            <el-select v-model="formData.gender" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.gender || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>        
        <el-col :span="8">
          <el-form-item label="tm" prop="tm">
            <el-input v-model="formData.tm" placeholder="请输入TM" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="国际电话区号" prop="countryCode">
            <el-select v-model="formData.countryCode" filterable :filter-method="filterCountryCode" placeholder="请选择">
              <el-option v-for="(item, index) in UICountryCodes" :key="index" :label="item.countryCode"
                :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="phoneNumber">
            <el-input v-model="formData.phoneNumber" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司地址" prop="companyAddress">
            <el-input v-model="formData.companyAddress" placeholder="请输入公司地址" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="社交平台" prop="socialPlatform">
            <el-select v-model="formData.socialPlatform" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.socialPlatform || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="社交平台账号" prop="spAccount">
            <el-input v-model="formData.spAccount" placeholder="请输入社交平台账号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户背调" prop="backgroundCheck">
            <el-input v-model="formData.backgroundCheck" placeholder="请输入客户背调" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="意向产品" prop="intentionProduct">
            <el-input v-model="formData.intentionProduct" placeholder="请输入意向产品" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="客户星级" prop="customerStars">
            <el-rate v-model="formData.customerStars" :show-text="false" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="币种" prop="currencyType">
            <el-select v-model="formData.currencyType" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.currencyType || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="意向采购金额" prop="purchaseAmount">
            <el-input-number v-model="formData.purchaseAmount" placeholder="请输入意向采购金额" style="width: 100%" :min="0" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购周期" prop="purchaseCycle">
            <el-select v-model="formData.purchaseCycle" clearable style="width: 100%">
              <el-option v-for="dict in (customerDicts?.purchaseCycle || [])" :key="dict.value" :label="dict.label"
                :value="dict.value" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="150" label="距离进入子公海日期" prop="toGroupSea">
            <el-date-picker v-model="formData.toGroupSea" type="date" placeholder="请选择日期" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分配人" prop="assignerId">
            <el-select v-model="formData.assignerId" clearable style="width: 100%">
              <el-option v-for="item in assignerList" :key="item.userId" :label="item.nickName" :value="item.userId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="分配凭证" prop="assignerImages">
            <ImageUploadGrid v-model="formData.assignerImages" action="/ossUpload/upload"
              :fileType="['png', 'jpg', 'jpeg']" :isShowTip="false"
              baseUrl="https://minnuo-test.oss-cn-qingdao.aliyuncs.com/">
            </ImageUploadGrid>
          </el-form-item>
        </el-col>        
        <el-col :span="24">
          <el-form-item label="意向产品图片" prop="ipImages">
            <ImageUploadGrid v-model="formData.ipImages" action="/ossUpload/upload" :fileType="['png', 'jpg', 'jpeg']"
              :isShowTip="false" baseUrl="https://minnuo-test.oss-cn-qingdao.aliyuncs.com/">
            </ImageUploadGrid>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="formData.remark" type="textarea" placeholder="请输入备注" :rows="3" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { addCustomer, updateCustomer, getAssignerList } from "@/api/Website/customer";
import { computed, getCurrentInstance, reactive, ref, watch, onMounted } from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  editData: {
    type: Object,
    default: null,
  },
  customerDicts: {
    type: Object,
    required: true
  },
  tradeTypeTag: {
    type: [Number, String],
    default: 0
  },
  destinationTag: {
    type: [Number, String],
    default: 0
  }
});

const emit = defineEmits(["update:visible", "submit-success"]);
const proxy = getCurrentInstance();

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

// 计算对话框标题
const dialogTitle = computed(() => {
  return props.editData ? "修改客户信息" : "新建客户信息";
});

// 国家列表
let UICountrys = ref(null);

// 过滤国家
const filterCountry = (query) => {
  const countryData = props.customerDicts?.country;
  if (query) {
    UICountrys.value = countryData?.filter((item) => {
      return item.chineseName.toLowerCase().includes(query.toLowerCase())
    })

  } else {
    UICountrys.value = countryData;
  }
};

// 国家区号列表
let UICountryCodes = ref(null);

// 过滤国家区号
const filterCountryCode = (query) => {
  const countryData = props.customerDicts?.country;
  if (query) {
    UICountryCodes.value = countryData?.filter((item) =>
      item.countryCode.toLowerCase().includes(query.toLowerCase())
    )
  } else {
    UICountryCodes.value = countryData;
  }
};


// 在组件挂载后初始化字典
onMounted(() => {
  // 监听字典数据变化并更新本地引用
  watchEffect(() => {
    // 字典数据
    UICountryCodes.value = props.customerDicts?.country;
    UICountrys.value = props.customerDicts?.country;
  });
});

// 定义表单初始值生成函数
const getInitialFormData = () => ({
  customerId: '',
  companyName: '',
  country: '',
  region: '',
  contactPerson: '',
  gender: 0,
  customerSource: 0,
  tm: '',
  email: '',
  countryCode: '',
  phoneNumber: '',
  companyAddress: '',
  socialPlatform: 0,
  spAccount: '',
  backgroundCheck: '',
  customerType: 0,
  intentionProduct: '',
  customerStars: '',
  currencyType: 0,
  purchaseAmount: 0,
  destination: 0,
  customerGroup: 0,
  customerState: 0,
  purchaseCycle: 0,
  toGroupSea: '',
  tradeType: 0,
  remark: '',
  ipImages: '',
  assignerId: '',
  assignerImages: '',
});

// 表单数据
const formData = ref(getInitialFormData());

// 分配人列表
const assignerList = ref([]);

// 表单校验
const rules = {
  companyName: [
    { required: true, message: '请输入公司名称', trigger: 'blur' }
  ],
  country: [
    { required: true, message: '请输入国家', trigger: 'blur' }
  ],
  contactPerson: [
    { required: true, message: '请输入联系人', trigger: 'blur' }
  ],
  customerSource: [
    { required: true, message: '请输入客户来源', trigger: 'blur' }
  ],
  customerType: [
    { required: true, message: '请输入客户类型', trigger: 'blur' }
  ],
  destination: [
    { required: true, message: '请输入客户分组', trigger: 'blur' }
  ],
  customerState: [
    { required: true, message: '请输入客户状态', trigger: 'blur' }
  ],
  tradeType: [
    { required: true, message: '请输入贸易类型', trigger: 'blur' }
  ],

};

// 监听编辑数据变化
watch(
  () => props.editData,
  (newVal) => {
    if (newVal) {
      formData.value = {
        ...newVal,
      };
    } else {
      formData.value = getInitialFormData();
      // 新增时设置计算属性的值
      formData.value.tradeType = props.tradeTypeTag;
      formData.value.destination = props.destinationTag;
    }
  },
  { immediate: true }
);

// 监听计算属性变化，更新表单数据
watch(
  [() => props.tradeTypeTag, () => props.destinationTag],
  ([newTradeType, newdestination]) => {
    if (!props.editData) {
      // 只在新增模式下更新
      formData.value.tradeType = newTradeType;
      formData.value.destination = newdestination;
    }
  }
);


// 关闭对话框
const handleClose = () => {
  formRef.value.resetFields();
  dialogVisible.value = false;
};

// 转换后台所需数据
const revertData = (formData) => {
  const tempFormData = { ...formData }
  if (formData.region?.length > 0) {
    tempFormData.region = formData.region[1];
  } else if (formData.region === undefined) {
    tempFormData.region = '';
  }
  return tempFormData
};

// 提交表单
const handleSubmit = async () => {
  try {
    await formRef.value.validate();
    if (props.editData) {
      // 编辑操作
      const tempData = revertData(formData.value);
      await updateCustomer(tempData);
      ElMessage.success("修改成功");
    } else {
      // 新增操作
      const tempData = revertData(formData.value);
      await addCustomer(tempData);
      ElMessage.success("新增成功");
    }

    emit("submit-success");
    dialogVisible.value = false;
  } catch (error) {
    console.error("操作失败", error);
    ElMessage.error(error.response?.message || "操作失败");
  }
};


// 获取分配人列表
const getAssigner = async () => {
  try {
    const res = await getAssignerList();
    if (res.code === 200) {
      assignerList.value = res.data || [];
    }
  } catch (error) {
    console.error("获取分配人列表失败", error);
    ElMessage.error(error.response?.message || "获取分配人列表失败");
  }
};

getAssigner();

</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>