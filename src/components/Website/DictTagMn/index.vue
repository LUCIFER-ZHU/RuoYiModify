<template>
  <div class="dict-tag-mn">
    <template v-for="item in matchedOptions" :key="item.value">
      <span
        v-if="(item.elTagType === 'default' || !item.elTagType) && !item.elTagClass"
        :class="item.elTagClass"
      >
        {{ item.label + " " }}
      </span>
      <el-tag
        v-else
        :disable-transitions="true"
        :type="item.elTagType"
        :class="item.elTagClass"
      >
        {{ item.label + " " }}
      </el-tag>
    </template>
    
    <template v-if="showValue && unmatchedValues.length > 0">
      {{ unmatchedValues.join(' ') }}
    </template>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  options: { type: Array, default: () => [] }, // 初始值给空数组避免 null 报错
  value: [Number, String, Array],
  showValue: { type: Boolean, default: true },
  separator: { type: String, default: "," }
});

// 规范化当前选中的值
const normalizedValues = computed(() => {
  if (props.value === null || props.value === undefined || props.value === '') return [];
  const valArray = Array.isArray(props.value) ? props.value : String(props.value).split(props.separator);
  return valArray.map(v => String(v).trim()); // 统一转成字符串处理比较稳妥
});

// 获取匹配到的选项
const matchedOptions = computed(() => {
  if (!Array.isArray(props.options)) return [];
  return props.options.filter(opt => 
    normalizedValues.value.includes(String(opt.value))
  );
});

// 获取未匹配到的原始值 (替代之前的 unmatch 副作用逻辑)
const unmatchedValues = computed(() => {
  if (!props.showValue || !Array.isArray(props.options)) return [];
  return normalizedValues.value.filter(val => 
    !props.options.some(opt => String(opt.value) === val)
  );
});
</script>

<style scoped>
/* 确保多个标签之间有水平间距 */
.dict-tag-mn .el-tag + .el-tag {
  margin-left: 10px;
}

/* 如果未匹配的文字紧跟在标签后面，也可以加点间距 */
.dict-tag-mn .el-tag + span,
.dict-tag-mn span + .el-tag {
  margin-left: 10px;
}
</style>