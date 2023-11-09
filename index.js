Array.prototype.shuffle = function () {
    return this.sort(() => Math.random() > 0.5 ? 1 : -1);
}

const SET_SELECTED_QUESTION_INDEX = 'SET_SELECTED_QUESTION_INDEX';
const SHUFFLE_QUESTIONS = 'SHUFFLE_QUESTIONS';
const SET_ANSWER_STATUS = 'SET_ANSWER_STATUS';
const SHUFFLE_ANSWERS = 'SHUFFLE_QUESTIONS';

class Store {
    observers = [];

    constructor(reducer) {
        this.reducer = reducer;
        this.dispatch({ type: 'INIT_' + Date.now() });
    }

    dispatch(action) {
        this.state = this.reducer(this.state, action);
        this.notify();
    }

    notify() {
        this.observers.forEach(observer => observer(this.state));
    }

    subscribe = (observer) => {
        this.observers.push(observer);
        observer(this.state);
    }

    unsubscribe = (observer) => {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
}

function createLazySubscriber(selector, observer) {
    let selectedValue;

    return state => {
        const newSelectedValue = selector(state);

        if (newSelectedValue !== selectedValue) {
            selectedValue = newSelectedValue;
            observer(newSelectedValue);
        }
    };
}

function selectCurrentQuestion(state) {
    if (state.selectedQuestionIndex !== undefined) {
        return state.questions[state.selectedQuestionIndex];
    }
}

function createQuestion(question, idx) {
    const questionNode = document.createElement('div');
    questionNode.setAttribute('data-idx', idx);
    questionNode.classList.add('question');
    if (question.answerStatus !== undefined) {
        questionNode.classList.add(question.answerStatus ? '__correct' : '__incorrect');
    }
    questionNode.innerText = question.title;
    return questionNode;
}

function createAnswer(answer, idx, isExtended) {
    const answerNode = document.createElement('div');
    answerNode.setAttribute('data-idx', idx);
    answerNode.classList.add('answer');
    answerNode.innerText = answer.title;
    if (isExtended && answer.description) {
        const descriptionNode = document.createElement('div');
        descriptionNode.classList.add('description');
        descriptionNode.innerText = answer.description;
        answerNode.appendChild(descriptionNode);
    }
    return answerNode;
}

const questionsBlock = document.getElementById('questions');
const answersBlock = document.getElementById('answers');

const store = new Store((state, action) => {
    switch (action.type) {
        case SET_SELECTED_QUESTION_INDEX:
            if (action.selectedQuestionIndex !== undefined) {
                return {
                    ...state,
                    questions: state.questions.map((question, idx) => idx === action.selectedQuestionIndex
                        ? {...question, answers: question.answers.shuffle()}
                        : question
                    ),
                    selectedQuestionIndex: action.selectedQuestionIndex
                };
            }

            return {
                ...state,
                questions: state.questions.shuffle(),
                selectedQuestionIndex: undefined
            };

        case SET_ANSWER_STATUS:
            return {
                ...state,
                questions: state.questions
                    .map((question, idx) => idx === state.selectedQuestionIndex
                        ? {...question, answerStatus: action.answerStatus}
                        : question)
            };
        case SHUFFLE_ANSWERS:
            return {
                ...state,
                questions: state.questions.map((question, idx) => idx === action.questionIndex)
            };
    }

    return {
        questions: [
            {
                title: 'Сколько лет?',
                answers: [
                    {
                        id: 0,
                        title: '10',
                    },
                    {
                        id: 1,
                        title: '20',
                        description: 'Да,'
                    },
                    {
                        id: 2,
                        title: '30'
                    },
                    {
                        id: 3,
                        title: '40'
                    }
                ]
            },
            {
                title: 'щвцДВЦД?',
                answers: [
                    {
                        title: '123'
                    },
                    {
                        title: '56',
                    },
                    {
                        title: '228'
                    },
                    {
                        title: 'АУУУУУУ',
                        description: 'da'
                    }
                ]
            }
        ]
    }
});

questionsBlock.addEventListener('click', evt => {
    const question = evt.target.closest('.question');

    if (question && store.state.selectedQuestionIndex === undefined) {
        store.dispatch({
            type: SET_SELECTED_QUESTION_INDEX,
            selectedQuestionIndex: Number(question.dataset.idx)
        })
    }
});

answersBlock.addEventListener('click', evt => {
    const answer = evt.target.closest('.answer');
    if (answer) {
        const question = store.state.questions[store.state.selectedQuestionIndex];
        const answer = question.answers[Number(evt.target.dataset.idx)];
        store.dispatch({ type: SET_ANSWER_STATUS, answerStatus: answer.description !== undefined });
        setTimeout(() => store.dispatch({ type: SET_SELECTED_QUESTION_INDEX }), 3_000);
    }
});

store.subscribe(createLazySubscriber(state => state, state => {
    Array.from(questionsBlock.childNodes).forEach(childNone => childNone.remove());

    if (state.selectedQuestionIndex !== undefined) {
        const question = state.questions[state.selectedQuestionIndex];
        if (question) {
            questionsBlock.appendChild(createQuestion(question, state.selectedQuestionIndex));
        }
    } else {
        state.questions
            .forEach((question, idx) => questionsBlock.appendChild(createQuestion(question, idx)))
    }
}));

store.subscribe(createLazySubscriber(selectCurrentQuestion, currentQuestion => {
    Array.from(answersBlock.childNodes).forEach(childNone => childNone.remove());

    if (currentQuestion) {
        currentQuestion.answers
            .forEach((answer, idx) => answersBlock.appendChild(createAnswer(answer, idx, currentQuestion.answerStatus)));
    }
}));


store.subscribe(console.log);
