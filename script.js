let currentQuestionIndex = 0;
let questions = [];
let userAnswers = [];

function startQuiz() {
    const examSelect = document.getElementById('examSelect').value;
    fetch(examSelect)
        .then(response => response.text())
        .then(data => {
            questions = parseCSV(data);
            showQuestion();
            document.getElementById('quizContainer').style.display = 'block';
            document.getElementById('nextButton').style.display = 'block';
            document.getElementById('examSelection').style.display = 'none';
        })
        .catch(error => {
            alert("CSV 파일을 불러오는 중 오류가 발생했습니다.");
            console.error(error);
        });
}

function parseCSV(data) {
    const lines = data.split('\n');
    return lines.slice(1).map(line => {
        const [번호, 문제, 선택지1, 선택지2, 선택지3, 선택지4, 정답인덱스, 해설] = line.split(',');
        return {
            번호,
            문제,
            선택지: [선택지1, 선택지2, 선택지3, 선택지4],
            정답인덱스: parseInt(정답인덱스),
            해설
        };
    });
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    const quizContainer = document.getElementById('quizContainer');
    quizContainer.innerHTML = `
        <div class="question">
            <label>문제 ${question.번호}: ${question.문제}</label>
        </div>
        <div class="choices">
            ${question.선택지.map((choice, index) => `
                <label>
                    <input type="radio" name="choice" value="${index}">
                    ${index + 1} ${choice}
                </label>
            `).join('')}
        </div>
    `;
}

function showNextQuestion() {
    const selectedChoice = document.querySelector('input[name="choice"]:checked');
    if (!selectedChoice) {
        alert("답을 선택해 주세요.");
        return;
    }

    const userAnswer = parseInt(selectedChoice.value);
    const correctAnswer = questions[currentQuestionIndex].정답인덱스;

    if (userAnswer === correctAnswer) {
        alert("정답입니다!");
    } else {
        alert(`오답입니다. 정답: ${correctAnswer + 1}, 해설: ${questions[currentQuestionIndex].해설}`);
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        alert("문제를 모두 풀었습니다.");
        document.getElementById('nextButton').style.display = 'none';
        document.getElementById('backButton').style.display = 'block';
    }
}

function goBack() {
    currentQuestionIndex = 0;
    document.getElementById('quizContainer').style.display = 'none';
    document.getElementById('nextButton').style.display = 'none';
    document.getElementById('examSelection').style.display = 'block';
    document.getElementById('backButton').style.display = 'none';
}
