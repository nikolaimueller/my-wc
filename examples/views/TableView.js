// Component: TableView
// See:   https://developer.mozilla.org/en-US/docs/Web/Web_Components

import { applyTheme, applyStyleSheet } from '../vendor/my-wc/components/theme-manager/theme-manager.js'
import TableWC, { 
    ATTRIBUTE_CLICKS_TO_HANDLE, 
    EVENT_TABLEWC_CELL_SELECTED 
} from '../vendor/my-wc/components/table-wc/TableWC.js'

const MOCK_DATA = {
    cols: [
        {field: 'id',          name: 'id',         title: 'Record id (id)' },
        {field: 'active',      name: 'Is Active',  title: 'Is Active' },
        {field: 'firstName',   name: 'First Name', title: 'First Name (firstName)' },
        {field: 'lastName',    name: 'Last Name',  title: 'Last Name (lastName)' },
        {field: 'role',        name: 'Role',       title: 'Role Select' },
        {field: 'action',      name: 'Action',     title: 'Custom rendering' }
    ],
    rows: [
        {id: 123, active: "true",  firstName: 'Nikolai', lastName: 'Müller',     role: {value:'SysAdmin'}, title: 'Mr. Nikolai Müller', },
        {id: 234, active: "false", firstName: 'Max',     lastName: 'Mustermann', role: {value:'User'},     title: 'Mr. Max Mustermann', },
        {id: 345, active: "true",  firstName: 'Klara',   lastName: 'Beispiel',   role: {value:'Manager'},  title: 'Mrs. Klara Beispiel', },
    ]
}

const ID_TABLE_CONTAINER = 'ID_TABLE_CONTAINER'
const ID_DETAILS_CONTAINER = 'ID_DETAILS_CONTAINER'

const ID_INPUT_ID = 'ID_INPUT_ID'
const ID_INPUT_ACTIVE = 'ID_INPUT_ACTIVE'
const ID_INPUT_FIRST_NAME = 'ID_INPUT_FIRST_NAME'
const ID_INPUT_LAST_NAME = 'ID_INPUT_LAST_NAME'
const ID_INPUT_ROLE = 'ID_INPUT_ROLE'

const ID_BUTTON_SAVE = 'ID_BUTTON_SAVE'
const ID_BUTTON_ADD = 'ID_BUTTON_ADD'

const ID_TABLE_WC2 = 'ID_TABLE_WC2'

const template = document.createElement('template')
template.innerHTML = `
<h1>TableView</h1>
<div class="table-detail-flex-container">

    <div id="${ID_TABLE_CONTAINER}" class="table-flex-item">
        <p>This is a <code>TabelWC</code> ( <code>&lt;table-wc&gt;</code> ) component:</p>
        <${TableWC.tag} id="${ID_TABLE_WC2}" ${ATTRIBUTE_CLICKS_TO_HANDLE}="1, 2, 3"></${TableWC.tag}>
    </div>

    <div id="${ID_DETAILS_CONTAINER}" class="detail-flex-item">
        <div class="detail-row"><b>Details (Selected Row):</b></div>
        <div class="detail-row">
            <label for="${ID_INPUT_ID}">id:</label><input id="${ID_INPUT_ID}" type="text" disabled />
        </div>
        
        <div class="detail-row">
            <label for="${ID_INPUT_ACTIVE}">Is Active:</label><input id="${ID_INPUT_ACTIVE}" type="text"/>
        </div>
        <div class="detail-row">
            <label for="${ID_INPUT_FIRST_NAME}">First Name:</label><input id="${ID_INPUT_FIRST_NAME}" type="text"/>
        </div>
        <div class="detail-row">
            <label for="${ID_INPUT_LAST_NAME}">Last Name:</label><input id="${ID_INPUT_LAST_NAME}" type="text"/>
        </div>
        <div class="detail-row">
            <label for="${ID_INPUT_LAST_NAME}">Role:</label>
            <select id="${ID_INPUT_ROLE}" type="text">
                <option disabled>--Select Role--</option>
                <option>User</option>
                <option>Manager</option>
                <option>SysAdmin</option>
            </select>
        </div>
        <div class="detail-row">
            <label for="${ID_BUTTON_SAVE}"> &nbsp; </label><button id="${ID_BUTTON_SAVE}" class="button-save" disabled>Save</button>
        </div>
        <div class="detail-row">
            <label for="${ID_BUTTON_ADD}"> &nbsp; </label><button id="${ID_BUTTON_ADD}" class="button-add">Add</button>
        </div>
    </div>

</div>

<ul>
    <li>You can <code>click</code> once to <b>mark</b> a row or a column</li>
    <li>You can <code>click</code> twice to <b>select</b> a row or a column</li>
    <li>You can <code>click</code> 3 times to <b>activate</b> a row or a column</li>
    <li>Table's content is provisioned via <code>setDataColumns(MOCK_DATA.cols)</code> and <code>setDataRows(MOCK_DATA.rows)</code> -
        the mock-data used here looks like this:
        <br>
        <pre>
const MOCK_DATA = {
    cols: [
        {field: 'id',        name: 'id',         title: 'Record id (id)' },
        {field: 'firstName', name: 'First Name', title: 'First Name (firstName)' },
        {field: 'lastName',  name: 'Last Name',  title: 'Last Name (lastName)' },
        {field: 'role',      name: 'Role',       title: 'Role' },
        {field: 'action',    name: 'Action',     title: 'Custom rendering' }
    ],
    rows: [
        {id: 123, firstName: 'Nikolai', lastName: 'Müller',     role: 'Admin',   title: 'Mr. Nikolai Müller', },
        {id: 234, firstName: 'Max',     lastName: 'Mustermann', role: 'User',    title: 'Mr. Max Mustermann', },
        {id: 345, firstName: 'Klara',   lastName: 'Beispiel',   role: 'Manager', title: 'Mrs. Klara Beispiel', },
    ]
}
        </pre>
    </li>
    <li>You can register your own event-handlers for <code>click</code> and <code>dblclick</code> events emited by &lt;table-wc&gt;, also triple-clicks are supported</li>
    <li>Optionally assign custom-rendering functions to header columns and data rows. So you can render special formatting or things like action buttons</li>
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
        
        // Apply theme
        applyTheme(shadow, TableView.styleSheet_url)

        // Add template content
        shadow.appendChild(template.content.cloneNode(true))
        
        this.refTableContainer = shadow.getElementById(ID_TABLE_CONTAINER)
        this.refDetailsContainer = shadow.getElementById(ID_DETAILS_CONTAINER)
        this.refInputId = shadow.getElementById(ID_INPUT_ID)
        this.refInputActive = shadow.getElementById(ID_INPUT_ACTIVE)
        this.refInputFirstName = shadow.getElementById(ID_INPUT_FIRST_NAME)
        this.refInputLastName = shadow.getElementById(ID_INPUT_LAST_NAME)
        this.refSelectRole = shadow.getElementById(ID_INPUT_ROLE)
        this.refSaveButton = shadow.getElementById(ID_BUTTON_SAVE)
        this.refAddButton = shadow.getElementById(ID_BUTTON_ADD)

        // * Add the TableWC component - this is the programmatical way to construct a TableWC component.
        //this.refTableWC = document.createElement(TableWC.tag)
        //this.refTableWC.setAttribute(ATTRIBUTE_CLICKS_TO_HANDLE, '1, 2, 3')
        //this.refTableContainer.appendChild(this.refTableWC)

        // * Refer to the TableWC component from template - this is the declarative way to construct a TabelWC component.
        this.refTableWC2 = shadow.getElementById(ID_TABLE_WC2)

        // Bind event-handler
        this.on_tablewc_cell_selected = this.on_tablewc_cell_selected.bind(this)
        this.on_click_save_button = this.on_click_save_button.bind(this)
        this.on_click_add_button = this.on_click_add_button.bind(this)
        // Bind custom rendering functions
        this.render_custom_column = this.render_custom_column.bind(this)
        this.render_custom_cell = this.render_custom_cell.bind(this)
        this.render_custom_role_cell = this.render_custom_role_cell.bind(this)
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
                // Extend column header(s) by custom rendering.
                const COL_INDEX_ACTION = tableData.cols.findIndex(col => col.field === 'action' )
                tableData.cols[COL_INDEX_ACTION].customRendering = this.render_custom_column
                // Assign columns definition
                this.refTableWC2.setDataColumns(tableData.cols /* MOCK_DATA.cols */)
                // Extend each data-row by custom rendering.
                tableData.rows.forEach(row => { 
                    row.role.render = this.render_custom_role_cell
                    row.action = this.render_custom_cell 
                })
                // Assign data-rows, this triggers <table-wc>'s rendering.
                this.refTableWC2.setDataRows(tableData.rows /* MOCK_DATA.rows */) 
            })
            .catch(err => {
                console.error(`${TableView.tag}.connectedCallback - provisioning <table-wc> failed - err:`, err)
            })
            
            // Add event handler for <table-wc>'s click event.
            this.addEventListener(EVENT_TABLEWC_CELL_SELECTED, this.on_tablewc_cell_selected)
            this.refSaveButton.addEventListener('click', this.on_click_save_button)
            this.refAddButton.addEventListener('click', this.on_click_add_button)
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        this.removeEventListener(EVENT_TABLEWC_CELL_SELECTED, this.on_tablewc_cell_selected)
        this.refSaveButton.removeEventListener('click', this.on_click_save_button)
        this.refAddButton.removeEventListener('click', this.on_click_add_button)
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

    on_tablewc_cell_selected(event) {
        if (event.detail.clicks === 2) {
            console.log(`${TableView.tag}.on_tablewc_cell_selected: clicks: ${event.detail.clicks} - event:`, event)

            if (event.detail.isRowSelected === true) {
                // Provision Detail inputs
                this.refInputId.value = event.detail.rowData.id
                
                this.refInputActive.value = event.detail.rowData.active
                this.refInputFirstName.value = event.detail.rowData.firstName
                this.refInputLastName.value = event.detail.rowData.lastName

                let role = event.detail.rowData.role.value
                this.refSelectRole.selectedIndex = -1
                Array.from(this.refSelectRole.options).forEach(option => {
                    if (option.value === role) {
                        option.setAttribute('selected', 'selected')
                        option.selected = true
                    }
                })
                

                this.refSaveButton.removeAttribute('disabled')
                this.refAddButton.setAttribute('disabled', 'disabled')
            } else {
                // Clear Detail inputs
                this.refInputId.value = 0
                this.refInputActive.value = false
                this.refInputFirstName.value = ''
                this.refInputLastName.value = ''
                // this.refSelectRole.selected
                Array.from(this.refSelectRole.options).forEach(option => { option.removeAttribute('selected') })
                this.refSelectRole.options[0].setAttribute('selected', 'selected') 

                this.refSaveButton.setAttribute('disabled', 'disabled')
                this.refAddButton.removeAttribute('disabled')
            }
        }
    }

    on_click_save_button(event) {
        console.log(`${TableView.tag}.on_click_save_button: event:`, event)
        
        // Emulate storing changed data 
        let id = Number(this.refInputId.value)
        let dataRow = MOCK_DATA.rows.find(item => item.id === id)
        if (dataRow) {
            dataRow.active =  this.refInputActive.value
            dataRow.firstName = this.refInputFirstName.value
            dataRow.lastName = this.refInputLastName.value
            let selectedOptions = Array.from(this.refSelectRole.selectedOptions)
            if (selectedOptions.length > 0) {
                dataRow.role.value = selectedOptions[0].value
            }

        }
        
        this.refTableWC2.setDataRows(MOCK_DATA.rows) // This triggers <table-wc>'s rendering

        // Clear Detail inputs
        this.refInputId.value = 0
        this.refInputActive.value = false
        this.refInputFirstName.value = ''
        this.refInputLastName.value = ''
        Array.from(this.refSelectRole.options).forEach(option => option.removeAttribute('selected'))
        this.refSelectRole.options[0].setAttribute('selected', 'selected')

        this.refSaveButton.setAttribute('disabled', 'disabled')
        this.refAddButton.removeAttribute('disabled')
    }

    on_click_add_button(event) {
        console.log(`${TableView.tag}.on_click_save_button: event:`, event)

        // Calc new id
        let lastRow = 0
        MOCK_DATA.rows.forEach(item => {
            if (item.id > lastRow) {
                lastRow = item.id
            }
        })
        lastRow = lastRow + 123

        // Create new row's data item
        let role = {
            value: 'User',
            render: this.render_custom_role_cell
        }
        let newRowData = {
            id: lastRow,
            active: false,
            firstName: '',
            lastName: '',
            title: `New User [${lastRow}]`,
            // Don't forget custom-rendering function.
            role: role,
            action: this.render_custom_cell
        }

        // Add new row's data item to mock-data
        MOCK_DATA.rows.push(newRowData)
        this.refTableWC2.setDataRows(MOCK_DATA.rows) // This triggers <table-wc>'s rendering

        this.refSaveButton.setAttribute('disabled', 'disabled')
        this.refAddButton.setAttribute('disabled', 'disabled')
    }

    // *** Custom Rendering ***/

    render_custom_column(columnData, refRow, refCol) {
        // custom column render funktion: (columnData, refRow, refCol) => {;}
        console.log(`${TableView.tag}.render_custom_column(): columnData:`, columnData)

        let refCustomButton = document.createElement('button')
        refCustomButton.textContent = 'Custom Column Action'
        
        // $$$ TODO: refCustomButton.classList.add('button-red')
        refCustomButton.style.backgroundColor = '#e00000'
        refCustomButton.style.color = '#ffffff'
        refCustomButton.style.fontWeight = 'bold'

        refCustomButton.addEventListener('click', () => {
            alert(`"Custom Column Action" button clicked!\n\nthis:\t${this}\nthis.localName:\t<${this.localName}`);
        })
        refCol.appendChild(refCustomButton)
    }

    render_custom_cell(rowData, cellData, refRow, refCol) {
        console.log(`${TableView.tag}.render_custom_cell(): rowData:`, rowData)

        let refCustomButton = document.createElement('button')
        refCustomButton.textContent = 'Custom Cell Action'

        // $$$ TODO: refCustomButton.classList.add('button-add')
        refCustomButton.style.backgroundColor = '#2040a0'
        refCustomButton.style.color = '#ffffff'

        refCustomButton.addEventListener('click', () => {
            alert(`"Custom Cell Action" button clicked!\n\nrowData: ${JSON.stringify(rowData||null)}\n\nthis:\t${this}\nthis.localName:\t<${this.localName}>`); 
        })
        refCol.appendChild(refCustomButton)
    }

    render_custom_role_cell(rowData, cellData, refRow, refCol) {
        console.log(`${TableView.tag}.render_custom_role_cell(): rowData:`, rowData)

        let refCustomSelect = document.createElement('select')

        let refOption1 = document.createElement('option')
        refOption1.textContent = 'User'
        if (rowData.role.value === 'User') { refOption1.setAttribute('selected', 'selected') }
        refCustomSelect.appendChild(refOption1)
        
        let refOption2 = document.createElement('option')
        refOption2.textContent = 'Manager'
        if (rowData.role.value === 'Manager') { refOption2.setAttribute('selected', 'selected') }
        refCustomSelect.appendChild(refOption2)
        
        let refOption3 = document.createElement('option')
        refOption3.textContent = 'SysAdmin'
        if (rowData.role.value === 'SysAdmin') { refOption3.setAttribute('selected', 'selected') }
        refCustomSelect.appendChild(refOption3)


        refCustomSelect.addEventListener('change', () => {
            // rowData.role.value = 
            alert(`"Custom Role Cell" select change!\n\nrowData: ${JSON.stringify(rowData||null)}\n\nthis:\t${this}\nthis.localName:\t<${this.localName}>`); 
        })

        refCol.appendChild(refCustomSelect)
    }
}
// Register custom element.
customElements.define(TableView.tag, TableView)