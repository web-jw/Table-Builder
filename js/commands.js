import argsValidation from './validation.js';
export { AddColumn, AddRow, AddSection, ChangeTextInCell, createArrayFromTable, DeleteRow, getFirstCellInEveryRow, getRowNumberOfCell, MoveRowDown, MoveRowUp, SetBackgroundColorOfCells, SetBordersColorOfTable, SetBordersWidthOfTable, SetFontColorOfCells, SetFontSizeAndLeftPadding, SetFontSizeOfCells, SetMinHeightOfCells, SetNumberOfColumns, SetPaddingOfCells, SetWidthOfColumn, };
// Create array that will represent the HTML table
function createArrayFromTable({ table, numOfColumns }) {
    // Get all cells of the table to array
    const listOfCells = [...table.querySelectorAll('li')];
    // Create base for array and template of row
    const tableArray = [];
    let rowInProgres = [];
    // Set cells in rght place in array
    listOfCells.forEach(cell => {
        // Check if it's section cell
        if (cell.classList.contains('ot-section')) {
            // Set cell as one row in array
            tableArray.push([cell]);
        }
        else {
            // Set cell at the end of template
            rowInProgres.push(cell);
        }
        // Check if created row has enough cells to create full row of array
        if (rowInProgres.length === numOfColumns) {
            // Set template of row as new row in array
            tableArray.push(rowInProgres);
            // Clear template of row
            rowInProgres = [];
        }
    });
    return tableArray;
}
function getLastCellInRows({ table, numOfColumns }) {
    return [...table.querySelectorAll('li')]
        // Filter out sections from array
        .filter(cell => cell.className === 'ot-row' ? true : false)
        // Get last cell of every row
        .filter((cell, index) => {
        if ((index + 1) % numOfColumns === 0)
            return true;
        return false;
    });
}
function getFirstCellInEveryRow(tableArray) {
    const onlyFirstCellsList = [];
    for (let i = 0; i < tableArray.length; i++)
        onlyFirstCellsList.push(tableArray[i][0]);
    return onlyFirstCellsList;
}
function getRowNumberOfCell({ cell, tableArray }) {
    let rowNumber = 0;
    for (let i = 0; i < tableArray.length; i++) {
        if (tableArray[i].indexOf(cell) > -1)
            rowNumber = i;
    }
    return rowNumber;
}
class AddColumn {
    constructor(width = '50px') {
        this.width = width;
        this.id = 'Add Column';
        this.deletedElements = [];
    }
    execute(table) {
        let numOfColumns = parseInt(table.dataset.columns, 10);
        const lastCellsOfRows = getLastCellInRows({ table, numOfColumns });
        if (this.deletedElements.length === 0)
            lastCellsOfRows.forEach(cell => {
                const newLastCell = document.createElement('li');
                const innerTextContainer = document.createElement('p');
                const datasetOfCell = Object.entries(cell.dataset);
                newLastCell.classList.add('ot-row');
                newLastCell.style.cssText = cell.style.cssText;
                newLastCell.appendChild(innerTextContainer);
                for (let [key, value] of datasetOfCell)
                    newLastCell.dataset[key] = value;
                cell.after(newLastCell);
            });
        if (this.deletedElements.length > 0) {
            const lastColumnDeleted = this.deletedElements.pop();
            for (let i = 0; i < lastCellsOfRows.length; i++)
                lastCellsOfRows[i].after(lastColumnDeleted[1].shift());
            this.width = lastColumnDeleted[0];
        }
        numOfColumns++;
        table.dataset.columns = `${numOfColumns}`;
        table.style.gridTemplateColumns = `${table.style.gridTemplateColumns} ${this.width}`;
    }
    undo(table) {
        let numOfColumns = parseInt(table.dataset.columns, 10);
        const lastCellsOfRows = getLastCellInRows({ table, numOfColumns });
        const widthOfColumnsList = table.style.gridTemplateColumns.split(' ');
        const deletedElementsList = [];
        const widthOfDeletedColumn = widthOfColumnsList.pop();
        lastCellsOfRows.forEach(cell => {
            deletedElementsList.push(cell);
            cell.remove();
        });
        this.deletedElements.push([widthOfDeletedColumn, deletedElementsList]);
        numOfColumns--;
        table.dataset.columns = `${numOfColumns}`;
        table.style.gridTemplateColumns = widthOfColumnsList.join(' ');
        return this.deletedElements;
    }
}
class AddRow {
    constructor() {
        this.id = 'Add Row';
        this.deletedElements = [];
    }
    execute(table) {
        var _a, _b;
        const numOfColumns = parseInt(table.dataset.columns, 10);
        const stylesForRows = (_a = table.querySelector('.ot-row')) === null || _a === void 0 ? void 0 : _a.style.cssText;
        const datasetForRows = (_b = table.querySelector('.ot-row')) === null || _b === void 0 ? void 0 : _b.dataset;
        if (this.deletedElements.length === 0)
            for (let i = 0; i < numOfColumns; i++) {
                const newCell = document.createElement('li');
                const innerTextContainer = document.createElement('p');
                newCell.classList.add('ot-row');
                if (stylesForRows)
                    newCell.style.cssText = stylesForRows;
                if (!stylesForRows)
                    newCell.style.minHeight = '30px';
                if (datasetForRows)
                    for (let [key, value] of Object.entries(datasetForRows))
                        newCell.dataset[key] = value;
                newCell.appendChild(innerTextContainer);
                table.appendChild(newCell);
            }
        if (this.deletedElements.length > 0)
            for (let i = 0; i < numOfColumns; i++)
                table.appendChild(this.deletedElements.shift());
    }
    undo(table) {
        var _a;
        const numOfColumns = parseInt(table.dataset.columns, 10);
        for (let i = 0; i < numOfColumns; i++) {
            this.deletedElements.unshift(table.lastChild);
            (_a = table.lastChild) === null || _a === void 0 ? void 0 : _a.remove();
        }
    }
}
class AddSection {
    constructor() {
        this.id = 'Add Section';
        this.deletedElements = [];
    }
    execute(table) {
        var _a, _b;
        if (this.deletedElements.length === 0) {
            const newSection = document.createElement('li');
            const innerTextContainer = document.createElement('p');
            const stylesForSection = (_a = table.querySelector('.ot-section')) === null || _a === void 0 ? void 0 : _a.style.cssText;
            const datasetForSection = (_b = table.querySelector('.ot-section')) === null || _b === void 0 ? void 0 : _b.dataset;
            const numberOfColumns = table.dataset.columns;
            newSection.classList.add('ot-section');
            newSection.style.gridColumn = `1/${parseInt(numberOfColumns) + 1}`;
            if (stylesForSection)
                newSection.style.cssText = stylesForSection;
            if (!stylesForSection) {
                newSection.style.gridColumn = `1/${parseInt(numberOfColumns) + 1}`;
                newSection.style.minHeight = '40px';
            }
            if (datasetForSection)
                for (let [key, value] of Object.entries(datasetForSection))
                    newSection.dataset[key] = value;
            newSection.appendChild(innerTextContainer);
            table.appendChild(newSection);
        }
        if (this.deletedElements.length > 0)
            table.appendChild(this.deletedElements.pop());
    }
    undo(table) {
        var _a;
        this.deletedElements.push(table.lastChild);
        (_a = table.lastChild) === null || _a === void 0 ? void 0 : _a.remove();
    }
}
class ChangeTextInCell {
    constructor(cell) {
        this.id = `Change Text In Cell`;
        this.cell = cell;
        this.innerBox = cell.querySelector('p');
        this.height = parseInt(window.getComputedStyle(this.cell).getPropertyValue('height'));
        this.previousValue = this.innerBox.innerText;
        this.textarea = this.createTextarea();
        this.innerBox.remove();
        cell.appendChild(this.textarea);
        this.textarea.focus();
        const newheight = parseInt(window.getComputedStyle(this.cell).getPropertyValue('height'));
        this.textarea.style.marginBottom = `-${newheight - this.height}px`;
    }
    createTextarea() {
        const textarea = document.createElement('textarea');
        textarea.value = this.innerBox.innerText.replace(/\n$/, '');
        textarea.maxLength = 50000;
        textarea.style.backgroundColor = this.cell.style.backgroundColor;
        textarea.style.fontSize = window.getComputedStyle(this.cell).getPropertyValue('font-size');
        textarea.style.fontWeight = window.getComputedStyle(this.cell).getPropertyValue('font-weight');
        textarea.style.fontFamily = window.getComputedStyle(this.cell).getPropertyValue('font-family');
        textarea.style.color = this.cell.style.color;
        textarea.style.height = `${this.height}px`;
        textarea.addEventListener('input', () => {
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
        return textarea;
    }
    execute() {
        this.valueForUser = this.textarea.value;
        this.textarea.remove();
        this.innerBox.innerText = this.textarea.value + '\n';
        this.cell.appendChild(this.innerBox);
    }
    undo() {
        this.innerBox.innerText = this.previousValue;
    }
}
class SetBackgroundColorOfCells {
    constructor({ value, selector, id }) {
        this.id = `Set Background Color Of ${id}`;
        this.value = value;
        this.selector = selector;
        this.valueForUser = value;
    }
    execute(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        this.previousValue = selectedCells[0].dataset.backgroundColor;
        selectedCells.forEach(cell => {
            cell.style.backgroundColor = this.value;
            cell.dataset.backgroundColor = this.value;
        });
    }
    undo(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        selectedCells.forEach(cell => {
            cell.style.backgroundColor = this.previousValue;
            cell.dataset.backgroundColor = this.previousValue;
        });
    }
}
class SetBordersColorOfTable {
    constructor(value) {
        this.id = 'Set Borders Color Of Table';
        this.value = value;
        this.valueForUser = value;
    }
    execute(table) {
        this.previousValue = table.dataset.bordersColor;
        table.style.borderColor = this.value;
        table.style.backgroundColor = this.value;
        table.dataset.bordersColor = this.value;
    }
    undo(table) {
        table.style.borderColor = this.previousValue;
        table.style.backgroundColor = this.previousValue;
        table.dataset.bordersColor = this.previousValue;
    }
}
class SetBordersWidthOfTable {
    constructor({ value, unit }) {
        this.id = 'Set Borders Width Of Table';
        this.value = value;
        this.unit = unit;
        this.valueForUser = `${value + unit}`;
    }
    execute(table) {
        this.previousValue = table.style.borderWidth;
        table.style.borderWidth = this.value + this.unit;
        table.style.gridGap = this.value + this.unit;
    }
    undo(table) {
        table.style.borderWidth = this.previousValue;
        table.style.gridGap = this.previousValue;
    }
}
class SetFontColorOfCells {
    constructor({ value, selector, id }) {
        this.id = `Set Font Color Of ${id}`;
        this.value = value;
        this.selector = selector;
        this.valueForUser = value;
    }
    execute(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        this.previousValue = selectedCells[0].dataset.color;
        selectedCells.forEach(cell => {
            cell.style.color = this.value;
            cell.dataset.color = this.value;
        });
    }
    undo(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        selectedCells.forEach(cell => {
            cell.style.color = this.previousValue;
            cell.dataset.color = this.previousValue;
        });
    }
}
class SetFontSizeOfCells {
    constructor({ value, selector, unit, id }) {
        this.id = `Set Font Size Of ${id}`;
        this.value = value;
        this.selector = selector;
        this.unit = unit;
        this.valueForUser = `${value + unit}`;
    }
    execute(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        this.previousValue = selectedCells[0].dataset.fontSize;
        selectedCells.forEach(cell => {
            cell.style.fontSize = this.value + this.unit;
            cell.dataset.fontSize = this.value + this.unit;
        });
    }
    undo(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        selectedCells.forEach(cell => {
            cell.style.fontSize = this.previousValue;
            cell.dataset.fontSize = this.previousValue;
        });
    }
}
class SetMinHeightOfCells {
    constructor({ value, selector, unit, id }) {
        this.id = `Set Min Height Of ${id}`;
        this.value = value;
        this.selector = selector;
        this.unit = unit;
        this.valueForUser = `${value + unit}`;
    }
    execute(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        this.previousValue = selectedCells[0].style.minHeight;
        selectedCells.forEach(cell => cell.style.minHeight = this.value + this.unit);
    }
    undo(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        selectedCells.forEach(cell => cell.style.minHeight = this.previousValue);
    }
}
class SetNumberOfColumns {
    constructor({ value, width, unit }) {
        this.id = 'Set Number Of Columns';
        this.value = value;
        this.AddColumn = new AddColumn(`${width}${unit}`);
        this.valueForUser = `${value}`;
        this.deletedElements = [];
    }
    execute(table) {
        argsValidation({
            nameOfFunction: `SetNumberOfColumn.execute`,
            dataForValidation: { args: arguments, types: { 0: ['HTMLUListElement'] } }
        });
        this.previousValue = parseInt(table.dataset.columns, 10);
        const addOrNot = this.value > this.previousValue;
        if (addOrNot) {
            const numOfColumnsToModify = this.value - this.previousValue;
            this.AddColumn.deletedElements = this.deletedElements;
            for (let i = 0; i < numOfColumnsToModify; i++)
                this.AddColumn.execute(table);
        }
        if (!addOrNot) {
            const numOfColumnsToModify = this.previousValue - this.value;
            for (let i = 0; i < numOfColumnsToModify; i++)
                this.deletedElements = this.AddColumn.undo(table);
        }
    }
    undo(table) {
        const addOrNot = this.value > this.previousValue;
        if (!addOrNot) {
            const numOfColumnsToModify = this.previousValue - this.value;
            this.AddColumn.deletedElements = this.deletedElements;
            for (let i = 0; i < numOfColumnsToModify; i++)
                this.AddColumn.execute(table);
        }
        if (addOrNot) {
            const numOfColumnsToModify = this.value - this.previousValue;
            for (let i = 0; i < numOfColumnsToModify; i++)
                this.deletedElements = this.AddColumn.undo(table);
        }
    }
}
class SetPaddingOfCells {
    constructor({ value, selector, whichPadding, unit, id }) {
        this.id = `Set ${whichPadding} Padding Of ${id}`;
        this.value = value;
        this.selector = selector;
        this.whichPadding = whichPadding;
        this.unit = unit;
        this.valueForUser = `${value + unit}`;
    }
    getPaddingValue(element) {
        switch (this.whichPadding) {
            case 'Top':
                return element.dataset.paddingTop;
            case 'Bottom':
                return element.dataset.paddingBottom;
            case 'Left':
                return element.dataset.paddingLeft;
            case 'Right':
                return element.dataset.paddingRight;
        }
    }
    setPaddingValue({ element, value }) {
        switch (this.whichPadding) {
            case 'Top':
                element.dataset.paddingTop;
                return element.style.paddingTop = value;
            case 'Bottom':
                element.dataset.paddingBottom = value;
                return element.style.paddingBottom = value;
            case 'Left':
                element.dataset.paddingLeft = value;
                return element.style.paddingLeft = value;
            case 'Right':
                element.dataset.paddingRight = value;
                return element.style.paddingRight = value;
        }
    }
    execute(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        this.previousValue = this.getPaddingValue(selectedCells[0]);
        selectedCells.forEach(cell => this.setPaddingValue({ element: cell, value: this.value + this.unit }));
    }
    undo(table) {
        const selectedCells = table.querySelectorAll(this.selector);
        selectedCells.forEach(cell => this.setPaddingValue({ element: cell, value: this.previousValue }));
    }
}
class SetWidthOfColumn {
    constructor({ value, pickedColumn, unit }) {
        this.id = `Set Width Of Column No. ${pickedColumn}`;
        this.value = value;
        this.unit = unit;
        this.pickedColumn = pickedColumn;
        this.valueForUser = `${value + unit}`;
    }
    execute(table) {
        const allColumns = table.style.gridTemplateColumns.match(/[\w%]+/g);
        this.previousValue = allColumns[this.pickedColumn - 1];
        allColumns[this.pickedColumn - 1] = this.value + this.unit;
        table.style.gridTemplateColumns = allColumns.join(' ');
    }
    undo(table) {
        const allColumns = table.style.gridTemplateColumns.match(/[\w%]+/g);
        allColumns[this.pickedColumn - 1] = this.previousValue;
        table.style.gridTemplateColumns = allColumns.join(' ');
    }
}
class MoveRowUp {
    constructor({ currentPosition, newPosition }) {
        this.previousValue = parseInt(currentPosition, 10);
        this.name = `Move Row Up`;
        this.value = parseInt(newPosition);
    }
    execute(table) {
        const numOfColumns = parseInt(table.dataset.columns);
        const tableArray = createArrayFromTable({ table, numOfColumns });
        let id = tableArray[this.previousValue][0].dataset.id || 1;
        if (id === 1)
            for (let row of tableArray)
                if (row[0].dataset.id) {
                    id = parseInt(row[0].dataset.id) + 1;
                    row[0].removeAttribute('data-id');
                }
        tableArray[this.previousValue][0].dataset.id = `${id}`;
        this.id = `Move Row Up ${id}`;
        for (let i = 0; i < tableArray[this.previousValue].length; i++)
            table.insertBefore(tableArray[this.previousValue][i], tableArray[this.value][0]);
    }
    undo(table) {
        const numOfColumns = parseInt(table.dataset.columns);
        const tableArray = createArrayFromTable({ table, numOfColumns });
        const rowBeforeThis = tableArray[this.previousValue];
        const last = rowBeforeThis.length - 1;
        for (let i = tableArray[this.value].length - 1; i > -1; i--)
            rowBeforeThis[last].after(tableArray[this.value][i]);
    }
}
class MoveRowDown {
    constructor({ currentPosition, newPosition }) {
        this.previousValue = parseInt(currentPosition, 10);
        this.id = `Move Row Down`;
        this.name = `Move Row Down`;
        this.value = parseInt(newPosition);
    }
    execute(table) {
        const numOfColumns = parseInt(table.dataset.columns);
        const tableArray = createArrayFromTable({ table, numOfColumns });
        const rowBeforeThis = tableArray[this.value];
        const last = rowBeforeThis.length - 1;
        let id = tableArray[this.previousValue][0].dataset.id || 1;
        if (id === 1)
            for (let row of tableArray)
                if (row[0].dataset.id) {
                    id = parseInt(row[0].dataset.id) + 1;
                    row[0].removeAttribute('data-id');
                }
        tableArray[this.previousValue][0].dataset.id = `${id}`;
        this.id = `Move Row Down ${id}`;
        for (let i = tableArray[this.previousValue].length - 1; i > -1; i--)
            rowBeforeThis[last].after(tableArray[this.previousValue][i]);
    }
    undo(table) {
        const numOfColumns = parseInt(table.dataset.columns);
        const tableArray = createArrayFromTable({ table, numOfColumns });
        for (let i = 0; i < tableArray[this.value].length; i++)
            table.insertBefore(tableArray[this.value][i], tableArray[this.previousValue][0]);
    }
}
class DeleteRow {
    constructor(rowNumber) {
        this.id = 'Delete Row';
        this.rowNumber = parseInt(rowNumber, 10);
        this.deletedRow = [];
    }
    execute(table) {
        const numOfColumns = parseInt(table.dataset.columns);
        const tableArray = createArrayFromTable({ table, numOfColumns });
        this.deletedRow = tableArray[this.rowNumber];
        this.deletedRow.forEach(cell => cell.remove());
    }
    undo(table) {
        const numOfColumns = parseInt(table.dataset.columns);
        const tableArray = createArrayFromTable({ table, numOfColumns });
        const rowBeforeThis = tableArray[this.rowNumber - 1];
        if (this.rowNumber > 0) {
            const last = rowBeforeThis.length - 1;
            for (let i = this.deletedRow.length - 1; i > -1; i--)
                rowBeforeThis[last].after(this.deletedRow[i]);
        }
        if (this.rowNumber === 0)
            for (let i = this.deletedRow.length - 1; i > -1; i--) {
                if (table.firstChild)
                    table.insertBefore(this.deletedRow[i], table.firstChild);
                if (!table.firstChild)
                    table.append(this.deletedRow[i]);
            }
    }
}
class SetFontSizeAndLeftPadding {
    constructor({ fontSizeValue, leftPaddingValue, selector, unit, id }) {
        this.id = `Set Font Size Of ${id}`;
        this.value = fontSizeValue;
        this.setFontSizeCommand = new SetFontSizeOfCells({ value: fontSizeValue, selector, unit, id });
        this.setPaddingCommand = new SetPaddingOfCells({ value: leftPaddingValue, selector, whichPadding: 'Left', unit, id });
        this.valueForUser = `${fontSizeValue + unit}`;
    }
    execute(table) {
        this.setFontSizeCommand.execute(table);
        this.setPaddingCommand.execute(table);
    }
    undo(table) {
        this.setFontSizeCommand.undo(table);
        this.setPaddingCommand.undo(table);
    }
}
