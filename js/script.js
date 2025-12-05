// "MM-DD" 형식으로 오늘 날짜 구하기
function getTodayKey() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 01~12
  const day = String(today.getDate()).padStart(2, "0"); // 01~31
  return `${month}-${day}`; // 예: "12-04"
}

async function loadTodayVerse() {
  try {
    const res = await fetch("./json/bibleByDate.json"); // 경로는 상황에 맞게 조정
    const data = await res.json();

    const todayKey = getTodayKey();
    const verse = data[todayKey];

    const verseTextEl = document.getElementById("verse-text");
    const verseRefEl = document.getElementById("verse-ref");

    if (verse) {
      // 오늘 날짜에 해당하는 말씀이 있을 때
      verseTextEl.textContent = verse.text;
      verseRefEl.textContent = verse.ref;
    } else {
      // 혹시 JSON에 오늘 날짜가 없을 때 대비 (옵션)
      verseTextEl.textContent = "오늘 날짜의 말씀이 아직 등록되지 않았어요.";
      verseRefEl.textContent = "";
    }
  } catch (error) {
    console.error("오늘의 말씀 로딩 오류:", error);
  }
}

document.addEventListener("DOMContentLoaded", loadTodayVerse);

document.addEventListener("DOMContentLoaded", () => {
  const ddayEl = document.getElementById("dday-text");
  const prepTextEl = document.getElementById("prep-text");

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const weekday = today.getDay(); // 0(일) ~ 6(토)

  // 이번 주 '주일(일요일)'까지 남은 일수 = D-Day
  const diffDays = (0 - weekday + 7) % 7; // 일요일이면 0, 월요일이면 6, 토요일이면 1

  // 오늘 요일에 해당하는 Day 정보 가져오기
  const info = weeklyPrepPlan[weekday];

  // D-Day 텍스트 업데이트
  if (ddayEl && info) {
    if (diffDays === 0) {
      ddayEl.textContent = `${info.label} · 오늘은 주일예배일이에요!`;
    } else {
      ddayEl.textContent = `${info.label} · 주일까지 D-${diffDays}`;
    }
  }

  // 오늘 해야 할 준비 내용 업데이트
  if (prepTextEl && info) {
    prepTextEl.innerHTML = info.tasks.map((t) => `• ${t}`).join("<br>");
  }
});

// 요일별 Day라벨 + 해야 할 일
const weeklyPrepPlan = {
  1: {
    // MON
    label: "Day 1 (MON)",
    tasks: [
      "지난 주 공과 진행 중 좋았던 점, 아쉬웠던 점을 기록하고 다음 주에 반영할 점을 생각해 보세요.",
      "다음 주 공과 본문, 주제, 학습 목표, 전체 흐름을 가볍게 훑어보세요.",
    ],
  },
  2: {
    // TUE
    label: "Day 2 (TUE)",
    tasks: [
      "다음 주 공과 성경 본문을 최소 2회 이상 읽습니다.",
      "교사용 지침서/공과 교재를 정독하며 본문의 배경, 신학적 의미, 아이들에게 전달할 핵심 메시지를 깊이 이해해 보세요.",
    ],
  },
  3: {
    // WED
    label: "Day 3 (WED)",
    tasks: [
      "도입(흥미 유발), 전개(본문 설명), 적용/활동(삶에 연결), 마무리(기도)의 흐름을 머릿속으로 구성해요.",
      "공과 본문과 목표에 맞는 창의적인 활동(게임, 만들기, 퀴즈, 역할극 등) 아이디어를 구상해요.",
    ],
  },
  4: {
    // THU
    label: "Day 4 (THU)",
    tasks: [
      "공과 시간을 고려하여 도입, 전개, 활동, 정리 단계별로 구체적인 멘트와 순서를 적은 교안을 제작해요.",
      "PPT, 그림, 도구, 만들기 재료 등 아이들의 이해를 돕고 흥미를 유발할 자료를 준비해요.",
    ],
  },
  5: {
    // FRI
    label: "Day 5 (FRI)",
    tasks: [
      "준비된 교안과 자료를 가지고 실제로 공과를 진행하는 것처럼 연습해요.",
      "아이들에게 가르쳐 줄 핵심 구절을 암송하고, 아이들이 쉽게 외울 수 있는 방법을 고민해요.",
    ],
  },
  6: {
    // SAT
    label: "Day 6 (SAT)",
    tasks: [
      "준비물(펜, 종이, 풀, 간식, 음향 등)과 교안을 다시 한번 확인해요.",
      "한 명 한 명의 이름을 부르며 다음 주 공과를 통해 아이들이 말씀을 잘 깨닫고 은혜 받도록 기도해요.",
    ],
  },
  0: {
    // SUN
    label: "Day 7 (SUN)",
    tasks: [
      "준비한 공과를 마지막으로 검토하며, 예배 환경을 정돈해요.",
      "아이들을 사랑하는 마음으로 예배에 임할 준비를 해요.",
    ],
  },
};

// 공과도우미에 보낼 프롬프트 템플릿
function buildPrompt(platform, bibleText, topic) {
  return `
  다음의 정보를 가지고 공과를 만들어주세요.
  교단은 ${platform}이며, 공과의 성경 본문는 ${bibleText}이고, 이번 공과의 핵심 주제는 ${topic}입니다.
    `.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const platformInput = document.getElementById("platform-input");
  const bibleInput = document.getElementById("bible-input");
  const topicInput = document.getElementById("topic-input");
  const generateBtn = document.getElementById("generate-prompt-btn");
  const copyBtn = document.getElementById("copy-prompt-btn");
  const resultP = document.getElementById("prompt-result");

  // 1) 프롬프트 생성
  generateBtn.addEventListener("click", () => {
    const bibleText = bibleInput.value.trim();
    const topic = topicInput.value.trim();
    const platform = platformInput.value.trim();

    if (!platform || !bibleText || !topic) {
      alert("성경 본문과 핵심 주제를 모두 입력해주세요.");
      return;
    }

    const prompt = buildPrompt(platform, bibleText, topic);
    resultP.textContent = prompt;
  });

  // 2) 프롬프트 복사
  copyBtn.addEventListener("click", async () => {
    const text = resultP.textContent.trim();

    if (!text) {
      alert("먼저 프롬프트를 생성해 주세요.");
      return;
    }

    // 최신 브라우저: 클립보드 API
    if (navigator.clipboard && navigator.clipboard.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        alert("프롬프트가 클립보드에 복사되었습니다.");
      } catch (err) {
        console.error("Clipboard 오류:", err);
        alert("복사 중 오류가 발생했습니다.");
      }
    } else {
      // 예전 브라우저용 fallback
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("프롬프트가 클립보드에 복사되었습니다.");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // chip-group 공통 클릭 이벤트
  document.querySelectorAll(".chip-group").forEach((group) => {
    group.addEventListener("click", (e) => {
      if (!e.target.classList.contains("chip")) return;

      // 기존 active 제거
      [...group.querySelectorAll(".chip")].forEach((btn) => btn.classList.remove("active"));

      // 클릭한 chip에 active 추가
      e.target.classList.add("active");
    });
  });
});
