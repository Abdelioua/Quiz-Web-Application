let theQuestion = document.querySelector(".quiz-questions h2");
let questionCount = document.querySelector(".quistion-count span");
let questionDiv = document.querySelector(".quiz-answers");
let btn = document.querySelector(".submit-btn");
let bullets = document.querySelector(".bullets");
let quizResult = document.querySelector(".quiz-result");
let timer = document.querySelector(".timer");

let countdownInterval;
let correctCount = 0;
let qCount = 0;
let requist = new XMLHttpRequest();
requist.open("GET", "htmlQuestions.json");
requist.send();
requist.onreadystatechange = () => {
  if (requist.readyState === 4 && requist.status === 200) {
    let responseObj = JSON.parse(requist.responseText);
    let responseLength = responseObj.length;

    questionCount.innerHTML = responseLength;
    if (qCount < responseLength) {
      theQuestion.innerHTML = responseObj[qCount].question;
    }
    createDom(responseObj[qCount], responseLength);

    createBullets(responseLength, qCount);
    countdown(90, responseLength);
    btn.onclick = () => {
      let theRightAnswer = responseObj[qCount].correctAnswer;
      qCount++;
      checkAnswer(theRightAnswer);
      theQuestion.innerHTML = "";
      questionDiv.innerHTML = "";

      if (qCount < responseLength) {
        theQuestion.innerHTML = responseObj[qCount].question;
      }
      createDom(responseObj[qCount], responseLength);
      createBullets(responseLength);

      handleBullets(qCount);
      showResult(responseLength);
      clearInterval(countdownInterval);
      countdown(90, responseLength);
    };
  }
};

function createDom(obj, count) {
  if (qCount < count) {
    for (let i = 1; i <= 3; i++) {
      let mainDiv = document.createElement("div");
      let input = document.createElement("input");
      input.type = "radio";
      input.name = "question";
      input.id = `answer-${i}`;
      input.dataset.answer = obj[`answer_${i}`];
      let labelText = document.createTextNode(obj[`answer_${i}`]);
      let label = document.createElement("label");
      label.htmlFor = `answer-${i}`;
      label.appendChild(labelText);

      if (i === 1) {
        input.checked = true;
      }

      mainDiv.appendChild(input);
      mainDiv.appendChild(label);
      questionDiv.appendChild(mainDiv);
    }
  }
}
function createBullets(count, qCount) {
  let jsSpan;
  if (qCount === 0) {
    for (let i = 0; i < count; i++) {
      jsSpan = document.createElement("span");
      if (i === 0) {
        jsSpan.className = "on";
      }
      bullets.appendChild(jsSpan);
    }
  }
}

function handleBullets(qCount) {
  let bulls = document.querySelectorAll(".bullets span");
  bulls.forEach((ele, i) => {
    if (qCount === i) {
      ele.className = "on";
    }
  });
}

function checkAnswer(rAnswer) {
  let chosen = document.getElementsByName("question");
  let chosenAnswer;
  for (let i = 0; i < chosen.length; i++) {
    if (chosen[i].checked) {
      chosenAnswer = chosen[i].dataset.answer;
    }
  }
  if (rAnswer === chosenAnswer) {
    correctCount++;
  }
}

function showResult(count) {
  if (qCount === count) {
    theQuestion.remove();
    questionDiv.remove();
    bullets.remove();
    btn.remove();
    if (correctCount >= count / 2) {
      let showPass = document.createElement("div");
      showPass.className = "pass";
      let passText = document.createTextNode(
        `You Answered ${correctCount} correctly out of ${count} Quistions`
      );
      showPass.appendChild(passText);
      quizResult.appendChild(showPass);
      quizResult.style.display = "block";
    } else {
      let showFail = document.createElement("div");
      showFail.className = "fail";
      let failText = document.createTextNode(
        `You Answered ${correctCount} correctly out of ${count} Quistions`
      );
      showFail.appendChild(failText);
      quizResult.appendChild(showFail);
      quizResult.style.display = "block";
    }
  }
}

function countdown(duration, count) {
  if (qCount < count) {
    let minutes, seconds;
    countdownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      timer.innerHTML = `${minutes}:${seconds}`;

      if (--duration < 0) {
        clearInterval(countdownInterval);
        btn.click();
      }
    }, 1000);
  }
}
