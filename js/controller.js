// ------------ Global Valued Vars ----------- // 
const questionsLimit = 20;
const numericLimit = 20;
const timerLimit = 30000;
const operators = ['+', '-', '/', 'X'];
// ---------- ---------------------------- //

const randomOperator = () => {
    return operators[randomGenerator(operators.length)];
}

const randomGenerator = (limit) => {
    return Math.floor(Math.random() * limit);
}

const hideElements = (...ids) => {
    ids.map((ele) => document.getElementById(ele).style.display = 'none')
}

const getAnswer = (num1, num2, operator) => {
    num1 = parseFloat(num1);
    num2 = parseFloat(num2);
    switch (operator) {
        case '+':
            return num1 + num2;
        case '-':
            return num1 - num2;
        case '/':
            return (num1 / num2).toFixed(2);
        case 'X':
            return num1 * num2;
    }
}

const showElements = (...ids) => {
    ids.map((ele) => document.getElementById(ele).style.display = 'block')
}

const getElement = (id) => {
    return document.getElementById(id);
}

const setElementText = (id, text) => {
    document.getElementById(id).innerHTML = text;
}

const review = (num) => {
    if (num == 1) {
        getElement('previousQuestion').style.color = "#28a745";
        return 'Correct (+1)';
    } else if (typeof num == 'string') {
        getElement('previousQuestion').style.color = "#ffc107";
        return 'Not Attempted';
    } else {
        getElement('previousQuestion').style.color = "#dc3545";
        return 'Incorrect';
    }
}

// --------------- //


// Function To Initiate Test
let testPanel = function () {
    let responseArray = new Array(questionsLimit).fill(0);
    let questionIndex = -1;
    setElementText('totalQuestions', questionsLimit.toString());

    function questionLoop() {

        if (questionIndex == questionsLimit -1 ) {
            // Logic For Report
            hideElements('testPanel');
            showElements('report');
            questionReport(responseArray);
            return;
        } else if (questionIndex >= 0 && questionIndex < questionsLimit) {
            setElementText('previousQuestion', review(responseArray[questionIndex]));
            showElements('prevReview');
        }

        questionIndex++;
        setElementText('currentQuestion', (questionIndex + 1).toString());

        let numberOne = randomGenerator(numericLimit);
        let numberTwo = randomGenerator(numericLimit);
        let operator = randomOperator();
        setElementText('numberOne', numberOne);
        setElementText('numberTwo', numberTwo);
        setElementText('operator', operator);

        let recordResponse = () => {
            let response = getElement('ans').value;
            let correct = parseFloat(response) == getAnswer(numberOne, numberTwo, operator);
            if (!response) {
                responseArray[questionIndex] = ''
            } else {
                correct ? responseArray[questionIndex] = 1 : responseArray[questionIndex] = 0
            }
            console.log(responseArray);

            // Removes the click event listener
            getElement('nextQuestion').removeEventListener('click', nextListener);
            getElement('ans').value = '';
        }

        let nextListener = () => {
            recordResponse();
            clearInterval(timerCounter);
            questionLoop();
        }

        // Adding Event Listener on Next Button
        getElement('nextQuestion').addEventListener('click', nextListener, false);

        // Question Timer
        let timer = Math.floor(timerLimit / 1000);
        var timerCounter = setInterval(function () {
            setElementText("timer", timer + ' s');
            timer--;
            if (timer == 0) {
                recordResponse();
                setElementText("timer", "EXPIRED");
                clearInterval(timerCounter);
                questionLoop();
            }
        }, 1000);
    }

    questionLoop();
}

let questionReport = (resArray) => {
    let report = {
        correct: 0,
        incorrect: 0,
        na: 0
    }

    resArray.map((ele) => {
        if (ele == 1) {
            report.correct++;
        } else if (typeof ele == 'string') {
            report.na++;
        } else {
            report.incorrect++;
        }
    })

    setElementText('score', report.correct);
    setElementText('correct', report.correct);
    setElementText('incorrect', report.incorrect);
    setElementText('na', report.na);
    setElementText('totalScore', questionsLimit);

    console.log(report)
}

getElement('startTest').addEventListener('click', () => {
    hideElements('intro');
    showElements('testPanel');
    setElementText('username', getElement('name').value);
    testPanel();
}, false);

getElement('restartTest').addEventListener('click', () => {
    hideElements('report');
    showElements('testPanel');
    setElementText('username', getElement('name').value);
    testPanel();
}, false)

getElement('name').addEventListener('input', (event) => {
    if (event.target.value) {
        getElement('startTest').disabled = false;
    }
}, false)









