// Class for a filterable and searchable table


// Currently supported types of filters
const DisplayType = {
    Simple: "Simple",
    Range: "Range",
    Datetime: "Datetime"
};

// Column configuration
class FilterTableColumn {
    constructor(label, displayType, sourceCol, filterType, searchable) {
        this.label = label;
        this.displayType = displayType;
        this.sourceCol = sourceCol;
        this.filterType = filterType;
        this.searchable = searchable;
    }
}

// Filterable and searchable table class
class FilterTable {
    constructor(colMeta, htmlTable, insertRowShiftIdx, htmlFilterBox, searchBox) {
        if (colMeta.constructor !== Array) colMeta = [colMeta];
        this.colMeta = colMeta;
        this.htmlTable = htmlTable;
        this.insertRowShiftIdx = insertRowShiftIdx;
        this.searchBox = searchBox;
        this.rows = [];
        this.filters = Array(colMeta.length).fill(null);

        // Add keyup event for the search bar to search on searchable columns
        searchBox.rows = this.rows;
        searchBox.addEventListener('keyup', (event) => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            this.checkSearchBox();
        });

        // Create header row
        let newRow = htmlTable.insertRow(htmlTable.rows.length + insertRowShiftIdx);
        for (let colIdx in colMeta) {
            const col = colMeta[colIdx];

            let newCol = document.createElement('th');
            newCol.innerHTML = col.label;
            newRow.appendChild(newCol);

            // If this column is filterable, set up that filter
            if (col.filterType) {
                // Create html container for filter, label, and values
                let filterBox = document.createElement('div');
                htmlFilterBox.appendChild(filterBox);

                // Create html for filter title (column name)
                let filterTitle = document.createElement('p');
                filterTitle.innerText = col.label;
                filterBox.appendChild(filterTitle);

                // Initialize filter
                let newFilter = new Filter(col.filterType, colIdx, filterBox);
                this.filters[colIdx] = newFilter;

                // Specific filter setup
                switch(newFilter.filterType) {
                    case FilterType.CheckBoxes:
                    case FilterType.Tags:
                        // Add an "All" option
                        let checkBoxValue = new CheckBoxValue("All", newFilter);
                        newFilter.allCheckBox = checkBoxValue.htmlCheckBox;
                        filterBox.appendChild(checkBoxValue.htmlBox); // special place for "All"

                        // Don't want "All" in list of filter values, so reset it
                        newFilter.filterValues = {};

                        // Custom onclick for "All"
                        newFilter.allCheckBox.onclick = function () {
                            // When clicking "All", copy checked down to all other values
                            let filter = this.checkBoxValue.filter;
                            Object.entries(filter.filterValues).forEach(([key, checkBoxValue]) => {
                                if (this.checked) {
                                    checkBoxValue.htmlBox.firstChild.checked = true;
                                    checkBoxValue.check();
                                }
                                else {
                                    checkBoxValue.htmlBox.firstChild.checked = false;
                                    checkBoxValue.uncheck();
                                }
                            })
                        }

                        // Add a horizontal line to separate "All" from the other filter values
                        let newHLine = document.createElement('hr');
                        checkBoxValue.htmlBox.appendChild(newHLine);
                        break;
                    case FilterType.IntRange:
                        // Do nothing - ranges are set up with first value
                        // This is because we otherwise don't have a min and max value
                        break;
                    default:
                        // Do nothing
                        break;
                }

                // Add the rest of the filter values to this box
                const filterValuesBox = document.createElement('div');
                filterBox.appendChild(filterValuesBox);
                newFilter.htmlFilter = filterValuesBox;
            }
        }
    }

    // Append a row to this filter table
    // Creates cross-references between filters, rows, and "filter values"
    appendRow(rawRow) {
        let newRow = this.htmlTable.insertRow(this.htmlTable.rows.length + this.insertRowShiftIdx);
        this.rows.push(newRow);

        // Initialize our special information for this row
        // Since we want to replace remove(), we'll just put our extra stuff here
        //        instead of creating new row class that contains the html row
        newRow.searchKey = '';
        newRow.filterValuesByCol = Array(this.colMeta.length).fill(null);
        newRow.origRemove = newRow.remove;
        newRow.remove = function () {
            for (let filterValues of this.filterValuesByCol) {
                if (filterValues) {
                    for (let filterValue of filterValues) {
                        filterValue.removeRow(this);
                    }
                }
            }
            this.origRemove();
        }
        newRow.selectedByFilter = Array(this.colMeta.length).fill(true);
        newRow.selectedBySearch = true;
        newRow.filterSetHidden = function() {
            if (!this.selectedBySearch) {
                newRow.hidden = true;
            }
            else {
                newRow.hidden = false;
                for (const selected of this.selectedByFilter) {
                    if (!selected) {
                        newRow.hidden = true;
                        break;
                    }
                }
            }
        }

        // Append this row to the table, one column at a time
        for (let colIdx in this.colMeta) {
            const col = this.colMeta[colIdx];

            // Collect all the source values into an array
            let srcData = rawRow;
            for (let srcColItem of col.sourceCol.split('.')) {
                srcData = srcData[srcColItem];
            }
            if (!srcData) srcData = '';

            // Create a column with this label
            let newCol = newRow.insertCell();
            switch(col.displayType) {
                case DisplayType.Range:
                    newCol.innerText = srcData[0] + ' to ' + srcData[1];
                    break;
                case DisplayType.Datetime:
                    let newInput = document.createElement('input');
                    newInput.setAttribute('type', 'datetime-local');
                    newInput.value = srcData;
                    newInput.disabled = true;
                    newCol.appendChild(newInput);
                    break;
                case DisplayType.Simple:
                default:
                    newCol.innerText = srcData;
                    break;
            }

            // Process filter: add cross references between row, filter, and filter value
            if (col.filterType) {
                let filter = this.filters[colIdx];
                if (!newRow.filterValuesByCol[colIdx]) newRow.filterValuesByCol[colIdx] = [];
                switch(filter.filterType) {
                    case FilterType.CheckBoxes:
                        let checkBoxValue = filter.filterValues[newCol.innerHTML];
                        if (!checkBoxValue) checkBoxValue = new CheckBoxValue(newCol.innerHTML, filter, colIdx);
                        checkBoxValue.appendRow(newRow);
                        break;
                    case FilterType.Tags:
                        for (const word of srcData.split(" ")) {
                            let checkBoxValue = filter.filterValues[word];
                            if (!checkBoxValue) checkBoxValue = new CheckBoxValue(word, filter, colIdx);
                            checkBoxValue.appendRow(newRow);
                        }
                        break;
                    case FilterType.IntRange:
                        let rangeValue = filter.filterValues[srcData];
                        if (!rangeValue) rangeValue = new IntRangeValue(srcData, filter, colIdx);
                        rangeValue.appendRow(newRow);
                        break;
                    default:
                        // Do nothing
                        break;
                }
            }

            // For searchable columns, add value to search key
            if (col.searchable) {
                if (newRow.searchKey.length === 0) newRow.searchKey = srcData.trim().toLowerCase();
                else newRow.searchKey += ' ' + srcData.trim().toLowerCase();
            }
        } // loop on columns

        // Check search box and filter values, to perhaps hide a row that was already searched or filtered out
        this.checkSearchBox();

        return newRow;
    }

    // Reset the search box
    resetSearchBox() {
        this.searchBox.innerText = '';
        for (let row of this.searchBox.rows) {
            row.selectedBySearch = true;
            row.filterSetHidden();
        }
    }

    // Check each row against the current value of the search box
    checkSearchBox() {
        const keysToCheck = this.searchBox.innerText.trim().toLowerCase().split(' ');
        for (let row of this.searchBox.rows) {
            if (keysToCheck.length === 0) {
                // Nothing searched - include all rows
                row.selectedBySearch = true;
            }
            else if (row.searchKey.length === 0) {
                // Somehow no search key - never include
                row.selectedBySearch = false;
            }
            else {
                row.selectedBySearch = true;
                for (const key of keysToCheck) {
                    if (row.searchKey.indexOf(key) === -1) {
                        row.selectedBySearch = false;
                        break;
                    }
                }
            }
            row.filterSetHidden();
        }
    }
}

// Filter class (for each filterable column)
class Filter {
    constructor(filterType, colIdx, htmlFilter) {
        this.filterType = filterType;
        this.colIdx = colIdx;
        this.htmlFilter = htmlFilter;
        this.filterValues = {};
    }

    // Returns true if all values in this filter are selected
    // Useful for an "All" checkbox
    allValuesSelected() {
        let allSelected = true;
        Object.entries(this.filterValues).every(([key, filterValue]) => {
            if (!filterValue.selected) {
                allSelected = false;
                return false;
            }
            return true;
        })
        return allSelected;
    }
}

// Filterable values base class
class FilterValue {
    constructor(value, filter, htmlBox, colIdx) {
        this.value = value;
        this.filter = filter; // for deletion
        this.htmlBox = htmlBox; // for deletion
        this.colIdx = colIdx;
        this.selected = true;
        this.rows = [];
    }

    // Create cross-references between a row and this filterable value
    appendRow(row) {
        row.filterValuesByCol[this.colIdx].push(this);
        this.rows.push(row);

        // If this wasn't selected, ensure that this row knows that
        if (!this.selected && row.filterValuesByCol[this.colIdx].length === 1) {
            row.selectedByFilter[this.colIdx] = false;
            row.filterSetHidden();
        }
    }

    // Remove cross-references between a row and this filterable value
    removeRow(row) {
        let index = this.rows.indexOf(row);
        if (index !== -1) {
            this.rows.splice(index, 1);

            // If this value isn't used anymore, delete it
            if (this.rows.length === 0) {
                this.htmlBox.remove();
                this.htmlBox = null;
                delete this.filter.filterValues[this.value];
            }
        }
    }

    // Mark this value as selected (aka not filtered out)
    select() {
        if (!this.selected) {
            this.selected = true;
            for (let row of this.rows) {
                row.selectedByFilter[this.colIdx] = true;
                row.filterSetHidden();
            }
        }
    }

    // Mark this value as filtered out
    unselect() {
        if (this.selected) {
            this.selected = false;
            for (let row of this.rows) {
                row.selectedByFilter[this.colIdx] = false;
                for (const filterValue of row.filterValuesByCol[this.colIdx]) {
                    if (filterValue.selected) {
                        row.selectedByFilter[this.colIdx] = true;
                        break;
                    }
                }
                row.filterSetHidden();
            }
        }
    }
}

// Currently supported types of filters
const FilterType = {
    CheckBoxes: "CheckBoxes",
    Tags: "Tags",
    IntRange: "IntRange"
};

// Checkbox filterable value class
class CheckBoxValue extends FilterValue {
    constructor(value, filter, colIdx) {
        // Create box for checkbox, containing "input" and "label"
        let container = document.createElement('div');
        container.classList.add('checkbox-box');

        super(value, filter, container, colIdx);

        // Add new filter value
        filter.filterValues[value] = this;

        // Create checkbox for this new value
        let checkBox = document.createElement('input');
        checkBox.type = "checkbox";
        checkBox.checked = true;
        checkBox.checkBoxValue = this;
        checkBox.onclick = function () {
            if (this.checked) this.checkBoxValue.check();
            else this.checkBoxValue.uncheck();
        }
        this.htmlCheckBox = checkBox;
        container.appendChild(checkBox);

        // Create label for the checkbox
        let label = document.createElement('label');
        label.for = checkBox;
        if (value.length === 0) label.innerText = ' (blank)';
        else label.innerText = value;
        container.appendChild(label);

        // Insert sorted
        let didInsert = false;
        for (let child of filter.htmlFilter.children) {
            if (value < child.lastChild.innerText) {
                filter.htmlFilter.insertBefore(container, child);
                didInsert = true;
                break;
            }
        }
        if (!didInsert) filter.htmlFilter.appendChild(container);
    }

    check() {
        this.select();
        if (this.filter.allValuesSelected()) this.filter.allCheckBox.checked = true;
    }

    uncheck() {
        this.unselect();
        this.filter.allCheckBox.checked = false;
    }
}

// Range of integers filterable value class
class IntRangeValue extends FilterValue {
    constructor(range, filter, colIdx) {
        super(range, filter, null, colIdx);
        filter.filterValues[range] = this;

        let fromVal = range[0].toString();
        let toVal = range[1].toString();

        // If this is the first time, do some first-time setup of the html objects
        // Otherwise update max and mix
        if (!Object.hasOwn(filter, 'fromRange')) {
            // Create box for range (input) and label on the "from" side
            let fromRangeBox = document.createElement('div');
            fromRangeBox.classList.add('range-box');
            filter.htmlFilter.appendChild(fromRangeBox);

            // Create "from" range input
            let fromRange = document.createElement('input');
            fromRange.type = "range";
            fromRange.min = fromVal;
            fromRange.max = toVal;
            fromRange.value = fromVal;
            fromRange.userSelectedOnce = false;
            fromRange.oninput = function() {
                let filter = this.filter;
                this.userSelectedOnce = true;
                filter.fromLabel.innerText = this.value;
                filter.toRange.value = Math.max(parseInt(filter.toRange.value.replace(/,/g, '')), parseInt(this.value.replace(/,/g, ''))).toString();
                filter.toLabel.innerText = filter.toRange.value;
                for (let [key, filterValue] of Object.entries(filter.filterValues)) {
                    if (this.value > filterValue.value[1]) filterValue.unselect();
                    else filterValue.select();
                }
            }
            fromRange.filter = filter;
            filter.fromRange = fromRange;
            fromRangeBox.appendChild(fromRange);

            // Create "from" range label (displays currently selected value)
            let fromLabel = document.createElement('label');
            fromLabel.for = fromRange;
            fromRangeBox.appendChild(fromLabel);
            filter.fromLabel = fromLabel;

            // Create box for range (input) and label on the "to" side
            let toRangeBox = document.createElement('div');
            toRangeBox.classList.add('range-box');
            filter.htmlFilter.appendChild(toRangeBox);

            // Create "to" range input
            let toRange = document.createElement('input');
            toRange.type = "range";
            toRange.min = fromVal;
            toRange.max = toVal;
            toRange.value = toVal;
            toRange.userSelectedOnce = false;
            toRange.oninput = function() {
                let filter = this.filter;
                this.userSelectedOnce = true;
                filter.toLabel.innerText = this.value;
                filter.fromRange.value = Math.min(parseInt(filter.fromRange.value), parseInt(this.value)).toString();
                filter.fromLabel.innerText = filter.fromRange.value;
                for (let [key, filterValue] of Object.entries(filter.filterValues)) {
                    if (this.value < filterValue.value[0]) filterValue.unselect();
                    else filterValue.select();
                }
            }
            filter.toRange = toRange;
            toRange.filter = filter;
            toRangeBox.appendChild(toRange);

            // Create "to" range label (displays currently selected value)
            let toLabel = document.createElement('label');
            toLabel.for = toRange;
            toRangeBox.appendChild(toLabel);
            filter.toLabel = toLabel;
        }
        else {
            // Update max and min for both "from" and "to"
            filter.fromRange.min = Math.min(parseInt(filter.fromRange.min), fromVal).toString();
            filter.fromRange.max = Math.max(parseInt(filter.fromRange.max), toVal).toString();
            filter.toRange.min = Math.min(parseInt(filter.toRange.min), fromVal).toString();
            filter.toRange.max = Math.max(parseInt(filter.toRange.max), toVal).toString();

            // If the user has touched the range, this range of values may start unselected
            // Otherwise, we can update the value
            if (filter.fromRange.userSelectedOnce) {
                // If selected once, we may need to filter out this value
                if (parseInt(filter.fromRange.value) > range[1]) this.unselect();
            }
            else {
                filter.fromRange.value = Math.min(parseInt(filter.fromRange.value), fromVal).toString();
            }
            if (filter.toRange.userSelectedOnce) {
                if (parseInt(filter.toRange.value) < range[0]) this.unselect();
            }
            else {
                filter.toRange.value = Math.max(parseInt(filter.toRange.value), toVal).toString();
            }
        }

        // Wherever the values land, the labels should reflect those values
        filter.fromLabel.innerText = filter.fromRange.value;
        filter.toLabel.innerText = filter.toRange.value;
    }
}