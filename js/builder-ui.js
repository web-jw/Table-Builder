var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _TableBuilderUi_name, _TableBuilderUi_columns, _TableBuilderUi_rows;
import argsValidation from './validation.js';
var SizesOfFields;
(function (SizesOfFields) {
    SizesOfFields["full"] = "";
    SizesOfFields["half"] = "size-half-element";
    SizesOfFields["quarter"] = "size-quarter-element";
})(SizesOfFields || (SizesOfFields = {}));
export default class TableBuilderUi {
    constructor({ columns = 1, rows = 1, name }) {
        _TableBuilderUi_name.set(this, void 0);
        _TableBuilderUi_columns.set(this, void 0);
        _TableBuilderUi_rows.set(this, void 0);
        __classPrivateFieldSet(this, _TableBuilderUi_name, name, "f");
        __classPrivateFieldSet(this, _TableBuilderUi_columns, columns, "f");
        __classPrivateFieldSet(this, _TableBuilderUi_rows, rows, "f");
        this.builderStructure = [];
        this.uiElements = {
            buttons: {},
            fields: {},
            sections: {}
        };
        for (let x = 0; x < rows; x++) {
            this.builderStructure.push([]);
            for (let y = 0; y < columns; y++)
                this.builderStructure[x].push([]);
        }
        this.createBuilderUi();
    }
    createLabelForHtmlProperties(label) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createLabelForHtmlProperties`,
            dataForValidation: { args: arguments, types: { 0: ['string'] } }
        });
        return label.replace(/ /g, '-').toLocaleLowerCase();
    }
    createBasicStructureForInputElement({ label, inputType, placeholder, value = '' }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createBasicStructureForInputElement`,
            dataForValidation: { args: arguments, types: { all: ['string'], placeholder: ['string', 'undefined'], value: ['string', 'undefined'] } }
        });
        const newBuilderUiElement = document.createElement('input');
        const labelForHtmlProperties = this.createLabelForHtmlProperties(label);
        newBuilderUiElement.name = labelForHtmlProperties;
        newBuilderUiElement.id = labelForHtmlProperties;
        newBuilderUiElement.type = inputType;
        if (placeholder)
            newBuilderUiElement.placeholder = placeholder;
        if (value)
            newBuilderUiElement.value = value;
        return newBuilderUiElement;
    }
    createNumberInputElement({ label, placeholder, value, min = '0', max }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createNumberInputElement`,
            dataForValidation: { args: arguments, types: { all: ['string'], placeholder: ['string', 'undefined'], value: ['string', 'undefined'], min: ['string', 'undefined'], max: ['string', 'undefined'] } }
        });
        const newNumberInputElement = this.createBasicStructureForInputElement({ label, inputType: "number", placeholder, value });
        newNumberInputElement.min = min;
        if (max)
            newNumberInputElement.max = max;
        return newNumberInputElement;
    }
    createColorInputElement({ label, value }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createColorInputElement`,
            dataForValidation: { args: arguments, types: { label: ['string'], value: ['string', 'undefined'] } }
        });
        return this.createBasicStructureForInputElement({ label, inputType: "color", value });
    }
    createTextInputElement({ label, placeholder }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createTextInputElement`,
            dataForValidation: { args: arguments, types: { label: ['string'], placeholder: ['string', 'undefined'] } }
        });
        return this.createBasicStructureForInputElement({ label, inputType: "text", placeholder });
    }
    createSelectInputElement({ selectionArray, label }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createSelectInputElement`,
            dataForValidation: { args: arguments, types: { selectionArray: ['array'], label: ['string'] } }
        });
        const newSelectInputElement = document.createElement('select');
        const labelForHtmlProperties = this.createLabelForHtmlProperties(label);
        newSelectInputElement.name = labelForHtmlProperties;
        newSelectInputElement.id = labelForHtmlProperties;
        selectionArray.forEach(optionObj => {
            const newOptionForSelect = document.createElement('option');
            newOptionForSelect.label = optionObj[0];
            newOptionForSelect.value = optionObj[1] || optionObj[0];
            newSelectInputElement.append(newOptionForSelect);
        });
        return newSelectInputElement;
    }
    createLabelForInputElement({ label, labelText }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createLabelForInputElement`,
            dataForValidation: { args: arguments, types: { all: ['string'] } }
        });
        const labelForInputElement = document.createElement('label');
        const labelForHtmlProperties = this.createLabelForHtmlProperties(label);
        labelForInputElement.htmlFor = labelForHtmlProperties;
        labelForInputElement.id = `${labelForHtmlProperties}-label`;
        labelForInputElement.innerText = labelText;
        return labelForInputElement;
    }
    createButtonElement({ label, sizeOfButton = SizesOfFields.full, buttonText }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createButtonElement`,
            dataForValidation: { args: arguments, types: { label: ['string'], sizeOfButton: ['string', 'undefined'], buttonText: ['string', 'undefined'] } }
        });
        const newButtonElement = document.createElement('button');
        const labelForHtmlProperties = this.createLabelForHtmlProperties(label);
        newButtonElement.name = labelForHtmlProperties;
        newButtonElement.id = labelForHtmlProperties;
        newButtonElement.innerText = buttonText || label;
        if (sizeOfButton !== SizesOfFields.full)
            newButtonElement.classList.add(sizeOfButton);
        return newButtonElement;
    }
    createSectionLabel(label) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createSectionLabel`,
            dataForValidation: { args: arguments, types: { 0: ['string'] } }
        });
        const newSectionLabel = document.createElement('p');
        newSectionLabel.id = this.createLabelForHtmlProperties(label);
        newSectionLabel.classList.add('ui-section');
        newSectionLabel.innerText = label;
        return newSectionLabel;
    }
    addElementToUiElements({ uiElementContainer, typeOfElement }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.addElementToUiElements`,
            dataForValidation: { args: arguments, types: { uiElementContainer: ['object'], typeOfElement: ['string'] } }
        });
        const { uiLabel } = uiElementContainer, other = __rest(uiElementContainer, ["uiLabel"]);
        this.uiElements[typeOfElement] = Object.assign(Object.assign({}, this.uiElements[typeOfElement]), { [uiLabel]: Object.assign({}, other) });
    }
    createUiLabel(label) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createUiLabel`,
            dataForValidation: { args: arguments, types: { 0: ['string'] } }
        });
        return label.toLowerCase().replace(/ [a-z]/g, x => x.toUpperCase()).replace(/ /g, '');
    }
    createUiFieldElement({ uiLabel, labelText, createCallback, argsForCallback, sizeOfField = SizesOfFields.full }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.createUiFieldElement`,
            dataForValidation: { args: arguments, types: { uiLabel: ['string'], labelText: ['string', 'undefined'], createCallback: ['function'], argsForCallback: ['object'], sizeOfField: ['string', 'undefined'] } }
        });
        const uiElementContainer = {
            uiLabel: uiLabel || this.createUiLabel(argsForCallback.label),
            element: createCallback(argsForCallback),
            labelElement: this.createLabelForInputElement({ label: argsForCallback.label, labelText: labelText || argsForCallback.label }),
        };
        if (sizeOfField !== SizesOfFields.full)
            uiElementContainer.element.classList.add(sizeOfField);
        this.addElementToUiElements({ uiElementContainer, typeOfElement: 'fields' });
        return this;
    }
    getTypeOfUiElement(uiLabel) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.getTypeOfUiElement`,
            dataForValidation: { args: arguments, types: { 0: ['string'] } }
        });
        const typesOfElement = [];
        for (let typeOfElement in this.uiElements)
            if (uiLabel in this.uiElements[typeOfElement])
                typesOfElement.push(typeOfElement);
        if (typesOfElement.length === 1)
            return typesOfElement[0];
        console.error(`${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.getTypeOfUiElement(): ${uiLabel} has more types: ${typesOfElement}`);
    }
    getUiElement({ uiLabel, type }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.getUiElement`,
            dataForValidation: { args: arguments, types: { uiLabel: ['string'], type: ['string', 'undefined'] } }
        });
        const typeOfElement = type || this.getTypeOfUiElement(uiLabel);
        if (typeOfElement)
            return this.uiElements[typeOfElement][uiLabel];
        console.error(`${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.getUiElement(): Couldn't get or there is no ${uiLabel} element`);
        return false;
    }
    getHtmlElement({ uiLabel, type }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.getHtmlElement`,
            dataForValidation: { args: arguments, types: { uiLabel: ['string'], type: ['string', 'undefined'] } }
        });
        const uiElement = this.getUiElement({ uiLabel, type });
        if (uiElement)
            return uiElement.element;
    }
    addToUiStructure({ uiLabel, uiRow = 1, uiColumn = 1, withLabel = true }) {
        argsValidation({
            nameOfFunction: `${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.addToUiStructure`,
            dataForValidation: { args: arguments, types: { uiLabel: ['string'], uiRow: ['number', 'undefined'], uiColumn: ['number', 'undefined'], withLabel: ['boolean'] } }
        });
        if (uiRow > __classPrivateFieldGet(this, _TableBuilderUi_rows, "f"))
            console.error(`${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.addToUiStructure(): Value of uiRow (${uiRow}) is haigher then number of declared rows (${__classPrivateFieldGet(this, _TableBuilderUi_rows, "f")})`);
        if (uiColumn > __classPrivateFieldGet(this, _TableBuilderUi_columns, "f"))
            console.error(`${__classPrivateFieldGet(this, _TableBuilderUi_name, "f")}.addToUiStructure(): Value of uiColumn (${uiColumn}) is haigher then number of declared columns (${__classPrivateFieldGet(this, _TableBuilderUi_columns, "f")})`);
        const uiSectionToModify = this.builderStructure[uiRow - 1][uiColumn - 1];
        const typeOfUiElementToAdd = this.getTypeOfUiElement(uiLabel);
        const uiElementToAdd = this.getUiElement({ uiLabel });
        if (!uiElementToAdd)
            return this;
        if (typeOfUiElementToAdd === 'buttons' || !withLabel) {
            uiSectionToModify.push(uiElementToAdd.element);
            return this;
        }
        uiSectionToModify.push(uiElementToAdd.labelElement);
        uiSectionToModify.push(uiElementToAdd.element);
        return this;
    }
    createUiFields() {
        this.createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            argsForCallback: {
                label: 'Number of columns',
                value: '2',
                min: '1',
                max: '100'
            }
        }).createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            labelText: 'Width of column (px)',
            argsForCallback: {
                label: 'Width of column',
                value: '200',
                max: '1000'
            }
        }).createUiFieldElement({
            createCallback: this.createSelectInputElement.bind(this),
            argsForCallback: {
                label: 'Pick column',
                selectionArray: ['1', '2']
            },
            labelText: 'Pick a column'
        }).createUiFieldElement({
            createCallback: this.createSelectInputElement.bind(this),
            argsForCallback: {
                label: 'Pick elements',
                selectionArray: [['Rows', '.ot-row'], ['Sections', '.ot-section']]
            },
        }).createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            labelText: 'Min height of elements (px)',
            argsForCallback: {
                label: 'Height of element',
                value: '30',
                max: '1000'
            }
        }).createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            labelText: 'Width of borders (px)',
            argsForCallback: {
                label: 'Width of borders',
                value: '1',
                max: '100'
            }
        }).createUiFieldElement({
            createCallback: this.createColorInputElement.bind(this),
            argsForCallback: {
                label: 'Color of borders',
                value: '#000000'
            }
        }).createUiFieldElement({
            createCallback: this.createColorInputElement.bind(this),
            argsForCallback: {
                label: 'Color of background',
                value: '#ffffff'
            }
        }).createUiFieldElement({
            createCallback: this.createColorInputElement.bind(this),
            argsForCallback: {
                label: 'Color of font',
                value: '#000000'
            }
        }).createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            sizeOfField: SizesOfFields.half,
            argsForCallback: {
                label: 'Padding Left',
                placeholder: 'Left',
            }
        }).createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            sizeOfField: SizesOfFields.half,
            argsForCallback: {
                label: 'Padding Top',
                placeholder: 'Top',
            }
        }).createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            sizeOfField: SizesOfFields.half,
            argsForCallback: {
                label: 'Padding Right',
                placeholder: 'Right',
            }
        }).createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            sizeOfField: SizesOfFields.half,
            argsForCallback: {
                label: 'Padding Bottom',
                placeholder: 'Bottom',
            }
        }).createUiFieldElement({
            createCallback: this.createNumberInputElement.bind(this),
            labelText: 'Font size of elements (px)',
            argsForCallback: {
                label: 'Font size of elements',
                value: '16',
                max: '50',
            }
        });
        return this;
    }
    createUiButtons() {
        const buttonsToCreate = [
            { label: 'Add row' },
            { label: 'Add section' },
            { label: 'Add bulk' },
            { label: 'Download table' },
            { label: 'Generate code' },
            { label: 'Undo', sizeOfButton: SizesOfFields.quarter },
            { label: 'Undo History', sizeOfButton: SizesOfFields.quarter, buttonText: '☰' },
            { label: 'Redo', sizeOfButton: SizesOfFields.quarter },
            { label: 'Redo History', sizeOfButton: SizesOfFields.quarter, buttonText: '☰' }
        ];
        buttonsToCreate.forEach(buttonSettings => {
            const createdButton = this.createButtonElement(buttonSettings);
            const uiLabel = this.createUiLabel(buttonSettings.label);
            const uiElementContainer = {
                uiLabel: uiLabel,
                element: createdButton
            };
            this.addElementToUiElements({ uiElementContainer, typeOfElement: 'buttons' });
        });
        return this;
    }
    createUiSections() {
        const sectionsToCreater = [
            'Padding of element'
        ];
        sectionsToCreater.forEach(sectionSettings => {
            const createdSection = this.createSectionLabel(sectionSettings);
            const uiLabel = this.createUiLabel(sectionSettings);
            const uiElementContainer = {
                uiLabel: uiLabel,
                element: createdSection
            };
            this.addElementToUiElements({ uiElementContainer, typeOfElement: 'sections' });
        });
        return this;
    }
    createBuilderUi() {
        this
            .createUiFields()
            .createUiButtons()
            .createUiSections()
            .addToUiStructure({ uiLabel: 'numberOfColumns' })
            .addToUiStructure({ uiLabel: 'pickColumn' })
            .addToUiStructure({ uiLabel: 'widthOfColumn' })
            .addToUiStructure({ uiLabel: 'widthOfBorders' })
            .addToUiStructure({ uiLabel: 'colorOfBorders' })
            .addToUiStructure({ uiLabel: 'pickElements', uiColumn: 2 })
            .addToUiStructure({ uiLabel: 'heightOfElement', uiColumn: 2 })
            .addToUiStructure({ uiLabel: 'fontSizeOfElements', uiColumn: 2 })
            .addToUiStructure({ uiLabel: 'colorOfFont', uiColumn: 2 })
            .addToUiStructure({ uiLabel: 'colorOfBackground', uiColumn: 2 })
            .addToUiStructure({ uiLabel: 'paddingOfElement', uiColumn: 2, withLabel: false })
            .addToUiStructure({ uiLabel: 'paddingLeft', uiColumn: 2, withLabel: false })
            .addToUiStructure({ uiLabel: 'paddingRight', uiColumn: 2, withLabel: false })
            .addToUiStructure({ uiLabel: 'paddingTop', uiColumn: 2, withLabel: false })
            .addToUiStructure({ uiLabel: 'paddingBottom', uiColumn: 2, withLabel: false })
            .addToUiStructure({ uiLabel: 'undo', uiColumn: 3 })
            .addToUiStructure({ uiLabel: 'undoHistory', uiColumn: 3 })
            .addToUiStructure({ uiLabel: 'redo', uiColumn: 3 })
            .addToUiStructure({ uiLabel: 'redoHistory', uiColumn: 3 })
            .addToUiStructure({ uiLabel: 'addRow', uiColumn: 3 })
            .addToUiStructure({ uiLabel: 'addSection', uiColumn: 3 })
            .addToUiStructure({ uiLabel: 'generateCode', uiColumn: 3 })
            .addToUiStructure({ uiLabel: 'downloadTable', uiColumn: 3 });
    }
    displayBuilderUi(builderContainer) {
        const builderUiContainer = document.createElement('ul');
        builderUiContainer.id = "table-builder-interface";
        builderUiContainer.style.gridTemplateColumns = `repeat(${__classPrivateFieldGet(this, _TableBuilderUi_columns, "f")}, minmax(100px, 220px))`;
        this.builderStructure.forEach(row => {
            row.forEach(column => {
                const htmlColomun = document.createElement('li');
                column.forEach(element => htmlColomun.appendChild(element));
                builderUiContainer.appendChild(htmlColomun);
                builderContainer.appendChild(builderUiContainer);
            });
        });
    }
}
_TableBuilderUi_name = new WeakMap(), _TableBuilderUi_columns = new WeakMap(), _TableBuilderUi_rows = new WeakMap();
