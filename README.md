# Popup Library

If you want to create nice and powerful popups easily using javascript for your website, you're in the right place!

## Why should I use this popup library

- 🏋️ It's lightweight
- 😅 It's easy to setup
- 😉 It's easy to use
- 👍 It helps you create nice popups
- 📄 It has a great documentation

## Quick start

### Setup

Import the `PopupManager` class from the CDN link at the top of the `.js` file where you want to use the popup library as shown:

```
import PopupManager from 'https://cdn.jsdelivr.net/gh/jorgeabrahan/popup_library@86cdba0/popup/Popup.js'
```

And that's it, you're done! 😁 Now check [how to use](#guide) the `PopupManager` class to create and manage your popups.

> If you are concerned about performance and you want to reduce network requests as much as possible then you can download all three files inside the `popup` folder (`popup.css`, `Popup.js`, `PopupHistory.js`) and add them to your project. Keep in mind that you will need to change the imports in the `Popup.js` file so that the other files are imported from your project and not externally.

## Guide

### Popup structure

Let's take a look at the type of popups that you can create using the popup library:

![Popup structure](./images/popup_structure.png)

As you can see a popup may have the following elements:

- ✅ Title
- ✅ Close button
- ✅ Content
- ✅ Interaction buttons

We can organize the popup elements by sections:

- Header
  - ✅ Title
  - ✅ Close button
- Main
  - ✅ Content
- Footer
  - ✅ Interaction buttons

Keep in mind that since none of this elements are mandatory, if you don't specify them when you display the popup it'll just show an empty white box with its default dimensions, however, because of how it is styled the popup adapts depending on which elements you decide to show.

For instance, if you don't specify the `interaction buttons` when displaying the popup it won't show the `Footer` section:

![Popup no footer section](./images/popup_no_footer_section.png)

Similarly, if you don't specify the `title` and `close button` elements when displaying the popup it won't show the `Header` section:

![Popup no footer section](./images/popup_no_header_section.png)

> Keep in mind that in order for the `Header` section not to be shown it has to be completely empty, if you specify either the `close button` or `title` then this section will be shown.

// Todo: mention about custom styles and elements that can't change

<p>
  As you saw when you create an instance of PopupManager you can (not mandatory) specify the
  popup: title, close button and styles. Title and close button parameters are inserted as HTML
  so you can send or not HTML code. The styles will be added as an attribute so you should send
  a string of valid css properties like this:
</p>

```
const ConfirmationPopup = new PopupManager("Popup title", "close", "border: 2px solid gray;")
```

<p>
  However if you only create the instance it won't show anything, in order to do this let's take
  a look at the two most necessary methods from the PopupManager class:
</p>
<ul>
  <li>show(): Shows the created popup. It cannot be nested.</li>
  <li>close(): Hides the created popup. It cannot be nested.</li>
</ul>
<p>
  Of course, if you use the show() method directly in the created instance it will show the
  popup once the webpage is loaded, which in most cases is not the intended beheavior, so you
  will need to handle this with a button click event like this:
</p>

```
import PopupManager from './popup/Popup.js'

const BasicPopup = new PopupManager('Basic popup', 'close', 'border: 2px solid gray;')
document.getElementById('basic-popup').onclick = () => BasicPopup.show()
```

<p>
  View the outputs in the deployed website. As you might've already realize the popup doesn't look too nice, that's because it's missing the content. Alongside the content let's take a look at some functions to change thing's we've already added like the title or close button:
</p>
<ul>
  <li>
    title(title: string): allows you to change the popup title, just as in the constructor it
    accepts a string that can be HTML code or not. Keep in mind that what you send as a
    parameter will be placed inside an h3 tag, so if you send HTML avoid using h tags. It can be
    nested.
  </li>
  <li>
    btnClose(btnClose: string): allows you to change the popup close button, just as in the
    constructor it accepts a string that can be HTML code or not. Keep in mind that what you
    send as a parameter will be placed inside a button tag, so if you send HTML avoid using
    button tags. It can be nested.
  </li>
  <li>
    style(styles: string): allows you to add custom styles to the popup, just as in the
    constructor it accepts a string with valid css properties separated by semicolons.
  </li>
  <li>
    content(content: string): allows you to insert or change the popup content. It is inserted
    as HTML so it accepts a string that may contain HTML tags. It can be nested.
  </li>
</ul>
<p>Let's now change the popup content with the new methods that we've learned</p>

```
import PopupManager from './popup/Popup.js'

const BasicPopup = new PopupManager('Basic popup', 'close', 'border: 2px solid gray;')
document.getElementById('basic-popup').onclick = () => {
  BasicPopup.content('<p>This is HTML content with <b>bold</b> and <i>cursive</i> text.</p>').show()
}
```

<p>
  View the outputs in the deployed website. Now let's add something else to make this popup even more useful. We will add buttons to our popup. Let's create a new popup to delete a file:
</p>

```
const btnClose = '&lt;span class="material-symbols-outlined">close&lt;/span>'
const DeleteFilePopup = new PopupManager('Delete file', btnClose)
const content = 'Are you sure you want to delete this file?'
DeleteFilePopup.content(content)
document.getElementById('delete-file').onclick = () => DeleteFilePopup.show()
```

<p>
  Now let's add the buttons but before, let's understand better how to add buttons to the popup:
</p>
<ul>
  <li>
    buttons(buttonObjects: buttonObject[], sharedHandler: function, position: 'left | center |
    right', sharedStyles: string): This method allows you to add buttons to the popup, buttons
    should be added as objects into the buttonObjects array, a buttonObject looks like this:
  </li>
</ul>

```
{
  text: "The button content, it can be HTML or plain text",
  handler: "The function that will handle the click event of the button",
  type: "Can be 'confirm or error' this will only change the button styles",
  style: "Allows you to set custom styles to each button"
}
```

So, if you want to add buttons simply create the objects of the buttons that you want to
add, and send it as the first parameter of the buttons method, however, as you saw you have
more parameters. So for instance, if you want to handle all the buttons event with a single
function instead of setting one handler for each funtion, simply send this sharedFunction as
a second parameter, this function receives 3 parameters, the event, the clicked button text
and the button itself. After that you can set the buttons position being the options 'left |
center | right' and lastly if there are some styles that all buttons shared send it as a
fourth parameter of the buttons function instead of setting the same styles for each button.

Let's take a look at how to add the buttons with this new knowledge:

```
// this is an icon from Google Icons
const btnClose = '&lt;span class="material-symbols-outlined">close&lt;/span>'
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
```

<p>View the outputs in the deployed website. Now we're just missing 2 main things:</p>
<ul>
  <li>
    rollback(): all PopupManager instances have an initial state which is an object that saves
    the title, btnClose, content and buttons of the popup the first time they are set. So when
    you use the rollback method it will get the popup back to its initial state, which basically
    means that It will set all properties from the initial state object to the popup.
  </li>
  <li>
    options(options: optionsObject): the options parameter allows you to change some properties
    of the popup, all properties that can be change through the options method can be changed
    through an inidividual method, but we won't explore each of them, so is just for you to
    know. The optionsObject parameter looks like this:
  </li>
</ul>

```
{
  allowSelect: boolean that allows the user to select content from the popup or not
  preventExternalClose: boolean that prevents the user from closing the popup by clicking outside of it or not
  position: 'top | center | bottom' sets the popup on one of the specified positions
  maxWidth: number that specifies the amount of pixels that the popup will have as width
  margin: string that will be set as a margin css property to the
}
```

<p>
  Feel free to fork this repository and change modify it as you wish. There are other things
  that I left out because of time but you can explore the code so you discover more methods and
  functionalities.
</p>
<p>
  If you spot any bug, please let me know by opening an issue and I will do my best to fix it as
  fast as possible. Feel free to create a pull request for proposed changes to code, styling or
  documentation.
</p>
