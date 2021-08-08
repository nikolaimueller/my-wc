// Component: SelectView
import {applyTheme} from '../../vendor/my-wc/components/theme-manager/theme-manager.js'
// import WCSelectBox, { EVENT_MYWC_SELECTBOX_SELECTED } from "../../../components/wc-select-box/WCSelectBox.js";
import WCSelectBox, { EVENT_MYWC_SELECTBOX_SELECTED } from "../../vendor/my-wc/components/wc-select-box/WCSelectBox.js";

const MOCK_DATA = [
    { id: 4, text: '(4) Other things'},
    { text: 'Drivers:', children: [
        { id: 12, text: '(12) Hans Mayer' /* , selected: true */ },
        { id: 45, text: '(45) Kasper Hauser' },
        { id: 72, text: '(72) Karin Neumann'},
    ] },
    { text: 'Cars', children: [
        { id: 7, text: '(7) BMW' },
        { id: 9, text: '(9) Audi' },
        { id: 17, text: '(17) VW' },
    ] }
]

const ID_SELECT_BOX = 'ID_SELECT_BOX'
const ID_SELECT_BOX_MULTI = 'ID_SELECT_BOX_MULTI'
const ID_SPAN_SELECTED = 'ID_SPAN_SELECTED'
const ID_SPAN_SELECTEDMULTI = 'ID_SPAN_SELECTEDMULTI'
const ID_PRE_MOCK_DATA = 'ID_PRE_MOCK_DATA'

const template = document.createElement('template')
template.innerHTML = `
<h1>SelectView</h1>
<p>
Examples for data driven select box: one single-option select (select one option at most) and one multi-option select.
<br>
see: <a href="https://github.com/nikolaimueller/my-wc/wiki/Component-WCSelectBox" target="my-wc-wiki">my-wc wiki</a>
</p>
<div>
    <label for="${ID_SELECT_BOX}">WC-Select-Box:
        <br>
        <small>Pre-selected id: [4]
        <br>
        Select id:72 programmatically after 3 secconds</small>
        <br>
        <${WCSelectBox.tag} id="${ID_SELECT_BOX}"
            empty-option="clear"
            empty-option-text="--Please select one--"
            empty-option-clear-text="--Clear selected--"
        "></${WCSelectBox.tag}>
    </label>
    Selected Values: <span id="${ID_SPAN_SELECTED}" class="result"></span>
</div>
<div>
    <label for="${ID_SELECT_BOX_MULTI}">WC-Select-Box Multi/4:
        <br>
        <small>Pre-selected ids: [4,7]
        <br>
        Select id:72 programmatically after 5 secconds</small>
        <br>
        <${WCSelectBox.tag} id="${ID_SELECT_BOX_MULTI}"
            multiple="true"
            size="7"
            empty-option="clear"
            empty-option-text="--Please select options--"
            empty-option-clear-text="--Clear selected options--"
        ></${WCSelectBox.tag}>
    </label>
    Selected Values: <span id="${ID_SPAN_SELECTEDMULTI}" class="result"></span>
</div>
<p><h3>MOCK_DATA:</h3>
    <pre id="${ID_PRE_MOCK_DATA}"></pre>
</p>
`;

export default class SelectView extends HTMLElement {
    static get tag() { return 'select-view' }
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
        this.refLinkStyle.setAttribute('href', SelectView.styleSheet_url)
        shadow.appendChild(this.refLinkStyle)

        // Apply theme
        applyTheme(shadow, SelectView.styleSheet_url)

        // Add template content
        shadow.appendChild(template.content.cloneNode(true))

        this.refSelectBox = shadow.getElementById(ID_SELECT_BOX)
        this.refSelectBoxMulti = shadow.getElementById(ID_SELECT_BOX_MULTI)
        this.refSpanSelected = shadow.getElementById(ID_SPAN_SELECTED)
        this.refSpanSelectedMulti = shadow.getElementById(ID_SPAN_SELECTEDMULTI)

        // Display MOCK_DATA
        this.refPreMockData = shadow.getElementById(ID_PRE_MOCK_DATA)
        shadow.appendChild(this.refPreMockData)

        // Bind Event Handler
        this.on_mywc_selectbox_selected = this.on_mywc_selectbox_selected.bind(this)
        this.on_mywc_selectboxmulti_selected = this.on_mywc_selectboxmulti_selected.bind(this)
    }

    // *** Livecycle callbacks  ***

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        // console.log(`${SelectView.tag}.connectedCallback(): NOT IMPLEMENTED !!`)
        if (this.isConnected) {
            let dummyFetch = Promise.resolve(MOCK_DATA)
            .then(data => {
                console.log(`${SelectView.tag}.connectedCallback: dummy fetch MOCK_DATA:`, data)
                this.refSelectBox.setData(data, [4])
                this.refSelectBox.addEventListener(EVENT_MYWC_SELECTBOX_SELECTED, this.on_mywc_selectbox_selected)
                // 
                this.refSelectBoxMulti.setData(data, [4,7])
                this.refSelectBoxMulti.addEventListener(EVENT_MYWC_SELECTBOX_SELECTED, this.on_mywc_selectboxmulti_selected)
                //
                this.refPreMockData.textContent = JSON.stringify(MOCK_DATA, null, 4)

                // Emulate some user action after 3 and 5 secconds.
                setTimeout(() => {
                    this.refSelectBox.setSelected(72)
                }, 3000)
                setTimeout(() => {
                    this.refSelectBoxMulti.setSelected(72)
                }, 5000)
            })
            .catch(err => console.error(err) )
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        // console.log(`${SelectView.tag}.disconnectedCallback(): NOT IMPLEMENTED !!`)
        this.refSelectBox.addEventListener(EVENT_MYWC_SELECTBOX_SELECTED, this.on_mywc_selectbox_selected)
        this.refSelectBoxMulti.addEventListener(EVENT_MYWC_SELECTBOX_SELECTED, this.on_mywc_selectboxmulti_selected)
    }

    adoptedCallback() {
        // Invoked each time the custom element is moved to a new document.
        // console.log(`${SelectView.tag}.adoptedCallback(): NOT IMPLEMENTED !!`)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Invoked each time one of the custom element's attributes is added, removed, or changed.
        // console.log(`${SelectView.tag}.attributeChangedCallback(): NOT IMPLEMENTED !!`)
        // switch (name) {
        // 	case 'exampleattr':
        // 		// Do something meaningfull with your new attribute value.
        // 		break
        // }
    }

    // *** Event Handler ***
    on_mywc_selectbox_selected(event) {
        // console.log(`${SelectView.tag}.on_mywc_selectbox_selected: event:`, event)
        console.log(`${SelectView.tag}.on_mywc_selectbox_selected: custom event '${EVENT_MYWC_SELECTBOX_SELECTED}', event.detail:`, event.detail)

        let selectedValues = event.detail.selectedValues
        let target = event.target

        if (target === this.refSelectBox) {
            let text = `(len: ${selectedValues.length}) value: [${selectedValues.join().toString()}]`
            this.refSpanSelected.textContent = text
        }
    }

    on_mywc_selectboxmulti_selected(event) {
         // console.log(`${SelectView.tag}.on_mywc_selectboxmulti_selected: event:`, event)
         EVENT_MYWC_SELECTBOX_SELECTED
         console.log(`${SelectView.tag}.on_mywc_selectboxmulti_selected: custom event '${EVENT_MYWC_SELECTBOX_SELECTED}', event.detail:`, event.detail)

        let selectedValues = event.detail.selectedValues
        let target = event.target
        
        if (target === this.refSelectBoxMulti) {
            let text = `(len: ${selectedValues.length}) values: [${selectedValues.join().toString()}]`
            this.refSpanSelectedMulti.textContent = text
        }
    }
}
// Register custom element.
customElements.define(SelectView.tag, SelectView)