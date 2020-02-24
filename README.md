# my-wc

__index:__

* [my-wc](#my-wc)
    + [Installation](#Installation)
    + [Components](#Components)
    + [Routing Components](#Routing%20Components)
* [Examples](#Examples)
    + [Prerequisites](#Prerequisites)
    + [Build the example](#Build%20the%20example)
    + [How routing works in the example](#How%20routing%20works%20in%20the%20example)


*__HINT: This is in a very early stage of development!__*

*You may find my Visual Studio Code snippets for webcomponents [vscode-wc-snippets](https://github.com/nikolaimueller/vscode-wc-snippets) even more helpful ;-)*

These are my native HTML5 web components / custom elements (v1). This is a  frontend package, meant to run in the browser only!  

The idea here is to avoid bundling - HTTP/2 can deliver many small files faster than HTTP/1 can deliver some rare big files (that's not allways true).  
Browsers which support native web components also support HTTP/2.  
Further more modern browsers support native javascript modules.

^ [top](#my-wc)

## Installation

As usual, you will need [Node.js](https://nodejs.org) with [npm](https://www.npmjs.com/) to be installed, before you can install ``my-wc`` into your project.

Open your favorite shell, navigate into your project folder and run:  
``npm install my-wc --save``

^ [top](#my-wc)

## Components

* Routing:
    + route-link ``components/routing/route-links.*`` - switch view (displayed component))
    + route-view ``components/routing/route-view.*`` - place holder component
    + routing core: ``components/routing/`routing.js`` - core functions

^ [top](#my-wc)

## Routing Components

The ideas behind the routing components are this:
* One component (``route-view``) act as a placeholder for views which can be switched at runtime. Besides the naming, Views are "normal" web components.
* There is a ``route-link`` web component that acts as a link or butten for switching the ``view`` component that is displayed in the ``route-view``.
* In the "Main" part of your application, you have to define and register all your routes. The routing core provides the ``register()`` function for this purpose.
* A route definition is an (literal) object, contaning the url and the class name of the desired view component. One of the routes can be flagged as the ``default`` route, which is automatically switched to, if no other route has been activated, i.e. after starting the application in the browser.

^ [top](#my-wc)

# Examples

^ [top](#my-wc)

## Prerequisites

You need these npm packages: ``ncp``, ``rimraf`` and ``mkdirp``.

You also need a webserver to run the example, or an IDE like Visual Studio Code and an extension like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).  
In any case the document-root is the ``/examples`` subfolder and the main ducument is ``index.html``.

^ [top](#my-wc)

## Build the example

Before you can run the example(s) you have to execute this in your shell - you need to do this only one time:
```bash
cd {your-project-path}
npm install ncp rimraf mkdirp

cd ./node_modules/my-wc
npm run build
```

__Hint:__  
In ``my-wc/package.json`` you will find the scripts ``build``, ``clean``, ``prebuild``, ``build-1`` and ``build-2``. These script use the npm packages ``ncp``, ``rimraf`` and ``mkdirp``. The ``build`` script creates a sub folder ``vendor`` below the ``examples`` folder and copies all files and folders from the ``components`` folder into it. You can run the ``clean`` script to get rid of the ``vendor`` folder.  
All in all, these scripts act as a deployment without bundling.

```json
"scripts": {
    "clean": "rimraf ./examples/vendor",
    "prebuild": "npm run clean -s",
    "build": "npm run build-1 -s  &  npm run build-2 -s",
    "build-1": "node_modules/.bin/mkdirp ./examples/vendor/my-wc/components",
    "build-2": "node_modules/.bin/ncp ./components ./examples/vendor/my-wc/components"
}
```

^ [top](#my-wc)

## How routing works in the example

* The tiny ``index.html`` has an empty \<body\> and includes the ``index.js`` as a native javascript module, which acts as the __main__ entry-point of the example app and provisions the \<body\>.
```javascript
<script type="module" src="index.js"></script>
```

* The ``index.js`` defines and registers the __route definitions__ - the module import url for my-wc starts as "``/examples/vendor/my-wc/components/routing/``".
```javascript
import { register } from '/examples/vendor/my-wc/components/routing/routing.js';
import HomeView from './views/HomeView.js';
import AboutView from './views/AboutView.js';
register({ default: true, url: '/home', component: HomeView });
register({ url: '/about', component: AboutView });
```

* The ``components/MainApp/MainApp.js`` builds a menu by using some ``route-link`` componnt. In addition it provides the ``route-view`` placeholder for displaying the views.
```javascript
import RouteView from '/examples/vendor/my-wc/components/routing/route-view.js';
import RouteLink from '/examples/vendor/my-wc/components/routing/route-link.js';

const template = document.createElement('template');
template.innerHTML = `
<div class="header">Menu:&nbsp;
    <${RouteLink.tag} title="Home" url="/home"></${RouteLink.tag}> | 
    <${RouteLink.tag} title="About" url="/about"></${RouteLink.tag}>
</div>
<div class="view">
    <${RouteView.tag}></${RouteView.tag}>
</div>
`;
// The MainApp (<main-app>) implementation comes here...
```

^ [top](#my-wc)

## *My developing hints*

*Just for my own, can't remember every syntax details :=(*

### Bump version via npm

``npm version patch -m "Upgrade to %s for reasons"``

 see:  https://docs.npmjs.com/cli-commands/version.html

^ [top](#my-wc)