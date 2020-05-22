# my-wc

__index:__

* [my-wc](#my-wc)
    + [Installation](#Installation)
    + [Components](#Components)
    + [Routing Components](#Routing-Components)
    + [Theme Manager](#Theme-Manager)
* [Examples](#Examples)
    + [Prerequisites](#Prerequisites)
    + [Build the example](#Build-the-example)
    + [How routing works in the example](#How-routing-works-in-the-example)


*__HINT: This is in a very early stage of development!__*

*You may find my Visual Studio Code snippets for webcomponents [vscode-wc-snippets](https://github.com/nikolaimueller/vscode-wc-snippets) even more helpful ;-)*

These are my native HTML5 web components / custom elements (v1). This is a  frontend package, meant to run in the browser only!  

The idea here is to avoid bundling - HTTP/2 can deliver many small files faster than HTTP/1 can deliver some rare big files (well, that's not allways true).  
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
    + route-link ``components/routing/route-links.*`` - switch view (displayed component)
    + route-view ``components/routing/route-view.*`` - place-holder component
    + routing core: ``components/routing/`routing.js`` - core functions
* theme-manager (module, not a component):
    + theme-manager ``components/theme-manager/theme-manager.js`` - handle CSS themes

^ [top](#my-wc)

## Routing Components

The ideas behind the routing components are this:
* One component (``route-view``) act as a placeholder for views which can be switched at runtime. Besides the naming, Views are "normal" web components.
* There is a ``route-link`` web component that acts as a link or butten for switching the ``view`` component that is displayed in the ``route-view``.
* In the "Main" part of your application, you have to define and register all your routes. The routing core provides the ``register()`` function for this purpose.
* A route definition is an (literal) object, contaning the url and the class name of the desired view component. One of the routes can be flagged as the ``default`` route, which is automatically switched to, if no other route has been activated, i.e. after starting the application in the browser.
* Switching route can be intercepted before and after the switch - `registerBeforeGlobalRoute((oldUrl, oldView, newUrl) => {...}` and `registerAfterGlobalRoute((oldUrl, newUrl, newView)  => {...}` - the before interceptor can redirect to another (registered) route.

^ [top](#my-wc)

## Theme Manager

Theme manager is not a component on it's own, but a collection of functions, meant to handle CSS stylesheets for custom components.  
> The big advantage of this css-theme implementation for components using shadowRoot is:  
You can apply literaly every styling for every element inside your shadow tree and the host element!

> The downside of this implementation is: you will end up with many many more `*.css` files.

* By convention, all sources building a component reside together in one folder.
* By convention, a component has a default stylesheet applied at construction time.
* The theme is implemented as a _additional_ stylesheet `<link rel="stylesheet">` to the shadowRoot of a component ( a sibling of the default stylesheet).
* The folder and `*.css` file structure of the origin component is mirrored into theme specific folders (one folder for each theme).
* The main folder of a theme than act as the 'switch argument' to identify a theme.

__Exported Functions:__

* `setThemeBaseLink(baseThemeLink)` - Set the absolute path of the themes path to use. (example: `/styles/themes/dark-theme`) to denote a specific theme. Call this only once in your app, typically from your main compopnent!
* `applyTheme(documentFragment, stylesheetLink)` nomen est omen - call this once in the constructor of your custom component. `documentFragment` is the shadowRoot of your component. `stylesheetLink` is the __absolute__ url to your __default__ stylesheet file - this is quite easy to achieve, take a look into the example views.
* `switchTheme(rootElement, oldBaseThemeLink, newBaseThemeLink)` - switch current theme stylesheets at runtime. `rootElement` is the main component in your app (where you called `setThemeBaseLink`). The `oldBaseThemeLink` is the current `baseThemeLink` set before (in your main component). `newBaseThemeLink` is the new `baseThemeLink` to use as the themes path. This function is typically used only at one place in your app, i.e. a event handler selecting a theme.

To start, take a look at `examples/components/MainApp/MainApp.js` and at some of the views, ie. `examples/views/HomeView.js`.

The default `*.css` files are mirrored from their respective component-folder into `examples/themes/light-theme/...` and `examples/themes/dark-theme/...` - that is: the folder and file structure is copied, while the file content is not copied. You can identify missing theme stylesheet via dev-tools of your browser.

Theme relevant stylesheets elements have set the `name` attribute to `theme-manager` - while switching theme, this is internally used by theme-manager, to identify themable elements (switch theme means to recursively traverse the DOM tree).


^ [top](#my-wc)

# Examples

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
import { register } from '/examples/vendor/my-wc/components/routing/routing.js'
import HomeView from './views/HomeView.js'
import AboutView from './views/AboutView.js'

register({ default: true, url: '/home', component: HomeView })
register({ url: '/about', component: AboutView })

// *** MAIN APP ***
import MainApp from './components/MainApp/MainApp.js'
let mainApp = document.createElement(MainApp.tag)
document.body.appendChild(mainApp)
```

* The ``components/MainApp/MainApp.js`` builds a menu by using some ``route-link`` componnt. In addition it provides the ``route-view`` placeholder for displaying the views.

```javascript
import RouteView from '/examples/vendor/my-wc/components/routing/route-view.js'
import RouteLink from '/examples/vendor/my-wc/components/routing/route-link.js'

const template = document.createElement('template')
template.innerHTML = `
<div class="header">Menu:&nbsp;
    <${RouteLink.tag} title="Home" url="/home"></${RouteLink.tag}> | 
    <${RouteLink.tag} title="About" url="/about"></${RouteLink.tag}>
</div>
<div class="view">
    <${RouteView.tag}></${RouteView.tag}>
</div>
`
// The MainApp (<main-app>) implementation comes here...
```

* Intercepting before and/or after route switch - see: `examples/index.js`:
    + At it's hard `registerBeforeGlobalRoute` and `registerAfterGlobalRoute` each take an interception callback wich is invoked before or after switching route. 
    + The before interceptor redirects to the `/login` view unless user has been loggedin. 
    + The `LoginView` emits `EVENT_USER_LOGGED_IN` event when user logged in...
    + ...this event will be catched by `onUserLoggedIn` custom event handler, which - finally - does a progammatial route switch to the `/home` route.
    + Puh!

```javascript
import { register,
    switchRoute, registerBeforeGlobalRoute, registerAfterGlobalRoute
} from '/examples/vendor/my-wc/components/routing/routing.js'

import LoginView, { EVENT_USER_LOGGED_IN } from './views/LoginView.js'

register({ url: '/login', component: LoginView })

// Current User: demo for routing interception:
let currentUser = {
    account: '',
    displayName: '',
    accessToken: null
}

// Add a intercept-routing callback - before switching route.
// Switching can be redirected by returning a registered routing url.
registerBeforeGlobalRoute((oldUrl, oldView, newUrl) => {
    // Return routing-url {string} to redirect to url.
    // Return null or undefined to proceed normal routing.
    if (currentUser.accessToken === null) {
        // User not logged in -- redirect him to the login page
        console.log(`Custom "beforeGlobalRoute" interceptor: -- oldUrl: '${oldUrl}' -- newUlr: '${newUrl}' -- oldView:`, oldView)
        return '/login'
    }
    return null
})

// Add a intercept-routing callback - after route has been switched.
// Switching cannot be "undone" i.e redirected to another route.
registerAfterGlobalRoute((oldUrl, newUrl, newView)  => {
    if (true === true) { // dummy condition
        console.log(`Custom "afterGlobalRoute" interceptor: -- oldUrl: '${oldUrl}' -- newUrl: '${newUrl}' -- newView:`, newView)
    }
})

// *** MAIN APP ***
import MainApp from './components/MainApp/MainApp.js'

function onUserLoggedIn(event) {
    currentUser.account = event.detail.account
    currentUser.accessToken = event.detail.accessToken
    currentUser.displayName = event.detail.displayName
    // Programmatically switch route
    switchRoute('/home')
}

let mainApp = document.createElement(MainApp.tag)

document.body.appendChild(mainApp)
document.body.addEventListener(EVENT_USER_LOGGED_IN, onUserLoggedIn.bind(mainApp))
```

^ [top](#my-wc)

## *My developing hints*

*Just for my own, can't remember every syntax details :=(*

### Bump version via npm

``npm version patch -m "Upgrade to %s for reasons"``

 see:  https://docs.npmjs.com/cli-commands/version.html

^ [top](#my-wc)
