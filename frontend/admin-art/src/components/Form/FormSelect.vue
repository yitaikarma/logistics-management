<!-- 响应式选择器 -->
<template>
  <el-col :xs="24" :sm="12" :lg="6">
    <el-form-item :label="`${label}：`" :prop="prop">
      <el-select v-model="modelValue" clearable placeholder="请选择" style="width: 100%">
        <el-option v-for="(item, i) in options" :key="i" :label="item.name" :value="item.value"> </el-option>
      </el-select>
    </el-form-item>
  </el-col>
</template>

<script setup lang="ts">
  const modelValue = defineModel<string | number | boolean | undefined>({ required: true })

  defineProps({
    label: String,
    prop: String,
    options: {
      type: Array as PropType<{ name: string; value: string | number | boolean; [key: string]: any }[]>,
      default: () => []
    }
  })
</script>

<style lang="scss" scoped></style>
