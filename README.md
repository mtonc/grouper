![Tab Icon](./icons/tabs64.png) 
# Grouper
An url matching tab grouper for chrome. Written in vanilla HTML, CSS, and Javascript to save on KB's. Might 
refactor with a frontend framework for v2.

## /Services
Here you will find the files that interact with the different Chrome Extension APIs. APIs used:

- [Storage](https://developer.chrome.com/docs/extensions/reference/storage) - storage.service.js
- [Tab Groups](https://developer.chrome.com/docs/extensions/reference/tabGroups) - groups.storage.js
- An additional file, elementFactory.js, is included here as well. It is used to build the html
elements for each group.


## /Popup
All files needed to render the popup are located in this folder, including css and fonts.

## /Util
Programmers are lazy. These help write less code, especially catchAsync.js


[ Tab icons created by Freepik - Flaticon ](https://www.flaticon.com/free-icons/tab)
