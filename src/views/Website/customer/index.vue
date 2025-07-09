<template>
  <div class="app-container">
    <!-- 客户分组 -->
    <el-row v-if="destinationTag === 1 || destinationTag === 2">
      <el-radio-group v-model="destinationRadio" @change="getList">
        <el-radio-button label="公司公海" :value="1" />
        <el-radio-button label="子公海" :value="2" />
      </el-radio-group>
    </el-row>
    <!-- 搜索区域 -->
    <el-card class="box-card">
      <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch" label-width="68px"
        @submit.prevent>
        <el-form-item label="公司名称" prop="companyName">
          <el-input v-model="queryParams.companyName" placeholder="请输入公司名称" @keyup.enter="handleQuery" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          <el-button icon="Refresh" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 未联系客户 -->
      <div class="no-contact mb8">
        <el-icon :style="{ color: 'rgb(255, 153, 0)' }"><Opportunity /></el-icon>
        未联系客户<el-tag type="warning">{{ noContactedCount }}</el-tag>个
        <el-button type="primary" @click="handleViewNoContact">查看</el-button>
      </div>
      <el-row :gutter="10" class="mb8" v-if="destinationTag === 0">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 表格数据 -->
    <el-card class="box-card">
      <el-table v-loading="loading" :data="customerList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="55" align="center" /> -->
        <el-table-column label="公司名称" align="center" prop="companyName" width="150" />
        <el-table-column label="贸易类型" align="center" prop="tradeType">
          <template #default="scope">
            <DictTagMn :options="customerDicts.tradeType" :value="scope.row.tradeType" />
          </template>
        </el-table-column>
        <el-table-column label="流转状态" align="center" prop="destination">
          <template #default="scope">
            <DictTagMn :options="customerDicts.destination" :value="scope.row.destination" />
          </template>
        </el-table-column>
        <el-table-column label="国家" align="center" prop="country" width="150">
          <template #default="scope">
            {{ getCountryName(scope.row.country) }}
          </template>
        </el-table-column>
        <el-table-column label="地区" align="center" prop="region" width="150">
          <template #default="scope">
            {{ getRegionName(scope.row.region) }}
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center" prop="contactPerson" />
        <el-table-column label="性别" align="center" prop="gender">
          <template #default="scope">
            <DictTagMn :options="customerDicts.gender" :value="scope.row.gender" />
          </template>
        </el-table-column>
        <el-table-column label="客户来源" align="center" prop="customerSource">
          <template #default="scope">
            <DictTagMn :options="customerDicts.customerSource" :value="scope.row.customerSource" />
          </template>
        </el-table-column>
        <el-table-column label="分配人" align="center" prop="assigner" />
        <el-table-column label="邮箱" align="center" prop="email" show-overflow-tooltip />
        <el-table-column label="联系电话" align="center" prop="phoneNumber" />
        <el-table-column label="客户状态" align="center" prop="customerState">
          <template #default="scope">
            <span>{{ scope.row.customerState }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template #default="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" fixed="right" width="280">
          <template #default="scope">
            <!-- <el-button link type="primary" icon="View" @click="handleDetail(scope.row)">详情</el-button> -->
            <el-button link type="primary" icon="User" @click="handleAssign(scope.row)">分配</el-button>
            <template v-if="destinationTag === 0">
              <el-button link type="primary" icon="Service" @click="handleTrack(scope.row)">跟踪客户</el-button>
              <el-button link type="primary" icon="Position" @click="handleMoveToPublic(scope.row)">移入公海</el-button>
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
            </template>
            <template v-if="destinationTag === 1 || destinationTag === 2">
              <el-button link type="primary" icon="Position" @click="handleMoveToPrivate(scope.row)">移入私海</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>

    <!-- 详情弹窗 -->
    <DetailDialog v-model="detailOpen" :data="detailData" :customer-dicts="customerDicts"
      :getCountryName="getCountryName" :getRegionName="getRegionName" />

    <!-- 新增编辑弹窗 -->
    <FormDialog v-model:visible="formOpen" :edit-data="formData" :customer-dicts="customerDicts"
      :trade-type-tag="tradeTypeTag" :destination-tag="destinationTag" @submit-success="handleSubmit" />

    <!-- 分配弹窗 -->
    <AssignDialog v-model:visible="assignOpen" :data="assignFormData" @submit-success="handleSubmit" />

    <!-- 追踪弹窗-->
    <TrackDialog v-model:visible="trackOpen" :data="trackFormData" :customer-dicts="customerDicts" @submit-success="handleSubmit" />
    
    <!-- 未联系客户弹窗 -->
    <NoContactDialog 
      v-model:visible="noContactOpen" 
      :customer-list="noContactedList" 
      :customer-dicts="customerDicts"
      :get-country-name="getCountryName"
      :get-region-name="getRegionName"
      @assign="handleAssign"
      @track="handleTrack" />
  </div>
</template>

<script setup name="Customer">
import { listCustomer, getCustomer, delCustomer, moveToPrivate, moveToPublic, getNoContacted } from "@/api/Website/customer";
import DetailDialog from "@/views/Website/components/customer/detailDialog.vue";
import FormDialog from "@/views/Website/components/customer/formDialog.vue";
import AssignDialog from "@/views/Website/components/customer/assignDialog.vue";
import TrackDialog from "@/views/Website/components/customer/trackDialog.vue";
import NoContactDialog from "@/views/Website/components/customer/noContactDialog.vue";
import { useDictMn, clearDictMnCache } from "@/utils/dictMn";
import { computed, reactive, onMounted, watchEffect } from "vue";
const route = useRoute();
const { proxy } = getCurrentInstance();

const customerList = ref([]);
const detailOpen = ref(false);
const formOpen = ref(false);
const assignOpen = ref(false);
const trackOpen = ref(false);
const noContactOpen = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const detailData = ref({});
const formData = ref({});
const assignFormData = ref({});
const trackFormData = ref({});
const destinationRadio = ref(1);

const dictData = useDictMn('country', 'cnRegions', 'gender', 'customer_source', 'trade_type', 'destination', 'customer_group', 'customer_type', 'customer_state', 'social_platform', 'purchase_cycle', 'currency_type');

const customerDicts = ref({});
// 在组件挂载后初始化字典
onMounted(() => {
  console.log('customerDictData', dictData);
  // 监听字典数据变化并更新本地引用
  watchEffect(() => {
    // 字典数据
    customerDicts.value = {
      country: dictData.country.value,
      cnRegions: dictData.cnRegions.value,
      gender: dictData.gender.value,
      customerSource: dictData.customer_source.value,
      tradeType: dictData.trade_type.value,
      destination: dictData.destination.value,
      customerGroup: dictData.customer_group.value,
      customerType: dictData.customer_type.value,
      customerState: dictData.customer_state.value,
      socialPlatform: dictData.social_platform.value,
      purchaseCycle: dictData.purchase_cycle.value,
      currencyType: dictData.currency_type.value,
    };
  });
});

// 判断贸易类型(0-外贸,1-内贸)
const tradeTypeTag = computed(() => {
  let tempTag = '';
  if (route.path.includes('foreignCustomer')) {
    tempTag = 0;
  } else if (route.path.includes('domesticCustomer')) {
    tempTag = 1;
  }
  return tempTag;
})

// 判断目的地(0-私海,1-公司公海,2-子公海)
const destinationTag = computed(() => {
  if (route.path.includes('foreignHighSea') || route.path.includes('domesticHighSea')) {
    return destinationRadio.value; // 直接返回响应式值（1或2）
  } else if (route.path.includes('domesticCustomer')) {
    return 0;
  }
  return 0;
})

const data = reactive({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    companyName: null,
    tradeType: tradeTypeTag.value,
    destination: destinationTag.value,
  }
});

const { queryParams } = toRefs(data);


/** 查询客户列表 */
function getList() {
  loading.value = true;
  // 在发起请求前更新 destination
  queryParams.value.destination = destinationTag.value;
  listCustomer(queryParams.value).then(response => {
    if (response.code === 200) {
      customerList.value = response.rows;
      total.value = response.total;
    }
    loading.value = false;
  });
}

/** 搜索按钮操作 */
function handleQuery() {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
function resetQuery() {
  proxy.resetForm("queryRef");
  handleQuery();
}

/** 多选框选中数据 */
function handleSelectionChange(selection) {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
function handleAdd() {
  formData.value = null;
  formOpen.value = true;
}

/** 详情按钮操作 */
function handleDetail(row) {
  const customerId = row.id;
  getCustomer(customerId).then(response => {
    if (response.success) {
      detailData.value = response.data;
      detailOpen.value = true;
    }
  });
}

/** 修改按钮操作 */
function handleUpdate(row) {
  const id = row.id;
  getCustomer(id).then(response => {
    if (response.success) {
      formData.value = response.data;
      formOpen.value = true;
    }
  });
}

/** 分配按钮操作 */
function handleAssign(row) {
  assignFormData.value = row;
  assignOpen.value = true;
}

/** 移入公海按钮操作 */
async function handleMoveToPublic(row) {
  const customerId = row.customerId;
  await moveToPublic({customerId});
  getList();
}

/** 移入私海按钮操作 */
async function handleMoveToPrivate(row) {
  const customerId = row.customerId;
  await moveToPrivate({customerId});
  getList()
}

/** 追踪客户 */
const handleTrack = (async (row) => {
  const id = row.id;
  getCustomer(id).then(response => {
    if (response.success) {
      trackFormData.value = response.data;
      trackOpen.value = true;
    }
  });  
  // trackOpen.value = true;
})

/** 提交按钮 */
function handleSubmit() {
  getList();
}

/** 查看未联系客户 */
function handleViewNoContact() {
  noContactOpen.value = true;
}

/** 删除按钮操作 */
function handleDelete(row) {
  const customerIds = row.id || ids.value;
  proxy.$modal.confirm('是否确认删除客户编号为"' + customerIds + '"的数据项？').then(function () {
    return delCustomer(customerIds);
  }).then(() => {
    getList();
    proxy.$modal.msgSuccess("删除成功");
  }).catch(() => { });
}

function getCountryName(countryId) {
  if (!countryId || !customerDicts.value?.country) {
    return '';
  }
  const country = customerDicts.value.country.find(item => item.id === countryId);
  return country ? country.chineseName : '';
}

function getRegionName(regionCode) {
  if (!regionCode || !customerDicts.value?.cnRegions) {
    return '';
  }
  // 遍历第一层（省/直辖市）
  for (const province of customerDicts.value.cnRegions) {
    // 检查是否有子级（第二层）
    if (province.children && Array.isArray(province.children)) {
      // 遍历第二层（市/区）
      for (const city of province.children) {
        if (city.regionCode === regionCode) {
          // 找到匹配的regionCode，返回"省-市"格式
          return `${province.label}-${city.label}`;
        }
      }
    }
  }

  return ''; // 未找到匹配的regionCode
}

getList();


// 获取未联系客户
const noContactedCount = ref(0);
const noContactedList = ref([]);
getNoContacted().then(res => {
  if (res.code === 200) {
    console.log(res);
    noContactedCount.value = res.data.count;
    noContactedList.value = res.data.filteredData;
  }
});
</script>

<style lang="scss" scoped>
  .no-contact{
    display: flex;
    align-items: center;
    .el-button{
      margin-left: 10px;
    }
  }
</style>