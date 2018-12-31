// ------------ Global Valued Vars ----------- // 
let quizCount = 1;
let settingsArray = [];
let responseArray = [];
let defaultSettings = {
    questionsLimit: 20,
    numericLimit: 20,
    timerLimit: 30000
}
const operators = ['+', '-', '/', 'X'];
// ------------------------------------------- //

const randomOperator = () => {
    return operators[randomGenerator(operators.length)];
}

const randomGenerator = (limit) => {
    return Math.floor(Math.random() * limit);
}

const hideElements = (...ids) => {
    ids.map((ele) => document.getElementById(ele).style.display = 'none');
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

const getTarget = (className, index = 0) => {
    return document.getElementsByClassName(className)[index];
}

const setTargetText = (className, index, text) => {
    getTarget(className, index).innerHTML = text;
}

const hideClass = (className, index = 0) => {
    document.getElementsByClassName(className)[index].style.display = 'none';
}

const showClass = (className, index = 0) => {
    document.getElementsByClassName(className)[index].style.display = 'block';
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
            if (num2 == 0) {
                return ('NA')
            } else {
                return (Math.round(num1 / num2))
            }
        case 'X':
            return num1 * num2;
    }
}

const review = (num, index) => {
    if (num == 1) {
        getTarget('previousQuestion', index).style.color = "#28a745";
        return 'Correct (+1)';
    } else if (num == -1) {
        getTarget('previousQuestion', index).style.color = "#ffc107";
        return 'Not Attempted';
    } else {
        getTarget('previousQuestion', index).style.color = "#dc3545";
        return 'Incorrect';
    }
}

// --------------------------------------------- ----------------------------------- //


// Function TO Prepare Settings And responseArray
let prepareTest = () => {
    for (let i = 0; i < quizCount; i++) {
        let questionCount = getTarget('questions', i).value;
        let timePquestion = getTarget('timeLimit', i).value;
        let numLimit = getTarget('numLimit', i).value;
        settingsArray.push(Object.assign({}, defaultSettings));

        questionCount ? settingsArray[i].questionsLimit = parseInt(questionCount) : null;
        timePquestion ? settingsArray[i].timerLimit = parseInt(timePquestion) * 1000 : null;
        numLimit ? settingsArray[i].numericLimit = parseInt(numLimit) : null;

        responseArray.push(new Array(settingsArray[i].questionsLimit).fill(-1));
    }
    console.log(settingsArray)
    console.log(responseArray);
}

// Creates Test Panels
let createTestPanels = () => {
    for (let i = 0; i < quizCount; i++) {
        showClass('container');
        if (i != 0) {
            // Panel Addition
            var panel = getTarget('container');
            var clonedPanel = panel.cloneNode(true);
            document.body.appendChild(clonedPanel);

            // Report Addition
            var reportCard = getTarget('reportCard');
            var clonedReportCard = reportCard.cloneNode(true);
            document.body.appendChild(clonedReportCard);
        }

        // Sets Name
        setTargetText('username', i, getElement('name').value);
        setTargetText('testHead', i, 'Test ' + parseInt(i + 1));

        // Inits TestPanel
        testPanel(i);
    }
}

// Function To Initiate Test
let testPanel = function (index) {

    let questionIndex = -1;
    let questionsLimit = settingsArray[index].questionsLimit;
    let numericLimit = settingsArray[index].numericLimit;
    let timerLimit = settingsArray[index].timerLimit;

    // Sets TotalQuestions
    setTargetText('totalQuestions', index, questionsLimit);

    function questionLoop() {

        if (questionIndex == questionsLimit - 1) {
            // Logic For Report
            questionReport(index, questionsLimit);
            hideClass('container', index);
            showClass('reportCard', index);
            return;
        } else if (questionIndex >= 0 && questionIndex < questionsLimit) {
            setTargetText('previousQuestion', index, review(responseArray[index][questionIndex], index))
            showClass('prevReview', index);
        }

        questionIndex++;
        setTargetText('currentQuestion', index, (questionIndex + 1).toString());

        let numberOne = randomGenerator(numericLimit);
        let numberTwo = randomGenerator(numericLimit);
        let operator = randomOperator();
        setTargetText('numberOne', index, numberOne);
        setTargetText('numberTwo', index, numberTwo);
        setTargetText('operator', index, operator);

        // Show Division Hint 
        operator == '/' ? showClass('hint', index) : hideClass('hint', index)

        let recordResponse = () => {
            let response = getTarget('ans', index).value;
            if (operator == '/' && numberTwo == 0) {
                var correct = 'NA' == (getAnswer(numberOne, numberTwo, operator)).toString().toUpperCase();
            } else {
                var correct = Math.round(response) == getAnswer(numberOne, numberTwo, operator);
            }

            if (!response) {
                responseArray[index][questionIndex] = -1;
            } else {
                correct ? responseArray[index][questionIndex] = 1 : responseArray[index][questionIndex] = 0
            }
            // console.log(responseArray);

            // Removes the click event listener and empties answer
            getTarget('nextQuestion', index).removeEventListener('click', nextListener);
            getTarget('ans', index).value = '';
        }

        let nextListener = () => {
            recordResponse();
            clearInterval(timerCounter);
            questionLoop();
        }

        // Adding Event Listener on Next Button
        getTarget('nextQuestion', index).addEventListener('click', nextListener, false);

        // Question Timer
        let timer = Math.floor(timerLimit / 1000);
        var timerCounter = setInterval(function () {
            setTargetText('timer', index, timer + ' s');
            timer--;
            if (timer == 0) {
                recordResponse();
                setTargetText('timer', index, 'EXPIRED');
                clearInterval(timerCounter);
                questionLoop();
            }
        }, 1000);
    }

    questionLoop();
}

// Report Setting
let questionReport = (index, qLimit) => {
    let report = {
        correct: 0,
        incorrect: 0,
        na: 0
    }

    responseArray[index].map((ele) => {
        if (ele == 1) {
            report.correct++;
        } else if (ele == -1) {
            report.na++;
        } else {
            report.incorrect++;
        }
    })

    let restartListener = () => {
        responseArray[index] = new Array(questionsLimit).fill(-1);
        hideClass('reportCard', index);
        showClass('container', index);
        testPanel(index);
    }

    // Removes Listener
    getTarget('restartTest', index).removeEventListener('click',restartListener);

    // Adds Restart Listener
    getTarget('restartTest', index).addEventListener('click',restartListener, false);

    // Setting Report
    setTargetText('testReport', index, 'Test ' + parseInt(index + 1));
    setTargetText('score', index, report.correct);
    setTargetText('correct', index, report.correct);
    setTargetText('incorrect', index, report.incorrect);
    setTargetText('na', index, report.na);
    setTargetText('totalScore', index, qLimit);

    console.log(report)
}

// Global Listeners
getElement('startTest').addEventListener('click', () => {
    hideClass('infoPrompt');
    prepareTest();
    createTestPanels();
}, false);

getElement('addMore').addEventListener('click', () => {
    var settingsEle = getTarget('testSettingsWrapper');
    var clonedEle = settingsEle.cloneNode(1);
    getElement('introCard').appendChild(clonedEle);
    setTargetText('settingsHead', quizCount, 'Test ' + parseInt(quizCount + 1));
    quizCount++;
}, false);

getElement('name').addEventListener('input', (event) => {
    if (event.target.value) {
        getElement('startTest').disabled = false;
    }
}, false)










