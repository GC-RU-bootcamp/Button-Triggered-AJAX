# Button-Triggered-AJAX
Button Triggered AJAX to make calls to Giphy API and displays a set of GIFs

Features
Ability to add seach buttons
   Will not add empty or duplicate buttons

Ability to remove all buttons.

Ability to remove a single button via:
   Drag & drop button to "Remove all" button OR "Input text" to remove a single button. 

Buttons created are Persisted on page reload with Local Storage 

Ability to dynamically add GIF on button press

Ability to toggle each GIF between "Still" & "Animated" on mouse click on image. 

Each button click will bring in 10 images.

   Click the same button (again) will prepend an addional 10 images. (implemented pagination)

   Click different button will clear all images from previous search and then load 10 new images. So that only the images relevent to that search are shown.  

   Hover over an image shows popover "Title" and "Rating".
