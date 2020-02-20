const template = document.createElement('template');
template.innerHTML = `
<h1>About-View</h1>
<p>Template comes here.</p>
`;

export default class AboutView extends HTMLElement {
    static get tag() { return 'about-view' };
    static get STYLESHEET_LINK() { return './views/AboutView.css' }

    constructor() {
        super()

        let shadow = this.attachShadow({mode:'open'});

        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link');
        this.refLinkStyle.setAttribute('rel', 'stylesheet');
        this.refLinkStyle.setAttribute('href', AboutView.STYLESHEET_LINK);
        shadow.appendChild(this.refLinkStyle);

        // Add template content
        shadow.appendChild(template.content.cloneNode(true));
    }
}
// Register custom element.
customElements.define(AboutView.tag, AboutView);
