import {applyTheme} from '../vendor/my-wc/components/theme-manager/theme-manager.js'

const template = document.createElement('template');
template.innerHTML = `
<h1>About-View</h1>
<p>Template content comes here.</p>
`;

export default class AboutView extends HTMLElement {
    static get tag() { return 'about-view' };
    static get styleSheet_url() {
        // Replace module url's ".js" extension with ".css"
        // Accept an exception to occure here, i.e. if "import.meta.url" doesn't exist !!
        return import.meta.url.substr(0, import.meta.url.length - '.js'.length) + '.css';
    }

    constructor() {
        super()

        let shadow = this.attachShadow({mode:'open'});

        // Add component's StyleSheet-Link
        this.refLinkStyle = document.createElement('link');
        this.refLinkStyle.setAttribute('rel', 'stylesheet');
        this.refLinkStyle.setAttribute('href', AboutView.styleSheet_url);
        shadow.appendChild(this.refLinkStyle);

        // Apply theme
        applyTheme(shadow, AboutView.styleSheet_url)

        // Add template content
        shadow.appendChild(template.content.cloneNode(true));
    }
}
// Register custom element.
customElements.define(AboutView.tag, AboutView);
