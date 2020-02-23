# my-wc

*__HINT: This is in a very early stage of development!__*

*You may find my Visual Studio Code snippets for webcomponents [vscode-wc-snippets](https://github.com/nikolaimueller/vscode-wc-snippets) even more helpful ;-)*

These are my native HTML5 web components / custom elements (v1). This is a  frontend package, meant to run in the browser only!  

The idea here is to avoid bundling - HTTP/2 can deliver many small files faster than HTTP/1 can deliver some rare big files.  
Browsers which support native web components also support HTTP/2.  
Further more modern browsers support native javascript modules.

## Installation

*As usual, you will need [Node.js](https://nodejs.org) with [npm](https://www.npmjs.com/) to be installed, before you can install ``my-wc`` into your project. As ``my-wc`` is a pure client (browser) moule/package the Node.js version doesn't matter much.*

Open your favorite shell, navigate into your project folder and run:  
``npm install my-wc --save``


## Component List:

* Routing:
    + route-link ``components/routing/route-links.*`` - switch view (displayed component))
    + route-view ``components/routing/route-view.*`` - place holder component
    + routing core: ``components/routing/`routing.js`` - core functions


## Routing

The ideas behind the routing components are this:
* One component (``route-view``) act as a placeholder for views which can be switched at runtime. Besides the naming, Views are "normal" web components.
* There is a ``route-link`` web component that acts as a link or butten for switching the ``view`` component that is displayed in the ``route-view``.
* In the "Main" part of your application, you have to define and register all your routes. The routing core provides the ``register()`` function for this reason.
* A route definition is an (literal) object contaning the url and the name of the desired view component. One route can be flagged as the default route.


# Examples

> You need a webserver to run the example, or an IDE like Visual Studio Code and an extension like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer).  
In any case the document-root is the ``/examples`` subfolder and the main ducument is ``index.html``.

* The tiny ``index.html`` has an empty \<body\> and includes the ``index.js`` as a native javascript module, which acts as the __main__ entry-point of the example app.
```javascript
<script type="module" src="index.js"></script>
```

* The ``index.js`` defines and registers the route definitions - the module import url for my-wc starts as "``node_modules/my-wc/components/``".
```javascript
import { register } from 'node_modules/my-wc/components/routing/routing.js';
import HomeView from './views/HomeView.js';
import AboutView from './views/AboutView.js';
register({ default: true, url: '/home', component: HomeView });
register({ url: '/about', component: AboutView });
```

* The ``components/MainApp/MainApp.js`` builds a menu by using some ``route-link`` componnt. In addition it provides the ``route-view`` placeholder for displaying the views.
```javascript
import RouteView from 'node_modules/my-wc/components/routing/route-view.js';
import RouteLink from 'node_modules/my-wc/components/routing/route-link.js';

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


## *My developing hints*

*Just for my own, can't remember every syntax details :=(*

### Bump version via npm

``npm version patch -m "Upgrade to %s for reasons"``

 see:  https://docs.npmjs.com/cli-commands/version.html
