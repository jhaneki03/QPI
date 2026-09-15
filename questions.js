const sampleQuestions = [
    {
        question: "What is learning retention?",
        choices: [
            "The ability to remember and recall learned information",
            "The ability to finish school requirements quickly",
            "The ability to avoid taking quizzes",
            "The ability to memorize everything permanently"
        ],
        answer: 0,
        explanation: "Learning retention is the ability to maintain and recall information that has been learned."
    },

    {
        question: "Why is learning retention important for students?",
        choices: [
            "It helps students remember and apply what they have learned",
            "It allows students to skip studying",
            "It makes every lesson easier without effort",
            "It guarantees a perfect score in every quiz"
        ],
        answer: 0,
        explanation: "Learning retention helps students remember information and apply their knowledge in future learning situations."
    },

    {
        question: "Which activity can help improve learning retention?",
        choices: [
            "Retrieving information from memory through practice",
            "Reading a lesson only once",
            "Avoiding review activities",
            "Ignoring mistakes after a quiz"
        ],
        answer: 0,
        explanation: "Retrieval practice strengthens memory by requiring students to recall information from memory."
    },

    {
        question: "What is retrieval practice?",
        choices: [
            "Actively recalling information from memory",
            "Copying notes without reading them",
            "Reading the same page repeatedly",
            "Skipping difficult questions"
        ],
        answer: 0,
        explanation: "Retrieval practice is a learning strategy where students actively recall information from memory."
    },

    {
        question: "What can happen when students review their mistakes?",
        choices: [
            "They can identify areas they need to improve",
            "They automatically receive a higher grade",
            "They no longer need to study",
            "They can avoid all future quizzes"
        ],
        answer: 0,
        explanation: "Reviewing mistakes helps students identify misunderstandings and focus their future study efforts."
    },

    {
        question: "What is the purpose of a quiz in the learning process?",
        choices: [
            "To measure students' understanding and recall of learned information",
            "To punish students who make mistakes",
            "To replace classroom instruction",
            "To prevent students from reviewing lessons"
        ],
        answer: 0,
        explanation: "Quizzes can provide information about how well students understand and remember previously learned material."
    },

    {
        question: "How can feedback help students improve their learning?",
        choices: [
            "It shows students what they did correctly and what they need to improve",
            "It removes the need for further studying",
            "It guarantees that students will never make mistakes",
            "It allows students to skip difficult topics"
        ],
        answer: 0,
        explanation: "Feedback helps students recognize their strengths and weaknesses so they can improve their learning."
    },

    {
        question: "What should a student do after getting an incorrect answer on a quiz?",
        choices: [
            "Review the mistake and understand the correct answer",
            "Ignore the mistake",
            "Memorize the letter of the correct answer only",
            "Skip the topic completely"
        ],
        answer: 0,
        explanation: "Reviewing incorrect answers helps students understand their mistakes and strengthens their understanding of the topic."
    },

    {
        question: "What is one benefit of taking a quiz again after reviewing mistakes?",
        choices: [
            "It allows students to check whether their understanding has improved",
            "It guarantees a perfect score",
            "It removes the need to study",
            "It makes mistakes impossible"
        ],
        answer: 0,
        explanation: "Retaking a quiz after reviewing mistakes can help students determine whether they have improved their understanding."
    },

    {
        question: "Which strategy is most related to strengthening long-term learning retention?",
        choices: [
            "Repeatedly recalling information over time",
            "Studying everything only minutes before a quiz",
            "Avoiding practice questions",
            "Reading without trying to remember the information"
        ],
        answer: 0,
        explanation: "Repeated retrieval of information over time can strengthen memory and support long-term retention."
    }
];


// ================================
// SHUFFLE ARRAY
// ================================

function shuffleArray(array) {
    const shuffled = array.slice();

    for (let i = shuffled.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));

        const temp = shuffled[i];
        shuffled[i] = shuffled[randomIndex];
        shuffled[randomIndex] = temp;
    }

    return shuffled;
}


// ================================
// SHUFFLE ANSWER CHOICES
// ================================

function shuffleChoices(question) {

    // Get the original correct answer
    const correctAnswer = question.choices[question.answer];

    // Shuffle the choices
    const shuffledChoices = shuffleArray(question.choices);

    // Find where the correct answer moved
    const newAnswerIndex = shuffledChoices.indexOf(correctAnswer);

    return {
        question: question.question,
        choices: shuffledChoices,
        answer: newAnswerIndex,
        explanation: question.explanation
    };
}


// ================================
// CREATE RANDOMIZED QUIZ
// ================================

function createQuizQuestions() {

    // Shuffle the questions
    const shuffledQuestions = shuffleArray(sampleQuestions);

    // Shuffle the choices of every question
    const randomizedQuestions = shuffledQuestions.map(function(question) {
        return shuffleChoices(question);
    });

    // Return 10 questions
    return randomizedQuestions.slice(0, 10);
}
