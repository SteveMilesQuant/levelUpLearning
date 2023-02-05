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

// Simple template for formatted strings
function simpleTemplate(strings, ...keys) {
    return (values) => {
        const dict = values[values.length - 1] || {};
        const result = [strings[0]];
        keys.forEach((key, i) => {
            const value = typeof(key) === "number" ? values[key] : dict[key];
            result.push(value, strings[i + 1]);
        });
        return result.join("");
    };
}

