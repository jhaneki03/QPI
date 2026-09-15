/* ========================================
   QPI - QUIZ PERFORMANCE IMPROVEMENT
   Main JavaScript
======================================== */


/* ---------- APP STATE ---------- */

const appState = {

    studentName: "",

    studentSection: "",

    lessonLink: "",

    questions: [],

    currentQuestion: 0,

    score: 0,

    answers: [],

    quizHistory: []

};


/* ---------- START APP ---------- */

document.addEventListener("DOMContentLoaded", function () {

    const studentNameInput =
        document.getElementById("studentName");

    const studentSectionInput =
        document.getElementById("studentSection");

    const lessonLinkInput =
        document.getElementById("lessonLink");

    const generateQuizBtn =
        document.getElementById("generateQuizBtn");


    if (!generateQuizBtn) {

        console.error(
            "ERROR: generateQuizBtn was not found."
        );

        return;

    }


    /* ---------- GENERATE QUIZ ---------- */

    generateQuizBtn.addEventListener(
        "click",
        function () {

            const studentName =
                studentNameInput.value.trim();

            const studentSection =
                studentSectionInput.value;

            const lessonLink =
                lessonLinkInput.value.trim();


            /* CHECK NAME */

            if (studentName === "") {

                alert(
                    "Please enter your name."
                );

                studentNameInput.focus();

                return;

            }


            /* CHECK SECTION */

            if (studentSection === "") {

                alert(
                    "Please select your section."
                );

                studentSectionInput.focus();

                return;

            }


            /* CHECK LESSON LINK */

            if (lessonLink === "") {

                alert(
                    "Please paste your lesson link."
                );

                lessonLinkInput.focus();

                return;

            }


            /* SAVE STUDENT */

            appState.studentName =
                studentName;

            appState.studentSection =
                studentSection;

            appState.lessonLink =
                lessonLink;


            localStorage.setItem(
                "qpiStudent",
                JSON.stringify({

                    name: studentName,

                    section: studentSection

                })
            );


            /*

                IMPORTANT:

                For now, questions.js provides
                the question bank.

                Later, we will connect this
                button to an AI backend that
                reads the lesson link and
                generates the questions.
            */

            if (
                typeof sampleQuestions ===
                    "undefined" ||
                !Array.isArray(sampleQuestions)
            ) {

                alert(
                    "Question bank could not be loaded. Please check questions.js."
                );

                return;

            }


            /* GET 10 RANDOM QUESTIONS */

            appState.questions =
                getRandomQuestions(
                    sampleQuestions,
                    10
                );


            /* RESET QUIZ */

            appState.currentQuestion = 0;

            appState.score = 0;

            appState.answers = [];


            /* SHOW QUIZ */

            showQuizPage();

        }
    );


    /* LOAD SAVED STUDENT */

    loadStudent(
        studentNameInput,
        studentSectionInput
    );

});


/* ========================================
   RANDOM QUESTIONS
======================================== */

function getRandomQuestions(
    questions,
    amount
) {

    const shuffled =
        [...questions];

    /* Fisher-Yates Shuffle */

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] =
        [
            shuffled[j],
            shuffled[i]
        ];

    }


    /* Return requested number */

    return shuffled.slice(
        0,
        Math.min(
            amount,
            shuffled.length
        )
    );

}


/* ========================================
   SHOW QUIZ PAGE
======================================== */

function showQuizPage() {

    const appContainer =
        document.querySelector(
            ".app-container"
        );


    if (!appContainer) {

        return;

    }


    /* HIDE HOME */

    const welcomeSection =
        document.querySelector(
            ".welcome-section"
        );

    const featuresSection =
        document.querySelector(
            ".features-section"
        );


    if (welcomeSection) {

        welcomeSection.style.display =
            "none";

    }


    if (featuresSection) {

        featuresSection.style.display =
            "none";

    }


    /* REMOVE OLD QUIZ */

    const oldQuiz =
        document.querySelector(
            ".quiz-section"
        );


    if (oldQuiz) {

        oldQuiz.remove();

    }


    /* CREATE QUIZ */

    const quizSection =
        document.createElement(
            "section"
        );


    quizSection.className =
        "quiz-section";


    quizSection.innerHTML = `

        <div class="quiz-card">

            <div class="quiz-header">

                <h2>QPI Quiz</h2>

                <p>
                    Student:
                    <strong>
                        ${escapeHTML(
                            appState.studentName
                        )}
                    </strong>
                </p>

                <p>
                    Section:
                    <strong>
                        ${escapeHTML(
                            appState.studentSection
                        )}
                    </strong>
                </p>

            </div>


            <div id="quizContent"></div>

        </div>

    `;


    appContainer.appendChild(
        quizSection
    );


    beginQuiz();

}


/* ========================================
   BEGIN QUIZ
======================================== */

function beginQuiz() {

    appState.currentQuestion = 0;

    appState.score = 0;

    appState.answers = [];


    loadQuestion();

}


/* ========================================
   LOAD QUESTION
======================================== */

function loadQuestion() {

    const quizContent =
        document.getElementById(
            "quizContent"
        );


    if (!quizContent) {

        return;

    }


    const questions =
        appState.questions;


    if (
        !questions ||
        questions.length === 0
    ) {

        quizContent.innerHTML = `

            <div class="result-container">

                <h2>No Questions</h2>

                <p>
                    No quiz questions were found.
                </p>

            </div>

        `;

        return;

    }


    /* FINISH */

    if (
        appState.currentQuestion >=
        questions.length
    ) {

        finishQuiz();

        return;

    }


    const question =
        questions[
            appState.currentQuestion
        ];


    /* DISPLAY QUESTION */

    quizContent.innerHTML = `

        <div class="question-container">

            <div class="progress-info">

                Question
                ${appState.currentQuestion + 1}
                of
                ${questions.length}

            </div>


            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="width:
                    ${
                        (
                            (
                                appState.currentQuestion
                                /
                                questions.length
                            ) * 100
                        )
                    }%"
                ></div>

            </div>


            <h3 class="question-text">

                ${escapeHTML(
                    question.question
                )}

            </h3>


            <div class="choices">

                ${
                    question.choices
                        .map(
                            function (
                                choice,
                                index
                            ) {

                                return `

                                    <button
                                        class="choice-btn"
                                        data-index="${index}"
                                    >

                                        ${escapeHTML(
                                            choice
                                        )}

                                    </button>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </div>

    `;


    /* ADD CHOICE EVENTS */

    document
        .querySelectorAll(
            ".choice-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        selectAnswer(
                            Number(
                                button.dataset.index
                            )
                        );

                    }
                );

            }
        );

}


/* ========================================
   SELECT ANSWER
======================================== */

function selectAnswer(
    selectedAnswer
) {

    const question =
        appState.questions[
            appState.currentQuestion
        ];


    if (!question) {

        return;

    }


    const isCorrect =
        selectedAnswer ===
        question.answer;


    /* SAVE ANSWER */

    appState.answers.push({

        question:
            question.question,

        choices:
            question.choices,

        selectedAnswer:
            selectedAnswer,

        correctAnswer:
            question.answer,

        explanation:
            question.explanation ||
            "Review the lesson to strengthen your understanding.",

        isCorrect:
            isCorrect

    });


    /* UPDATE SCORE */

    if (isCorrect) {

        appState.score++;

    }


    /* SHOW FEEDBACK */

    showAnswerFeedback(
        question,
        selectedAnswer,
        isCorrect
    );

}


/* ========================================
   SHOW ANSWER FEEDBACK
======================================== */

function showAnswerFeedback(
    question,
    selectedAnswer,
    isCorrect
) {

    const quizContent =
        document.getElementById(
            "quizContent"
        );


    if (!quizContent) {

        return;

    }


    const selectedText =
        question.choices[
            selectedAnswer
        ];


    const correctText =
        question.choices[
            question.answer
        ];


    if (isCorrect) {

        quizContent.innerHTML = `

            <div class="feedback correct-feedback">

                <div class="feedback-icon">
                    ✓
                </div>

                <h2>Correct!</h2>

                <p>
                    Great job! Your answer is correct.
                </p>

                <div class="answer-box">

                    <strong>
                        Your Answer:
                    </strong>

                    <p>
                        ${escapeHTML(
                            selectedText
                        )}
                    </p>

                </div>

                <button
                    id="nextQuestionBtn"
                    class="primary-btn"
                >
                    Next Question
                </button>

            </div>

        `;

    } else {

        quizContent.innerHTML = `

            <div class="feedback wrong-feedback">

                <div class="feedback-icon">
                    ✕
                </div>

                <h2>Incorrect</h2>

                <div class="answer-box">

                    <strong>
                        Your Answer:
                    </strong>

                    <p>
                        ${escapeHTML(
                            selectedText
                        )}
                    </p>

                </div>


                <div class="correct-answer-box">

                    <strong>
                        Correct Answer:
                    </strong>

                    <p>
                        ${escapeHTML(
                            correctText
                        )}
                    </p>

                </div>


                <div class="explanation-box">

                    <strong>
                        Explanation:
                    </strong>

                    <p>
                        ${escapeHTML(
                            question.explanation ||
                            "Review this topic again to strengthen your understanding."
                        )}
                    </p>

                </div>


                <button
                    id="nextQuestionBtn"
                    class="primary-btn"
                >
                    Next Question
                </button>

            </div>

        `;

    }


    const nextButton =
        document.getElementById(
            "nextQuestionBtn"
        );


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            function () {

                appState.currentQuestion++;

                loadQuestion();

            }
        );

    }

}


/* ========================================
   FINISH QUIZ
======================================== */

function finishQuiz() {

    const quizContent =
        document.getElementById(
            "quizContent"
        );


    if (!quizContent) {

        return;

    }


    const totalQuestions =
        appState.questions.length;


    const percentage =
        totalQuestions > 0
            ? Math.round(
                (
                    appState.score /
                    totalQuestions
                ) * 100
            )
            : 0;


    /* SAVE RESULT */

    saveQuizResult();


    quizContent.innerHTML = `

        <div class="result-container">

            <div class="result-icon">
                🎯
            </div>

            <h2>
                Quiz Completed!
            </h2>

            <div class="score-card">

                <span>
                    Your Score
                </span>

                <strong>
                    ${appState.score}
                    /
                    ${totalQuestions}
                </strong>

                <p>
                    ${percentage}%
                </p>

            </div>


            <div class="result-buttons">

                <button
                    id="reviewMistakesBtn"
                    class="primary-btn"
                >
                    Review Mistakes
                </button>


                <button
                    id="retakeQuizBtn"
                    class="secondary-btn"
                >
                    Retake Quiz
                </button>


                <button
                    id="homeBtn"
                    class="secondary-btn"
                >
                    Return Home
                </button>

            </div>

        </div>

    `;


    /* REVIEW */

    document
        .getElementById(
            "reviewMistakesBtn"
        )
        .addEventListener(
            "click",
            reviewMistakes
        );


    /* RETAKE */

    document
        .getElementById(
            "retakeQuizBtn"
        )
        .addEventListener(
            "click",
            retakeQuiz
        );


    /* HOME */

    document
        .getElementById(
            "homeBtn"
        )
        .addEventListener(
            "click",
            function () {

                location.reload();

            }
        );

}


/* ========================================
   REVIEW MISTAKES
======================================== */

function reviewMistakes() {

    const quizContent =
        document.getElementById(
            "quizContent"
        );


    if (!quizContent) {

        return;

    }


    const mistakes =
        appState.answers.filter(
            function (answer) {

                return !answer.isCorrect;

            }
        );


    /* NO MISTAKES */

    if (mistakes.length === 0) {

        quizContent.innerHTML = `

            <div class="result-container">

                <div class="result-icon">
                    🏆
                </div>

                <h2>
                    Excellent Work!
                </h2>

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
            .getElementById(
                "returnHomeBtn"
            )
            .addEventListener(
                "click",
                function () {

                    location.reload();

                }
            );


        return;

    }


    /* SHOW ALL MISTAKES */

    quizContent.innerHTML = `

        <div class="mistakes-container">

            <h2>
                Review Your Mistakes
            </h2>

            <p class="review-intro">
                Study the correct answers and explanations
                before taking the quiz again.
            </p>


            <div class="mistake-list">

                ${
                    mistakes
                        .map(
                            function (
                                mistake,
                                index
                            ) {

                                return `

                                    <div class="mistake-card">

                                        <span class="mistake-number">
                                            Mistake ${index + 1}
                                        </span>


                                        <h3>
                                            ${escapeHTML(
                                                mistake.question
                                            )}
                                        </h3>


                                        <div class="answer-box">

                                            <strong>
                                                Your Answer:
                                            </strong>

                                            <p>
                                                ${escapeHTML(
                                                    mistake.choices[
                                                        mistake.selectedAnswer
                                                    ]
                                                )}
                                            </p>

                                        </div>


                                        <div class="correct-answer-box">

                                            <strong>
                                                Correct Answer:
                                            </strong>

                                            <p>
                                                ${escapeHTML(
                                                    mistake.choices[
                                                        mistake.correctAnswer
                                                    ]
                                                )}
                                            </p>

                                        </div>


                                        <div class="explanation-box">

                                            <strong>
                                                Why?
                                            </strong>

                                            <p>
                                                ${escapeHTML(
                                                    mistake.explanation
                                                )}
                                            </p>

                                        </div>

                                    </div>

                                `;

                            }
                        )
                        .join("")
                }

            </div>


            <div class="result-buttons">

                <button
                    id="reviewRetakeBtn"
                    class="primary-btn"
                >
                    Retake Quiz
                </button>


                <button
                    id="reviewHomeBtn"
                    class="secondary-btn"
                >
                    Return Home
                </button>

            </div>

        </div>

    `;


    document
        .getElementById(
            "reviewRetakeBtn"
        )
        .addEventListener(
            "click",
            retakeQuiz
        );


    document
        .getElementById(
            "reviewHomeBtn"
        )
        .addEventListener(
            "click",
            function () {

                location.reload();

            }
        );

}


/* ========================================
   RETAKE QUIZ
======================================== */

function retakeQuiz() {

    appState.questions =
        getRandomQuestions(
            appState.questions,
            appState.questions.length
        );


    appState.currentQuestion = 0;

    appState.score = 0;

    appState.answers = [];


    loadQuestion();

}


/* ========================================
   SAVE QUIZ RESULT
======================================== */

function saveQuizResult() {

    const previousHistory =
        JSON.parse(
            localStorage.getItem(
                "qpiHistory"
            )
        ) || [];


    const total =
        appState.questions.length;


    const percentage =
        total > 0
            ? Math.round(
                (
                    appState.score /
                    total
                ) * 100
            )
            : 0;


    const result = {

        student:
            appState.studentName,

        section:
            appState.studentSection,

        lessonLink:
            appState.lessonLink,

        score:
            appState.score,

        total:
            total,

        percentage:
            percentage,

        date:
            new Date().toLocaleString()

    };


    previousHistory.push(
        result
    );


    localStorage.setItem(
        "qpiHistory",
        JSON.stringify(
            previousHistory
        )
    );

}


/* ========================================
   LOAD SAVED STUDENT
======================================== */

function loadStudent(
    studentNameInput,
    studentSectionInput
) {

    const savedStudent =
        JSON.parse(
            localStorage.getItem(
                "qpiStudent"
            )
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


/* ========================================
   HTML SECURITY
======================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}
