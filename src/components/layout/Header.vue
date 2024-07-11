<script setup lang="ts">
</script>

<template>
  <header className="header">
    <h1>
      数<span className="header__group-one">独</span><span className="header__group-two">sudoku</span>
      (<span className="header__group-two"> for </span><span className="header__group-one">Miss
        Yang</span>)
    </h1>

    <h2 @click="$emit('newGame')">
      新游戏
    </h2>
  </header>

</template>

<style></style>