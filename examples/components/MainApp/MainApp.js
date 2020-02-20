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

export default class MainApp extends HTMLElement {
    static get tag() { return 'main-app' };
    static get STYLESHEET_LINK() { return './components/MainApp/MainApp.css' }

    constructor() {
        super()

        let shadow = this.attachShadow({mode:'open'});

        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link');
        this.refLinkStyle.setAttribute('rel', 'stylesheet');
        this.refLinkStyle.setAttribute('href', MainApp.STYLESHEET_LINK);
        shadow.appendChild(this.refLinkStyle);

        // Add template content
        shadow.appendChild(template.content.cloneNode(true));
    }
}

// Register custom element.
customElements.define(MainApp.tag, MainApp);
