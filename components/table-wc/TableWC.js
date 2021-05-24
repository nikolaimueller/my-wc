// Component: TableComponent
// See:   https://developer.mozilla.org/en-US/docs/Web/Web_Components
//
// see:   https://developer.mozilla.org/en-US/docs/Web/API/Touch_events
// see:   https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent

import {applyTheme} from '../theme-manager/theme-manager.js'

export const ATTRIBUTE_CLICKS_TO_HANDLE = 'clicks-to-handle'

export default class TableWC extends HTMLElement {
    static get tag() { return 'table-wc' }
    static get observedAttributes() { return [ATTRIBUTE_CLICKS_TO_HANDLE] }
    static get styleSheet_url() {
        if (import.meta.url.endsWith('.js'))  { return import.meta.url.replace('.js',  '.css') }
        if (import.meta.url.endsWith('.mjs')) { return import.meta.url.replace('.mjs', '.css') }
    }

    constructor() {
        super()
        // Table cols
        this.dataCols = null
        // Table data
        this.dataRows = null

        // Single click
        this.markedRow = null
        this.markedColumn = null
        // Double click
        this.selectedRow = null
        this.selectedColumn = null
        // Triple click
        this.activatedRow = null
        this.activatedColumn = null

        this.clicksToHandle = {single:true, double:false, triple:false}

        let shadow = this.attachShadow({mode:'open'})

        // Add Component StyleSheet-Link
        this.refLinkStyle = document.createElement('link')
        this.refLinkStyle.setAttribute('rel', 'stylesheet')
        this.refLinkStyle.setAttribute('href', TableWC.styleSheet_url)
        shadow.appendChild(this.refLinkStyle)

        // Apply theme
        applyTheme(shadow, TableWC.styleSheet_url)

        // Reference to the TableWC element
        this.refTable = null

        // Bind event handler
        this.on_click_th = this.on_click_th.bind(this)
        this.on_click_td = this.on_click_td.bind(this)
    }


    /**
     * Set the definitions of columns.
     * @arg {Array} cols - array of column definitions, see example.
     * @returns void
     * @example
     * [ { field: 'id', name: 'id', title: 'Record ID' },
     *   { field: 'firstName', name: 'First Name', title: 'First Name (firstName)' }, ...]
     */
    setDataColumns(cols) {
        if (this.dataRows !== null) {
            console.warn(`${TableWC.tag}.setDataColumns: this.dataRows value(s) already set.`)
            return
        }
        if (this.dataCols !== null) {
            console.warn(`${TableWC.tag}.setDataColumns: this.dataColumns value(s) already set.`)
            return
        }
        if (Array.isArray(this.dataCols)) {
            console.warn(`${TableWC.tag}.setDataColumns: arg 'cols' must be an Array.`)
            return
        }
        if (this.dataCols === 0) {
            console.warn(`${TableWC.tag}.setDataColumns: arg 'cols' array must not be empty.`)
            return
        }

        this.dataCols = cols
    }

    /** 
     * Set the data rows of the table.
     * @arg {Array} rows - array of data-rows, see example.
     * @examlpe
     * ```js
     * [
     *   {id: 123, fisrtName:'Nikolai', lastName:'Müller' },
     *   {id: 234, firstName:'Max', lastName:'Mustermmann' },
     * ...]
     * ```
     */
    setDataRows(rows) {
        if (this.dataCols === null) {
            console.warn(`${TableWC.tag}.setDataRows: must set columns before this.setDataRows.`)
            return
        }
        if (Array.isArray(rows) === false) {
            console.warn(`${TableWC.tag}.setDataRows: arg 'rows' must be an Array.`)
            return
        }

        this.dataRows = rows
        if (this.isConnected) {
            this.render()
        }
    }

    // *** Livecycle callbacks  ***
    // see:  https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements#Using_the_lifecycle_callbacks

    connectedCallback() {
        // Invoked each time the custom element is appended into a document-connected element.
        console.log(`${TableWC.tag}.connectedCallback(): NOT IMPLEMENTED !!`)
        if (this.isConnected) {
            // implement your callback here.
            //if (this.dataCols !== null && this.dataRows !== null) {
            //    this.render()
            //}
        }
    }

    disconnectedCallback() {
        // Invoked each time the custom element is disconnected from the document's DOM.
        console.log(`${TableWC.tag}.disconnectedCallback(): NOT IMPLEMENTED !!`)
    }

    adoptedCallback() {
        // Invoked each time the custom element is moved to a new document.
        console.log(`${TableWC.tag}.adoptedCallback(): NOT IMPLEMENTED !!`)
    }

    attributeChangedCallback(name, oldValue, newValue) {
        // Invoked each time one of the custom element's attributes is added, removed, or changed.
        console.log(`${TableWC.tag}.attributeChangedCallback(): NOT IMPLEMENTED !!`)
        switch (name) {
            case ATTRIBUTE_CLICKS_TO_HANDLE:
                // Do something meaningfull with your new attribute value.
                // this.clicksToHandle = {single:true, double:false, triple:false}
                console.log(`${TableWC.tag}.attributeChangedCallback() - name: '${name}' - oldValue: '${oldValue}' - newValue: '${newValue}'`)
                if (newValue.length > 0) {
                    this.clicksToHandle = []
                    let  handleClickParts = newValue.split(',')
                    handleClickParts.forEach(clickPart => {
                        let clickInt = parseInt(clickPart.trim())
                        this.clicksToHandle.push(clickInt)
                        let dummy = this.clicksToHandle
                    })
                }
                break
        }
    }

    // *** Render ***

    render() {
        this.refTable = document.createElement('table')
        this.renderTable()
        this.shadowRoot.appendChild(this.refTable)
    }

    renderTable() {
        this.refTable.appendChild(this.renderTHead())
        this.refTable.appendChild(this.renderTBody())
    }

    renderTHead() {
        let refTHead = document.createElement('thead')
        
        let refTR = document.createElement('tr')
        refTR.classList.add('head-row')

        this.dataCols.forEach(col => {
            let refTH = document.createElement('th')
            refTH.addEventListener('click', this.on_click_th)
            refTH.textContent = col.name
            if (col.title) { refTH.setAttribute('title', col.title) }
            refTR.appendChild(refTH)
        });
        refTHead.appendChild(refTR)

        return refTHead
    }

    renderTBody() {
        let refTBody = document.createElement('tbody')
        this.dataRows.forEach(row => {
            let refTR = document.createElement('tr')
            this.dataCols.forEach(col => {
                let refTD = document.createElement('td')
                refTD.addEventListener('click', this.on_click_td)
                refTD.textContent = row[col.field]
                if (row.title) { refTD.setAttribute('title', row.title)}
                refTR.appendChild(refTD)
            })
            refTBody.appendChild(refTR)
        })
        return refTBody
    }

    // *** Event Handler ***

    renderHighlightColumn(className, currentColumn, refTH, trs) {
        if (currentColumn !== null) {
            Array.from(trs).forEach(row => {
                let cell = row.cells[currentColumn.cellIndex]
                cell.classList.remove(className)
            })
        }
        if (refTH === currentColumn) {
            currentColumn = null
        } else {
            currentColumn = refTH
            Array.from(trs).forEach(row => {
                let cell = row.cells[refTH.cellIndex]
                cell.classList.add(className)
            })
        }
        return currentColumn
    }

    renderHighlightRow(className, currentRow, refTR) {
        if (currentRow !== null) {
            currentRow.classList.remove(className)
        }
        // let refTR = event.target.parentElement
        if (refTR === currentRow) {
            currentRow = null
        } else {
            refTR.classList.add(className)
            currentRow = refTR
        }
        return currentRow
    }

    on_click_th(event) {
        let clicks = event.detail
        console.log(`${TableWC.tag}.on_click_th - clicks: ${clicks} - event:`, event)

        let trs = this.refTable.rows
        let refTH = event.target
        if (clicks === 1 && this.clicksToHandle.find(clickNum => clickNum === clicks)) {
            this.markedColumn = this.renderHighlightColumn('marked-col', this.markedColumn, refTH, trs)
        } else if (clicks === 2 && this.clicksToHandle.find(clickNum => clickNum === clicks)) {
            this.selectedColumn = this.renderHighlightColumn('selected-col', this.selectedColumn, refTH, trs)
        } else if (clicks === 3 && this.clicksToHandle.find(clickNum => clickNum === clicks)) {
            this.activatedColumn = this.renderHighlightColumn('activated-col', this.activatedColumn, refTH, trs)
        }
    }
    
    on_click_td(event) {
        let clicks = event.detail
        console.log(`${TableWC.tag}.on_click_td - clicks: ${clicks} - event:`, event)

        let refTR = event.target.parentElement
        if (clicks === 1 && this.clicksToHandle.find(clickNum => clickNum === clicks)) {
            this.markedRow = this.renderHighlightRow('marked-row', this.markedRow, refTR)
        } else if (clicks === 2 && this.clicksToHandle.find(clickNum => clickNum === clicks)) {
            this.selectedRow = this.renderHighlightRow('selected-row', this.selectedRow, refTR)
        } else if (clicks === 3 && this.clicksToHandle.find(clickNum => clickNum === clicks)) {
            this.activatedRow = this.renderHighlightRow('activated-row', this.activatedRow, refTR)
        }
    }
    
}
// Register custom element.
customElements.define(TableWC.tag, TableWC)