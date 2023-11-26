const DOM_PARSER_INSTANCE = new DOMParser();

export function insertAll(selector, innerHtml) {
    Array.from(document.querySelectorAll(selector))
        .forEach(element => element.innerHTML = innerHtml);
}

export function insertAllByClass(className, innerHtml) {
    insertAll(`.${className}`, innerHtml);
}

export function convertToNode(str) {
    const doc = DOM_PARSER_INSTANCE.parseFromString(str, 'text/html');
    return doc.body.firstChild;
}
