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

        // 선택지 앞에 번호를 추가
        const span = document.createElement("span");
        span.textContent = `${i}.`;

        label.appendChild(radio);
        label.appendChild(span);
        label.append(` ${choiceText}`);
        form.appendChild(label);
        form.appendChild(document.createElement("br"));
    }
}
