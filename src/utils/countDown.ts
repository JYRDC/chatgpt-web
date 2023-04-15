import { onBeforeUnmount, reactive } from 'vue'

interface CountdownState {
  count: number
  timer: ReturnType<typeof setInterval> | null
}

export default function countDown(count = 60): { state: CountdownState; start: () => void } {
  const state = reactive<CountdownState> ({
    count: 0,
    timer: null,
  })

  // 开始倒计时
  function start() {
    clear()
    state.count = count
    state.timer = setInterval(() => {
      state.count--
      if (state.count <= 0)
        clear()
    }, 1000)
  }

  // 清除倒计时
  function clear() {
    if (state.timer)
      clearInterval(state.timer)
  }

  onBeforeUnmount(() => {
    clear()
  })

  return {
    state,
    start,
  }
}
