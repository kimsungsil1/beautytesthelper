// Google Sheets ID 설정
const sheetId = '1Nmlr7XYc_n57UK-mglyOOJMTLwPur9-STi4390wlCNc';

function fetchDataFromGoogleSheet() {
    const examRound = document.getElementById("examRound").value; // 선택한 시험 회차 가져오기
    console.log(`Fetching data for sheet: ${examRound}`);

    Tabletop.init({
        key: sheetId,
        simpleSheet: true,
        wanted: [examRound], // 선택한 시험 회차를 시트 이름으로 설정
        callback: function(data, tabletop) {
            console.log("Data successfully fetched:", data);
            startQuiz(data);
        },
        error: function(error) {
            console.error('Error fetching data from Google Sheets:', error);
            alert('CSV 파일을 불러오는 중 오류가 발생했습니다. 파일을 확인해주세요.');
        }
    });
}

document.getElementById("startButton").addEventListener("click", function () {
    console.log("Start button clicked");
    fetchDataFromGoogleSheet(); // Google Sheets에서 데이터 가져오기
});

function startQuiz(questions) {
    console.log("Starting quiz with questions:", questions);
    document.querySelector(".selection").classList.add("hidden");
    document.getElementById("quizContainer").classList.remove("hidden");

    let currentQuestionIndex = 0;
    displayQuestion(questions, currentQuestionIndex);

    document.getElementById("nextButton").addEventListener("click", function () {
        checkAnswer(questions, currentQuestionIndex);
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(questions, currentQuestionIndex);
        } else {
            endQuiz(questions);
        }
    });

    document.getElementById("backButton").addEventListener("click", function () {
        document.getElementById("quizContainer").classList.add("hidden");
        document.querySelector(".selection").classList.remove("hidden");
    });
}

function displayQuestion(questions, index) {
    const questionObj = questions[index];
    console.log(`Displaying question ${index + 1}:`, questionObj);

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

function checkAnswer(questions, index) {
    const form = document.getElementById("answersForm");
    const selected = form.querySelector('input[name="answer"]:checked');
    if (selected) {
        const answer = parseInt(selected.value);
        const correctAnswer = parseInt(questions[index]["정답 인덱스"]);
        if (answer === correctAnswer) {
            alert("정답입니다!");
        } else {
            alert("오답입니다. 정답은 " + correctAnswer + "번입니다.");
        }
    } else {
        alert("정답을 선택하세요.");
    }
}

function endQuiz(questions) {
    alert("퀴즈가 끝났습니다! 총 " + questions.length + "문제를 풀었습니다.");
    document.getElementById("quizContainer").classList.add("hidden");
    document.querySelector(".selection").classList.remove("hidden");
}
