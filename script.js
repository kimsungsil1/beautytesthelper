// Google Sheets ID와 시트 이름 설정
const sheetId = '1Nmlr7XYc_n57UK-mglyOOJMTLwPur9-STi4390wlCNc';
const sheetName = 'Sheet1'; // 시트 이름 (일반적으로 기본 시트 이름은 Sheet1)

// Google Sheets의 CSV 형식 데이터 URL
const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;

function fetchDataFromGoogleSheet() {
    fetch(url)
        .then(response => response.text())
        .then(csvData => {
            const parsedData = parseCSV(csvData);
            console.log(parsedData);
            startQuiz(parsedData);
        })
        .catch(error => {
            console.error('Error fetching data from Google Sheets:', error);
        });
}

function parseCSV(csvData) {
    const lines = csvData.split("\n").map(line => line.trim()).filter(line => line !== "");
    const headers = lines[0].split(",").map(header => header.trim());
    const rows = lines.slice(1);

    return rows.map(row => {
        const values = row.split(",");
        const result = {};
        headers.forEach((header, index) => {
            result[header] = values[index].trim();
        });
        return result;
    });
}

document.getElementById("startButton").addEventListener("click", function () {
    fetchDataFromGoogleSheet(); // Google Sheets에서 데이터 가져오기
});

function startQuiz(questions) {
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
