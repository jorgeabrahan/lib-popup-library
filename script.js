import PopupManager from './popup/Popup.js'
const btnClose = '<span class="material-symbols-outlined">close</span>'
const DeleteFilePopup = new PopupManager({ btnClose })
document.getElementById('delete-file').onclick = () =>
  DeleteFilePopup.display({
    title: 'Delete file',
    content: 'Are you sure you want to <b>delete permanently</b> this file?',
    buttons: {
      elements: [
        {
          text: 'Delete',
          type: 'error',
          handler: () => {
            DeleteFilePopup.update({
              content: 'File is being deleted...',
              buttons: {},
              allowClosing: false
            })
            setTimeout(() => {
              DeleteFilePopup.update({ content: 'File was deleted!' })
            }, 3000)
          }
        },
        { text: 'Cancel', type: 'confirm', handler: () => DeleteFilePopup.close() }
      ]
    }
  })

const slides = ['First slide', 'Second slide', 'Third slide', 'Last slide']
const BasicPopup = new PopupManager({ btnClose })
document.getElementById('basic-popup').onclick = () =>
  BasicPopup.display({
    title: 'Multiple messages',
    content: 'This is a popup with multiple messages <b>easy</b> to navigate',
    buttons: {
      elements: [
        { text: 'First', handler: () => BasicPopup.goFirst() },
        { text: 'Previous', handler: () => BasicPopup.goBack() },
        { text: 'Next', handler: () => BasicPopup.goNext() },
        { text: 'Last', handler: () => BasicPopup.goLast() }
      ]
    }
  })
    .update({ content: slides[0] })
    .update({ content: slides[1] })
    .update({ content: slides[2] })
    .update({ content: slides[3] })
    .goFirst()
