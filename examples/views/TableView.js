// Component: TableView
// See:   https://developer.mozilla.org/en-US/docs/Web/Web_Components

import TableWC, { ATTRIBUTE_CLICKS_TO_HANDLE } from '../vendor/my-wc/components/table-wc/TableWC.js'

const MOCK_DATA = {
    cols: [
        {field:'id', name: 'id',         title: 'Record id (id)'},
        {field:'firstName', name: 'First Name', title: 'First Name (firstName)'},
        {field:'lastName', name: 'Last Name',  title: 'Last Name (lastName)'}
    ],
    rows: [
        {id: 123, firstName: 'Nikolai', lastName: 'Müller',     title: 'Mr. Nikolai Müller'},
        {id: 234, firstName: 'Max',     lastName: 'Mustermann', title: 'Mr. Max Mustermann'},
        {id: 345, firstName: 'Klara',   lastName: 'Beispiel',   title: 'Mrs. Klara Beispiel'},
    ]
}

const ID_UL = 'ID_UL'

const template = document.createElement('template')
template.innerHTML = `
<h1>TableView</h1>
<p>Her is a <code>TabelWC</code> ( <code>&lt;table-wc&gt;</code> ) component:</p>
<ul id="${ID_UL}">
    <li>You can <code>click</code> to <b>mark</b> a row or a column</li>
    <li>You can <code>dbl-click</code> to <b>select</b> a row or a column</li>
    <li>Table's content is provisioned via <code>setDataColumns(MOCK_DATA.cols)</code> and <code>setDataRows(MOCK_DATA.rows)</code> -
        the mock-data used here looks like this:
        <br>
        <pre>
const MOCK_DATA = {
    cols: [
        { field: 'id',        name: 'id',         title: 'Record id (id)' },
        { field: 'firstName', name: 'First Name', title: 'First Name (firstName)' },
        { field: 'lastName',  name: 'Last Name',  title: 'Last Name (lastName)' }
    ],
    rows: [
        {id: 123, firstName: 'Nikolai', lastName: 'Müller',     title: 'Mr. Nikolai Müller' },
        {id: 234, firstName: 'Max',     lastName: 'Mustermann', title: 'Mr. Max Mustermann' },
        {id: 345, firstName: 'Klara',   lastName: 'Beispiel',   title: 'Mrs. Klara Beispiel' },
    ]
}
        </pre>
    </li>
    <li>You can register your own event-handlers for <code>clicke</code> and <code>dblclick</code> events emited by &lt;table-wc&gt;</li>
</ul>
`;

export default class TableView extends HTMLElement {
    static get tag() { return 'table-view' }
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
        this.refLinkStyle.setAttribute('href', TableView.styleSheet_url)
        shadow.appendChild(this.refLinkStyle)

        // Add template content
        shadow.appendChild(template.content.cloneNode(true))

        this.refUL = shadow.getElementById(ID_UL)
        this.refTableWC = document.createElement(TableWC.tag)
        this.refTableWC.setAttribute(ATTRIBUTE_CLICKS_TO_HANDLE, '1, 2, 3')
        shadow.insertBefore(this.refTableWC, this.refUL) // Insert <table-wc> before the <ul>.

        // Bind event-handler
        this.on_click_table_wc = this.on_click_table_wc.bind(this)
    }

    // *** Livecycle callbacks  ***
    // see:  https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        console.log(`${TableView.tag}.connectedCallback(): NOT IMPLEMENTED !!`)
        if (this.isConnected) {
            // Provision <table-wc> columns und data.
            this.fetchDataForTable()
            .then(tableData => {
                this.refTableWC.setDataColumns(tableData.cols /* MOCK_DATA.cols */)
                this.refTableWC.setDataRows(tableData.rows /* MOCK_DATA.rows */) // This triggers <table-wc>'s rendering
            })
            .catch(err => {
                console.exception(`${TableView.tag}.connectedCallback - provisioning <table-wc> failed - err:`, err)
            })
            
            // Add event handler for <table-wc>'s click event.
            this.refTableWC.addEventListener('click', this.on_click_table_wc)
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        // console.log(`${TableView.tag}.disconnectedCallback(): NOT IMPLEMENTED !!`)
        this.refTableWC.removeEventListener('click', this.on_click_table_wc)
    }

    adoptedCallback() {
        // Invoked each time the custom element is moved to a new document.
        console.log(`${TableView.tag}.adoptedCallback(): NOT IMPLEMENTED !!`)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Invoked each time one of the custom element's attributes is added, removed, or changed.
        console.log(`${TableView.tag}.attributeChangedCallback(): NOT IMPLEMENTED !!`)
        // switch (name) {
        // 	case 'exampleattr':
        // 		// Do something meaningfull with your new attribute value.
        // 		break
        // }
    }

    // *** fetch data, a async dummy - it returns the MOCK-DATA from above. ***
    fetchDataForTable() {
        return new Promise((resolve, reject) => {
            let data = {
                cols: MOCK_DATA.cols,
                rows: MOCK_DATA.rows
            }
            resolve(data)
        })
    }

    // *** Event handler ***

    on_click_table_wc(event) {
        let clicks = event.detail
        if (clicks === 1) {
            console.log(`${TableView.tag}.on_click_table_wc <table-wc> handler - 'single-click' - event:`, event)
        } else if (clicks === 2) {
            console.log(`${TableView.tag}.on_click_table_wc <table-wc> handler - 'double-click' - event:`, event)
        } else if (clicks === 3) {
            console.log(`${TableView.tag}.on_click_table_wc <table-wc> handler - 'triple-click' - event:`, event)
        }
    }
}
// Register custom element.
customElements.define(TableView.tag, TableView)