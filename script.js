// 글로벌 변수 선언
let currentQuestionIndex = 0;
let questions = [];
let score = 0;

// CSV 파일 파싱 함수
function parseCSV(csv) {
    const lines = csv.split("\n");
    const result = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
            const values = line.split(",");
            result.push({
                question: values[1],
                options: [values[2], values[3], values[4], values[5]],
                correctAnswer: parseInt(values[6]) - 1, // 0-based index for answers
                explanation: values[7]
            });
        }
    }

    return result;
}

// 퀴즈 시작 함수
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}

// 질문 표시 함수
function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showScore();
        return;
    }

    const questionData = questions[currentQuestionIndex];
    document.getElementById("question").innerText = `문제 ${currentQuestionIndex + 1}: ${questionData.question}`;

    for (let i = 0; i < 4; i++) {
        const optionElement = document.getElementById(`option${i + 1}`);
        optionElement.innerText = questionData.options[i];
    }
}

// 선택한 답변 검사 함수
function checkAnswer(selectedIndex) {
    const questionData = questions[currentQuestionIndex];
    const resultElement = document.getElementById("result");

    if (selectedIndex === questionData.correctAnswer) {
        score++;
        resultElement.innerText = `정답입니다! 정답: ${questionData.options[selectedIndex]}.`;
    } else {
        resultElement.innerText = `오답입니다. 정답은 ${questionData.options[questionData.correctAnswer]}입니다. 해설: ${questionData.explanation}`;
    }

    currentQuestionIndex++;
    document.getElementById("nextButton").disabled = false;
}

// 다음 질문으로 이동하는 함수
function nextQuestion() {
    document.getElementById("result").innerText = "";
    document.getElementById("nextButton").disabled = true;
    showQuestion();
}

// 점수 표시 함수
function showScore() {
    document.getElementById("quizContainer").style.display = "none";
    document.getElementById("scoreContainer").style.display = "block";
    document.getElementById("score").innerText = `점수: ${score}/${questions.length}`;
}

// 퀴즈 다시 시작 함수
function resetQuiz() {
    document.getElementById("scoreContainer").style.display = "none";
    document.getElementById("quizContainer").style.display = "block";
    startQuiz();
}

// 이벤트 리스너 추가
document.getElementById("startButton").addEventListener("click", function () {
    const examRound = document.getElementById("examRound").value;
    fetch(`${examRound}.csv`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            questions = parseCSV(data);
            startQuiz();
        })
        .catch(error => {
            alert("CSV 파일을 불러오는 중 오류가 발생했습니다.");
            console.error("Error loading CSV file:", error);
        });
});

document.getElementById("nextButton").addEventListener("click", nextQuestion);
document.getElementById("resetButton").addEventListener("click", resetQuiz);

for (let i = 0; i < 4; i++) {
    document.getElementById(`option${i + 1}`).addEventListener("click", function () {
        checkAnswer(i);
    });
}
