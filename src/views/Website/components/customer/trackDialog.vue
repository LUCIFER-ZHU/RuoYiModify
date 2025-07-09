<template>
  <el-dialog v-model="dialogVisible" title="追踪页面" width="1200px" :destroy-on-close="true" @close="handleClose">
    <div class="track-dialog">
      <!-- 客户基本信息区域 -->
      <div class="customer-info-section">
        <el-row :gutter="20" class="top-info">
          <el-col :span="24" class="contact-person">
            <span class="label">联系人名称：</span>
            <span class="value">{{ formData.contactPerson }}</span>
          </el-col>
          <el-col :span="8" class="info-item">
            <span class="label">客户状态：</span>
            <DictTagMn :options="customerDicts.customerState" :value="formData.customerState" />
          </el-col>
          <el-col :span="8" class="info-item">
            <span class="label">客户分组：</span>
            <DictTagMn :options="customerDicts.customerGroup" :value="formData.customerGroup" />
          </el-col>
          <el-col :span="8" class="info-item">
            <span class="label">客户星级：</span>
            <el-rate v-model="formData.customerStars" :show-text="false" disabled/>
          </el-col>
        </el-row>
      </div>

      <!-- 编辑区域 -->
      <div class="edit-section">
        <el-row :gutter="24" class="center-rich-text">
          <el-col :span="12">
            <div class="section-card">
              <div class="section-title">客户跟踪</div>
              <div class="rich-text-container">
                <RichTextMn v-model="formData.customerTrack" />
              </div>
              <div class="btns">
                <el-button type="primary" size="small" @click="handleSave(0)" :disabled="isCustomerTrackEdit">保存草稿</el-button>
                <el-button type="success" size="small" @click="handleAdd(0)" :disabled="isCustomerTrackEdit">添加一条</el-button>
                <el-button type="warning" size="small" @click="handleClean(0)">清空此条</el-button>
                <el-button type="info" size="small" @click="handleFinishEdit(0)" v-show="isCustomerTrackEdit">编辑完成</el-button>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="section-card">
              <div class="section-title">供应商报价</div>
              <div class="rich-text-container">
                <RichTextMn v-model="formData.supplierQt" />
              </div>
              <div class="btns">
                <el-button type="primary" size="small" @click="handleSave(1)" :disabled="isSupplierQtEdit">保存草稿</el-button>
                <el-button type="success" size="small" @click="handleAdd(1)" :disabled="isSupplierQtEdit">添加一条</el-button>
                <el-button type="warning" size="small" @click="handleClean(1)">清空此条</el-button>
                <el-button type="info" size="small" @click="handleFinishEdit(1)" v-show="isSupplierQtEdit">编辑完成</el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>

      <!-- 动态列表区域 -->
      <div class="list-section">
        <el-row :gutter="24" class="bottom-list">
          <el-col :span="12">
            <div class="list-card">
              <div class="tip-message warning">
                温馨提示：客户跟踪记录必须大于三次，少一次扣50元
              </div>
              <div class="list-title">客户跟踪动态</div>
              <div class="list-content">
                <div class="placeholder" v-if="formData.customerTrackList.length === 0">暂无跟踪记录</div>
                <div class="list-item" v-else v-for="(item, index) in formData.customerTrackList" :key="index">
                  <div class="item-top">
                    <div class="des">{{ item.createBy }} 在 {{ parseTime(item.createTime) }} 创建了一条跟进</div>
                    <el-button type="primary" size="small" @click="handleEdit(item, 0)">编辑</el-button>
                  </div>
                  <div class="item-content" v-html="item.content"></div>
                  <el-divider />
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="list-card">
              <div class="tip-message info">
                温馨提示：需至少三个供应商报价
              </div>
              <div class="list-title">供应商报价动态</div>
              <div class="list-content">
                <div class="placeholder" v-if="formData.supplierQtList.length === 0">暂无报价记录</div>
                <div class="list-item" v-else v-for="(item, index) in formData.supplierQtList" :key="index">
                  <div class="item-top">
                    <div class="des">{{ item.createBy }} 在 {{ parseTime(item.createTime) }} 创建了一条跟进</div>
                    <el-button type="primary" size="small" @click="handleEdit(item, 1)">编辑</el-button>
                  </div>
                  <div class="item-content" v-html="item.content"></div>
                  <el-divider />
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { ElDialog } from 'element-plus';
import RichTextMn from '@/components/Website/RichText/index.vue'
import { getCustomerTrackList, saveCustomerTrack, addCustomerTrack, editCustomerTrack, getCustomerTrackDetail } from "@/api/Website/customer"

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  data: {
    type: Object,
    default: null,
  },
  customerDicts: {
    type: Object,
    required: true
  },
});

const emit = defineEmits(['update:visible', 'submit-success']);

const { proxy } = getCurrentInstance();
// 是否在编辑中
const isCustomerTrackEdit = ref(false);
const isSupplierQtEdit = ref(false);

// 定义表单初始值生成函数
const getInitialFormData = () => ({
  content: '',
  savingMode: 0,
  customerId: '',
  customerState: 0,
  customerGroup: 0,
  customerStars: 0,
  savingType: 0,
  // 客户追踪对象
  customerTrackObj: null,
  // 客户追踪
  customerTrack: '',
  // 客户列表
  customerTrackList: [],
  // 供应商报价对象
  supplierQtObj: null,
  // 供应商报价
  supplierQt: '',
  // 供应商报价列表
  supplierQtList: [],
});

// 表单数据
const formData = ref(getInitialFormData());

// 监听编辑数据变化
watch(
  () => props.data,
  (newVal) => {
    if (newVal) {
      Object.assign(formData.value, {
        customerId: newVal.customerId,
        contactPerson: newVal.contactPerson,
        customerState: newVal.customerState,
        customerGroup: newVal.customerGroup,
        customerStars: newVal.customerStars
      });

      // 获取列表数据
      if (newVal.customerId) {
        getTrackList(newVal.customerId);
      }

    } else {
      formData.value = getInitialFormData();
    }
  },
  { immediate: true }
);

// 控制对话框显示
const dialogVisible = computed({
  get() {
    return props.visible;
  },
  set(value) {
    emit("update:visible", value);
  },
});

function handleClose() {
  dialogVisible.value = false;
}

const getTrackList = async (customerId) => {
  const res = await getCustomerTrackList({ customerId: customerId });
  console.log('getTrackList', res);
  if (res.code === 200) {
    formData.value.customerTrackObj = res.data?.rickCustomer;
    formData.value.customerTrack = res.data?.rickCustomer?.content;
    formData.value.customerTrackList = res.data?.customerList;

    formData.value.supplierQtObj = res.data?.rickSupplier;
    formData.value.supplierQt = res.data?.rickSupplier?.content;
    formData.value.supplierQtList = res.data?.supplierList;
  }
}

// 保存草稿
const handleSave = async (num) => {
  const tempData = { customerId: formData.value.customerId };
  if (num === 0) {
    tempData.savingType = 0;
    tempData.content = formData.value.customerTrack;
  } else {
    tempData.savingType = 1;
    tempData.content = formData.value.supplierQt;
  }
  const res = await saveCustomerTrack(tempData);
  // 获取列表数据
  if (res.code === 200 && formData.value.customerId) {
    proxy.$modal.msgSuccess("保存草稿成功");
    getTrackList(formData.value.customerId);
  }
}

// 添加一条
const handleAdd = async (num) => {
  const tempData = { customerId: formData.value.customerId };
  if (num === 0) {
    tempData.savingType = 0;
    tempData.content = formData.value.customerTrack;
    if (formData.value.customerTrackObj?.id) {
      tempData.id = formData.value.customerTrackObj.id;
    }
  } else {
    tempData.savingType = 1;
    tempData.content = formData.value.supplierQt;
    if (formData.value.supplierQtObj?.id) {
      tempData.id = formData.value.supplierQtObj.id;
    }
  }
  const res = await addCustomerTrack(tempData);
  console.log('handleAdd', res);
  if (res.code === 200) {
    // 获取列表数据
    if (formData.value.customerId) {
      getTrackList(formData.value.customerId);
    }      
    // 清空草稿
    if (num === 0) {
      formData.value.customerTrack = '';
      formData.value.customerTrackObj = null;
    } else {
      formData.value.supplierQt = '';
      formData.value.supplierQtObj = null;
    }    
  }
}

const handleClean = async (num) => {
  if (num === 0) {
    formData.value.customerTrack = '';
    if (!isCustomerTrackEdit.value) {
      formData.value.customerTrackObj = null;
    }
  } else {
    formData.value.supplierQt = '';
    if (!isSupplierQtEdit.value) {
      formData.value.supplierQtObj = null;
    }
  }
}

const handleFinishEdit = async (num) => {
  const tempData = {};
  if (num === 0) {
    tempData.savingType = 0;
    tempData.content = formData.value.customerTrack;
    tempData.id = formData.value.customerTrackObj.id;
  } else {
    tempData.savingType = 1;
    tempData.content = formData.value.supplierQt;
    tempData.id = formData.value.supplierQtObj.id;
  }
  const res = await editCustomerTrack(tempData);
  console.log('handleFinishEdit', res);
  // 获取列表数据
  if (res.code === 200 && formData.value.customerId) {
    getTrackList(formData.value.customerId);
  }  
  // 清空编辑状态
  if (num === 0) {
    isCustomerTrackEdit.value = false;
  } else {
    isSupplierQtEdit.value = false;
  }
}

const handleEdit = (item, num) => {
  if (num === 0) {
    formData.value.customerTrackObj = item;
    formData.value.customerTrack = item.content;
    isCustomerTrackEdit.value = true;
  } else {
    formData.value.supplierQtObj = item;
    formData.value.supplierQt = item.content;
    isSupplierQtEdit.value = true;
  }
}

</script>

<style lang="scss" scoped>
.dict-tag-mn {
  display: inline-block;
}

.track-dialog {
  min-height: 800px;
  max-height: 900px;
  width: 100%;
  overflow-y: auto;
  padding: 0;
}

/* 客户信息区域 */
.customer-info-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  border: 1px solid #e9ecef;
}

.top-info {
  margin: 0;
}

.contact-person {
  margin-bottom: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e9ecef;
}

.contact-person .label {
  font-size: 16px;
  margin-right: 8px;
}

.contact-person .value {
  font-size: 16px;
  font-weight: 700;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
}

.info-item .label {
  font-size: 14px;
  font-weight: 500;
  color: #495057;
  margin-right: 8px;
  min-width: 70px;
}

/* 编辑区域 */
.edit-section {
  margin-bottom: 24px;
}

.section-card {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.section-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #3498db;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: -2px;
  width: 30px;
  height: 2px;
  background: #e74c3c;
}

.rich-text-container {
  margin-bottom: 16px;
  min-height: 200px;
}

.btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e9ecef;
}

.btns .el-button {
  margin: 0;
  min-width: 80px;
  font-size: 12px;
}

/* 列表区域 */
.list-section {
  margin-top: 24px;
}

.list-card {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.tip-message {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 16px;
  font-size: 13px;
  line-height: 1.4;
}

.tip-message.warning {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
}

.tip-message.info {
  background: #d1ecf1;
  border: 1px solid #bee5eb;
  color: #0c5460;
}

.tip-message i {
  margin-right: 8px;
  font-size: 14px;
}

.list-title {
  font-size: 15px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e9ecef;
}

.list-content {
  min-height: 120px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px dashed #ced4da;
}

.list-item {
  .item-top{
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
  }
}

.placeholder {
  text-align: center;
  color: #6c757d;
  font-style: italic;
  padding: 40px 0;
}
</style>