<script setup lang="ts">
import { onUpdated, ref } from 'vue';
import Action from './components/Action.vue';
import Difficulty from './components/Difficulty.vue';
import Timer from './components/Timer.vue';
import Footer from './components/layout/Footer.vue';
import Header from './components/layout/Header.vue';
import { ArraySudoku, SudokuArray, SudokuContent } from './context/SudokuContext';
import { getUniqueSudoku } from './sovler/UniqueSudoku';

let difficulty = ref("Easy")
let zero = ref("0")
let clickIndex = ref<number>(82)
let isSolved = ref(false)
let isTimer = ref<boolean>(false)

let currentRow = ref<number>(10);
let currentColumn = ref<number>(10);

let numbers: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const temporaryInitArray = ref<string[]>([]);
const temporarySolvedArray = ref<string[]>([]);
let errors = ref<{ row: number; col: number; }[]>([]);

[temporaryInitArray.value, temporarySolvedArray.value] = getUniqueSudoku(difficulty.value, difficulty.value)

const InitArray = ref<SudokuContent[]>(SudokuArray(temporaryInitArray.value))

function newGame() {
  [temporaryInitArray.value, temporarySolvedArray.value] = getUniqueSudoku(difficulty.value, difficulty.value)
  InitArray.value = SudokuArray(temporaryInitArray.value)
  clickIndex.value = 82
  isTimer = ref(true)
}

// 在你的 checkSudoku 函数中
function checkSudoku(sudokuArray: SudokuContent[]) {
  errors.value = [];
  // 将一维数组转换为二维数组
  let sudoku: string[][] = [];
  for (let i = 0; i < 9; i++) {
    sudoku[i] = sudokuArray.slice(i * 9, (i + 1) * 9).map((item) =>
      item.content
    );
  }

  // 检查行
  for (let i = 0; i < 9; i++) {
    const row = new Set();
    for (let j = 0; j < 9; j++) {
      const current = sudoku[i][j]
      if ('0' != current && row.has(current)) {
        errors.value.push({ row: i, col: j });
      } else {
        row.add(current);
      }
    }
  }

  // 检查列
  for (let j = 0; j < 9; j++) {
    const col = new Set();
    for (let i = 0; i < 9; i++) {
      if ('0' != sudoku[i][j] && col.has(sudoku[i][j])) {
        errors.value.push({ row: i, col: j });
      } else {
        col.add(sudoku[i][j]);
      }
    }
  }

  // 检查小方格
  for (let block = 0; block < 9; block++) {
    const box = new Set();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        const row = Math.floor(block / 3) * 3 + i;
        const col = (block % 3) * 3 + j;
        if ('0' != sudoku[row][col] && box.has(sudoku[row][col])) {
          errors.value.push({ row, col });
        } else {
          box.add(sudoku[row][col]);
        }
      }
    }
  }
}

onUpdated(() => {
  const slovedArray: string[] = ArraySudoku(InitArray.value)

  var flag: boolean = true;
  for (var i = 0; i < temporarySolvedArray.value.length; i++) {
    if (temporarySolvedArray.value[i] !== slovedArray[i]) {
      flag = false;
    }
  }
  if (flag === true) {
    isSolved.value = true
  }
})

function numberClick(number: number) {
  if (InitArray.value[clickIndex.value].isLocked === true) {
    InitArray.value[clickIndex.value].content = number.toString()
  }

  checkSudoku(InitArray.value)
  console.log(errors.value)
}

function erase() {
  if (InitArray.value[clickIndex.value].isLocked === true) {
    InitArray.value[clickIndex.value].content = ''
  }
}

function hint() {
  if (InitArray.value[clickIndex.value].isLocked === true) {
    InitArray.value[clickIndex.value].content = temporarySolvedArray.value[clickIndex.value]
  }
}

function gameClick(index: number) {
  clickIndex.value = index
  currentRow.value = Math.floor(index / 9) + 1;
  currentColumn.value = index % 9 + 1;
}

function onClickOverlay() {
  isSolved.value = false
  newGame()
}
</script>

<template>
  <div class="container">
    <Header @new-game="newGame()"></Header>
    <div class="innercontainer">

      <section class="game">
        <table class="game__board">
          <tbody>
            <tr v-for="row in numbers" :key="row" class="game__row">
              <template v-for="column in numbers" :key="(column - 1) + (9 * (row - 1))">
                <td class="game__cell" :class="[
                  InitArray[(column - 1) + (9 * (row - 1))].content !== zero && InitArray[(column - 1) + (9 * (row - 1))].isLocked === true ? 'game__cell--userfilled' : '',
                  clickIndex === (column - 1) + (9 * (row - 1)) ? 'game__cell--highlightselected' : '',
                  row === currentRow || column === currentColumn ? 'game__cell--highlightrowcolumn' : '',
                  InitArray[(column - 1) + (9 * (row - 1))].content === zero ? 'game__cell--invisible' : '',
                  errors.some(error => error.row + 1 === row && error.col === column - 1) ? 'game__cell--error' : ''
                ]" @click="gameClick((column - 1) + (9 * (row - 1)))">
                  {{ InitArray[(column - 1) + (9 * (row - 1))].content }}
                </td>
              </template>
            </tr>
          </tbody>
        </table>
      </section>

      <section class="status">
        <Difficulty v-model="difficulty"></Difficulty>
        <Timer :status="isTimer"></Timer>

        <div class="status__numbers">
          <div v-for="(number, index) in numbers" :key="index" @click="numberClick(number)" class="status__number">
            {{ number }}
          </div>
        </div>

        <div class="status__actions">
          <!-- <Action action='undo' @action-click="undo()" /> -->
          <Action action='erase' @action-click="erase()" />
          <Action action='hint' @action-click="hint()" />
          <!-- <Mode mode='mistakes' @mode-click="mistakes()" /> -->
          <!-- <Mode mode='fast' @mode-click="fast()" /> -->
        </div>
      </section>

    </div>
    <Footer name="Elone Hoo"></Footer>

    <div @click="onClickOverlay()" :class="[isSolved ? 'overlay overlay--visible' : 'overlay']">
      <h2 class="overlay__text">
        You <span class="overlay__textspan1">solved</span> <span className="overlay__textspan2">it!</span>
      </h2>
    </div>
  </div>
</template>

<style scoped>
.game__cell {
  color: black;
}

.game__cell--highlightselected {
  color: white;
}

.game__cell--highlightrowcolumn {
  background-color: #f0f0f0;
}

.game__cell--invisible {
  color: #f0f0f0;
}

.game__cell--error {
  color: white;
  background-color: red;
  font-weight: bold;
}
</style>