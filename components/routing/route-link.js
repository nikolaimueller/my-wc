// Component: RouteLink
import { switchRoute } from './routing.js'
import { applyTheme } from '../theme-manager/theme-manager.js'

export default class RouteLink extends HTMLElement {
    static get tag() { return 'route-link' }
    static get observedAttributes() { return ['url', 'title', 'activated', 'highlight-activated'] }
    static get styleSheet_url() {
        // Replace module url's ".js" extension with ".css"
        // Accept an exception to occure here, i.e. if "import.meta.url" doesn't exist !!
        return import.meta.url.substr(0, import.meta.url.length - '.js'.length) + '.css'
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
        }
	}
}
customElements.define(RouteLink.tag, RouteLink)
