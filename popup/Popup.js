/* Import popup css file */
let link = document.createElement('link')
link.rel = 'stylesheet'
link.type = 'text/css'
link.href = 'https://cdn.jsdelivr.net/gh/jorgeabrahan/popup_library@main/popup/popup.css'
document.head.appendChild(link)

// TODO: don't display buttons section if there are no buttons
const isNumberInRange = (range = [0, 2], number = 1) => {
  return number > range[0] && number < range[1]
}
/* define popup html structure */
const generatePopupHTML = (title = '', btnClose = '') =>
  `
    <header class="popup-header">
      <h3 id='popup-title' class="popup-header__title">${title}</h3>
      <button id='popup-close-button' class="popup-header__close-button">${btnClose}</button>
    </header>
    <hr />
    <main id='popup-content' class="popup-content"></main>
    <hr />
    <footer id='popup-buttons' class="popup-buttons"></footer>
  `

class PopupManager {
  constructor(title = '', btnClose = '', styles = '') {
    /* define popup components initial state */
    this.initialState = {
      title: title,
      btnClose: btnClose,
      content: '',
      buttons: []
    }
    /* create popup html element */
    this.element = document.createElement('dialog')
    this.element.className = 'popup popup--top'
    this.style(styles)
    this.element.innerHTML = generatePopupHTML(title, btnClose)
    /* get elements from the popup */
    this.popupTitle = this.element.querySelector('#popup-title')
    this.popupBtnClose = this.element.querySelector('#popup-close-button')
    this.popupContent = this.element.querySelector('#popup-content')
    this.popupButtons = this.element.querySelector('#popup-buttons')
    this.dimensions = this.element.getBoundingClientRect()
    /* add click event to the popup itself to close it */
    this.handleDialogExternalClose = (e) => {
      e.stopImmediatePropagation()
      const { x, width, y, height } = this.dimensions
      const userClickedInsidePopup =
        isNumberInRange([x, x + width], e.x) && isNumberInRange([y, y + height], e.y)
      if (!userClickedInsidePopup) this.close()
    }
    this.element.addEventListener('click', this.handleDialogExternalClose)
    /* add click event to popup close button */
    this.popupBtnClose.addEventListener('click', () => this.close())
    /* set popup options to default */
    this.options({})
    /* add popup to html body */
    document.body.appendChild(this.element)
  }
  /* sets the popup title */
  title(title = '') {
    this.popupTitle.innerHTML = title
    // first time title is set
    if (this.initialState.title === '') this.initialState.title = title
    return this
  }
  /* sets the popup close button */
  btnClose(btnClose = '') {
    this.popupBtnClose.innerHTML = btnClose
    // first time btnClose is set
    if (this.initialState.btnClose === '') this.initialState.btnClose = btnClose
    return this
  }
  /* set custom styles to popup */
  style(styles = '') {
    this.element.setAttribute('style', styles) // custom popup styles
  }
  /* sets the popup content */
  content(content = '') {
    this.popupContent.innerHTML = content
    // first time content is set
    if (this.initialState.content === '') this.initialState.content = content
    return this
  }
  /* sets the popup buttons */
  // @buttonObjects: @buttonObject[]
  // @buttonObject: { text: string, handler: function, type: 'confirm | error', style: string }
  // @position: 'left | right'
  buttons(buttonObjects = [], sharedHandler = () => {}, position = 'left', sharedStyles = '') {
    // sharedStyles are styles all buttons share
    // however each button object have a style property for unique styling
    const fragment = document.createDocumentFragment() // fragment to append all buttons
    buttonObjects.forEach(
      ({ text = '', handler = () => {}, type = '', style = '', disabled = false }) => {
        const button = document.createElement('button') // create button
        button.innerHTML = text // add button content
        button.onclick = (e) => {
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
    // first time buttons are set
    if (this.initialState.buttons.length === 0 && buttonObjects.length !== 0)
      this.initialState.buttons = buttonObjects
    return this
  }
  /* get popup back to its initial state */
  rollback() {
    this.title(this.initialState.title)
    this.btnClose(this.initialState.btnClose)
    this.content(this.initialState.content)
    this.buttons(this.initialState.buttons)
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
  /* add popup open attribute to show it */
  show() {
    this.element.showModal()
    // refresh dimensions
    this.dimensions = this.element.getBoundingClientRect()
  }
  /* remove popup open attribute to show it */
  close() {
    this.rollback()
    this.element.close()
  }
}

export default PopupManager
