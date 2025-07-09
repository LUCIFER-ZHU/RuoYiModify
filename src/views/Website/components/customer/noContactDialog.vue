<template>
  <el-dialog v-model="dialogVisible" title="未联系客户" width="80%" :destroy-on-close="true" @close="handleClose">
    <el-table v-loading="loading" :data="customerList" height="500">
      <el-table-column label="公司名称" align="center" prop="companyName" width="150" />
      <el-table-column label="联系人" align="center" prop="contactPerson" width="120" />
      <el-table-column label="贸易类型" align="center" prop="tradeType" width="100">
        <template #default="scope">
          <DictTagMn :options="customerDicts.tradeType" :value="scope.row.tradeType" />
        </template>
      </el-table-column>
      <el-table-column label="流转状态" align="center" prop="destination" width="100">
        <template #default="scope">
          <DictTagMn :options="customerDicts.destination" :value="scope.row.destination" />
        </template>
      </el-table-column>
      <el-table-column label="国家" align="center" prop="country" width="120">
        <template #default="scope">
          {{ getCountryName(scope.row.country) }}
        </template>
      </el-table-column>
      <el-table-column label="地区" align="center" prop="region" width="150">
        <template #default="scope">
          {{ getRegionName(scope.row.region) }}
        </template>
      </el-table-column>
      <el-table-column label="性别" align="center" prop="gender" width="80">
        <template #default="scope">
          <DictTagMn :options="customerDicts.gender" :value="scope.row.gender" />
        </template>
      </el-table-column>
      <el-table-column label="客户来源" align="center" prop="customerSource" width="100">
        <template #default="scope">
          <DictTagMn :options="customerDicts.customerSource" :value="scope.row.customerSource" />
        </template>
      </el-table-column>
      <el-table-column label="分配人" align="center" prop="assigner" width="100" />
      <el-table-column label="邮箱" align="center" prop="email" show-overflow-tooltip width="180" />
      <el-table-column label="联系电话" align="center" prop="phoneNumber" width="120" />
      <el-table-column label="客户状态" align="center" prop="customerState" width="100">
        <template #default="scope">
          <DictTagMn :options="customerDicts.customerState" :value="scope.row.customerState" />
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <el-button link type="primary" icon="User" @click="handleAssign(scope.row)">分配</el-button>
          <el-button link type="primary" icon="Service" @click="handleTrack(scope.row)">跟踪客户</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import { parseTime } from '@/utils/ruoyi';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  customerList: {
    type: Array,
    default: () => []
  },
  customerDicts: {
    type: Object,
    default: () => ({})
  },
  getCountryName: {
    type: Function,
    default: () => ''
  },
  getRegionName: {
    type: Function,
    default: () => ''
  }
});

const emit = defineEmits(['update:visible', 'assign', 'track']);

const loading = ref(false);

// 对话框显示状态
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit('update:visible', value);
  }
});

// 关闭对话框
function handleClose() {
  dialogVisible.value = false;
}

// 分配客户
function handleAssign(row) {
  emit('assign', row);
}

// 跟踪客户
function handleTrack(row) {
  emit('track', row);
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>