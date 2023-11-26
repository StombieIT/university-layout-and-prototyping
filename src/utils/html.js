export function insertAll(selector, innerHtml) {
    Array.from(document.querySelectorAll(selector))
        .forEach(element => element.innerHTML = innerHtml);
}

export function insertAllByClass(className, innerHtml) {
    insertAll(`.${className}`, innerHtml);
}