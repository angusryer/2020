const QUESTION = document.getElementById("question")
const CHOICES = Array.from(document.getElementsByClassName("choice-text"))
const QUESTIONCOUNTERDISPLAY = document.getElementById('questionCounter')
const SCOREDISPLAY = document.getElementById('score')

let currentQuestion = {}
let acceptingAnswers = false // cannot answer before everything is loaded
let score = 0 // score starts at 0
let questionCounter = 0 // question counter begins at 0
let availableQuestions = []

let questions = [
    {
        question: "Who hit most career homeruns in MLB history?",
        choice1: "Hank Aaron",
        choice2: "Babe Ruth",
        choice3: "Pete Rose",
        choice4: "Barry Bonds",
        choice5: "Ken Griffey Jr",
        answer: 4
    },
    { 
        question: "Who scored the most points in NBA history?",
        choice1: "Wilt Chamberlain",
        choice2: "Karl Malone",
        choice3: "Julius Erving",
        choice4: "Michael Jordan",
        choice5: "Kareem Abdul-Jabbar",
        answer: 5
    },
    { 
        question: "Who scored the most goals in NHL history?",
        choice1: "Wayne Gretzky",
        choice2: "Jaromir Jagr",
        choice3: "Gordie Howe",
        choice4: "Mike Bossy",
        choice5: "Mark Messier",
        answer: 1
    }
]

const CORRECT_BONUS = 5; // correct answer, reward 5 points
const MAX_QUESTIONS = 3; // how many questions does the user get before they finish

startGame = () => {
    questionCounter = 0
    beginningScore = 0
    availableQuestions = [...questions] // copy all the questions
    getNewQuestion()
}

getNewQuestion = () => {
    // when user clicks on answer(s)
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        // redirect to end page
        return window.location.assign('/game-end.html')
    }
    // when game starts, increment by 1
    questionCounter++
    // display question count out of how many
    QUESTIONCOUNTERDISPLAY.innerText = `${questionCounter}/${MAX_QUESTIONS}`
    // start with 3 questions, use 1, then 2 are left
    const QUESTION_INDEX = Math.floor(Math.random() * availableQuestions.length)
        currentQuestion = availableQuestions[QUESTION_INDEX]
        question.innerText = currentQuestion.question

    CHOICES.forEach( choice => {
        const NUMBER = choice.dataset['number']
        choice.innerText = currentQuestion[`choice${NUMBER}`]
    })
    
    availableQuestions.splice(QUESTION_INDEX, 1)

    acceptingAnswers = true
}

CHOICES.forEach(choice => {
    // e - event
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return
        // do not want user to click on answers immediately
        acceptingAnswers = false
        const SELECTEDCHOICE = e.target
        const SELECTEDANSWER = SELECTEDCHOICE.dataset['number']
        
        // if the answer is not correct, "X" message appears
        const CLASSTOAPPLY = SELECTEDANSWER == currentQuestion.answer ? "correct" : "incorrect"
        
        if (CLASSTOAPPLY === 'correct') {
            incrementScore(CORRECT_BONUS);
        }
        
        SELECTEDCHOICE.parentElement.classList.add(CLASSTOAPPLY)
        
        setTimeout(() => {
            SELECTEDCHOICE.parentElement.classList.remove(CLASSTOAPPLY)
        
            // when a question is answered, a new one is loaded
            getNewQuestion()
        }, 800) // wait for 0.8 seconds before moving to next page
    })
})

incrementScore = num => {
    score += num
    SCOREDISPLAY.innerText = score
}

startGame()