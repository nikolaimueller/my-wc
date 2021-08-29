// Component: WCSelectBox
import {
    applyTheme, 
    applyStyleSheet as themeManager_applyStyleSheet } from '../theme-manager/theme-manager.js'

export const EVENT_MYWC_SELECTBOX_SELECTED = 'mywc-select-box-selected'

export default class WCSelectBox extends HTMLElement {
    static get tag() { return 'wc-select-box' }
    static get observedAttributes() { return ['multiple', 'size', 'empty-option', 'empty-option-text', 'empty-option-clear-text', 'style-sheet'] }
    static get styleSheet_url() {
        if (import.meta.url.endsWith('.js'))  { return import.meta.url.replace('.js',  '.css') }
        if (import.meta.url.endsWith('.mjs')) { return import.meta.url.replace('.mjs', '.css') }
    }

    constructor() {
        super()

        this.data = null
        this.selectedIds = []

        this.attr_multiple = null
        this.attr_size = null 
        this.attr_empty_option = null // '', 'true', 'clear'
        this.attr_empty_option_text = ''
        this.attr_empty_option_clear_text = ''

        let shadow = this.attachShadow({mode:'open'})

        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link')
        this.refLinkStyle.setAttribute('rel', 'stylesheet')
        this.refLinkStyle.setAttribute('href', WCSelectBox.styleSheet_url)
        shadow.appendChild(this.refLinkStyle)
        
        // Apply theme
        applyTheme(shadow, WCSelectBox.styleSheet_url)

        this.refRenderPanel = null

        this.on_input_select = this.on_input_select.bind(this)
    }
    
    applyStyleSheet(url) {
        themeManager_applyStyleSheet(this, url)
    }

    setData(data, selectedIds=null) {
        this.data = data

        if (Array.isArray(selectedIds)) {
            this.selectedIds = selectedIds
        }

        this.render()
    }

    setSelected(id) {
        let isMatchId = this.equalsIds(id, this.selectedIds)
        if (!isMatchId) {
            this.selectedIds.push(id)
            Array.from(this.refSelectElement.options).forEach(option => {
                if (this.equalsIds(option.value, [id.toString()]) === true) {
                    option.setAttribute('selected', true)
                }
            })
        }
    }

    // *** Livecycle callbacks  ***

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        // console.log(`${WCSelectBox.tag}.connectedCallback(): NOT IMPLEMENTED !!`)
        if (this.isConnected) {
            // implement your callback here.
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        // console.log(`${WCSelectBox.tag}.disconnectedCallback(): NOT IMPLEMENTED !!`)
    }

    adoptedCallback() {
        // Invoked each time the custom element is moved to a new document.
        // console.log(`${WCSelectBox.tag}.adoptedCallback(): NOT IMPLEMENTED !!`)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Invoked each time one of the custom element's attributes is added, removed, or changed.
        // console.log(`${WCSelectBox.tag}.attributeChangedCallback(): name: ${name} - oldValue: ${oldValue} - newValue: ${newValue}`)

        switch (name) {
        	case 'multiple':
        		// Do something meaningfull with your new attribute value.
                this.attr_multiple = newValue
        		break
            case 'size':
                this.attr_size = newValue
                break
            // *** Custom options: ***
            case 'empty-option': // '', 'true', 'clear'
                this.attr_empty_option = newValue
                break
            case 'empty-option-text':
                this.attr_empty_option_text = newValue
                break
            case 'empty-option-clear-text':
                this.attr_empty_option_clear_text = newValue
                break
            case 'style-sheet':
                themeManager_applyStyleSheet(this.shadowRoot, newValue)
                break
        }
    }

    equalsIds(id1, ids) {
        if (!Array.isArray(ids)) {
            return false
        }

        let result = false
        for (let i = 0; i < ids.length; i++) {
            let id2 = ids[i]
            if (typeof id1 === 'number' || typeof id1 === 'string') {
                result = id1 === id2
            } else if (id1.low && id2.low && id1.high && id2.high) {
                result = (id1.low === id2.low && id1.high === id2.high)
            }
            if (result === true) {
                break
            }
        }
        return result
    }

    // *** Render ***

    render() {
        // see:  https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select
        // see:  https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement

        function _setBoolAttribute(element, attr, value) {
            if (value === true || value === 'true') {
                let strValue = value.toString()
                element.setAttribute(attr, strValue)
            } else {
                element.removeAttribute(attr)
            }
        }
        function _setValueAttribute(element, attr, value) {
            if (value !== null) {
                element.setAttribute(attr, value.toString())
            }
        }

        // this.refRenderPanel = document.createElement('div')

        if (this.refSelectElement !== undefined) {
            this.refSelectElement.remove()
        }
        this.refSelectElement = document.createElement('select')
        _setBoolAttribute( this.refSelectElement, 'multiple', this.attr_multiple)
        _setValueAttribute( this.refSelectElement, 'size', this.attr_size)        
        this.refSelectElement.addEventListener('input', this.on_input_select)

        // handle attr empty-option
        if (this.attr_empty_option === 'true' || this.attr_empty_option === 'clear') {
            let emptyOption = document.createElement('option')
            if (this.selectedIds.length === 0) {
                emptyOption.setAttribute('selected', true)
            }
            if (this.attr_empty_option === 'true') {
                emptyOption.setAttribute('disabled', true)
            } else if (this.attr_empty_option === 'clear') {
                emptyOption.removeAttribute('disabled')
            }
            emptyOption.value = ''
            if (this.attr_empty_option_text.length > 0) {
                emptyOption.textContent = this.attr_empty_option_text
            }
            this.refSelectElement.appendChild(emptyOption)
        }

        if (Array.isArray(this.data)) {
            this.data.forEach(item => {
                if (item.children) {
                    let refOptGroup = document.createElement('optgroup')
                    refOptGroup.setAttribute('label', item.text)
                    item.children.forEach(child => {
                        let option = document.createElement('option')
                        option.value = child.id
                        option.textContent = child.text.toString()
                        if ((child.selected && child.selected === true) || this.equalsIds(child.id, this.selectedIds)) {
                            option.setAttribute('selected', true)
                        }
                        refOptGroup.appendChild(option)
                    })
                    this.refSelectElement.appendChild(refOptGroup)
                } else {
                    let option = document.createElement('option')
                    option.value = item.id
                    option.textContent = item.text.toString()
                    if ((item.selected && item.selected === true) || this.equalsIds(item.id, this.selectedIds)) {
                        option.setAttribute('selected', true)
                    }
                    this.refSelectElement.appendChild(option)
                }
            })
        }
        this.shadowRoot.appendChild(this.refSelectElement)
        
        //this.refRenderPanel.appendChild(this.refSelectElement)

        // this.shadowRoot.appendChild(this.refRenderPanel)
    }

    // *** Event Handler ***

    on_input_select(event) {
        // console.log(`${WCSelectBox.tag}.on_input_select: event:`, event)

        let selectedOptions = this.refSelectElement.selectedOptions
        let selectedValues = []
        Array.from(selectedOptions).forEach(option => { 
            if (option.value && option.value !== '') {
                selectedValues.push(option.value)
            }
        })

        // Handle attr empty option
        if ( /* this.attr_empty_option === 'true' || */ this.attr_empty_option === 'clear') {
            if (selectedValues.length === 0) {
                if (this.attr_empty_option_clear_text.length > 0) {
                    this.refSelectElement.firstChild.textContent = this.attr_empty_option_text
                }
            } else {
                if (this.attr_empty_option_clear_text.length > 0) {
                    this.refSelectElement.firstChild.textContent = this.attr_empty_option_clear_text
                }
            }
        }

        // Dispatch custom event
        let customEvent = new CustomEvent(EVENT_MYWC_SELECTBOX_SELECTED, {
            detail: { selectedValues: selectedValues },
            composed: true
        })
        this.dispatchEvent(customEvent)
        // console.log(`${WCSelectBox.tag}.on_input_select: emitted custom event:'${EVENT_MYWC_SELECTBOX_SELECTED}', detail:`, customEvent.detail)
    }
}
// Register custom element.
customElements.define(WCSelectBox.tag, WCSelectBox)