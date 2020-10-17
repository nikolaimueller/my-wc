// Component: DialogComponent


// *** Singleton instance. ***
let _refDialogInstance = null

// Currently displayed component inside dialog-component. 
let _currentComponent = null

export function openModal(component, caption, data) {
    if (_currentComponent !== null) {
        Array.from(_refDialogInstance.refContentContainer.children).forEach(child => {
            // $$$ EMIT EVENT :: EVENT_DIALOG_COMPONENT_CLOSING
            child.remove()
        })
    }
    _currentComponent = component

    _refDialogInstance.refContentContainer.appendChild(component)
    _refDialogInstance.refHeaderText.textContent = caption || '(Caption)'

    // Provision data to component.
    if (data && component.setData) {
        component.setData(data)
    }

    // $$$ EMIT EVENT :: EVENT_DIALOG_COMPONENT_OPENED

    _refDialogInstance.style.display = 'block'
}

export function closeModal(component) {
    
    if (_currentComponent !== null) {
        let closeEvent = new CustomEvent(EVENT_DIALOG_COMPONENT_CLOSING, {
            composed: true,
            bubbles: true,
            detail:{ isClosing: true }
        })
        _refDialogInstance.dispatchEvent(closeEvent)
    }

    _refDialogInstance.clearContentContainer()

    _currentComponent = null

    _refDialogInstance.style.display = 'none'

}

// *** DialogComponent stuff ***

export const EVENT_DIALOG_COMPONENT_CLOSING = 'event-dialog-component-closing'
export const EVENT_DIALOG_COMPONENT_OPENED = 'event-dialog-component-opened'

const ID_CONTENT_CONTAINER = 'id-content-container'
const ID_HEADER_TEXT = 'id-header-text'
const ID_HEADER_CLOSE_BUTTON = 'id-header-close-button'

const template = document.createElement('template')
template.innerHTML = `
<div class="header-container">
    <div id="${ID_HEADER_TEXT}" class="header-text">(Header)</div>
    <div id="${ID_HEADER_CLOSE_BUTTON}" class="header-close-button" title="Close Dialog">X</div>
</div>
<div id ="${ID_CONTENT_CONTAINER}" class="content-container"></div>
<div class="footer-container">
    DialogComponent - footer
</div>
`;

export default class DialogComponent extends HTMLElement {
    static get tag() { return 'dialog-component' }
    // static get observedAttributes() { return ['exampleattr'] }
    static get styleSheet_url() {
        // Replace module url's ".js" extension with ".css"
        // Accept an exception to occure here, i.e. if "import.meta.url" doesn't exist !!
        return import.meta.url.substr(0, import.meta.url.length - '.js'.length) + '.css'
    }

    static get instance() {
        if (_refDialogInstance === null) {
            _refDialogInstance = document.createElement(DialogComponent.tag)
            document.body.appendChild(_refDialogInstance)
        }
        return _refDialogInstance
    }

    constructor() {
        super()

        let shadow = this.attachShadow({mode:'open'})

        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link')
        this.refLinkStyle.setAttribute('rel', 'stylesheet')
        this.refLinkStyle.setAttribute('href', DialogComponent.styleSheet_url)
        shadow.appendChild(this.refLinkStyle)

        // Add template content
        shadow.appendChild(template.content.cloneNode(true))

        this.refContentContainer = shadow.getElementById(ID_CONTENT_CONTAINER)
        this.refHeaderText = shadow.getElementById(ID_HEADER_TEXT)
        this.refHeaderCloseButton = shadow.getElementById(ID_HEADER_CLOSE_BUTTON)

        // Event handler binding
        this.on_keyup_body = this.on_keyup_body.bind(this)
        // this.onKeyupEscape = this.onKeyupEscape.bind(this)
        this.on_click_HeaderCloseButton = this.on_click_HeaderCloseButton.bind(this)
    }

    // *** Livecycle callbacks  ***
    // see:  https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        // console.log(`${DialogComponent.tag}.connectedCallback(): NOT IMPLEMENTED !!`)

        if (this.isConnected) {
            document.body.addEventListener('keyup', this.on_keyup_body)
            this.refHeaderCloseButton.addEventListener('click', this.on_click_HeaderCloseButton)
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        // console.log(`${DialogComponent.tag}.disconnectedCallback(): NOT IMPLEMENTED !!`)

        document.body.removeEventListener('keyup', this.on_keyup_body)
        this.refHeaderCloseButton.removeEventListener('click', this.on_click_HeaderCloseButton)
    }

    adoptedCallback() {
        // Invoked each time the custom element is moved to a new document.
        console.log(`${DialogComponent.tag}.adoptedCallback(): NOT IMPLEMENTED !!`)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Invoked each time one of the custom element's attributes is added, removed, or changed.
        console.log(`${DialogComponent.tag}.attributeChangedCallback(): NOT IMPLEMENTED !!`)
        // switch (name) {
        // 	case 'exampleattr':
        // 		// Do something meaningfull with your new attribute value.
        // 		break
        // }
    }

    // Event handler

    on_keyup_body(event) {
        // console.log(`${DialogComponent.tag}.on_keyup_body(): event:`, event)
        if (event.key === 'Escape') {
            closeModal(_currentComponent)
        }
    }

    on_click_HeaderCloseButton(event) {
        closeModal()
    }

    // methods
    clearContentContainer() {
        Array.from(this.refContentContainer.children).forEach(child => {
            child.remove()
        })
    }
}
// Register custom element.
customElements.define(DialogComponent.tag, DialogComponent)