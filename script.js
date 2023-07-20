import PopupManager from './popup/Popup.js'

const BasicPopup = new PopupManager('Basic popup', 'close', 'border: 2px solid gray;')
document.getElementById('basic-popup').onclick = () => BasicPopup.show()
document.getElementById('basic-popup-content').onclick = () =>
  BasicPopup.content('<p>This is HTML content with <b>bold</b> and <i>cursive</i> text.</p>').show()

const btnClose = '<span class="material-symbols-outlined">close</span>'
const DeleteFilePopup = new PopupManager('Delete file', btnClose)
const content = 'Are you sure you want to delete this file?'
const buttons = [
  {
    text: 'Delete',
    type: 'error',
    handler: () => {
      // Here you should have the logic to delete the file
      // for this example let's consider a timer as an async function
      setTimeout(() => {
        DeleteFilePopup.content('File was deleted!')
      }, 3000) // after 3 seconds file will be deleted
      // while the file is being deleted you could display a message to your user
      DeleteFilePopup.content('File is being deleted, please wait...').buttons()
    }
  },
  { text: 'Cancel', type: 'confirm', handler: () => DeleteFilePopup.close() }
]
DeleteFilePopup.content(content).buttons(buttons)
document.getElementById('delete-file').onclick = () => DeleteFilePopup.show()
