/* define popup html structure and return it */
const popupHTML = (btnClose) => `
  <header class="popup-header">
    <h3 id='popup-title' class="popup-header__title"></h3>
    <button id='popup-close-button' class="popup-header__close-button">${btnClose}</button>
  </header>
  <hr />
  <main id='popup-content' class="popup-content"></main>
  <hr />
  <footer id='popup-buttons' class="popup-buttons"></footer>
`

export default popupHTML
