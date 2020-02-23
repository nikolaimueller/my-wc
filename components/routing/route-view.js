import { getCurrentRoute, registerTarget, lookupRouteByUrl } from './routing.js';

export default class RouteView extends HTMLElement {
    static get tag() { return 'route-view'; }
    constructor() {
        super();

        registerTarget(this);

        let shadow = this.attachShadow({ mode: 'open' });

        let styleLink = document.createElement('link');
        styleLink.setAttribute('rel', 'stylesheet');
        styleLink.setAttribute('href', '/node_modules/my-wc/components/routing/route-view.css');
        shadow.appendChild(styleLink);

        let currentRoute = getCurrentRoute();
        if (currentRoute !== null && currentRoute.component) {
            this.refRoutingView = document.createElement(currentRoute.component.tag);
        } else {
            this.refRoutingView = document.createElement('div');
            this.refRoutingView.textContent = '((empty currentView))';
        }
        shadow.appendChild(this.refRoutingView);
    }

    handleSwitchRoute(currentRoute, newUrl) {
        let newRoute = lookupRouteByUrl(newUrl);
        if (!newRoute) {
            newRoute = getCurrentRoute();
        }
        if (!newRoute) {
            console.warn(RouteView.tag+'.handleSwitchRoute: Empty newRoute.');
            return null;
        }
        if (!currentRoute || newRoute.url !== currentRoute.url) {
            // Fire switch
            this.shadowRoot.removeChild(this.refRoutingView);
            this.refRoutingView = document.createElement(newRoute.component.tag);
            
            // $$$ TODO: Handle Themes.
            this.refRoutingView.setAttribute('theme', 'theme');

            this.shadowRoot.appendChild(this.refRoutingView);
            return newRoute;
        }
        return null;
    }
}
customElements.define(RouteView.tag, RouteView);