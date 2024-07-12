/*
 * @Author: jixiaoyong
 * @Email: jixiaoyong1995@gmail.com
 * @Webiste: https://jixiaoyong.github.io
 * @Date: 24/07/11
 * @LastEditors: jixiaoyong
 * @LastEditTime: 24/07/12
 * @FilePath: /sudoku/vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by jixiaoyong, All Rights Reserved. 
 */
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/sudoku/'
})
