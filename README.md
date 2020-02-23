# my-wc

*__HINT: This is in a very early stage of development!__*

*You may find my Visual Studio Code snippets for webcomponents [vscode-wc-snippets](https://github.com/nikolaimueller/vscode-wc-snippets) even more helpful ;-)*

This are my native HTML5 web components / custom elements (v1).

## Install

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

* The ``index.html`` is tiny: It has an empty \<body\> tag and includes the ``index.js`` file, which is the "MAIN" of the example page. And links some 
CSS file.

* The ``index.js`` defines and registers the route definitions.
```javascript
import { register } from 'node_modules/my-wc/components/routing/routing.js';
import HomeView from './views/HomeView.js';
import AboutView from './views/AboutView.js';
register({ default: true, url: '/home', component: HomeView });
register({ url: '/about', component: AboutView });
```

* The ``components/MainApp/MainApp.js`` builds a menu by using some ``route-link`` componnt. In addition it provides the ``route-view`` placeholder for displaying the views.
```javascript
import RouteView from '../../../components/routing/route-view.js';
import RouteLink from '../../../components/routing/route-link.js';

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
// The custom element/web component implementation comes here...
```


## *My developing hints*

*Just for my own, can't remember every syntax details :=(*

### Bump version via npm

``npm version patch -m "Upgrade to %s for reasons"``

 see:  https://docs.npmjs.com/cli-commands/version.html
