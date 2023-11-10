Array.prototype.shuffle = function () {
    return this.sort(() => Math.random() > 0.5 ? 1 : -1);
}

const SHUFFLE = 'SHUFFLE';
const SET_SELECTED_QUESTION_INDEX = 'SET_SELECTED_QUESTION_INDEX';
const SET_ANSWER_STATUS = 'SET_ANSWER_STATUS';

const HIDE_ANIMATION_TIME_MILLIS = 500;
const DISPLAY_DELAY_MILLIS = 3_000;

const INITIAL_STATE = {
    questions: [
        {
            title: 'А голос у него был не такой, как у почтальона Печкина, дохленький. У Гаврюши голосище был, как у электрички. Он _____ _____ на ноги поднимал.',
            answers: [
                {
                    title: 'Пол деревни, за раз',
                },
                {
                    title: 'Полдеревни, зараз',
                    description: 'Правильно! Раздельно существительное будет писаться в случае наличия дополнительного слова между существительным и частицей. Правильный ответ: полдеревни пишется слитно. Зараз (ударение на второй слог) — это обстоятельственное наречие, пишется слитно. Означает быстро, одним махом.'
                },
                {
                    title: 'Пол-деревни, за раз'
                }
            ]
        },
        {
            title: 'А эти слова как пишутся?',
            answers: [
                {
                    title: 'Капуччино и эспрессо'
                },
                {
                    title: 'Каппуччино и экспресо',
                },
                {
                    title: 'Капучино и эспрессо',
                    description: 'Конечно! По орфографическим нормам русского языка единственно верным написанием будут «капучино» и «эспрессо».'
                }
            ]
        },
        {
            title: 'Как нужно писать?',
            answers: [
                {
                    title: 'Черезчур'
                },
                {
                    title: 'Черес-чур',
                },
                {
                    title: 'Чересчур',
                    description: 'Да! Это слово появилось от соединения предлога «через» и древнего слова «чур», которое означает «граница», «край». Но слово претерпело изменения, так что правильное написание учим наизусть — «чересчур».'
                }
            ]
        },
        {
            title: 'Где допущена ошибка?',
            answers: [
                {
                    title: 'Аккордеон'
                },
                {
                    title: 'Белиберда',
                },
                {
                },
                {
                    title: 'Эпелепсия',
                    description: 'Верно! Это слово пишется так: «эпИлепсия».'
                }
            ]
        },
    ]
};

function handleSequentially(elements, handler, delay) {
    return new Promise(resolve => {
        if (!elements.length) {
            return resolve();
        }
        handler(elements[0]);
        setTimeout(() => handleSequentially(elements.slice(1), handler, delay).then(resolve), delay);
    });
}

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

function createSubscriber(selector, observer) {
    let selectedValue;

    return state => {
        const newSelectedValue = selector(state);

        if (newSelectedValue !== selectedValue) {
            observer(newSelectedValue, selectedValue);
            selectedValue = newSelectedValue;
        }
    };
}

function selectCurrentQuestion(state) {
    if (state.selectedQuestionIndex !== undefined) {
        return state.questions[state.selectedQuestionIndex];
    }
}

function selectIsRanOutOfQuestions(state) {
    return state.questions.every(question => question.answerStatus !== undefined);
}

function selectIsRanOutOfQuestionsAndQuestionIsNotSelected(state) {
    return selectIsRanOutOfQuestions(state) && state.selectedQuestionIndex === undefined;
}

function createQuestion(question, idx) {
    const questionNode = document.createElement('div');
    questionNode.setAttribute('data-idx', idx);
    questionNode.classList.add('question');
    if (question.answerStatus !== undefined) {
        questionNode.classList.add(question.answerStatus ? '__correct' : '__incorrect');
    }
    questionNode.innerText = `${idx + 1}. ${question.title}`;
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

const bannerBlock = document.getElementById('banner');
const statisticsBlock = document.getElementById('statistics');
const questionsBlock = document.getElementById('questions');
const answersBlock = document.getElementById('answers');

const store = new Store((state, action) => {
    switch (action.type) {
        case SHUFFLE:
            return {
                ...state,
                questions: state.questions
                    .map(question => ({...question, answers: question.answers.shuffle()}))
                    .shuffle()
            }
        case SET_SELECTED_QUESTION_INDEX:
            if (action.selectedQuestionIndex !== undefined) {
                return {
                    ...state,
                    questions: state.questions.map((question, idx) => idx === action.selectedQuestionIndex
                        ? {...question, answers: question.answers}
                        : question
                    ),
                    selectedQuestionIndex: action.selectedQuestionIndex
                };
            }

            return {
                ...state,
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
    }

    return INITIAL_STATE;
});

store.dispatch({ type: SHUFFLE });

questionsBlock.addEventListener('click', evt => {
    const question = evt.target.closest('.question');

    if (question && store.state.selectedQuestionIndex === undefined) {
        const questionIndex = Number(question.dataset.idx);
        const isRanOutOfQuestions = selectIsRanOutOfQuestions(store.state);
        if (isRanOutOfQuestions || store.state.questions[questionIndex].answerStatus === undefined) {
            store.dispatch({
                type: SET_SELECTED_QUESTION_INDEX,
                selectedQuestionIndex: questionIndex
            });
            if (isRanOutOfQuestions) {
                setTimeout(() => store.dispatch({type: SET_SELECTED_QUESTION_INDEX}), DISPLAY_DELAY_MILLIS);
            }
        }
    }
});

let isAnswering = false;

answersBlock.addEventListener('click', evt => {
    if (!isAnswering && selectCurrentQuestion(store.state).answerStatus === undefined) {
        const answer = evt.target.closest('.answer');
        if (answer) {
            isAnswering = true;
            const answerIdx = Number(answer.dataset.idx);
            const question = store.state.questions[store.state.selectedQuestionIndex];
            const answerModel = question.answers[answerIdx];
            const isAnswerCorrect = answerModel.description !== undefined;

            let answersToHide = Array.from(answersBlock.childNodes);
            if (isAnswerCorrect) {
                answer.classList.add('__correct');
                answersToHide = answersToHide.filter(answerNode => Number(answerNode.dataset.idx) !== answerIdx);
            }
            store.dispatch({ type: SET_ANSWER_STATUS, answerStatus: isAnswerCorrect });
            handleSequentially(
                answersToHide,
                answer => answer.description !== undefined ? answer.classList.add('__correct') : answer.classList.add('__hidden'),
                HIDE_ANIMATION_TIME_MILLIS
            ).then(() => setTimeout(() => {
                    store.dispatch({ type: SET_SELECTED_QUESTION_INDEX })
                    isAnswering = false;
                }, DISPLAY_DELAY_MILLIS));
        }
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

store.subscribe(createSubscriber(selectCurrentQuestion, (currentQuestion, oldCurrentQuestion) => {
    const answersNodes = Array.from(answersBlock.childNodes);

    if (currentQuestion && oldCurrentQuestion &&
        currentQuestion.answers == oldCurrentQuestion.answers &&
        currentQuestion.answerStatus !== oldCurrentQuestion.answerStatus) {
        currentQuestion.answers
            .forEach((answer, idx) => {
                if (answer.description && currentQuestion.answerStatus) {
                    const answerNode = answersNodes[idx];
                    const descriptionNode = document.createElement('div');
                    descriptionNode.classList.add('description');
                    descriptionNode.innerText = answer.description;
                    answerNode.appendChild(descriptionNode);
                }
            });
    } else {
        answersNodes.forEach(childNone => childNone.remove());

        if (currentQuestion) {
            let answers = currentQuestion.answers;
            if (selectIsRanOutOfQuestions(store.state)) {
                answers = answers.filter(answer => answer.description !== undefined);
            }
            answers
                .forEach((answer, idx) => answersBlock.appendChild(createAnswer(answer, idx, currentQuestion.answerStatus !== undefined)));
        }
    }
}));

store.subscribe(createLazySubscriber(selectIsRanOutOfQuestionsAndQuestionIsNotSelected, isRanOutOfQuestions => {
    const bannerBlock = document.getElementById('banner');
    const statisticsBlock = document.getElementById('statistics');
    if (isRanOutOfQuestions) {
        bannerBlock.innerText = 'Вопросы закончились';
        bannerBlock.classList.add('__visible');
        statisticsBlock.innerText = `Количество правильных ответов - ${store.state.questions.map(question => question.answerStatus).filter(Boolean).length}`;
        statisticsBlock.classList.add('__visible');
    }
}));
