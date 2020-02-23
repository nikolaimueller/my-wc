import {switchRoute} from './routing.js';

export default class RouteLink extends HTMLElement {
    static get tag() { return 'route-link'; }
    static get observedAttributes() { return ['url', 'title']; }

    constructor() {
        super();

        this.url = null;

        let shadow = this.attachShadow({ mode:'open' });
        
        this.refSpan = document.createElement('span');
        this.refSpan.onclick = this.onClickHandler;
        this.refSpan.textContent = this.title || '(-Route.Url not set-)';
        
        shadow.appendChild(this.refSpan);
    }

    onClickHandler(e) {
        switchRoute(this.url);
    }
    
	attributeChangedCallback(name, oldValue, newValue) {
		switch (name) {
		  case 'title':
            this.refSpan.textContent = newValue;
			break;
		case 'url':
            this.refSpan.url = newValue;
            this.refSpan.title = newValue;
			break;
        }
	}
}
customElements.define(RouteLink.tag, RouteLink);