Kodemon Web Appliation
======================


Install
-------
`npm install -g grunt-cli bower`


And to install npm packages

`npm install`


Note:

If npm command doesn't install bower components 

automatically you can run this command:

`bower install`

Run Grunt
---------

Try the app

`grunt serv`

Build it for production

`grunt build`


Folder structure
----------------
``app`` folder contains the development app

``dist`` folder contains the production app



Other things
------------

When you select a theme for jquery-ui you must edit Gruntfile.js under the 'copy' module
like so: bower_components/jquery-ui/themes/cupertino
