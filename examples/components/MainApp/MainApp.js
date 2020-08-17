import RouteView from '/examples/vendor/my-wc/components/routing/route-view.js';
import RouteLink from '/examples/vendor/my-wc/components/routing/route-link.js';
import { setThemeBaseLink, applyTheme, switchTheme } from '/examples/vendor/my-wc/components/theme-manager/theme-manager.js'

const ID_THEME_SELECT = 'id-theme-select'

const light_theme_Base_Path = '/examples/themes/light-theme'
const dark_theme_Base_Path = '/examples/themes/dark-theme'

const template = document.createElement('template');
template.innerHTML = `
<div class="header">Menu:&nbsp;
    <${RouteLink.tag} title="Home" url="/home"></${RouteLink.tag}> | 
    <${RouteLink.tag} title="About" url="/about"></${RouteLink.tag}> |
    &nbsp; &nbsp; Select Theme: 
    <select id="${ID_THEME_SELECT}">
        <option disabled value="" selected>Please select one</option>
        <option>${light_theme_Base_Path}</option>
        <option>${dark_theme_Base_Path}</option>
    </select>
</div>
<div class="view">
    <${RouteView.tag}></${RouteView.tag}>
</div>
`;

export default class MainApp extends HTMLElement {
    static get tag() { return 'main-app' };
    static get styleSheet_url() {
        // Replace module url's ".js" extension with ".css"
        // Accept an exception to occure here, i.e. if "import.meta.url" doesn't exist !!
        return import.meta.url.substr(0, import.meta.url.length - '.js'.length) + '.css';
    }

    constructor() {
        super()

        let shadow = this.attachShadow({mode:'open'});

        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link');
        this.refLinkStyle.setAttribute('rel', 'stylesheet');
        this.refLinkStyle.setAttribute('href', MainApp.styleSheet_url);
        shadow.appendChild(this.refLinkStyle);

        // Set theme base-path for the whole application.
        this._theme = dark_theme_Base_Path // Uncomment one of thiese 2 lines.
        // this._theme = light_theme_Base_Path // Uncomment one of thiese 2 lines.
        setThemeBaseLink(this._theme)

        // Apply theme.
        applyTheme(shadow, MainApp.styleSheet_url);

        // Add template content
        shadow.appendChild(template.content.cloneNode(true));

        // Pre-select themes select-option
        let refThemeSelect = this.shadowRoot.getElementById(ID_THEME_SELECT)
        let matchOption = Array.from(refThemeSelect.options).find(option => option.textContent === this._theme)
        matchOption.selected = true

        // Event handler, the react way.
        this.on_change_themeSelect = this.on_change_themeSelect.bind(this)
    }

    
    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        // console.log(`${MainApp.tag}.connectedCallback()`)
        if (this.isConnected) {
            let refThemeSelect = this.shadowRoot.getElementById(ID_THEME_SELECT)
            refThemeSelect.addEventListener('change', this.on_change_themeSelect)
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        // console.log(`${MainApp.tag}.disconnectedCallback()`)
        let refThemeSelect = this.shadowRoot.getElementById(ID_THEME_SELECT)
        refThemeSelect.removeEventListener('change', this.on_change_themeSelect)
    }

    on_change_themeSelect(event) {
        // console.log(`${MainApp.tag}.on_change_themeSelect()`, event)
        let refThemeSelect = this.shadowRoot.getElementById(ID_THEME_SELECT)

        let oldBaseThemeLink = '' + this._theme
        let newBaseThemeLink = refThemeSelect.value
        switchTheme(this, oldBaseThemeLink, newBaseThemeLink)
        this._theme = newBaseThemeLink
    }
}

// Register custom element.
customElements.define(MainApp.tag, MainApp);
