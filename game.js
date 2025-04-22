const scenarios = {
  start: {
    text: "あなたは霧の森に迷い込んだ。",
    image: "images/forest.jpg",
    choices: [
      { text: "森を歩く", next: "walk" },
      { text: "その場にとどまる", next: "stay" }
    ]
  },
  walk: {
    text: "しばらく歩くと、少女に出会った。",
    image: "images/girl.png",
    choices: [
      { text: "話しかける", next: "talk" },
      { text: "逃げる", next: "run" }
    ]
  },
  stay: {
    text: "霧はさらに濃くなり、あなたは意識を失った。",
    image: "images/forest.jpg",
    choices: [],
    ending: "bad"
  },
  talk: {
    text: "少女『かくれんぼしよう』と言い、森の奥へ走っていった。",
    image: "images/girl.png",
    choices: [
      { text: "追いかける", next: "chase" },
      { text: "無視する", next: "ignore" }
    ]
  },
  run: {
    text: "あなたは転び、霧の中へ消えた…。",
    image: "images/forest.jpg",
    choices: [],
    ending: "bad"
  },
  chase: {
    text: "少女を追って古びた屋敷にたどり着いた。",
    image: "images/mansion.jpg",
    choices: [
      { text: "屋敷に入る", next: "enter" },
      { text: "森に戻る", next: "return" }
    ]
  },
  ignore: {
    text: "少女は怒り、あなたに呪いをかけた。",
    image: "images/girl.png",
    choices: [],
    ending: "bad"
  },
  enter: {
    text: "屋敷の中は不気味な空気に満ちていた。あなたは無事に脱出できた！",
    image: "images/mansion.jpg",
    choices: [],
    ending: "good"
  },
  return: {
    text: "森の中であなたは永遠に迷い続けた。",
    image: "images/forest.jpg",
    choices: [],
    ending: "bad"
  }
};

let currentKey = "start";

function showScenario(key) {
  const scenario = scenarios[key];
  currentKey = key;

  showTextWithTyping(scenario.text, () => {
    if (scenario.ending) {
      playEnding(scenario.ending);
      return;
    }
    const choicesDiv = document.getElementById("choices");
    choicesDiv.innerHTML = "";
    scenario.choices.forEach(choice => {
      const button = document.createElement("button");
      button.textContent = choice.text;
      button.className = "choice";
      button.onclick = () => {
        playSound("sounds/decision.mp3");
        showScenario(choice.next);
      };
      choicesDiv.appendChild(button);
    });
  });

  document.getElementById("image").src = scenario.image;
}

function showTextWithTyping(text, callback) {
  const textDiv = document.getElementById("text");
  textDiv.textContent = "";
  let i = 0;
  const interval = setInterval(() => {
    textDiv.textContent += text[i];
    i++;
    if (i >= text.length) {
      clearInterval(interval);
      if (callback) callback();
    }
  }, 50);
}

function playSound(src) {
  const se = document.getElementById("se");
  se.src = src;
  se.play();
}

function playEnding(type) {
  const textDiv = document.getElementById("text");
  const choicesDiv = document.getElementById("choices");
  const bgm = document.getElementById("bgm");

  if (type === "good") {
    playSound("sounds/goodend.mp3");
    textDiv.textContent += "【GOOD END】";
  } else {
    playSound("sounds/badend.mp3");
    textDiv.textContent += "【BAD END】";
  }
  choicesDiv.innerHTML = "";
  bgm.pause();
}

document.getElementById("save").onclick = () => {
  localStorage.setItem("novelgame_save", currentKey);
  alert("セーブしました！");
};

document.getElementById("load").onclick = () => {
  const savedKey = localStorage.getItem("novelgame_save");
  if (savedKey) {
    showScenario(savedKey);
    alert("ロードしました！");
  } else {
    alert("セーブデータがありません。");
  }
};

document.getElementById("bgm").play();
showScenario(currentKey);
