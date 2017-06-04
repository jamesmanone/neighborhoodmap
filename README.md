# Neighborhood Map

Neighborhood Map is a single page app showing a few of my favorite places in St.Petersburg, FL. It makes use of third party api's and responsive web design techniques to show these locations and information about them.
___

## Getting started

Before using Neighborhood map you must install the dependencies. Neighborhood map requires that you have [node](https://nodejs.org/en/download/) and npm (included with node). Once node is installed, you can clone this repository. To clone this, navigate to the folder you want this located in from a bash prompt(mac terminal or windows gitbash).
### Installation
From the prompt enter  
`git clone https://github.com/jamesmanone/neighborhoodmap.git`  
then enter  
`npm install`  
This will install the dependencies. You can then type  
`node server.js`  
to start the server. You can then view the project by visiting [http://localhost:3000](http://localhost:3000).
___

## API's
Neighborhood maps makes use of several third party API's.
*   **knockoutjs**: for separation of concerns.
*   **Google maps javascript API**: to build the map and handle all interactions with the map.
*   **Flickr**: to retrieve photos from the location.
*   **Wikipedia**: to retrieve wikipedia page.
*   **Yelp Fusion**: to retrieve reviews of locations
___

## Modification
If you wish to make modifications to this program there are additional steps to take. The frontend source code is located in the `src` directory. Edits made here will not effect the program until the code is built. To do this you need gulp.
### How to modify the code
If you do not have gulp, run the following command from the command line  
`npm install -g gulp`  

gulpfile.js contains several tasks for dealing with changes. Once changes have been made to the source code you can rebuild the public folder by running  
`gulp`  
from the root folder of the project. If you are actively modifying the code gulp can automatically rebuild the public folder every time you save a file. From the root project folder run the following command  
`gulp watch`  
