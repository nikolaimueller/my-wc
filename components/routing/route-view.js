// Component: RouteView
import {
    getCurrentRoute, setCurrentRoute,
    getDefaultRoute,
    registerTarget,
    lookupRouteByUrl,
    interceptBefore,
    interceptAfter
} from './routing.js'

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
    }

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        if (this.isConnected) {
            let currentRoute = getCurrentRoute()
            let defaultRoute = getDefaultRoute()
            this.handleSwitchRoute(null, defaultRoute, currentRoute?.url)
        }
    }

    handleSwitchRoute(currentRoute, defaultRoute, newUrl) {
        // console.log(`${RouteView.tag}.handleSwitchRoute-0: defaultRoute?.url: '${defaultRoute?.url}' -- newUrl: '${newUrl}' -- currentRoute?.tag: <${defaultRoute?.tag}>`)

        let newRoute = lookupRouteByUrl(newUrl)
        if (!newRoute) {
            newRoute = getCurrentRoute()
        }
        if (!newRoute) {
            console.warn(RouteView.tag+'.handleSwitchRoute: Empty newRoute.')
            return null
        }
        
        // Handle interception before routing
        let redirectUrl
        redirectUrl = interceptBefore(currentRoute?.url, currentRoute?.component, newRoute.url)
        if (typeof redirectUrl === 'string' && redirectUrl.length > 0) {
            newRoute = lookupRouteByUrl(redirectUrl)
        }

        // Switch the displayed component
        if (!currentRoute || newRoute.url !== currentRoute.url) {
            // ..Remove old routeView content node (child).
            if (this.refRoutingView) {
                this.shadowRoot.removeChild(this.refRoutingView)
            }
            // ...Append new created content node ti routeView.
            this.refRoutingView = document.createElement(newRoute.component.tag)
            
            // $$$ TODO: Handle Themes.
            this.refRoutingView.setAttribute('theme', 'theme')

            this.shadowRoot.appendChild(this.refRoutingView)

            let stateObj = null
            history.replaceState(stateObj, `route: ${newRoute.url}`, `#${newRoute.url}`)

            console.warn(RouteView.tag+'.handleSwitchRoute: handle intercetion after routing.')
            // $$$ TODO: Handle interception after routing
            // $$$

            return newRoute
        }
        return null
    }
}
// Register custom element.
customElements.define(RouteView.tag, RouteView)