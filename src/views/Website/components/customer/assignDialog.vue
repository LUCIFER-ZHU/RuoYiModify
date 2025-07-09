<template>
  <el-dialog v-model="dialogVisible" title="分配页面" width="600px" :destroy-on-close="true" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="120px" :rules="rules">
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="选择部门" prop="groupId">
            <el-select v-model="selectedDept" clearable style="width: 100%" placeholder="请选择部门" @change="handleDeptChange">
              <el-option 
                v-for="item in deptList" 
                :key="item.deptId" 
                :label="item.deptName" 
                :value="item.deptId" 
              />
            </el-select> 
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="选择人员" prop="receiverId">
            <el-select v-model="selectedUser" clearable style="width: 100%" placeholder="请选择人员" @change="handleUserChange" :disabled="!selectedDept">
              <el-option 
                v-for="item in userList" 
                :key="item.userId" 
                :label="item.nickName" 
                :value="item.userId" 
              />
            </el-select> 
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="分配原因" prop="carReason">
            <el-input v-model="formData.carReason" placeholder="请输入分配原因" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>  
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          确认
        </el-button>
      </div>
    </template>    
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { handleAllocation } from '@/api/Website/customer';
import { getSysDeptList, getSysUserList } from '@/api/Website/system';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: null,
  },  
});

const emit = defineEmits(['update:visible', 'submit-success']);

// 表单
const formRef = ref(null);

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});

// 定义表单初始值生成函数
const getInitialFormData = () => ({
  customerId:'',
  // 组别
  groupId:'',
  groupName:'',
  // 受理人
  receiverId:'',
  receiver:'',
  // 分配原因
  carReason:''
});

// 表单数据
const formData = ref(getInitialFormData());

// 部门列表
const deptList = ref([]);
// 人员列表
const userList = ref([]);
// 选中的部门ID
const selectedDept = ref('');
// 选中的用户ID
const selectedUser = ref('');

// 表单验证规则
const rules = {
  groupId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  receiverId: [
    { required: true, message: '请选择人员', trigger: 'change' }
  ],
  carReason: [
    { required: true, message: '请输入分配原因', trigger: 'blur' }
  ]
};

// 监听编辑数据变化
watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      formData.value.customerId = newVal.customerId;
    } else {
      formData.value = getInitialFormData();
    }
  },
  { immediate: true }
);

// 监听对话框显示状态
watch(
  () => dialogVisible.value,
  (newVal) => {
    if (newVal) {
      // 对话框打开时，获取部门列表
      fetchDeptList();
    } else {
      // 对话框关闭时，重置选择
      selectedDept.value = '';
      selectedUser.value = '';
      userList.value = [];
    }
  }
);

// 获取部门列表
function fetchDeptList() {
  getSysDeptList().then(res => {
    if (res.code === 200 && res.data) {
      deptList.value = res.data;
    }
  });
}

// 获取人员列表
function fetchUserList(deptId) {
  if (!deptId) {
    userList.value = [];
    return;
  }
  
  getSysUserList({ deptId }).then(res => {
    if (res.code === 200 && res.data) {
      userList.value = res.data;
    }
  });
}

// 处理部门选择变化
function handleDeptChange(deptId) {
  if (deptId) {
    // 找到选中的部门
    const dept = deptList.value.find(item => item.deptId === deptId);
    if (dept) {
      // 更新表单数据
      formData.value.groupId = dept.deptId;
      formData.value.groupName = dept.deptName;
      formData.value.receiverId = '';
      formData.value.receiver = '';
      selectedUser.value = '';          
      // 获取该部门的人员列表
      fetchUserList(deptId);
    }
  } else {
    // 清空部门选择
    formData.value.groupId = '';
    formData.value.groupName = '';
    formData.value.receiverId = '';
    formData.value.receiver = '';
    selectedUser.value = '';
    userList.value = [];
  }
}

// 处理人员选择变化
function handleUserChange(userId) {
  if (userId) {
    // 找到选中的用户
    const user = userList.value.find(item => item.userId === userId);
    if (user) {
      // 更新表单数据
      formData.value.receiverId = user.userId;
      formData.value.receiver = user.nickName;
    }
  } else {
    // 清空人员选择
    formData.value.receiverId = '';
    formData.value.receiver = '';
  }
}

// 关闭
function handleClose() {
  formRef.value.resetFields();
  dialogVisible.value = false;
}

// 提交
function handleSubmit() {
  // 表单验证
  formRef.value.validate((valid) => {
    if (valid) {
      // 调用分配接口
      handleAllocation(formData.value).then(res => {
        if (res.code === 200) {
          emit('submit-success');
          dialogVisible.value = false;
        }
      });
    }
  });
}

// 组件挂载时获取部门列表
onMounted(() => {
  if (dialogVisible.value) {
    fetchDeptList();
  }
});
</script>

<style scoped>
</style>