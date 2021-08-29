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
import {
    applyTheme, 
    applyStyleSheet as themeManager_applyStyleSheet } from '../theme-manager/theme-manager.js'

export default class RouteView extends HTMLElement {
    static get tag() { return 'route-view' }
    static get observedAttributes() { return ['style-sheet'] }
    static get styleSheet_url() {
        if (import.meta.url.endsWith('.js'))  { return import.meta.url.replace('.js',  '.css') }
        if (import.meta.url.endsWith('.mjs')) { return import.meta.url.replace('.mjs', '.css') }
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

    applyStyleSheet(url) {
        themeManager_applyStyleSheet(this, url)
    }

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        if (this.isConnected) {
            // *** Initial switch-route ***
            let locationHash = location.hash
            if (locationHash === '#/') {
                // Ignore empty route url.
                locationHash = ''
            } else if (locationHash.length > 2 && locationHash.startsWith('#/')) {
                locationHash = locationHash.substr(1) // Drop leading '#' (hashbang).
                let matchRoute = lookupRouteByUrl(locationHash)
                if (!matchRoute) {
                    // Redirect to location.hash only if a matching route has been found.
                    locationHash = ''
                }
            }
            let currentRoute = getCurrentRoute()
            let defaultRoute = getDefaultRoute()
            let newUrl = null;
            if (defaultRoute !== null) {
                newUrl = defaultRoute.url
            }
            if (currentRoute !== null) {
                newUrl = currentRoute.url
            }
            if (locationHash.length > 1) {
                newUrl = locationHash
            }
            // console.log(`+++ ${RouteView.tag}.connectedCallback: - locationHash: '${locationHash}' - currentRoute?.url: '${currentRoute?.url}' - defaultRoute?.url: '${defaultRoute?.url}' => newUrl: '${newUrl}'`)
            switchRoute(newUrl)
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'style-sheet':
                themeManager_applyStyleSheet(this.shadowRoot, newValue)
                break
        }
	}

    switchContent(currentRoute, newUrl) {
        function doSwitchContent(currentRoute, newRoute) {
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

        // console.log(`${RouteView.tag}.switchContent-0: defaultRoute?.url: '${defaultRoute?.url}' -- newUrl: '${newUrl}' -- currentRoute?.tag: <${defaultRoute?.tag}>`)

        let newRoute = lookupRouteByUrl(newUrl)
        if (!newRoute) {
            newRoute = getCurrentRoute()
        }
        if (!newRoute) {
            console.warn(RouteView.tag+'.switchContent: Empty newRoute.')
            return null
        }

        // Handle sync or async loading route's component
        let fuSwitchContent = doSwitchContent.bind(this)
        if (newRoute.component instanceof Promise) {
            let promise = newRoute.component
            promise.then(() => fuSwitchContent(currentRoute, newRoute))
            .catch(err => console.error(err))
        } else {
            return fuSwitchContent(currentRoute, newRoute)
        }
    }
}
// Register custom element.
customElements.define(RouteView.tag, RouteView)