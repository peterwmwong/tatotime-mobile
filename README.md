tatotime-mobile
===============

Getting Started on Linux / Mac OS X
-----------------------------------

### [Installing node.js and NPM](https://github.com/joyent/node/wiki/Installation)

### Get the code

    > git clone git://github.com/peterwmwong/tatotime-mobile.git
    > cd tatotime-mobile/src

### Run development server

    -- Open new terminal --
    > make dev-server

In a browser, visit `http://localhost:3000/index-dev.html?mock-service=true`.

##### Why a development server?

> *It's JUST for live.js and Chrome*. live.js uses XHR to automatically reload JavaScript and CSS, Chrome does not allow XHR over the `file://` protocol ([issue 41024](http://code.google.com/p/chromium/issues/detail?id=41024)).

### Run Stylus/CoffeeScript compilers

    -- Open new terminal --
    > make dev-stylus

    -- Open new terminal --
    > make dev-coffee

This will compile `.styl` *to* `.css` and `.coffee` *to* `.js`.  
File changes will **automatically** be recompiled.
No need to `Alt-Tab` and `F5`. Cool, yah?
Thank you [live.js](http://livejs.com/)!

### Build for production

    > make clean; make

In a browser, visit `http://localhost:3000/?mock-service=true`.

##### What just happened?

All AMD Modules (JS) and CSS relevant for a page load are concatenated and minified into `bootstrap.js` 
and `bootstrap.css`.

How? You might think this is a nightmare to maintain (giant-whitelist-of-doom), but it's not.
One [require.js command](http://requirejs.org/docs/optimization.html#onejs) and [Cell plugin](https://github.com/peterwmwong/cell/blob/master/lib/cell-pluginBuilder.coffee) handles all the tracing of 
dependencies and packaging.
Check out the [Makefile target](https://github.com/peterwmwong/tatotime-mobile/blob/181a0d4a2e4ca2a7ab835cd84695eccf8b7deb0b/Makefile#L43-55) that gets it done.

Getting Started on Windows
--------------------------

Haven't tried, but should work with Node v5.X with the same steps above...

Edit Stylus/CoffeeScript like a Pro
-----------------------------------

* [Sublime Text 2](http://www.sublimetext.com/dev)
  * Use the TextMate bundles below
* [Vim](http://www.vim.org/) or [MacVim](http://code.google.com/p/macvim/)
  * [vim-stylus](https://github.com/wavded/vim-stylus)
  * [vim-coffee-script](https://github.com/kchmck/vim-coffee-script)
* [TextMate](http://macromates.com/)
  * [Stylus TextMate Bundle](https://github.com/LearnBoost/stylus/blob/master/docs/textmate.md)
    * The `Stylus.tmbundle` directory can be found in tatotime-mobile here: `{tatotime-mobile Project Directory}/node_modules/stylus/editors`
  * [CoffeeScript TextMate Bundle](https://github.com/jashkenas/coffee-script-tmbundle)


Credit
======
* [CoffeeScript](http://jashkenas.github.com/coffee-script/) - Better than JavaScript
* [Stylus](http://learnboost.github.com/stylus/) - Better than CSS
* [jQuery](http://jquery.com/) - Better than DOM
* [live.js](http://livejs.com) - Better than Alt-Tab, F5, Alt-Tab, Ctrl+S, Alt-Tab, F5, ...
* [RequireJS](https://github.com/jrburke/requirejs) - Modular JavaScript
* [cell](https://github.com/peterwmwong/cell) - Modular HTML/CSS/JavaScript