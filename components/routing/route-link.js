// Component: RouteLink
import { switchRoute } from './routing.js'

export default class RouteLink extends HTMLElement {
    static get tag() { return 'route-link' }
    static get observedAttributes() { return ['url', 'title'] }
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
        
        this.refSpan = document.createElement('span')
        this.refSpan.onclick = this.onClickHandler
        this.refSpan.textContent = this.title || '(-Route.Url not set-)'
        
        shadow.appendChild(this.refSpan)
    }

    onClickHandler(e) {
        switchRoute(this.url)
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
        }
	}
}
customElements.define(RouteLink.tag, RouteLink)
