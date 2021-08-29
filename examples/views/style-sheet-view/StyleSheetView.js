// Component: PrivateCSSView
import {applyTheme} from '../../vendor/my-wc/components/theme-manager/theme-manager.js'

const template = document.createElement('template')
template.innerHTML = `
<h1>Manage CSS Style Sheets</h1>

<p>You can apply custom CSS style-sheets to <code>my-wc</code> components in two ways:
    <ol>
        <li>By theming the whole application</li>
        <li>By applaying private style-sheets</li>
    </ol>
</p>

<p>For details take a look to the wiki page 
    <a href="https://github.com/nikolaimueller/my-wc/wiki/Manage-Themes-and-StyleSheets" target="_my_wiki">Manage-Themes-and-StyleSheets</a>    
</p>
`;

export default class PrivateCSSView extends HTMLElement {
    static get tag() { return 'style-sheet-view' }
    // static get observedAttributes() { return ['exampleattr'] }
    static get styleSheet_url() {
        if (import.meta.url.endsWith('.js'))  { return import.meta.url.replace('.js',  '.css') }
        if (import.meta.url.endsWith('.mjs')) { return import.meta.url.replace('.mjs', '.css') }
    }

    constructor() {
        super()

        let shadow = this.attachShadow({mode:'open'})

        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link')
        this.refLinkStyle.setAttribute('rel', 'stylesheet')
        this.refLinkStyle.setAttribute('href', PrivateCSSView.styleSheet_url)
        shadow.appendChild(this.refLinkStyle)

        // Apply theme
        applyTheme(shadow, PrivateCSSView.styleSheet_url)

        // Add template content
        shadow.appendChild(template.content.cloneNode(true))
    }

    // *** Livecycle callbacks  ***
    // see:  https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        console.log(`${PrivateCSSView.tag}.connectedCallback(): NOT IMPLEMENTED !!`)
        if (this.isConnected) {
            // implement your callback here.
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        console.log(`${PrivateCSSView.tag}.disconnectedCallback(): NOT IMPLEMENTED !!`)
    }

    adoptedCallback() {
        // Invoked each time the custom element is moved to a new document.
        console.log(`${PrivateCSSView.tag}.adoptedCallback(): NOT IMPLEMENTED !!`)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Invoked each time one of the custom element's attributes is added, removed, or changed.
        console.log(`${PrivateCSSView.tag}.attributeChangedCallback(): NOT IMPLEMENTED !!`)
        // switch (name) {
        // 	case 'exampleattr':
        // 		// Do something meaningfull with your new attribute value.
        // 		break
        // }
    }
}
// Register custom element.
customElements.define(PrivateCSSView.tag, PrivateCSSView)