<script setup lang="ts">
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="status__difficulty">
    <span class="status__difficulty-text">难度:&nbsp;&nbsp;</span>
    <select name="status__difficulty-select" class="status__difficulty-select" :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)">
      <option value="Easy">简单</option>
      <option value="Medium">中级</option>
      <option value="Hard">大师</option>
    </select>
  </div>
</template>

<style></style>