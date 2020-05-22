// Component: LoginView
// See:   https://developer.mozilla.org/en-US/docs/Web/Web_Components

import {applyTheme} from '../vendor/my-wc/components/theme-manager/theme-manager.js'

export const EVENT_USER_LOGGED_IN = 'user-logged-in' // Export const to avoid typo (we dispatch an custom-event here, wich will be catched inside index.js)

// HTML template
const ID_LOGIN_BUTTON = 'login-button'
const template = document.createElement('template')
template.innerHTML = `
<h1>LoginView</h1>
<p>Please click the "Login" button to emulate user login.</p>
<p>This view is for demonstration:<br/>
    Show how to intercept routing by redirecting to this Login view, until user has logged in.
</p>
<div>
    <button id="${ID_LOGIN_BUTTON}">Demo Login</button>
</div>
`;

// LoginView implementation -- a demo Login view to show before/after route interception
export default class LoginView extends HTMLElement {
    static get tag() { return 'login-view' }
    static get styleSheet_url() {
        // Replace module url's ".js" extension with ".css"
        // Accept an exception to occure here, i.e. if "import.meta.url" doesn't exist !!
        return import.meta.url.substr(0, import.meta.url.length - '.js'.length) + '.css'
    }

    constructor() {
        super()

        let shadow = this.attachShadow({mode:'open'})

        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link')
        this.refLinkStyle.setAttribute('rel', 'stylesheet')
        this.refLinkStyle.setAttribute('href', LoginView.styleSheet_url)
        shadow.appendChild(this.refLinkStyle)

        //
        applyTheme(shadow, LoginView.styleSheet_url)

        // Add template content
        shadow.appendChild(template.content.cloneNode(true))

        // eventhandler the react.js way
        this.onClickButton = this.onClickButton.bind(this)
    }

    // *** Livecycle callbacks  ***
    // see:  https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        // console.log(`${LoginView.tag}.connectedCallback()`)
        if (this.isConnected) {
            // Add click-button event handler
            let refButton = this.shadowRoot.getElementById(ID_LOGIN_BUTTON)
            refButton.addEventListener('click', this.onClickButton)
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        // console.log(`${LoginView.tag}.disconnectedCallback()`)
        // Remove click-button event handler
        let refButton = this.shadowRoot.getElementById(ID_LOGIN_BUTTON)
        refButton.removeEventListener('click', this.onClickButton)
    }

    // *** DOM-Event handler(s) ***
    onClickButton(event) {
        // console.log(`${LoginView.tag}.onClickButton: event:`, event)
        let customEvent = new CustomEvent(EVENT_USER_LOGGED_IN, {
            bubbles: true,
            cancelable: false,
            detail: {
                account: 'demo_usr1',
                displayName: 'Demo User-1',
                accessToken: '1234568901234567890123456789012'
            }
        })
        document.body.dispatchEvent(customEvent)
    }
}

// Register custom element.
customElements.define(LoginView.tag, LoginView)
