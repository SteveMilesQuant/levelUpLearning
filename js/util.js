// Basic behavioral utility functions

function slideFromLeft(elementId, width) {
    elem = document.getElementById(elementId);
    mainElem = document.getElementById('main');
    if (elem.style.left === '0px') {
        elem.style.left = '-' + width;
        mainElem.style.marginLeft = '0px';
    }
    else {
        elem.style.left = '0px';
        mainElem.style.marginLeft = width;
    }
}

function hide(elemIds) {
    if (elemIds.constructor !== Array) {
        elemIds = [elemIds];
    }
    for (const elemId of elemIds) {
        elem = document.getElementById(elemId);
        elem.hidden = true;
    }
}

function unhide(elemIds) {
    if (elemIds.constructor !== Array) {
        elemIds = [elemIds];
    }
    for (const elemId of elemIds) {
        elem = document.getElementById(elemId);
        elem.hidden = false;
    }
}

function edit(elemIds) {
    if (elemIds.constructor !== Array) {
        elemIds = [elemIds];
    }
    for (const elemId of elemIds) {
        elem = document.getElementById(elemId);
        if (elem.tagName === 'TEXTAREA' || elem.tagName === 'INPUT') {
            elem.readOnly = false;
        }
        else if (elem.tagName === 'SELECT') {
            elem.disabled = false;
        }
        else {
            elem.contentEditable = true;
        }
    }
}

function insertCampRowContent(campId, rowBox, titleBox, instructorBox, tagsBox, gradeRangeBox, startTimeBox) {
    rowBox.classList.add('camp-row');
    rowBox.classList.add('selectable');

    let link = document.createElement('a');
    link.href = '/camps/' + campId;
    rowBox.appendChild(link);
    
    let withText = document.createElement('p');
    withText.innerText = 'with ';
    instructorBox.insertBefore(withText, instructorBox.firstElementChild);

    let hLine = document.createElement('hr');
    hLine.classList.add('h-divider');

    let headerBox = document.createElement('div');
    headerBox.appendChild(titleBox);
    headerBox.appendChild(instructorBox);
    headerBox.appendChild(hLine);
    link.appendChild(headerBox);

    let box = document.createElement('div');
    box.appendChild(tagsBox);
    box.appendChild(gradeRangeBox);
    box.appendChild(startTimeBox);
    link.appendChild(box);

    let label = document.createElement('strong');
    label.innerText = 'Tags: ';
    tagsBox.insertBefore(label, tagsBox.lastElementChild);

    label = document.createElement('strong');
    label.innerText = 'Grades: ';
    gradeRangeBox.insertBefore(label, gradeRangeBox.lastElementChild);

    label = document.createElement('strong');
    label.innerText = 'Start time: ';
    startTimeBox.insertBefore(label, startTimeBox.lastElementChild);
}



