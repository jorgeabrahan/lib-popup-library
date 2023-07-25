import history from 'https://cdn.jsdelivr.net/gh/jorgeabrahan/popup_library@d0bdb37/popup/PopupHistory.js'

/* Import popup css file */
let link = document.createElement('link')
link.rel = 'stylesheet'
link.type = 'text/css'
link.href = 'https://cdn.jsdelivr.net/gh/jorgeabrahan/popup_library@c05c890/popup/popup.css'
document.head.appendChild(link)

const isNumberInRange = (range = [0, 2], number = 1) => number > range[0] && number < range[1]
/* define popup html structure and return it */
const popupHTML = (btnClose) => `
  <header class="popup-header ${btnClose !== '' ? 'p-1rem' : ''}">
    <h3 id='popup-title' class="popup-header__title"></h3>
    <button id='popup-close-button' class="popup-header__close-button">${btnClose}</button>
  </header>
  <hr />
  <main id='popup-content' class="popup-content"></main>
  <hr />
  <footer id='popup-buttons' class="popup-buttons"></footer>
`

class PopupManager {
  // custom styles and close button can only be set once
  constructor({ style = '', btnClose = '' }) {
    /* create popup html element */
    this.element = document.createElement('dialog')
    this.element.className = 'popup popup--top'
    this.element.innerHTML = popupHTML(btnClose)
    /* set popup styles */
    this.element.setAttribute('style', style) // custom popup styles
    this.allowClosing = true
    /* get needed elements from the popup and set them as properties */
    this.#setPopupProperties()
    /* add external popup click to close it */
    this.handleDialogExternalClose = (e) => {
      e.stopImmediatePropagation()
      const { x, width, y, height } = this.element.getBoundingClientRect()
      const userClickedInsidePopup =
        isNumberInRange([x, x + width], e.x) && isNumberInRange([y, y + height], e.y)
      if (!userClickedInsidePopup && this.allowClosing) this.close()
    }
    this.element.addEventListener('click', this.handleDialogExternalClose)
    /* add click event to popup close button */
    this.popupBtnClose.addEventListener('click', () => {
      if (this.allowClosing) this.close()
    })
    /* set popup options to default */
    this.options({})
    /* add popup to html body */
    document.body.appendChild(this.element)
  }
  #setPopupProperties() {
    this.popupHeader = this.element.querySelector('.popup-header')
    this.popupTitle = this.element.querySelector('#popup-title')
    this.popupBtnClose = this.element.querySelector('#popup-close-button')
    this.popupContent = this.element.querySelector('#popup-content')
    this.popupButtons = this.element.querySelector('#popup-buttons')
  }
  /* sets the popup buttons */
  // @buttonObjects: @buttonObject[]
  // @buttonObject: { text: string, handler: function, type: 'confirm | error', style: string }
  // @position: 'left | right'
  #buttons({ elements = [], sharedHandler = () => {}, sharedStyles = '', position = 'left' }) {
    // sharedStyles are styles all buttons share
    // however each button object have a style property for unique styling
    const fragment = document.createDocumentFragment() // fragment to append all buttons
    elements.forEach(
      ({ text = '', handler = () => {}, type = '', style = '', disabled = false }) => {
        const button = document.createElement('button') // create button
        button.innerHTML = text // add button content
        button.onclick = (e) => {
          e.stopImmediatePropagation()
          handler(e) // call the handler function for each button
          sharedHandler(e, text, button) // call shared handler function for all buttons
        }
        // if button is set as disabled
        if (disabled) {
          button.setAttribute('disabled', '') // disable button
          button.classList.add('disabled') // set styles for disabled buttons
        }
        if (type !== '') button.classList.add(type) // add class to style button according its type
        button.setAttribute('style', sharedStyles.concat(style)) // add shared and unique styles
        fragment.appendChild(button) // add button to fragment
      }
    )
    this.popupButtons.innerHTML = '' // clear previous content
    this.popupButtons.appendChild(fragment) // add buttons to popup butttons container
    if (position === 'right') this.popupButtons.classList.add('popup-buttons--right')
    if (position === 'center') this.popupButtons.classList.add('popup-buttons--center')
    return this
  }
  /* set popup class to disallow select if necessary */
  allowSelect(allowSelect = true) {
    if (allowSelect) return this.element.classList.remove('popup--no-select')
    this.element.classList.add('popup--no-select')
    return this
  }
  /* prevent popup from being close by clicking outside of it */
  preventExternalClose(preventExternalClose = true) {
    if (preventExternalClose)
      this.element.removeEventListener('click', this.handleDialogExternalClose)
    else this.element.addEventListener('click', this.handleDialogExternalClose)
    return this
  }
  /* set popup class to position it */
  position(position = 'top') {
    /* remove all classes before setting anything */
    this.element.classList.remove('popup--top', 'popup--center', 'popup--bottom')
    switch (position) {
      case 'center':
        return this.element.classList.add('popup--center')
      case 'bottom':
        return this.element.classList.add('popup--bottom')
      case 'top':
      default:
        this.element.classList.add('popup--top')
    }
    return this
  }
  /* set popup max width */
  maxWidth(width = 450 /* width: number(px) */) {
    this.element.style.maxWidth = `${width}px`
    return this
  }
  /* set popup margin to separate it from window viewport */
  margin(margin = '1rem') {
    this.element.style.margin = margin
    return this
  }
  /* setup popup by changing multiple parameters */
  options({
    allowSelect = true,
    preventExternalClose = false,
    position = 'top',
    maxWidth = 450,
    margin = '1rem'
  }) {
    this.allowSelect(allowSelect)
    this.preventExternalClose(preventExternalClose)
    this.position(position)
    this.maxWidth(maxWidth)
    this.margin(margin)
    return this
  }
  #refresh(title, content, buttons) {
    // update modal content
    this.popupTitle.innerHTML = title
    this.popupContent.innerHTML = content
    this.#buttons(buttons)
    if (this.popupHeader.classList.contains('p-1rem')) {
      if (title === '' && this.popupBtnClose.innerHTML === '')
        this.popupHeader.classList.remove('p-1rem')
    } else if (title !== '') this.popupHeader.classList.add('p-1rem')
  }
  display({
    title = '',
    content = '',
    buttons = { elements: [], sharedHandler: () => {}, sharedStyles: '', position: 'left' },
    allowClosing = true
  }) {
    this.#refresh(title, content, buttons)
    this.allowClosing = allowClosing
    this.element.showModal()
    history.add(title, content, buttons) // add state to popup history
    return this
  }
  update({
    title = null,
    content = null,
    buttons = null,
    preserveInHistory = true,
    allowClosing = true
  }) {
    let current = history.getCurrent() // get a copy of the current object
    // if there are no elements in history
    if (current === null) current = { title: '', content: '', buttons: {} }
    this.allowClosing = allowClosing
    // update the received parameters and refresh necessary content
    if (title !== null) current.title = title
    if (content !== null) current.content = content
    if (buttons !== null) current.buttons = buttons
    this.#refresh(current.title, current.content, current.buttons)
    // add updated history state
    if (preserveInHistory) history.add(current.title, current.content, current.buttons)
    return this
  }
  /* display previous state in history */
  goBack() {
    const previous = history.previous()
    if (previous === null) return // if there are no elements in history
    this.#refresh(previous.title, previous.content, previous.buttons)
  }
  /* display next state in history */
  goNext() {
    const next = history.next()
    if (next === null) return // if there are no elements in history
    this.#refresh(next.title, next.content, next.buttons)
  }
  /* display first state in history */
  goFirst() {
    const first = history.first()
    if (first === null) return
    this.#refresh(first.title, first.content, first.buttons)
  }
  /* display last state in history */
  goLast() {
    const last = history.last()
    if (last === null) return
    this.#refresh(last.title, last.content, last.buttons)
  }
  /* remove popup open attribute to show it */
  close() {
    this.element.close()
    history.clear()
  }
}

export default PopupManager
