/* ========================================
   QPI - QUIZ PERFORMANCE IMPROVEMENT
   Main JavaScript
======================================== */


/* ---------- APP STATE ---------- */

const appState = {
    studentName: "",
    studentSection: "",
    currentQuiz: 0,
    score: 0,
    answers: [],
    quizHistory: []
};


/* ---------- START APP ---------- */

document.addEventListener("DOMContentLoaded", function () {

    const studentNameInput = document.getElementById("studentName");
    const studentSectionInput = document.getElementById("studentSection");
    const startQuizBtn = document.getElementById("startQuizBtn");

    /* Check if Start Quiz button exists */

    if (!startQuizBtn) {
        console.error("ERROR: startQuizBtn was not found.");
        return;
    }

    /* Start Quiz */

    startQuizBtn.addEventListener("click", function () {

        const studentName = studentNameInput.value.trim();
        const studentSection = studentSectionInput.value;

        /* Check Name */

        if (studentName === "") {
            alert("Please enter your name.");
            studentNameInput.focus();
            return;
        }

        /* Check Section */

        if (studentSection === "") {
            alert("Please select your section.");
            studentSectionInput.focus();
            return;
        }

        /* Save student information */

        appState.studentName = studentName;
        appState.studentSection = studentSection;

        localStorage.setItem(
            "qpiStudent",
            JSON.stringify({
                name: studentName,
                section: studentSection
            })
        );

        /* Reset quiz */

        appState.currentQuiz = 0;
        appState.score = 0;
        appState.answers = [];

        /* Show quiz */

        showQuizPage();

    });


    /* Load saved student */

    loadStudent(
        studentNameInput,
        studentSectionInput
    );

});


/* ---------- SHOW QUIZ PAGE ---------- */

function showQuizPage() {

    const appContainer =
        document.querySelector(".app-container");

    if (!appContainer) {
        console.error("ERROR: .app-container was not found.");
        return;
    }

    /* Hide welcome and features */

    const welcomeSection =
        document.querySelector(".welcome-section");

    const featuresSection =
        document.querySelector(".features-section");

    if (welcomeSection) {
        welcomeSection.style.display = "none";
    }

    if (featuresSection) {
        featuresSection.style.display = "none";
    }


    /* Remove old quiz section */

    const oldQuiz =
        document.querySelector(".quiz-section");

    if (oldQuiz) {
        oldQuiz.remove();
    }


    /* Create quiz section */

    const quizSection =
        document.createElement("section");

    quizSection.className = "quiz-section";

    quizSection.innerHTML = `

        <div class="quiz-card">

            <div class="quiz-header">

                <h2>QPI Quiz</h2>

                <p>
                    Student:
                    <strong>
                        ${escapeHTML(appState.studentName)}
                    </strong>
                </p>

                <p>
                    Section:
                    <strong>
                        ${escapeHTML(appState.studentSection)}
                    </strong>
                </p>

            </div>


            <div id="quizContent">

                <h3>Ready to Begin?</h3>

                <p>
                    Answer each question carefully.
                    Your results will help track your
                    quiz performance and learning retention.
                </p>

                <button
                    id="beginQuizBtn"
                    class="primary-btn"
                >
                    Begin Quiz
                </button>

            </div>

        </div>

    `;


    appContainer.appendChild(quizSection);


    /* Begin Quiz button */

    const beginQuizBtn =
        document.getElementById("beginQuizBtn");

    if (beginQuizBtn) {

        beginQuizBtn.addEventListener(
            "click",
            beginQuiz
        );

    }

}


/* ---------- BEGIN QUIZ ---------- */

function beginQuiz() {

    appState.currentQuiz = 0;
    appState.score = 0;
    appState.answers = [];

    loadQuestion();

}


/* ---------- LOAD QUESTION ---------- */

function loadQuestion() {

    const quizContent =
        document.getElementById("quizContent");

    if (!quizContent) {
        console.error("ERROR: quizContent was not found.");
        return;
    }


    /* Make sure questions.js loaded */

    if (
        typeof sampleQuestions === "undefined" ||
        !Array.isArray(sampleQuestions) ||
        sampleQuestions.length === 0
    ) {

        quizContent.innerHTML = `

            <div class="result-container">

                <h2>Question Error</h2>

                <p>
                    No questions were found.
                </p>

                <p>
                    Please check your questions.js file.
                </p>

            </div>

        `;

        console.error(
            "ERROR: sampleQuestions was not found. Check questions.js."
        );

        return;
    }


    /* Get current question */

    const question =
        sampleQuestions[appState.currentQuiz];


    /* Finish quiz */

    if (!question) {
        finishQuiz();
        return;
    }


    /* Display question */

    quizContent.innerHTML = `

        <div class="question-container">

            <p class="question-number">

                Question
                ${appState.currentQuiz + 1}
                of
                ${sampleQuestions.length}

            </p>


            <h3 class="question-text">

                ${escapeHTML(question.question)}

            </h3>


            <div class="choices">

                ${question.choices.map(
                    function (choice, index) {

                        return `

                            <button
                                class="choice-btn"
                                data-index="${index}"
                            >

                                ${escapeHTML(choice)}

                            </button>

                        `;

                    }
                ).join("")}

            </div>

        </div>

    `;


    /* Add answer buttons */

    document
        .querySelectorAll(".choice-btn")
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectAnswer(
                        Number(button.dataset.index)
                    );

                }
            );

        });

}


/* ---------- SELECT ANSWER ---------- */

function selectAnswer(selectedAnswer) {

    const question =
        sampleQuestions[appState.currentQuiz];


    if (!question) {
        return;
    }


    const isCorrect =
        selectedAnswer === question.answer;


    /* Save answer */

    appState.answers.push({

        question: question.question,

        selectedAnswer: selectedAnswer,

        correctAnswer: question.answer,

        isCorrect: isCorrect

    });


    /* Update score */

    if (isCorrect) {
        appState.score++;
    }


    /* Move to next question */

    appState.currentQuiz++;


    /* Load next question */

    loadQuestion();

}


/* ---------- FINISH QUIZ ---------- */

function finishQuiz() {

    const quizContent =
        document.getElementById("quizContent");


    if (!quizContent) {
        return;
    }


    const totalQuestions =
        sampleQuestions.length;


    const percentage =
        totalQuestions > 0
            ? Math.round(
                (appState.score / totalQuestions) * 100
            )
            : 0;


    /* Save result */

    saveQuizResult();


    quizContent.innerHTML = `

        <div class="result-container">

            <h2>Quiz Completed!</h2>

            <p class="result-score">

                ${appState.score}
                /
                ${totalQuestions}

            </p>

            <p>
                Score:
                <strong>${percentage}%</strong>
            </p>


            <button
                id="reviewMistakesBtn"
                class="primary-btn"
            >

                Review Mistakes

            </button>


            <button
                id="homeBtn"
                class="primary-btn"
            >

                Return Home

            </button>

        </div>

    `;


    /* Review mistakes */

    const reviewButton =
        document.getElementById(
            "reviewMistakesBtn"
        );

    if (reviewButton) {

        reviewButton.addEventListener(
            "click",
            reviewMistakes
        );

    }


    /* Return home */

    const homeButton =
        document.getElementById("homeBtn");

    if (homeButton) {

        homeButton.addEventListener(
            "click",
            function () {

                location.reload();

            }
        );

    }

}


/* ---------- SAVE QUIZ RESULT ---------- */

function saveQuizResult() {

    const previousHistory =
        JSON.parse(
            localStorage.getItem("qpiHistory")
        ) || [];


    const total =
        sampleQuestions.length;


    const percentage =
        total > 0
            ? Math.round(
                (appState.score / total) * 100
            )
            : 0;


    const result = {

        student: appState.studentName,

        section: appState.studentSection,

        score: appState.score,

        total: total,

        percentage: percentage,

        date: new Date().toLocaleString()

    };


    previousHistory.push(result);


    localStorage.setItem(
        "qpiHistory",
        JSON.stringify(previousHistory)
    );

}


/* ---------- REVIEW MISTAKES ---------- */

function reviewMistakes() {

    const quizContent =
        document.getElementById("quizContent");


    if (!quizContent) {
        return;
    }


    const mistakes =
        appState.answers.filter(
            function (answer) {

                return !answer.isCorrect;

            }
        );


    /* No mistakes */

    if (mistakes.length === 0) {

        quizContent.innerHTML = `

            <div class="result-container">

                <h2>Excellent Work!</h2>

                <p>
                    You answered all questions correctly.
                </p>

                <button
                    id="returnHomeBtn"
                    class="primary-btn"
                >

                    Return Home

                </button>

            </div>

        `;


        document
            .getElementById("returnHomeBtn")
            .addEventListener(
                "click",
                function () {

                    location.reload();

                }
            );

        return;

    }


    /* Show mistakes */

    quizContent.innerHTML = `

        <div class="mistakes-container">

            <h2>Review Your Mistakes</h2>

            <p>
                Review the questions you missed
                before taking another quiz.
            </p>


            <div class="mistake-list">

                ${mistakes.map(
                    function (mistake, index) {

                        return `

                            <div class="mistake-card">

                                <h3>
                                    Mistake ${index + 1}
                                </h3>

                                <p>
                                    ${escapeHTML(
                                        mistake.question
                                    )}
                                </p>

                            </div>

                        `;

                    }
                ).join("")}

            </div>


            <button
                id="returnHomeMistakeBtn"
                class="primary-btn"
            >

                Return Home

            </button>

        </div>

    `;


    document
        .getElementById(
            "returnHomeMistakeBtn"
        )
        .addEventListener(
            "click",
            function () {

                location.reload();

            }
        );

}


/* ---------- HTML SECURITY ---------- */

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* ---------- LOAD SAVED STUDENT ---------- */

function loadStudent(
    studentNameInput,
    studentSectionInput
) {

    const savedStudent =
        JSON.parse(
            localStorage.getItem("qpiStudent")
        );


    if (!savedStudent) {
        return;
    }


    if (studentNameInput) {

        studentNameInput.value =
            savedStudent.name || "";

    }


    if (studentSectionInput) {

        studentSectionInput.value =
            savedStudent.section || "";

    }

}