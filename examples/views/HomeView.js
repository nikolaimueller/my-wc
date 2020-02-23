const template = document.createElement('template');
template.innerHTML = `
<h1>Home-View</h1>
<p>Template content comes here.</p>
`;

export default class HomeView extends HTMLElement {
    static get tag() { return 'home-view' };
    static get STYLESHEET_LINK() { return './views/HomeView.css' }

    constructor() {
        super()

        let shadow = this.attachShadow({mode:'open'});

        // Add component's StyleSheet-Link
        this.refLinkStyle = document.createElement('link');
        this.refLinkStyle.setAttribute('rel', 'stylesheet');
        this.refLinkStyle.setAttribute('href', HomeView.STYLESHEET_LINK);
        shadow.appendChild(this.refLinkStyle);

        // Add template content
        shadow.appendChild(template.content.cloneNode(true));
    }
}
// Register custom element.
customElements.define(HomeView.tag, HomeView);
