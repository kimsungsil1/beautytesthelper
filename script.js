let questions = [];
let currentQuestionIndex = 0;

document.getElementById("startButton").addEventListener("click", function () {
    const examRound = document.getElementById("examRound").value;
    const filePath = `${examRound}.csv`;
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            questions = parseCSV(data);
            document.querySelector(".selection").classList.add("hidden");
            document.getElementById("quizContainer").classList.remove("hidden");
            startQuiz();
        })
        .catch(error => {
            alert("CSV 파일을 불러오는 중 오류가 발생했습니다.");
            console.error("Error loading CSV file:", error);
        });
});

document.getElementById("nextButton").addEventListener("click", function () {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const answerIndex = questions[currentQuestionIndex].정답인덱스;
        const isCorrect = parseInt(selectedOption.value) === parseInt(answerIndex);
        alert(isCorrect ? "정답입니다!" : `틀렸습니다. 정답은 ${parseInt(answerIndex) + 1}번입니다.`);
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            alert("모든 문제를 풀었습니다. 다시 시작합니다.");
            restartQuiz();
        }
    } else {
        alert("답을 선택하세요.");
    }
});

document.getElementById("restartButton").addEventListener("click", restartQuiz);
document.getElementById("backButton").addEventListener("click", function () {
    document.getElementById("quizContainer").classList.add("hidden");
    document.querySelector(".selection").classList.remove("hidden");
});

function parseCSV(data) {
    const rows = data.split("\n").map(row => row.split(","));
    const keys = rows[0];
    return rows.slice(1).map(row => {
        let obj = {};
        row.forEach((cell, i) => {
            obj[keys[i]] = cell;
        });
        return obj;
    });
}

function startQuiz() {
    currentQuestionIndex = 0;
    displayQuestion();
}

function displayQuestion() {
    const question = questions[currentQuestionIndex];
    document.getElementById("questionText").textContent = `문제 ${currentQuestionIndex + 1}: ${question.문제}`;
    document.getElementById("label1").textContent = question.선택지1;
    document.getElementById("label2").textContent = question.선택지2;
    document.getElementById("label3").textContent = question.선택지3;
    document.getElementById("label4").textContent = question.선택지4;
}

function restartQuiz() {
    document.getElementById("quizContainer").classList.add("hidden");
    document.querySelector(".selection").classList.remove("hidden");
}
