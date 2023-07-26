import PopupManager from 'https://cdn.jsdelivr.net/gh/jorgeabrahan/popup_library@67068b1/popup/Popup.js'

const $ = (query = '') => document.querySelector(query)
const btnClose = '<span class="material-symbols-outlined">close</span>'
/* Information popup */
const InfoPopup = new PopupManager({ btnClose })
$('#info-popup').onclick = () =>
  InfoPopup.display({
    title: 'Welcome {user}!',
    content: "It's nice having you onboard! Checkout all the great features we've prepared for you",
    buttons: {
      elements: [{ text: 'Ok', type: 'confirm', handler: () => InfoPopup.close() }],
      position: 'right'
    }
  })

/* Confirmation popup */
const ConfirmationPopup = new PopupManager({ btnClose })
const onFileDelete = () => {
  ConfirmationPopup.update({
    content: 'File is being deleted, please wait...',
    buttons: {},
    allowClosing: false
  })
  setTimeout(() => {
    ConfirmationPopup.update({ content: 'File was deleted!', allowClosing: true })
  }, 3000)
}
$('#confirmation-popup').onclick = () =>
  ConfirmationPopup.display({
    title: 'Delete file',
    content: 'Are you sure you want to delete ${this} file?',
    buttons: {
      elements: [
        { text: 'Confirm', type: 'confirm', handler: onFileDelete },
        { text: 'Cancel', type: 'error', handler: () => ConfirmationPopup.close() }
      ]
    }
  })

/* MultiPage popup */
const MultiPagePopup = new PopupManager({ btnClose })
$('#multipage-popup').onclick = () =>
  MultiPagePopup.display({
    title: 'MultiPage Popup',
    content: 'This is the first page of our multipage popup',
    buttons: {
      elements: [
        { text: 'First', handler: () => MultiPagePopup.goFirst() },
        { text: 'Previous', handler: () => MultiPagePopup.goBack() },
        { text: 'Next', handler: () => MultiPagePopup.goNext() },
        { text: 'Last', handler: () => MultiPagePopup.goLast() }
      ]
    }
  })
    .update({ content: 'This is page two!' })
    .update({ content: 'This is page three!' })
    .update({ content: 'This is the last page!' })
    .goFirst()

/* Custom popup */
const CustomPopup = new PopupManager({ btnClose })
$('#custom-popup').onclick = () =>
  CustomPopup.display({
    title: 'Custom popup',
    content:
      "This popup won't allow you to select content inside it, it won't close if you click outside of it, it has a maxWidth of 500px and it is positioned in the center of the viewport"
  }).options({
    allowSelect: false,
    preventExternalClose: true,
    position: 'center',
    maxWidth: 500
  })
