// Class for a searchable list


class ListRow {
    constructor(id, value, searchList) {
        this.id = id;
        this.value = value;
        this.searchList = searchList;
        this.searchKey = value.trim().toLowerCase();

        var htmlBox = document.createElement('div');
        htmlBox.classList.add('selectable');
        htmlBox.listRow = this;
        this.htmlBox = htmlBox;
        htmlBox.onclick = function() {
            var listRow = this.listRow;
            var searchList = listRow.searchList;
            var prevSelection = searchList.selectedRow;
            if (prevSelection) prevSelection.unselect();
            listRow.select();
            searchList.selectedRow = listRow;
        }

        var rowText = document.createElement('p');
        rowText.innerText = value;

        htmlBox.appendChild(rowText);
        searchList.htmlList.appendChild(htmlBox);
    }

    hide() {
        this.htmlBox.hidden = true;
    }

    unhide() {
        this.htmlBox.hidden = false;
    }

    select() {
        this.htmlBox.classList.add('selected');
    }

    unselect() {
        this.htmlBox.classList.remove('selected');
    }
}

class SearchList {
    constructor(htmlList, searchBox) {
        this.htmlList = htmlList;
        this.searchBox = searchBox;
        this.rows = [];
        this.selectedRow = null;

        // Add keyup event for the search bar to search on searchable columns
        searchBox.rows = this.rows;
        searchBox.addEventListener('keyup', (event) => {
            if (event.isComposing || event.keyCode === 229) {
                return;
            }
            this.checkSearchBox();
        });
    }

    appendValue(id, value) {
        var row = new ListRow(id, value, this);
        this.rows.push(row);
    }

    // Reset the search box
    resetSearchBox() {
        this.searchBox.innerText = '';
        for (var row of this.searchBox.rows) {
            row.unhide();
        }
    }

    // Reset: unselect values and reset search box
    reset() {
        this.resetSearchBox();
        if (this.selectedRow) {
            this.selectedRow.unselect();
            this.selectedRow = null;
        }
    }

    // Check each row against the current value of the search box
    checkSearchBox() {
        const keysToCheck = this.searchBox.innerText.trim().toLowerCase().split(' ');
        for (var row of this.searchBox.rows) {
            if (keysToCheck.length === 0) {
                // Nothing searched - include all rows
                row.unhide();
            }
            else if (row.searchKey.length === 0) {
                // Somehow no search key - never include
                row.hide();
            }
            else {
                var unhide = true;
                for (const key of keysToCheck) {
                    if (row.searchKey.indexOf(key) === -1) {
                        unhide = false;
                        break;
                    }
                }
                if (unhide) row.unhide();
                else row.hide();
            }
        }
    }

}
