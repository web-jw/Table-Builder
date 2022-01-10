import * as Command from './commands.js';
import * as Elem from './elements.js';
export { copyCodeToClipboard, createEditMenu, downloadTextFile, editCell, generateCodeOfTable, getBackgroundColorOfElements, getBorderColorOfElements, getBordersWidth, getFontColorOfElements, getFontSizeOfElements, getMinHeightOfElements, getNumberOfRows, getSelectedPaddingOfElements, getSpaceLeftForLeftPadding, getSpaceLeftForRightPadding, getWidthOfSelectedColumn, historyHide, historyShow, historyTurnOffElementsHover, historyTurnOnElementsHover, makePlaceForEditMenu, prepareEditMenusForRows, previewBackgroundColorOfElements, previewBordersColor, previewFontColorOfElements, previewFontSizeOfElements, previewPaddingOfElements, redoFromHistory, redoPreview, redoPreviewCancel, restrainFieldValueInRange, undoFromHistory, undoPreview, undoPreviewCancel, updateEditMenusPosition, updateFields, updateListOfColumns, updateWidthOfSections, };
const editMenuFunctions = {
    up() {
        const editMenu = this.parentElement;
        const currentPosition = editMenu.dataset.row;
        const newPosition = `${parseInt(currentPosition) - 1}`;
        if (newPosition !== '-1')
            Elem.newOutstandingTable.executeCommand(new Command.MoveRowUp({ currentPosition, newPosition }));
    },
    down() {
        const editMenu = this.parentElement;
        const currentPosition = editMenu.dataset.row;
        const newPosition = `${parseInt(currentPosition) + 1}`;
        const numberOfRows = getNumberOfRows(Elem.theTable);
        if (newPosition !== `${numberOfRows}`)
            Elem.newOutstandingTable.executeCommand(new Command.MoveRowDown({ currentPosition, newPosition }));
    },
    top() {
        const editMenu = this.parentElement;
        const currentPosition = editMenu.dataset.row;
        const newPosition = '0';
        if (currentPosition !== newPosition)
            Elem.newOutstandingTable.executeCommand(new Command.MoveRowUp({ currentPosition, newPosition }));
    },
    bottom() {
        const editMenu = this.parentElement;
        const currentPosition = editMenu.dataset.row;
        const newPosition = `${getNumberOfRows(Elem.theTable) - 1}`;
        if (currentPosition !== newPosition)
            Elem.newOutstandingTable.executeCommand(new Command.MoveRowDown({ currentPosition, newPosition }));
    },
    delete() {
        const editMenu = this.parentElement;
        const currentPosition = editMenu.dataset.row;
        Elem.newOutstandingTable.executeCommand(new Command.DeleteRow(currentPosition));
    }
};
function convertRgbValueToHex(borderColorinRgb) {
    const colorList = borderColorinRgb.match(/[\d]+/g);
    return colorList.reduce((previousValue, currentValue) => {
        currentValue = parseInt(currentValue, 10).toString(16);
        if (currentValue.length === 1)
            currentValue = "0" + currentValue;
        return previousValue + currentValue;
    }, '#');
}
function copyCodeToClipboard(generateCodeOfTable) {
    const textarea = document.createElement('textarea');
    textarea.value = generateCodeOfTable;
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textarea.value);
}
function createEditMenu() {
    const editMenu = document.createElement('div');
    editMenu.classList.add('ot-menu');
    editMenu.style.right = 'calc(100% + 1px)';
    const listOfButtons = new Map([
        ['up', '˄'],
        ['down', '˅'],
        ['top', '⌤'],
        ['bottom', '⌤'],
        ['delete', '🗑']
    ]);
    for (let [key, value] of listOfButtons) {
        const newButton = document.createElement('button');
        newButton.classList.add(`ot-${key}`);
        newButton.innerText = value;
        editMenu.appendChild(newButton);
    }
    return editMenu;
}
function downloadTextFile({ filename, text }) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
function editCell(e) {
    const innerParagraph = this.querySelector('p');
    const target = e.target;
    if (!innerParagraph || (target !== this && target.classList.length !== 0))
        return;
    const editCell = new Command.ChangeTextInCell(this);
    editCell.textarea.addEventListener('focusout', function () {
        let valueInHtml = this.value.replace(/\n/g, '<br>').replace(/ [\s]+/, '');
        if (innerParagraph.innerHTML.match(/<br>/))
            valueInHtml += `<br>`;
        if (valueInHtml === innerParagraph.innerHTML) {
            this.remove();
            editCell.cell.appendChild(innerParagraph);
        }
        else {
            Elem.newOutstandingTable.executeCommand(editCell);
        }
    });
}
function generateCodeOfTable(table) {
    removeAllEditMenus(table);
    const stylesToPrint = getStylesForGeneratedCode(table);
    const cssCode = generateCssCode(stylesToPrint);
    const pureHtmlText = generateHtmlCode(table);
    prepareEditMenusForRows(table);
    updateEditMenusPosition(table);
    return `<style>\n${cssCode}\n</style>\n${pureHtmlText}`;
}
function generateCssCode(stylesToPrint) {
    var _a;
    (_a = stylesToPrint.get('.outstanding-table')) === null || _a === void 0 ? void 0 : _a.set('margin-left', 'auto');
    const stylesText = [...stylesToPrint].reduce((prevClassName, currClassName) => {
        let classRulesText = '';
        for (let [rule, value] of currClassName[1])
            classRulesText += `  ${rule}: ${value};\n`;
        return `${prevClassName}${currClassName[0]} {\n${classRulesText}}\n`;
    }, '');
    return stylesText;
}
function generateHtmlCode(element) {
    return element.outerHTML.replace(/(data-[\w-="#]+"\s)|(style="[\w\s-:;"/#)(.,_]+")/g, '').replace(/ >/g, ">").replace(/<li/g, '\n  <li').replace(/<p>/g, '\n    <p>\n      ').replace(/<\/p>/g, '\n    </p>\n  ').replace(/<\/ul>/g, '\n</ul>');
}
function getBackgroundColorOfElements({ table, selector }) {
    const element = table.querySelector(selector);
    return convertRgbValueToHex(window.getComputedStyle(element).backgroundColor);
}
function getBorderColorOfElements(table) {
    return convertRgbValueToHex(window.getComputedStyle(table).borderLeftColor);
}
function getBordersWidth(table) {
    return `${parseInt(window.getComputedStyle(table).borderLeftWidth)}`;
}
function getFontColorOfElements({ table, selector }) {
    const element = table.querySelector(selector);
    return convertRgbValueToHex(window.getComputedStyle(element).color);
}
function getFontSizeOfElements({ table, selector }) {
    const element = table.querySelector(selector);
    const fontSizeOfElements = window.getComputedStyle(element).fontSize;
    return `${parseInt(fontSizeOfElements)}`;
}
function getMinHeightOfElements({ table, selector }) {
    const element = table.querySelector(selector);
    const minHeigtOfRows = window.getComputedStyle(element).minHeight;
    return `${parseInt(minHeigtOfRows)}`;
}
function getNumberOfRows(table) {
    const numOfColumns = parseInt(table.dataset.columns);
    const tableArray = Command.createArrayFromTable({ table, numOfColumns });
    return tableArray.length;
}
function getSelectedPaddingOfElements({ table, selector, whichPadding }) {
    const element = table.querySelector(selector);
    switch (whichPadding) {
        case 'Top':
            return element.style.paddingTop.replace(/px/, '');
        case 'Bottom':
            return element.style.paddingBottom.replace(/px/, '');
        case 'Left':
            return element.style.paddingLeft.replace(/px/, '');
        case 'Right':
            return element.style.paddingRight.replace(/px/, '');
    }
}
function getSmallestWidth(table) {
    const columnsWidthList = window.getComputedStyle(table).gridTemplateColumns.split(' ').map(width => parseInt(width));
    return columnsWidthList.reduce((prevWidth, currWidth) => prevWidth < currWidth ? prevWidth : currWidth);
}
function getSpaceLeftForLeftPadding({ table, selector }) {
    const element = table.querySelector(selector);
    const elementInnerBox = element.querySelector('p');
    const rightPaddingOfElement = parseInt(window.getComputedStyle(element).paddingRight);
    const fontSizeOfElements = parseInt(window.getComputedStyle(elementInnerBox).fontSize);
    const smallestWidth = getSmallestWidth(table);
    return smallestWidth - rightPaddingOfElement - fontSizeOfElements;
}
function getSpaceLeftForRightPadding({ table, selector }) {
    const element = table.querySelector(selector);
    const elementInnerBox = element.querySelector('p');
    const leftPaddingOfElement = parseInt(window.getComputedStyle(element).paddingLeft);
    const fontSizeOfElements = parseInt(window.getComputedStyle(elementInnerBox).fontSize);
    const smallestWidth = getSmallestWidth(table);
    return smallestWidth - leftPaddingOfElement - fontSizeOfElements;
}
function getStylesUser(element) {
    const allElements = [...element.children];
    const allClassesWithStyles = new Map();
    allElements.unshift(element);
    allElements.forEach(element => {
        if (!allClassesWithStyles.has(`.${element.className}`)) {
            const declaredStyles = new Map();
            const arrayOfDeclared = [...element.style];
            for (let style of arrayOfDeclared)
                declaredStyles.set(style, element.style[style]);
            allClassesWithStyles.set(`.${element.className}`, declaredStyles);
        }
    });
    return allClassesWithStyles;
}
function getStylesPredefined(numberOfFile = 0) {
    const cssRulesArray = [...document.styleSheets[numberOfFile].cssRules];
    const allClassesWithStyles = new Map();
    cssRulesArray.forEach(rule => {
        if (!allClassesWithStyles.has(rule.selectorText)) {
            const declaredStyles = new Map();
            const arrayOfDeclared = [...rule.style];
            for (let style of arrayOfDeclared)
                declaredStyles.set(style, rule.style[style]);
            allClassesWithStyles.set(rule.selectorText, declaredStyles);
        }
    });
    return allClassesWithStyles;
}
function getStylesForGeneratedCode(table) {
    var _a;
    const stylesPredefined = getStylesPredefined(1);
    const stylesUser = getStylesUser(table);
    for (let [className, styles] of stylesUser)
        for (let [rule, value] of styles)
            if (stylesPredefined.has(className))
                (_a = stylesPredefined.get(className)) === null || _a === void 0 ? void 0 : _a.set(rule, value);
    return stylesPredefined;
}
function getWidthOfSelectedColumn({ table, whichColumn }) {
    const allColumns = window.getComputedStyle(table).gridTemplateColumns.match(/[0-9]+/g);
    return allColumns[whichColumn - 1];
}
function historyHide() {
    const historyToHide = document.querySelector('.history');
    if (historyToHide)
        historyToHide.remove();
}
function historyShow(historyArray) {
    if (historyArray.length === 0)
        return;
    const historyContainer = document.createElement('ul');
    historyContainer.classList.add('history');
    historyArray.forEach(command => {
        const newHistoryElement = document.createElement('li');
        if (!command.valueForUser)
            newHistoryElement.textContent = `${command.name || command.id}`;
        if (command.valueForUser) {
            newHistoryElement.textContent = `${command.name || command.id} (${command.valueForUser})`;
            newHistoryElement.textContent = newHistoryElement.textContent.substring(0, 45).replace(/[\w\s]{3}$/, '...)');
        }
        historyContainer.insertBefore(newHistoryElement, historyContainer.firstChild);
    });
    return historyContainer;
}
function historyTurnOffElementsHover(historyListContainer) {
    const historyList = historyListContainer.querySelectorAll('li');
    historyList.forEach(command => command.classList.remove('hover'));
}
function historyTurnOnElementsHover({ historyListContainer, historyElement }) {
    const historyList = historyListContainer.querySelectorAll('li');
    const placeInList = [...historyList].indexOf(historyElement);
    if (placeInList >= 0)
        for (let i = placeInList; i >= 0; i--)
            historyList[i].classList.add('hover');
}
function makePlaceForEditMenu(table, addedWidth = 0) {
    const widthOfTable = parseInt(window.getComputedStyle(table).width) + (parseInt(window.getComputedStyle(table).borderLeftWidth) * 2);
    const widthOfWindow = parseInt(window.getComputedStyle(table.parentElement).width);
    if (widthOfWindow - 280 < widthOfTable + addedWidth)
        table.style.marginLeft = "140px";
    if (widthOfWindow - 280 > widthOfTable + addedWidth)
        table.style.marginLeft = "auto";
}
function prepareEditMenusForRows(table) {
    removeAllEditMenus(table);
    const numOfColumns = parseInt(table.dataset.columns);
    const tableArray = Command.createArrayFromTable({ table, numOfColumns });
    const firstCells = Command.getFirstCellInEveryRow(tableArray);
    const listOfEditMenus = [];
    firstCells.forEach((cell, index) => {
        const newEditMenu = createEditMenu();
        newEditMenu.dataset.row = `${index}`;
        cell.appendChild(newEditMenu);
        listOfEditMenus.push(newEditMenu);
    });
    listOfEditMenus.forEach(menu => {
        const allButtons = menu.querySelectorAll('button');
        setFunctionsOfEditMenuButtons(allButtons);
    });
}
function previewBackgroundColorOfElements({ table, selector, value }) {
    const elements = table.querySelectorAll(selector);
    elements.forEach(cell => cell.style.backgroundColor = value);
}
function previewBordersColor({ table, value }) {
    table.style.borderColor = value;
    table.style.backgroundColor = value;
}
function previewFontColorOfElements({ table, selector, value }) {
    const elements = table.querySelectorAll(selector);
    elements.forEach(cell => cell.style.color = value);
}
function previewFontSizeOfElements({ table, selector, value, unit }) {
    const elements = table.querySelectorAll(selector);
    elements.forEach(cell => cell.style.fontSize = value + unit);
}
function previewPaddingOfElements({ table, selector, value, unit, whichPadding }) {
    const elements = table.querySelectorAll(selector);
    elements.forEach(cell => setPaddingValue({ element: cell, value: value + unit, whichPadding }));
}
function redoFromHistory({ tableObject, historyListContainer, historyElement }) {
    const historyList = historyListContainer.querySelectorAll('li');
    const placeInList = [...historyList].indexOf(historyElement);
    if (placeInList >= 0)
        for (let i = placeInList; i >= 0; i--) {
            tableObject.redo();
            historyList[i].remove();
        }
}
function redoPreview({ historyListContainer, historyElement, tableObject, lastPosition }) {
    const historyList = historyListContainer.querySelectorAll('li');
    const placeInList = [...historyList].indexOf(historyElement);
    const reversedHistory = [...tableObject.undoHistory].reverse();
    if (placeInList > lastPosition)
        for (let i = lastPosition + 1; i <= placeInList; i++)
            reversedHistory[i].execute(tableObject.table);
    if (placeInList <= lastPosition)
        for (let i = lastPosition; i > placeInList; i--)
            reversedHistory[i].undo(tableObject.table);
}
function redoPreviewCancel({ lastPosition, tableObject }) {
    const reversedHistory = [...tableObject.undoHistory].reverse();
    for (let i = lastPosition; i >= 0; i--)
        reversedHistory[i].undo(tableObject.table);
}
function removeAllEditMenus(table) {
    const allEditMenus = table.querySelectorAll('.ot-menu');
    if (allEditMenus.length !== 0)
        allEditMenus.forEach(menu => menu.remove());
}
function restrainFieldValueInRange({ value, min, max }) {
    let parsedValue = parseInt(value, 10);
    parsedValue = (parsedValue > max) ? max
        : (parsedValue < min || value === '') ? min
            : parsedValue;
    return `${parsedValue}`;
}
function setFunctionsOfEditMenuButtons(allButtons) {
    allButtons.forEach(button => {
        const whatButton = button.className.replace('ot-', '');
        button.addEventListener('click', editMenuFunctions[whatButton]);
    });
}
function setPaddingValue({ element, value, whichPadding }) {
    switch (whichPadding) {
        case 'Top':
            return element.style.paddingTop = value;
        case 'Bottom':
            return element.style.paddingBottom = value;
        case 'Left':
            return element.style.paddingLeft = value;
        case 'Right':
            return element.style.paddingRight = value;
    }
}
function undoFromHistory({ tableObject, historyListContainer, historyElement }) {
    const historyList = historyListContainer.querySelectorAll('li');
    const placeInList = [...historyList].indexOf(historyElement);
    if (placeInList >= 0)
        for (let i = placeInList; i >= 0; i--) {
            tableObject.undo();
            historyList[i].remove();
        }
}
function undoPreview({ historyListContainer, historyElement, tableObject, lastPosition }) {
    const historyList = historyListContainer.querySelectorAll('li');
    const placeInList = [...historyList].indexOf(historyElement);
    const reversedHistory = [...tableObject.history].reverse();
    if (placeInList > lastPosition)
        for (let i = lastPosition + 1; i <= placeInList; i++)
            reversedHistory[i].undo(tableObject.table);
    if (placeInList <= lastPosition)
        for (let i = lastPosition; i > placeInList; i--)
            reversedHistory[i].execute(tableObject.table);
}
function undoPreviewCancel({ lastPosition, tableObject }) {
    const reversedHistory = [...tableObject.history].reverse();
    for (let i = lastPosition; i >= 0; i--)
        reversedHistory[i].execute(tableObject.table);
}
function updateEditMenusPosition(table) {
    const allMenus = table.querySelectorAll('.ot-menu');
    const borderWidth = window.getComputedStyle(table).borderLeftWidth;
    allMenus.forEach(menu => menu.style.right = `calc(100% + ${borderWidth})`);
}
function updateFields(table) {
    const selectField = Elem.uiField.pickColumn, selector = Elem.uiField.pickElement.value, numberOfColumns = Elem.theTable.dataset.columns;
    updateWidthOfSections(table);
    updateListOfColumns({ selectField, numberOfColumns: parseInt(numberOfColumns) });
    Elem.uiField.numberOfColumns.value = numberOfColumns;
    Elem.uiField.colorOfFont.value = getFontColorOfElements({ table, selector }) || '#000000';
    Elem.uiField.colorOfBackground.value = getBackgroundColorOfElements({ table, selector }) || '#ffffff';
    Elem.uiField.colorOfBorders.value = getBorderColorOfElements(table) || '#000000';
    Elem.uiField.fontSizeOfElements.value = getFontSizeOfElements({ table, selector });
    Elem.uiField.heightOfElements.value = getMinHeightOfElements({ table, selector });
    Elem.uiField.paddingTop.value = getSelectedPaddingOfElements({ table, selector, whichPadding: 'Top' });
    Elem.uiField.paddingBottom.value = getSelectedPaddingOfElements({ table, selector, whichPadding: 'Bottom' });
    Elem.uiField.paddingLeft.value = getSelectedPaddingOfElements({ table, selector, whichPadding: 'Left' });
    Elem.uiField.paddingRight.value = getSelectedPaddingOfElements({ table, selector, whichPadding: 'Right' });
    Elem.uiField.widthOfBorders.value = getBordersWidth(table);
    Elem.uiField.widthOfColumn.value = getWidthOfSelectedColumn({ table, whichColumn: parseInt(Elem.uiField.pickColumn.value, 10) });
}
function updateListOfColumns({ selectField, numberOfColumns }) {
    var _a;
    const currentNumberOfColumns = selectField.childElementCount;
    if (currentNumberOfColumns < numberOfColumns) {
        for (let i = currentNumberOfColumns; i < numberOfColumns; i++) {
            const newOptionForSelect = document.createElement('option');
            newOptionForSelect.label = `${i + 1}`;
            newOptionForSelect.value = `${i + 1}`;
            selectField.append(newOptionForSelect);
        }
    }
    if (currentNumberOfColumns > numberOfColumns)
        for (let i = numberOfColumns; i < currentNumberOfColumns; i++)
            (_a = selectField.lastElementChild) === null || _a === void 0 ? void 0 : _a.remove();
}
function updateWidthOfSections(table) {
    const allColumns = table.style.gridTemplateColumns.match(/[0-9]+/g);
    const allSections = table.querySelectorAll('.ot-section');
    allSections.forEach(cell => cell.style.gridColumn = `1/${allColumns.length + 1}`);
}
