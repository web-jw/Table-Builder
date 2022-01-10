import * as Command from './commands.js';
import * as Elem from './elements.js';
import * as Func from './functions.js';
window.onload = () => {
    Func.makePlaceForEditMenu(Elem.theTable);
    Func.prepareEditMenusForRows(Elem.theTable);
};
window.onresize = () => Func.makePlaceForEditMenu(Elem.theTable);
window.onbeforeunload = () => "";
const tableChildListObserver = new MutationObserver(function () {
    Func.prepareEditMenusForRows(Elem.theTable);
    Func.makePlaceForEditMenu(Elem.theTable);
    Func.updateEditMenusPosition(Elem.theTable);
    Func.updateWidthOfSections(Elem.theTable);
});
const tableAttributesObserver = new MutationObserver(function () {
    Func.makePlaceForEditMenu(Elem.theTable);
    Func.updateEditMenusPosition(Elem.theTable);
});
tableChildListObserver.observe(Elem.theTable, { childList: true });
tableAttributesObserver.observe(Elem.theTable, { attributes: true });
Elem.theTable.addEventListener('mouseenter', function () {
    const allCells = this.querySelectorAll('li');
    allCells.forEach(cell => cell.addEventListener('click', Func.editCell, true));
});
Elem.theTable.addEventListener('mouseleave', function () {
    const allCells = this.querySelectorAll('li');
    allCells.forEach(cell => cell.removeEventListener('click', Func.editCell, true));
});
Elem.uiButton.addRow.addEventListener('click', function () {
    Elem.newOutstandingTable.executeCommand(new Command.AddRow());
    Func.updateFields(Elem.theTable);
});
Elem.uiButton.addSection.addEventListener('click', function () {
    Elem.newOutstandingTable.executeCommand(new Command.AddSection());
    Func.updateFields(Elem.theTable);
});
Elem.uiButton.downloadTable.addEventListener('click', function () {
    const generatedCode = Func.generateCodeOfTable(Elem.theTable);
    Func.downloadTextFile({ filename: 'OustandingTable.html', text: generatedCode });
});
Elem.uiButton.generateCode.addEventListener('click', function () {
    const generatedCode = Func.generateCodeOfTable(Elem.theTable);
    Func.copyCodeToClipboard(generatedCode);
    this.textContent = 'Copied!';
});
Elem.uiButton.generateCode.addEventListener('focusout', function () {
    this.textContent = 'Generate code';
});
Elem.uiButton.redo.addEventListener('click', () => {
    Elem.newOutstandingTable.redo();
    Func.updateFields(Elem.theTable);
});
Elem.uiButton.redoHistory.addEventListener('click', function () {
    if (this.dataset.isOpen === 'true') {
        this.dataset.isOpen = 'false';
        return Func.historyHide();
    }
    const tableObject = Elem.newOutstandingTable, historyListContainer = Func.historyShow(tableObject.undoHistory);
    if (historyListContainer) {
        this.dataset.isOpen = 'true';
        this.append(historyListContainer);
        const allHistoryElements = historyListContainer.querySelectorAll('li');
        let lastPosition = -1;
        historyListContainer.addEventListener('mouseleave', function () {
            Func.redoPreviewCancel({ lastPosition, tableObject });
            lastPosition = -1;
        });
        allHistoryElements.forEach(element => {
            element.addEventListener('mousedown', function (e) {
                Func.redoPreviewCancel({ lastPosition, tableObject });
                Func.redoFromHistory({ tableObject, historyListContainer, historyElement: this });
                Func.historyHide();
                Func.updateFields(Elem.theTable);
            });
            element.addEventListener('mouseover', function () {
                Func.redoPreview({ historyListContainer, historyElement: this, tableObject, lastPosition });
                lastPosition = [...allHistoryElements].indexOf(this);
                Func.historyTurnOnElementsHover({ historyListContainer, historyElement: this });
            });
            element.addEventListener('mouseleave', function () {
                Func.historyTurnOffElementsHover(historyListContainer);
            });
        });
    }
});
Elem.uiButton.redoHistory.addEventListener('focusout', function () {
    this.dataset.isOpen = 'false';
    Func.historyHide();
});
Elem.uiButton.undo.addEventListener('click', () => {
    Elem.newOutstandingTable.undo();
    Func.updateFields(Elem.theTable);
});
Elem.uiButton.undoHistory.addEventListener('click', function () {
    if (this.dataset.isOpen === 'true') {
        this.dataset.isOpen = 'false';
        return Func.historyHide();
    }
    const tableObject = Elem.newOutstandingTable, historyListContainer = Func.historyShow(tableObject.history);
    if (historyListContainer) {
        this.dataset.isOpen = 'true';
        this.append(historyListContainer);
        const allHistoryElements = historyListContainer.querySelectorAll('li');
        let lastPosition = -1;
        historyListContainer.addEventListener('mouseleave', function () {
            Func.undoPreviewCancel({ lastPosition, tableObject });
            lastPosition = -1;
        });
        allHistoryElements.forEach(element => {
            element.addEventListener('mousedown', function (e) {
                Func.undoPreviewCancel({ lastPosition, tableObject });
                Func.undoFromHistory({ tableObject, historyListContainer, historyElement: this });
                Func.historyHide();
                Func.updateFields(Elem.theTable);
            });
            element.addEventListener('mouseover', function () {
                Func.undoPreview({ historyListContainer, historyElement: this, tableObject, lastPosition });
                lastPosition = [...allHistoryElements].indexOf(this);
                Func.historyTurnOnElementsHover({ historyListContainer, historyElement: this });
            });
            element.addEventListener('mouseleave', function () {
                Func.historyTurnOffElementsHover(historyListContainer);
            });
        });
    }
});
Elem.uiButton.undoHistory.addEventListener('focusout', function () {
    this.dataset.isOpen = 'false';
    Func.historyHide();
});
Elem.uiField.colorOfFont.addEventListener('input', function () {
    Func.previewFontColorOfElements({ table: Elem.theTable, selector: Elem.uiField.pickElement.value, value: this.value });
});
Elem.uiField.colorOfFont.addEventListener('change', function () {
    const id = Elem.uiField.pickElement.selectedOptions[0].label, selector = Elem.uiField.pickElement.value;
    Elem.newOutstandingTable.executeCommand(new Command.SetFontColorOfCells({ id, selector, value: this.value }));
});
Elem.uiField.colorOfBackground.addEventListener('input', function () {
    Func.previewBackgroundColorOfElements({ table: Elem.theTable, selector: Elem.uiField.pickElement.value, value: this.value });
});
Elem.uiField.colorOfBackground.addEventListener('change', function () {
    const id = Elem.uiField.pickElement.selectedOptions[0].label, selector = Elem.uiField.pickElement.value;
    Elem.newOutstandingTable.executeCommand(new Command.SetBackgroundColorOfCells({ id, selector, value: this.value }));
});
Elem.uiField.colorOfBorders.addEventListener('input', function () {
    Func.previewBordersColor({ table: Elem.theTable, value: this.value });
});
Elem.uiField.colorOfBorders.addEventListener('change', function () {
    Elem.newOutstandingTable.executeCommand(new Command.SetBordersColorOfTable(this.value));
});
Elem.uiField.fontSizeOfElements.addEventListener('input', function () {
    const table = Elem.theTable, selector = Elem.uiField.pickElement.value, rightPaddingFieldValue = parseInt(Elem.uiField.paddingRight.value) || 0;
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: 50 });
    Func.previewFontSizeOfElements({ table, selector, value: this.value, unit: 'px' });
    const spaceForRightPading = Func.getSpaceLeftForRightPadding({ table, selector }), spaceForLeftPading = Func.getSpaceLeftForLeftPadding({ table, selector }), value = spaceForLeftPading.toString();
    if (spaceForRightPading - rightPaddingFieldValue < 0)
        Func.previewPaddingOfElements({ table, selector, value, unit: 'px', whichPadding: 'Left' });
});
Elem.uiField.fontSizeOfElements.addEventListener('change', function () {
    const id = Elem.uiField.pickElement.selectedOptions[0].label, selector = Elem.uiField.pickElement.value, table = Elem.theTable, leftPaddingFieldValue = parseInt(Elem.uiField.paddingLeft.value) || 0, spaceForLeftPading = Func.getSpaceLeftForLeftPadding({ table, selector }), leftPaddingValue = spaceForLeftPading.toString();
    Func.updateFields(table);
    if (leftPaddingFieldValue > spaceForLeftPading)
        return Elem.newOutstandingTable.executeCommand(new Command.SetFontSizeAndLeftPadding({ id, selector, leftPaddingValue, fontSizeValue: this.value, unit: 'px' }));
    return Elem.newOutstandingTable.executeCommand(new Command.SetFontSizeOfCells({ id, selector, value: this.value, unit: 'px' }));
});
Elem.uiField.heightOfElements.addEventListener('input', function () {
    const id = Elem.uiField.pickElement.selectedOptions[0].label, selector = Elem.uiField.pickElement.value;
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: 1000 });
    Elem.newOutstandingTable.executeCommand(new Command.SetMinHeightOfCells({ id, selector, value: this.value, unit: 'px' }));
});
Elem.uiField.numberOfColumns.addEventListener('input', function () {
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: 100 });
});
Elem.uiField.numberOfColumns.addEventListener('change', function () {
    const leftPadding = parseInt(Elem.uiField.paddingLeft.value, 10) || 0, rightPadding = parseInt(Elem.uiField.paddingRight.value, 10) || 0, width = leftPadding + rightPadding + 50;
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 1, max: 100 });
    const value = parseInt(this.value);
    Elem.newOutstandingTable.executeCommand(new Command.SetNumberOfColumns({ value, width, unit: 'px' }));
    Func.updateFields(Elem.theTable);
});
Elem.uiField.pickColumn.addEventListener('change', function () {
    const table = Elem.theTable, whichColumn = parseInt(this.value);
    Elem.uiField.widthOfColumn.value = Func.getWidthOfSelectedColumn({ table, whichColumn });
});
Elem.uiField.pickElement.addEventListener('change', function () {
    Func.updateFields(Elem.theTable);
    if (this.value === ".ot-section") {
        Elem.uiField.paddingTop.disabled = true;
        Elem.uiField.paddingBottom.disabled = true;
        Elem.uiField.paddingLeft.disabled = true;
        Elem.uiField.paddingRight.disabled = true;
    }
    else {
        Elem.uiField.paddingTop.disabled = false;
        Elem.uiField.paddingBottom.disabled = false;
        Elem.uiField.paddingLeft.disabled = false;
        Elem.uiField.paddingRight.disabled = false;
    }
});
Elem.uiField.paddingTop.addEventListener('input', function () {
    const id = Elem.uiField.pickElement.selectedOptions[0].label, selector = Elem.uiField.pickElement.value;
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: 500 });
    Elem.newOutstandingTable.executeCommand(new Command.SetPaddingOfCells({ id, selector, whichPadding: 'Top', value: this.value, unit: 'px' }));
});
Elem.uiField.paddingBottom.addEventListener('input', function () {
    const id = Elem.uiField.pickElement.selectedOptions[0].label, selector = Elem.uiField.pickElement.value;
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: 500 });
    Elem.newOutstandingTable.executeCommand(new Command.SetPaddingOfCells({ id, selector, whichPadding: 'Bottom', value: this.value, unit: 'px' }));
});
Elem.uiField.paddingLeft.addEventListener('input', function () {
    const id = Elem.uiField.pickElement.selectedOptions[0].label, selector = Elem.uiField.pickElement.value, table = Elem.theTable;
    let placeLeft = Func.getSpaceLeftForLeftPadding({ table, selector });
    placeLeft = placeLeft < 0 ? 0 : placeLeft;
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: placeLeft });
    if (placeLeft > 0)
        Elem.newOutstandingTable.executeCommand(new Command.SetPaddingOfCells({ id, selector, whichPadding: 'Left', value: this.value, unit: 'px' }));
});
Elem.uiField.paddingRight.addEventListener('input', function () {
    const id = Elem.uiField.pickElement.selectedOptions[0].label, selector = Elem.uiField.pickElement.value, table = Elem.theTable;
    let placeLeft = Func.getSpaceLeftForRightPadding({ table, selector });
    placeLeft = placeLeft < 0 ? 0 : placeLeft;
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: placeLeft });
    if (placeLeft > 0)
        Elem.newOutstandingTable.executeCommand(new Command.SetPaddingOfCells({ id, selector, whichPadding: 'Right', value: this.value, unit: 'px' }));
});
Elem.uiField.widthOfBorders.addEventListener('input', function () {
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: 100 });
    Elem.newOutstandingTable.executeCommand(new Command.SetBordersWidthOfTable({ value: this.value, unit: 'px' }));
});
Elem.uiField.widthOfColumn.addEventListener('input', function () {
    const leftPadding = parseInt(Elem.uiField.paddingLeft.value, 10) || 0, rightPadding = parseInt(Elem.uiField.paddingRight.value, 10) || 0, pickedColumn = parseInt(Elem.uiField.pickColumn.value, 10);
    this.value = Func.restrainFieldValueInRange({ value: this.value, min: 0, max: 1000 });
    let parsedValue = parseInt(this.value);
    if (parsedValue < leftPadding + rightPadding) {
        parsedValue = leftPadding + rightPadding;
        this.value = `${parsedValue}`;
    }
    if (parsedValue >= leftPadding + rightPadding)
        Elem.newOutstandingTable.executeCommand(new Command.SetWidthOfColumn({ pickedColumn, value: this.value, unit: 'px' }));
});
