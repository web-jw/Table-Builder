import TableBuilderUi from './builder-ui.js';
import TheOutstandingTable from './outstanding-table.js';
export { builderUi, newOutstandingTable, theTable, uiButton, uiField };
const containerBuilder = document.querySelector('#table-builder-container'), containerTable = document.querySelector('#outstanding-table-container'), builderUi = new TableBuilderUi({ rows: 1, columns: 3, name: "builderUi" }), newOutstandingTable = new TheOutstandingTable(containerTable), theTable = newOutstandingTable.table, uiButton = {
    addRow: builderUi.getHtmlElement({ uiLabel: 'addRow' }),
    addSection: builderUi.getHtmlElement({ uiLabel: 'addSection' }),
    downloadTable: builderUi.getHtmlElement({ uiLabel: 'downloadTable' }),
    generateCode: builderUi.getHtmlElement({ uiLabel: 'generateCode' }),
    redo: builderUi.getHtmlElement({ uiLabel: 'redo' }),
    redoHistory: builderUi.getHtmlElement({ uiLabel: 'redoHistory' }),
    undo: builderUi.getHtmlElement({ uiLabel: 'undo' }),
    undoHistory: builderUi.getHtmlElement({ uiLabel: 'undoHistory' }),
}, uiField = {
    colorOfFont: builderUi.getHtmlElement({ uiLabel: 'colorOfFont' }),
    colorOfBackground: builderUi.getHtmlElement({ uiLabel: 'colorOfBackground' }),
    colorOfBorders: builderUi.getHtmlElement({ uiLabel: 'colorOfBorders' }),
    fontSizeOfElements: builderUi.getHtmlElement({ uiLabel: 'fontSizeOfElements' }),
    heightOfElements: builderUi.getHtmlElement({ uiLabel: 'heightOfElement' }),
    numberOfColumns: builderUi.getHtmlElement({ uiLabel: 'numberOfColumns' }),
    paddingTop: builderUi.getHtmlElement({ uiLabel: 'paddingTop' }),
    paddingBottom: builderUi.getHtmlElement({ uiLabel: 'paddingBottom' }),
    paddingLeft: builderUi.getHtmlElement({ uiLabel: 'paddingLeft' }),
    paddingRight: builderUi.getHtmlElement({ uiLabel: 'paddingRight' }),
    pickColumn: builderUi.getHtmlElement({ uiLabel: 'pickColumn' }),
    pickElement: builderUi.getHtmlElement({ uiLabel: 'pickElements' }),
    widthOfBorders: builderUi.getHtmlElement({ uiLabel: 'widthOfBorders' }),
    widthOfColumn: builderUi.getHtmlElement({ uiLabel: 'widthOfColumn' }),
};
builderUi.displayBuilderUi(containerBuilder);
