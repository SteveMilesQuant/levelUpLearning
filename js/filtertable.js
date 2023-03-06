// Class for a filterable and searchable table

class FilterTableColumn {
    constructor(box, elem) {
        this.box = box;
        this.elem = elem;
        this.value = null;
        this.sortValue = null;
        this.searchKey = null;
        box.appendChild(elem);
    }

    setValue(value) {
        this.value = value;
    }
}

class FilterTableText extends FilterTableColumn {
    constructor(box) {
        let elem = document.createElement('p');
        super(box, elem);
    }

    setValue(inValue) {
        super.setValue(inValue);
        this.elem.innerText = inValue;
        this.sortValue = inValue;
    }
}

class FilterTableRange extends FilterTableColumn {
    constructor(box) {
        let elem = document.createElement('p');
        super(box, elem);
    }

    setValue(inValue) {
        super.setValue(inValue);
        let rangeText = inValue[0] + ' to ' + inValue[1];
        this.elem.innerText = rangeText;
        this.sortValue = inValue[0];
    }
}

class FilterTableDatetime extends FilterTableColumn {
    constructor(box) {
        let elem = document.createElement('input');
        elem.setAttribute('type', 'datetime-local');
        elem.disabled = true;
        super(box, elem);
    }

    setValue(inValue) {
        super.setValue(Date.parse(inValue));
        this.elem.value = inValue;
        this.sortValue = inValue;
    }
}

class FilterTableBoolean extends FilterTableColumn {
    constructor(box) {
        let elem = document.createElement('p');
        super(box, elem);
    }

    setValue(inValue) {
        super.setValue(inValue);
        let boolText = (inValue)? 'True' : 'False';
        this.elem.innerText = boolText;
        this.sortValue = inValue;
    }
}


// Currently supported display types
const DisplayType = {
    Simple: "Simple",
    Range: "Range",
    Datetime: "Datetime",
    Boolean: "Boolean"
};

// Currently supported types of filters
const FilterType = {
    CheckBoxes: "CheckBoxes",
    Tags: "Tags",
    IntRange: "IntRange"
};

// Column configuration
class FilterTableColumnConfig {
    constructor(label, displayType, boxType, filterType=null, searchable=false, sortable=false) {
        this.label = label;
        this.displayType = displayType;
        this.boxType = boxType;
        this.filterType = filterType;
        this.searchable = searchable;
        this.sortable = sortable;
    }
}

class SortColumn {
    constructor(colIdx, upButton, downButton, ascending=true) {
        this.colIdx = colIdx;
        this.ascending = ascending;
        this.upButton = upButton;
        this.downButton = downButton;
    }
}


// Filterable and searchable table class
class FilterTable {
    constructor(colMeta, htmlTable, insertRowShiftIdx, htmlFilterBox, searchBox, sortImages) {
        if (colMeta.constructor !== Array) colMeta = [colMeta];
        this.colMeta = colMeta;
        this.htmlTable = htmlTable;
        this.insertRowShiftIdx = insertRowShiftIdx;
        this.searchBox = searchBox;
        this.rows = [];
        this.filters = Array(colMeta.length).fill(null);
        this.useTableContainer = (colMeta[0].boxType === 'tr');
        this.sortCol = null;

        // Add keyup event for the search bar to search on searchable columns
        if (searchBox) {
            searchBox.rows = this.rows;
            searchBox.addEventListener('keyup', (event) => {
                if (event.isComposing || event.keyCode === 229) {
                    return;
                }
                this.checkSearchBox();
            });
        }

        // Create header row
        if (this.useTableContainer) {
            var newRow = htmlTable.insertRow(htmlTable.rows.length + insertRowShiftIdx);
        }
        for (let colIdx in colMeta) {
            const col = colMeta[colIdx];

            if (this.useTableContainer) {
                let colLabelText = document.createElement('span');
                colLabelText.innerText = col.label;
                let newCol = document.createElement('th');
                newCol.appendChild(colLabelText);
                newRow.appendChild(newCol);

                // If this column is sortable, add sort buttons
                if (col.sortable) {
                    let upImage = document.createElement('img');
                    upImage.classList.add('small-button');
                    upImage.src = sortImages[0];
                    upImage.alt = 'Sort (ascending)';

                    let upButton = document.createElement('button');
                    upButton.classList.add('selectable');
                    upButton.filterTable = this;
                    upButton.colIdx = colIdx;
                    upButton.appendChild(upImage);
                    newCol.appendChild(upButton);

                    let downImage = document.createElement('img');
                    downImage.classList.add('small-button');
                    downImage.src = sortImages[1];
                    downImage.alt = 'Sort (descending)';

                    let downButton = document.createElement('button');
                    downButton.classList.add('selectable');
                    downButton.filterTable = this;
                    downButton.colIdx = colIdx;
                    downButton.appendChild(downImage);
                    newCol.appendChild(downButton);

                    upButton.upButton = upButton;
                    upButton.downButton = downButton;
                    downButton.upButton = upButton;
                    downButton.downButton = downButton;
                    upButton.onclick = function () {
                        if (!this.disabled) {
                            let filterTable = this.filterTable;
                            let sortCol = filterTable.sortCol;
                            sortCol.upButton.disabled = false;
                            sortCol.downButton.disabled = false;

                            this.disabled = true;
                            filterTable.sortCol = new SortColumn(this.colIdx, this.upButton, this.downButton, (this === this.upButton));
                            filterTable.sort();
                        }
                    }
                    downButton.onclick = upButton.onclick;

                    if (!this.sortCol) {
                        upButton.disabled = true;
                        this.sortCol = new SortColumn(colIdx, upButton, downButton);
                    }
                }
            }

            // If this column is filterable, set up that filter
            if (col.filterType) {
                // Create html container for filter, label, and values
                let filterBox = document.createElement('div');
                filterBox.classList.add('filter-box');
                htmlFilterBox.appendChild(filterBox);

                // Create html for filter title (column name)
                let filterTitleBox = document.createElement('div');
                let filterTitle = document.createElement('p');
                filterTitle.innerText = col.label;
                filterTitleBox.appendChild(filterTitle);
                filterBox.appendChild(filterTitleBox);

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
    appendEmptyRow() {
        if (this.useTableContainer) {
            var newRow = this.htmlTable.insertRow(this.htmlTable.rows.length + this.insertRowShiftIdx);
        }
        else {
            var newRow = document.createElement('div');
            this.htmlTable.appendChild(newRow); // don't account for insertRowShiftIdx here
        }
        this.rows.push(newRow);

        // Initialize our special information for this row
        // Since we want to replace remove(), we'll just put our extra stuff here
        //        instead of creating new row class that contains the html row
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
        newRow.filterTable = this;

        newRow.filterTableColumns = []
        for (const col of this.colMeta) {
            let box = null;
            if (this.useTableContainer) {
                box = newRow.insertCell();
            }
            else {
                box = document.createElement(col.boxType);
                newRow.appendChild(box);
            }

            switch(col.displayType) {
                case DisplayType.Range:
                    newRow.filterTableColumns.push(new FilterTableRange(box));
                    break;
                case DisplayType.Datetime:
                    newRow.filterTableColumns.push(new FilterTableDatetime(box));
                    break;
                case DisplayType.Boolean:
                    newRow.filterTableColumns.push(new FilterTableBoolean(box));
                    break;
                case DisplayType.Simple:
                default:
                    newRow.filterTableColumns.push(new FilterTableText(box));
                    break;
            }
        }

        newRow.setColValue = function(colIdx, value) {
            let filterTable = this.filterTable;
            const colMeta = filterTable.colMeta[colIdx];

            let col = this.filterTableColumns[colIdx];
            col.setValue(value);
            if (colMeta.searchable) col.searchKey = col.value.trim().toLowerCase();

            // Process filter: add cross references between row, filter, and filter value
            if (colMeta.filterType) {
                let filter = filterTable.filters[colIdx];
                if (!this.filterValuesByCol[colIdx]) this.filterValuesByCol[colIdx] = [];
                switch(filter.filterType) {
                    case FilterType.CheckBoxes:
                        let checkBoxValue = filter.filterValues[col.value];
                        if (!checkBoxValue) checkBoxValue = new CheckBoxValue(col.value, filter, colIdx);
                        checkBoxValue.appendRow(this);
                        break;
                    case FilterType.Tags:
                        for (const word of col.value.split(" ")) {
                            let checkBoxValue = filter.filterValues[word];
                            if (!checkBoxValue) checkBoxValue = new CheckBoxValue(word, filter, colIdx);
                            checkBoxValue.appendRow(this);
                        }
                        break;
                    case FilterType.IntRange:
                        let rangeValue = filter.filterValues[col.value];
                        if (!rangeValue) rangeValue = new IntRangeValue(col.value, filter, colIdx);
                        rangeValue.appendRow(this);
                        break;
                    default:
                        // Do nothing
                        break;
                }
            }

            return col;
        }

        return newRow;
    }

    // Reset the search box
    resetSearchBox() {
        if (!this.searchBox) return;
        this.searchBox.innerText = '';
        for (let row of this.searchBox.rows) {
            row.selectedBySearch = true;
            row.filterSetHidden();
        }
    }

    // Check each row against the current value of the search box
    checkSearchBox() {
        if (!this.searchBox) return;
        const keysToCheck = this.searchBox.innerText.trim().toLowerCase().split(' ');
        for (let row of this.searchBox.rows) {
            if (keysToCheck.length === 0) {
                // Nothing searched - include all rows
                row.selectedBySearch = true;
            }
            else {
                row.selectedBySearch = false;
                for (const col of row.filterTableColumns) {
                    if (col.searchKey) {
                        for (const key of keysToCheck) {
                            if (col.searchKey.indexOf(key) !== -1) {
                                row.selectedBySearch = true;
                                break;
                            }
                        }
                    }
                    if (row.selectedBySearch) break;
                }
            }
            row.filterSetHidden();
        }
    }

    // Sort the rows
    sort() {
        if (this.sortCol) {
            var sortColIdx = this.sortCol.colIdx;
            var sortDirection = (this.sortCol.ascending)? -1 : 1;
            this.rows.sort(function doCompare(a, b) {
                let a_val = a.filterTableColumns[sortColIdx].sortValue;
                let b_val = b.filterTableColumns[sortColIdx].sortValue;
                if (a_val < b_val) return sortDirection;
                else if (a_val > b_val) return -sortDirection;
                else return 0;
            });
            let tableBody = this.htmlTable.firstElementChild;
            for (const row of this.rows) {
                tableBody.appendChild(row);
            }
            for (let i = 0; i > this.insertRowShiftIdx; i--) {
                tableBody.appendChild(tableBody.children[1]);
            }
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