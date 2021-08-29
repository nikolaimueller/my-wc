// Component: RouteLink
import { switchRoute } from './routing.js'
import { 
    applyTheme, 
    applyStyleSheet as themeManager_applyStyleSheet } from '../theme-manager/theme-manager.js' 

export default class RouteLink extends HTMLElement {
    static get tag() { return 'route-link' }
    static get observedAttributes() { return ['url', 'title', 'activated', 'highlight-activated', 'style-sheet'] }
    static get styleSheet_url() {
        if (import.meta.url.endsWith('.js'))  { return import.meta.url.replace('.js',  '.css') }
        if (import.meta.url.endsWith('.mjs')) { return import.meta.url.replace('.mjs', '.css') }
    }

    constructor() {
        super()

        this.url = null

        let shadow = this.attachShadow({ mode:'open' })
        
        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link')
        this.refLinkStyle.setAttribute('rel', 'stylesheet')
        this.refLinkStyle.setAttribute('href', RouteLink.styleSheet_url)
        shadow.appendChild(this.refLinkStyle)

        // Applay theme
        applyTheme(shadow, RouteLink.styleSheet_url);
        
        this.refSpan = document.createElement('span')
        this.refSpan.textContent = this.title || '(-Route.Url not set-)'
        
        shadow.appendChild(this.refSpan)

        this.onClickHandler = this.onClickHandler.bind(this)
    }

    applyStyleSheet(url) {
        themeManager_applyStyleSheet(this, url)
    }

    onClickHandler(e) {
        switchRoute(e.target.url, this)
    }

    connectedCallback() {
        if (this.isConnected) {
            this.refSpan.addEventListener('click', this.onClickHandler)
        }
    }

    disconnectedCallback() {
        this.refSpan.removeEventListener('click', this.onClickHandler)
    }
    
	attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'title':
                this.refSpan.textContent = newValue
                break
            case 'url':
                this.refSpan.url = newValue
                this.refSpan.title = newValue
                break
            case 'activated':
                // Highlighting activated route-link is the default behavior.
                let isHighlightActivated = (!this.hasAttribute('highlight-activated') || this.getAttribute('highlight-activated') === 'true')

                if (isHighlightActivated === true) {
                        if (newValue === 'true') {
                            this.refSpan.classList.add('activated')
                        } else {
                            this.refSpan.classList.remove('activated')
                        }
                    }
                break
            case 'highlight-activated':
                // No action needed here, see 'activated' attribute.
                break
            case 'style-sheet':
                themeManager_applyStyleSheet(this.shadowRoot, newValue)
                break
        }
	}
}
customElements.define(RouteLink.tag, RouteLink)
