// Component: RouteView
import {
    getCurrentRoute, setCurrentRoute,
    getDefaultRoute,
    registerTarget,
    lookupRouteByUrl,
    interceptBefore,
    interceptAfter,
    switchRoute
} from './routing.js'
import { applyTheme } from '../theme-manager/theme-manager.js'

export default class RouteView extends HTMLElement {
    static get tag() { return 'route-view' }
    static get styleSheet_url() {
        // Replace module url's ".js" extension with ".css"
        // Accept an exception to occure here, i.e. if "import.meta.url" doesn't exist !!
        return import.meta.url.substr(0, import.meta.url.length - '.js'.length) + '.css'
    }
    constructor() {
        super()

        registerTarget(this)

        let shadow = this.attachShadow({ mode: 'open' })

        let styleLink = document.createElement('link')
        styleLink.setAttribute('rel', 'stylesheet')
        styleLink.setAttribute('href', RouteView.styleSheet_url)
        shadow.appendChild(styleLink)

        // Set a specific theme to use
        applyTheme(shadow, RouteView.styleSheet_url);
    }

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        if (this.isConnected) {
            // Initial switch-route
            let currentRoute = getCurrentRoute()
            let defaultRoute = getDefaultRoute()
            let newUrl = null;
            if (defaultRoute !== null) {
                newUrl = defaultRoute.url
            }
            if (currentRoute !== null) {
                newUrl = currentRoute.url
            }
            switchRoute(newUrl)
        }
    }

    switchContent(currentRoute, newUrl) {
        // console.log(`${RouteView.tag}.switchContent-0: defaultRoute?.url: '${defaultRoute?.url}' -- newUrl: '${newUrl}' -- currentRoute?.tag: <${defaultRoute?.tag}>`)

        let newRoute = lookupRouteByUrl(newUrl)
        if (!newRoute) {
            newRoute = getCurrentRoute()
        }
        if (!newRoute) {
            console.warn(RouteView.tag+'.switchContent: Empty newRoute.')
            return null
        }

        // Switch the displayed component
        if (!currentRoute || newRoute.url !== currentRoute.url) {
            // ..Remove old routeView content node (child).
            if (this.refRoutingView) {
                this.shadowRoot.removeChild(this.refRoutingView)
            }
            // ...append new created content node to routeView.
            this.refRoutingView = document.createElement(newRoute.component.tag)
            
            // $$$ TODO: Handle Themes.
            this.refRoutingView.setAttribute('theme', 'theme')

            this.shadowRoot.appendChild(this.refRoutingView)

            // Reflect current route into history state
            let stateObj = null
            history.replaceState(stateObj, `route: ${newRoute.url}`, `#${newRoute.url}`)

            return newRoute
        }
        return null
    }
}
// Register custom element.
customElements.define(RouteView.tag, RouteView)