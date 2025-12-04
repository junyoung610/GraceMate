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

function getDaysUntilSunday() {
  const today = new Date();
  const todayDay = today.getDay(); // 0=일요일, 1=월, ... 6=토

  // 오늘이 일요일일 경우
  if (todayDay === 0) return 0;

  // 다음 주일(이번 주 일요일)까지 남은 날
  return 7 - todayDay;
}

function renderDday() {
  const days = getDaysUntilSunday();
  const ddayElement = document.getElementById("dday-text");

  if (days === 0) {
    ddayElement.textContent = "D-Day 0일 (오늘이 주일입니다!)";
  } else {
    ddayElement.textContent = `D-${days}일`;
  }
}

document.addEventListener("DOMContentLoaded", renderDday);

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
