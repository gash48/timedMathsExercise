// ------------ Global Valued Vars ----------- // 
// let quizCount = 1;
// let settingsArray = [];
// let responseArray = [];
// let defaultSettings = {
//     questionsLimit: 20,
//     numericLimit: 20,
//     timerLimit: 30000
// }
const operators = ['+', '-', '/', 'X'];
// ------------------------------------------- //

class QuizUtil {

    constructor() {
        console.log("Contructor For Quiz Utility");
    }

    static randomOperator() {
        return operators[QuizUtil.randomGenerator(operators.length)];
    }

    static randomGenerator(limit) {
        return Math.floor(Math.random() * limit);
    }

    static hideElements(...ids) {
        ids.map((ele) => document.getElementById(ele).style.display = 'none');
    }

    static showElements(...ids) {
        ids.map((ele) => document.getElementById(ele).style.display = 'block')
    }

    static getElement(id) {
        return document.getElementById(id);
    }

    static setElementText(id, text) {
        document.getElementById(id).innerHTML = text;
    }

    static getTarget(className, index = 0) {
        return document.getElementsByClassName(className)[index];
    }

    static setTargetText(className, index, text) {
        QuizUtil.getTarget(className, index).innerHTML = text;
    }

    static hideClass(className, index = 0) {
        document.getElementsByClassName(className)[index].style.display = 'none';
    }

    static showClass(className, index = 0) {
        document.getElementsByClassName(className)[index].style.display = 'block';
    }

    static getAnswer(num1, num2, operator) {
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

    static review(num, index) {
        if (num == 1) {
            QuizUtil.getTarget('previousQuestion', index).style.color = "#28a745";
            return 'Correct (+1)';
        } else if (num == -1) {
            QuizUtil.getTarget('previousQuestion', index).style.color = "#ffc107";
            return 'Not Attempted';
        } else {
            QuizUtil.getTarget('previousQuestion', index).style.color = "#dc3545";
            return 'Incorrect';
        }
    }
}

// --------------------------------------------- ----------------------------------- //


class QuizManager {

    constructor() {
        console.log("Quiz Init")
        this.quizCount = 1;
        this.settingsArray = [];
        this.responseArray = [];
        this.defaultSettings = {
            questionsLimit: 20,
            numericLimit: 20,
            timerLimit: 30000
        }

        QuizUtil.getElement('startTest').addEventListener('click', () => this.startTestListener(this), false);
        QuizUtil.getElement('addMore').addEventListener('click', () => this.addQuizListener(this), false);
        QuizUtil.getElement('name').addEventListener('input', this.nameInputListener, false);
    }

    startTestListener(ref) {
        QuizUtil.hideClass('infoPrompt');
        for (let i = 0; i < ref.quizCount; i++) {
            ref.prepareTest(i);
            ref.createTestPanels(i);
        }
        console.log(ref.settingsArray);
        console.log(ref.responseArray);
    }

    addQuizListener(ref) {
        var settingsEle = QuizUtil.getTarget('testSettingsWrapper');
        var clonedEle = settingsEle.cloneNode(1);
        QuizUtil.getElement('introCard').appendChild(clonedEle);
        QuizUtil.setTargetText('settingsHead', ref.quizCount, 'Test ' + parseInt(ref.quizCount + 1));
        ref.quizCount++;
    }

    nameInputListener(event) {
        if (event.target.value) {
            QuizUtil.getElement('startTest').disabled = false;
        }
    }


    // Function TO Prepare Settings And responseArray
    prepareTest(i) {
        // for (let i = 0; i < quizCount; i++) {
        let questionCount = QuizUtil.getTarget('questions', i).value;
        let timePquestion = QuizUtil.getTarget('timeLimit', i).value;
        let numLimit = QuizUtil.getTarget('numLimit', i).value;
        this.settingsArray.push(Object.assign({}, this.defaultSettings));

        questionCount ? this.settingsArray[i].questionsLimit = parseInt(questionCount) : null;
        timePquestion ? this.settingsArray[i].timerLimit = parseInt(timePquestion) * 1000 : null;
        numLimit ? this.settingsArray[i].numericLimit = parseInt(numLimit) : null;

        this.responseArray.push(new Array(this.settingsArray[i].questionsLimit).fill(-1));
        // }
        // console.log(settingsArray)
        // console.log(responseArray);
    }

    // Creates Test Panels
    createTestPanels(i) {

        QuizUtil.showClass('container');
        if (i != 0) {
            // Panel Addition
            var panel = QuizUtil.getTarget('container');
            var clonedPanel = panel.cloneNode(true);
            document.body.appendChild(clonedPanel);

            // Report Addition
            var reportCard = QuizUtil.getTarget('reportCard');
            var clonedReportCard = reportCard.cloneNode(true);
            document.body.appendChild(clonedReportCard);
        }

        // Sets Name
        console.log(QuizUtil.getElement('name').value);
        QuizUtil.setTargetText('username', i, QuizUtil.getElement('name').value);
        QuizUtil.setTargetText('testHead', i, 'Test ' + parseInt(i + 1));

        // Inits TestPanel
        var testPanel = new TestPanels(this.settingsArray[i], this.responseArray[i], i);

    }
}


class TestPanels {

    constructor(settings, resArray, testIndex) {
        console.log("Quiz Init")
        this.settings = settings;
        this.responseArray = resArray;

        this.testPanel(testIndex);
    }

    // Function To Initiate Test
    testPanel(index) {

        let questionIndex = -1;
        let { questionsLimit, numericLimit, timerLimit } = this.settings;
        let responseArray = this.responseArray;
        let ref = this;

        // Sets TotalQuestions
        QuizUtil.setTargetText('totalQuestions', index, questionsLimit);

        function questionLoop() {
            if (questionIndex == questionsLimit - 1) {
                ref.questionReport(responseArray, questionsLimit, index);
                // Removes Restart Listener
                QuizUtil.getTarget('restartTest', index).removeEventListener('click', ref.restartListener);
                // Adds Restart Listener
                QuizUtil.getTarget('restartTest', index).addEventListener('click', () => ref.restartListener(index,questionsLimit), false);

                QuizUtil.hideClass('container', index);
                QuizUtil.showClass('reportCard', index);
                return;
            } else if (questionIndex >= 0 && questionIndex < questionsLimit) {
                QuizUtil.setTargetText('previousQuestion', index, QuizUtil.review(responseArray[questionIndex], index))
                QuizUtil.showClass('prevReview', index);
            }

            questionIndex++;
            QuizUtil.setTargetText('currentQuestion', index, (questionIndex + 1).toString());

            let numberOne = QuizUtil.randomGenerator(numericLimit);
            let numberTwo = QuizUtil.randomGenerator(numericLimit);
            let operator = QuizUtil.randomOperator();
            QuizUtil.setTargetText('numberOne', index, numberOne);
            QuizUtil.setTargetText('numberTwo', index, numberTwo);
            QuizUtil.setTargetText('operator', index, operator);

            // Show Division Hint 
            operator == '/' ? QuizUtil.showClass('hint', index) : QuizUtil.hideClass('hint', index)

            let recordResponse = () => {
                let response = QuizUtil.getTarget('ans', index).value;
                if (operator == '/' && numberTwo == 0) {
                    var correct = 'NA' == (QuizUtil.getAnswer(numberOne, numberTwo, operator)).toString().toUpperCase();
                } else {
                    var correct = Math.round(response) == QuizUtil.getAnswer(numberOne, numberTwo, operator);
                }

                if (!response) {
                    responseArray[questionIndex] = -1;
                } else {
                    correct ? responseArray[questionIndex] = 1 : responseArray[questionIndex] = 0
                }

                // Removes the click event listener and empties answer
                QuizUtil.getTarget('nextQuestion', index).removeEventListener('click', nextListener);
                QuizUtil.getTarget('ans', index).value = '';
            }

            let nextListener = () => {
                recordResponse();
                clearInterval(timerCounter);
                questionLoop();
            }

            // Adding Event Listener on Next Button
            QuizUtil.getTarget('nextQuestion', index).addEventListener('click', nextListener, false);

            // Question Timer
            let timer = Math.floor(timerLimit / 1000);
            var timerCounter = setInterval(function () {
                QuizUtil.setTargetText('timer', index, timer + ' s');
                timer--;
                if (timer == 0) {
                    recordResponse();
                    QuizUtil.setTargetText('timer', index, 'EXPIRED');
                    clearInterval(timerCounter);
                    questionLoop();
                }
            }, 1000);
        }

        questionLoop();
    }

    // Calc Report
    questionReport(resArray, qLimit, index) {
        let report = {
            correct: 0,
            incorrect: 0,
            na: 0
        }

        resArray.map((ele) => {
            if (ele == 1) {
                report.correct++;
            } else if (ele == -1) {
                report.na++;
            } else {
                report.incorrect++;
            }
        })

        // Setting Report
        QuizUtil.setTargetText('testReport', index, 'Test ' + parseInt(index + 1));
        QuizUtil.setTargetText('score', index, report.correct);
        QuizUtil.setTargetText('correct', index, report.correct);
        QuizUtil.setTargetText('incorrect', index, report.incorrect);
        QuizUtil.setTargetText('na', index, report.na);
        QuizUtil.setTargetText('totalScore', index, qLimit);

        console.log(report)
    }

    // Restart Test
    restartListener(index, qLimit) {
        this.responseArray = new Array(qLimit).fill(-1);
        QuizUtil.hideClass('reportCard', index);
        QuizUtil.showClass('container', index);
        this.testPanel(index);
    }

}

var newTest = new QuizManager();











