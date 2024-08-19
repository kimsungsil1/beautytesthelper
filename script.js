let timer;
let timeLimit = 600; // 10분
let score = 0;
let bookmarks = [];
let questions = [];

document.getElementById("startButton").addEventListener("click", function () {
    const examRound = document.getElementById("examRound").value;
    const filePath = `${examRound}.csv`;
    console.log("Loading CSV file from:", filePath);

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            console.log("CSV file loaded successfully");
            questions = parseCSV(data);
            if (questions.length === 0) {
                throw new Error("CSV 파일에 질문 데이터가 없습니다.");
            }
            console.log(questions);
            document.querySelector(".selection").classList.add("hidden");
            document.getElementById("quizContainer").classList.remove("hidden");
            startTimer(timeLimit);
            startQuiz();
        })
        .catch(error => {
            alert("CSV 파일을 불러오는 중 오류가 발생했습니다. 파일을 확인해주세요.");
            console.error("Error loading CSV file:", error);
        });
});

function parseCSV(data) {
    const lines = data.split("\n").filter(line => line.trim() !== "");
    const result = [];
    const headers = lines[0].split(",").map(header => header.trim());

    for (let i = 1; i < lines.length; i++) {
        const currentline = lines[i].split(",");
        if (currentline.length < headers.length) {
            console.log(`Skipping line ${i + 1}: incomplete data`);
            continue;
        }

        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j].trim();
        }
        result.push(obj);
    }
    return result;
}

function startQuiz() {
    let currentQuestionIndex = 0;
    displayQuestion(currentQuestionIndex);

    document.getElementById("nextButton").addEventListener("click", function () {
        checkAnswer(currentQuestionIndex);
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);
        } else {
            endQuiz();
        }
    });

    document.getElementById("bookmarkButton").addEventListener("click", function () {
        bookmarks.push(currentQuestionIndex);
        alert("문제가 북마크되었습니다.");
    });

    document.getElementById("backButton").addEventListener("click", function () {
        clearInterval(timer);
        document.getElementById("quizContainer").classList.add("hidden");
        document.querySelector(".selection").classList.remove("hidden");
    });
}

function displayQuestion(index) {
    const questionObj = questions[index];
    document.getElementById("question").textContent = `문제 ${index + 1}: ${questionObj['문제']}`;

    const form = document.getElementById("answersForm");
    form.innerHTML = ""; // 이전 답변을 초기화

    for (let i = 1; i <= 4; i++) {
        const label = document.createElement("label");
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "answer";
        radio.value = i;

        const choiceText = questionObj[`선택지${i}`] || `선택지${i} 내용`;
        const span = document.createElement("span");
        span.textContent = `${i}.`;

        label.appendChild(radio);
        label.appendChild(span);
        label.append(` ${choiceText}`);
        form.appendChild(label);
        form.appendChild(document.createElement("br"));
    }
}

function checkAnswer(index) {
    const form = document.getElementById("answersForm");
    const selected = form.querySelector('input[name="answer"]:checked');
    if (selected) {
        const answer = parseInt(selected.value);
        const correctAnswer = parseInt(questions[index]["정답 인덱스"]);
        if (answer === correctAnswer) {
            score++;
        }
    }
}

function startTimer(duration) {
    let timeRemaining = duration;
    timer = setInterval(function () {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        document.getElementById("time").textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        if (--timeRemaining < 0) {
            clearInterval(timer);
            endQuiz();
        }
    }, 1000);
}

function endQuiz() {
    clearInterval(timer);
    document.getElementById("quizContainer").classList.add("hidden");
    document.getElementById("resultContainer").classList.remove("hidden");

    // 결과를 표시
    document.getElementById("score").textContent = `${score} / ${questions.length}`;
    document.getElementById("totalQuestions").textContent = questions.length;
    document.getElementById("correctAnswers").textContent = score;
    document.getElementById("wrongAnswers").textContent = questions.length - score;
    document.getElementById("bookmarkedQuestions").textContent = bookmarks.length;

    // 다시 풀기 버튼 이벤트
    document.getElementById("retryButton").addEventListener("click", function () {
        score = 0;
        bookmarks = [];
        document.getElementById("resultContainer").classList.add("hidden");
        startQuiz();
    });

    // 첫 화면으로 돌아가기 버튼 이벤트
    document.getElementById("backToSelection").addEventListener("click", function () {
        score = 0;
        bookmarks = [];
        document.getElementById("resultContainer").classList.add("hidden");
        document.querySelector(".selection").classList.remove("hidden");
    });
}
