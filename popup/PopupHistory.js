class PopupHistory {
  #history = []
  constructor() {
    this.current = 0 // pointer to popup state that is being displayed
  }
  getHistory() {
    return this.#history
  }
  add(title = '', content = '', buttons = {}) {
    this.#history.push({ title, content, buttons })
    // set current state to last added
    this.current = this.#history.length - 1
  }
  getCurrent() {
    // when there are no states
    if (this.#history.length === 0) return null
    // returns a copy
    return { ...this.#history[this.current] }
  }
  previous() {
    // when there are no states
    if (this.#history.length === 0 || this.#history.length === 1) return null
    // only when a previous state exist the counter is reduced
    if (this.current > 0) this.current -= 1
    return this.#history[this.current]
  }
  next() {
    // when there are no states
    if (this.#history.length === 0 || this.#history.length === 1) return null
    // only when a next state exist the counter is incremented
    if (this.current < this.#history.length - 1) this.current += 1
    return this.#history[this.current]
  }
  first() {
    // when there are no states
    if (this.#history.length === 0 || this.#history.length === 1) return null
    this.current = 0
    return this.#history[this.current]
  }
  last() {
    // when there are no states
    if (this.#history.length === 0 || this.#history.length === 1) return null
    this.current = this.#history.length - 1
    return this.#history[this.current]
  }
  clear() {
    this.#history = []
  }
}

const history = new PopupHistory()
export default history
