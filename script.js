function showNextQuestion() {
    const selectedAnswer = document.querySelector('input[name="answer"]:checked');
    if (!selectedAnswer) {
        alert("답을 선택해주세요!");
        return;
    }

    const isCorrect = parseInt(selectedAnswer.value) === currentExam.questions[currentQuestionIndex].answer;
    
    // 정답 해설 표시
    const explanationDiv = document.createElement('div');
    explanationDiv.style.marginTop = '20px';
    explanationDiv.style.padding = '10px';
    explanationDiv.style.borderRadius = '5px';
    explanationDiv.style.backgroundColor = isCorrect ? '#d4edda' : '#f8d7da';
    explanationDiv.style.color = isCorrect ? '#155724' : '#721c24';

    explanationDiv.innerHTML = isCorrect ? '정답입니다! ' : '오답입니다. ';
    explanationDiv.innerHTML += `정답: ${currentExam.questions[currentQuestionIndex].choices[currentExam.questions[currentQuestionIndex].answer]}. `;
    explanationDiv.innerHTML += currentExam.questions[currentQuestionIndex].explanation;

    document.getElementById('quizContainer').appendChild(explanationDiv);

    // "다음" 버튼을 "다음 문제"로 변경
    document.getElementById('nextButton').textContent = '다음 문제';
    document.getElementById('nextButton').onclick = function () {
        currentQuestionIndex++;

        // 해설을 지우고 다음 문제 로드
        document.getElementById('quizContainer').removeChild(explanationDiv);

        if (currentQuestionIndex < currentExam.questions.length) {
            loadQuestion();
        } else {
            showResult();
        }
    };
}
