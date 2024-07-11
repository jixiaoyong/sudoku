<script setup lang="ts">
let footerDate: number = new Date().getFullYear();
defineProps<{ name: string }>()
</script>

<template>
  <footer className="footer">
    <p>&#169; {{ footerDate }} 修改 by <a href="https://github.com/jixiaoyong" target="_blank">JI,XIAOYONG</a>；源码 by <a
        href="https://github.com/xiaoxunyao/vue-sudoku" target="_blank">{{ name
        }}</a>
    </p>
  </footer>
</template>
