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
            document.querySelector(".selection").classList.add("hidden");
            document.getElementById("quizContainer").classList.remove("hidden");
            startQuiz();
        })
        .catch(error => {
            alert("CSV 파일을 불러오는 중 오류가 발생했습니다.");
            console.error("Error loading CSV file:", error);
        });
});

function parseCSV(data) {
    const lines = data.split("\n");
    const result = [];
    const headers = lines[0].split(",");

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentline[j].trim();
        }
        result.push(obj);
    }
    return result;
}

function startQuiz() {
    let currentQuestionIndex = 0;
    displayQuestion(currentQuestionIndex);

    document.getElementById("nextButton").addEventListener("click", function () {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            displayQuestion(currentQuestionIndex);
        } else {
            alert("퀴즈가 끝났습니다!");
            document.getElementById("quizContainer").classList.add("hidden");
            document.querySelector(".selection").classList.remove("hidden");
        }
    });

    document.getElementById("backButton").addEventListener("click", function () {
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

        // 선택지 내용을 CSV에서 가져옴
        const choiceText = questionObj[`선택지${i}`] || `선택지${i} 내용`;
        label.appendChild(radio);
        label.append(` ${choiceText}`);
        form.appendChild(label);
        form.appendChild(document.createElement("br"));
    }
}
