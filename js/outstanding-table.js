// Table class
export default class TheOutstandingTable {
    // Create HTML table, history of commands and reversed commands, and displays the table in the specified container
    constructor(builderContainer) {
        this.table = document.createElement('ul');
        this.table.className = "outstanding-table";
        this.table.style.gridTemplateColumns = '200px 400px';
        // Set data for some commands
        this.table.dataset.columns = '2';
        this.table.dataset.bordersColor = '#000000';
        // Set mode for command execution
        this.mode = 0;
        // Create structure of the table
        this.createSection();
        for (let i = 0; i < 4; i++)
            this.createCell();
        // Insert the table in the specified container
        builderContainer.appendChild(this.table);
        // Create history of commands and reversed commands
        this.history = [];
        this.undoHistory = [];
    }
    // Create section in the table
    createSection() {
        const newSection = document.createElement('li');
        const innerTextContainer = document.createElement('p');
        newSection.className = 'ot-section';
        newSection.style.minHeight = '40px';
        newSection.style.gridColumn = '1/3';
        // Set data for some commands
        newSection.dataset.color = '#000000';
        newSection.dataset.fontSize = '18px';
        newSection.dataset.backgroundColor = '#ffffff';
        innerTextContainer.innerText = 'Section';
        newSection.appendChild(innerTextContainer);
        this.table.appendChild(newSection);
    }
    // Create cell in row of the table
    createCell() {
        const newLi = document.createElement('li');
        const innerTextContainer = document.createElement('p');
        newLi.className = 'ot-row';
        newLi.style.minHeight = '30px';
        // Set data for some commands
        newLi.dataset.color = '#000000';
        newLi.dataset.fontSize = '16px';
        newLi.dataset.paddingTop = '0';
        newLi.dataset.paddingBottom = '0';
        newLi.dataset.paddingLeft = '0';
        newLi.dataset.paddingRight = '0';
        newLi.dataset.backgroundColor = '#ffffff';
        innerTextContainer.innerText = 'Row';
        newLi.appendChild(innerTextContainer);
        this.table.appendChild(newLi);
    }
    // Execute command (command pattern) to modify the table and update the history of executed command
    executeCommand(command) {
        command.execute(this.table);
        if (this.history.length === 500)
            this.history.shift();
        // Get last executed command from history
        const lastAction = this.history[this.history.length - 1];
        /* Check if there was any executed command before
        if there is one check if it's the same as the one executed now and if it has "value" property */
        if (lastAction && command.id === lastAction.id && command.value !== (null || undefined)) {
            if (command.value === lastAction.value)
                return this;
            const lastValue = parseInt(lastAction.value, 10);
            const newValue = parseInt(command.value, 10);
            // Check if value of now executed command differs only by 1 from last executed command
            if (newValue === lastValue + 1 || newValue === lastValue - 1) {
                // Get new mode of execution if value is increasing or decreasing
                const newMode = newValue > lastValue ? 1 : -1;
                // Check if execution mode is the same as before or if it's value was default
                if (this.mode === newMode || this.mode === 0) {
                    // Set new mode of execution
                    this.mode = newMode;
                    // Update values of last executed command in history of executed commands
                    lastAction.value = command.value;
                    lastAction.valueForUser = command.valueForUser;
                    // Check if executed command has "deletedElements" array and if it's not empty
                    if (command.deletedElements && command.deletedElements.length > 0)
                        // Update array of deleted Elements in last executed command
                        lastAction.deletedElements = [...lastAction.deletedElements, ...command.deletedElements];
                    return this;
                }
                /* If last mode was diffrent and wasn't default (0)
                set new mode of execution and add new command to history */
                this.mode = newMode;
                this.history.push(command);
                return this;
            }
        }
        /* If executed command is not the same as the last one
        set execution mode to default and add new command to history */
        this.mode = 0;
        this.history.push(command);
        this.undoHistory = [];
        return this;
    }
    // Reverse last executed command and update history of revesed commands 
    undo() {
        const command = this.history.pop();
        if (command) {
            command.undo(this.table);
            this.undoHistory.push(command);
        }
        return command;
    }
    // Execute last reversed command and update histroy of executed commands 
    redo() {
        const command = this.undoHistory.pop();
        if (command) {
            command.execute(this.table);
            this.history.push(command);
        }
        return command;
    }
}
