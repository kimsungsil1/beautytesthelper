let currentQuestionIndex = 0;
let questions = [];
let selectedAnswers = [];

document.getElementById('startButton').addEventListener('click', function () {
    const examRound = document.getElementById('examRound').value;
    fetch(`${examRound}.csv`)
        .then(response => response.text())
        .then(data => {
            questions = parseCSV(data);
            startQuiz();
        })
        .catch(error => {
            alert('CSV 파일을 불러오는 중 오류가 발생했습니다.');
            console.error(error);
        });
});

function parseCSV(data) {
    const lines = data.split('\n');
    return lines.map(line => {
        const [number, question, option1, option2, option3, option4, correctAnswer, explanation] = line.split(',');
        return {
            number,
            question,
            options: [option1, option2, option3, option4],
            correctAnswer: parseInt(correctAnswer.trim(), 10),
            explanation
        };
    });
}

function startQuiz() {
    document.querySelector('.selector').classList.add('hidden');
    document.getElementById('questionContainer').classList.remove('hidden');
    showQuestion();
}

function showQuestion() {
    const questionData = questions[currentQuestionIndex];
    document.getElementById('questionText').innerText = `문제 ${questionData.number}: ${questionData.question}`;
    const optionsList = document.getElementById('optionsList');
    optionsList.innerHTML = '';

    questionData.options.forEach((option, index) => {
        const li = document.createElement('li');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'option';
        input.value = index + 1;
        input.id = `option${index + 1}`;
        const label = document.createElement('label');
        label.htmlFor = `option${index + 1}`;
        label.innerText = option;

        li.appendChild(input);
        li.appendChild(label);
        optionsList.appendChild(li);
    });
}

document.getElementById('nextButton').addEventListener('click', function () {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const selectedAnswer = parseInt(selectedOption.value, 10);
        selectedAnswers.push(selectedAnswer);

        const correctAnswer = questions[currentQuestionIndex].correctAnswer;
        if (selectedAnswer === correctAnswer) {
            alert('정답입니다!');
        } else {
            alert(`오답입니다. 정답: ${correctAnswer}, 해설: ${questions[currentQuestionIndex].explanation}`);
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            endQuiz();
        }
    } else {
        alert('정답을 선택해주세요.');
    }
});

document.getElementById('backButton').addEventListener('click', function () {
    window.location.reload();
});

function endQuiz() {
    document.getElementById('questionContainer').classList.add('hidden');
    document.getElementById('resultContainer').classList.remove('hidden');

    const score = selectedAnswers.filter((answer, index) => answer === questions[index].correctAnswer).length;
    document.getElementById('resultText').innerText = `퀴즈 완료! 당신의 점수는 ${score}점입니다.`;
}

document.getElementById('restartButton').addEventListener('click', function () {
    window.location.reload();
});
