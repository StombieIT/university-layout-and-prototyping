const wordsList = document.getElementById('words-list');
const wordsSandbox = document.getElementById('words-sandbox');
const outputNode = document.getElementById('output');
const wordsInput = document.getElementById('words-input');
const disassembleButton = document.getElementById('disassemble-button');

const wordsSandboxRect = wordsSandbox.getBoundingClientRect();

function isNumeric(str) {
    return /^\d+$/.test(str);
}

function compareWords(word1, word2) {
    if (isNumeric(word1)) {
        if (isNumeric(word2)) {
            return Number(word1) - Number(word2);
        }

        return 1;
    }

    if (isNumeric(word2)) {
        return -1;
    }

    return word1 > word2 ? 1 : -1;
}

const UPDATE_WORDS = 'UPDATE_WORDS';
const UPDATE_SELECTED_WORDS = 'UPDATE_SELECTED_WORDS';

class Store {
    constructor() {
        this.observers = {};
        this.wordsMap = new Map();
        this.selectedWordsKeys = new Set();
    }

    subscribe(event, observer) {
        if (this.observers[event]) {
            this.observers[event].push(observer);
        } else {
            this.observers[event] = [observer];
        }
        observer();
    }

    notify(event) {
        if (this.observers[event]) {
            this.observers[event].forEach(observer => observer());
        }
    }

    set words(value) {
        this.wordsMap.clear();
        this.selectedWordsKeys.clear();
        let wordsCounter = 0;
        let numbersCounter = 0;
        for (const word of value.sort(compareWords)) {
            if (isNumeric(word)) {
                this.wordsMap.set(`n${++numbersCounter}`, word);
            } else {
                this.wordsMap.set(`a${++wordsCounter}`, word);
            }
        }
        this.notify(UPDATE_WORDS);
        this.notify(UPDATE_SELECTED_WORDS);
    }

    addSelectedWordKey(word) {
        this.selectedWordsKeys.add(word);
        this.notify(UPDATE_SELECTED_WORDS);
    }

    removeSelectedWordKey(word) {
        this.selectedWordsKeys.delete(word);
        this.notify(UPDATE_SELECTED_WORDS);
    }
}

const store = new Store();

function isElementInsideSandbox(element) {
    const elementRect = element.getBoundingClientRect();

    return elementRect.left >= wordsSandboxRect.left &&
        elementRect.right <= wordsSandboxRect.right &&
        elementRect.top >= wordsSandboxRect.top &&
        elementRect.bottom <= wordsSandboxRect.bottom;
}

store.subscribe(UPDATE_WORDS, () => {
    Array.from(wordsList.childNodes).forEach(wordNode => wordNode.remove());

    Array.from(store.wordsMap)
        .sort(([key1], [key2]) => key1 - key2)
        .forEach(([key, word]) => {
            const wordNode = document.createElement('span');
            wordNode.classList.add('word');
            wordNode.innerText = `${key} ${word}`;
            wordNode.setAttribute('data-key', key);
            wordsList.appendChild(wordNode);
        });
});

store.subscribe(UPDATE_SELECTED_WORDS, () => {
    outputNode.innerText = Array.from(store.selectedWordsKeys)
        .sort()
        .map(selectedWordKey => store.wordsMap.get(selectedWordKey)).join(' ');
});

wordsList.addEventListener('mousedown', evt => {
    const target = evt.target;
    if (target.classList.contains('word')) {
        target.classList.add('__shifted', '__moving');
        target.style.left = `${evt.clientX}px`;
        target.style.top = `${evt.clientY}px`;
        wordsSandbox.classList.add('__attractive');

        function dispose() {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
        }

        function onMouseMove(evt) {
            target.style.top = `${evt.clientY}px`;
            target.style.left = `${evt.clientX}px`;
            if (isElementInsideSandbox(target)) {
                wordsSandbox.classList.add('__active');
            } else {
                wordsSandbox.classList.remove('__active');
            }
        }

        function onMouseUp(evt) {
            target.classList.remove('__moving');
            wordsSandbox.classList.remove('__attractive');
            if (isElementInsideSandbox(target)) {
                store.addSelectedWordKey(target.dataset.key);
                wordsSandbox.classList.remove('__active');
            } else {
                store.removeSelectedWordKey(target.dataset.key);
                target.classList.remove('__shifted');
            }
            dispose();
        }

        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
    }
});

disassembleButton.addEventListener('click', evt => {
    store.words = wordsInput.value.split('-')
        .map(word => word.trim());
});
