function buildCounselPrompt({
  target,
  type,
  context,
  background,
  myAction,
  options,
  tone,
  withChristian,
}) {
  const targetText =
    {
      student: "학생 상담",
      parent: "학부모 상담",
      teacher: "교사 자신의 감정·번아웃 상담",
    }[target] || "상담";

  const typeText =
    {
      behavior: "문제 행동 및 생활지도",
      emotion: "정서·사회성 문제",
      peer: "또래 관계 갈등",
      study: "학습 태도 및 동기",
      parent: "학부모와의 관계 및 소통",
      burnout: "교사 자신의 번아웃과 감정 관리",
    }[type] || "상담 이슈";

  const toneText =
    {
      warm: "따뜻하고 공감적인 말투로,",
      firm: "단호하지만 상대를 존중하는 말투로,",
      formal: "조금 더 공식적이고 정중한 말투로,",
    }[tone] || "";

  const parts = [];

  if (options.script) parts.push("1. 실제로 사용할 수 있는 상담 대화 스크립트");
  if (options.guide) parts.push("2. 상황에 대한 교육적·심리학적 해석과 지도 방향");
  if (options.parent)
    parts.push("3. 학부모와 통화하거나 직접 만났을 때 사용할 수 있는 구체적인 문장 예시");
  if (options.emotion) parts.push("4. 교사로서 내 감정을 정리하고 보호하기 위한 조언");

  const whatToDo = parts.length ? parts.join("\n- ") : "1. 상황에 맞는 상담 방향과 대화 예시";

  const christianText = withChristian
    ? "\n또한, 기독교 교육 관점에서 아이의 신앙과 인격이 함께 자라도록 돕는 조언도 함께 포함해 주세요."
    : "";

  return `
[상담 기본 정보]
- 상담 대상: ${targetText}
- 문제 유형: ${typeText}

[상황 설명]
${context || "(상황 설명이 비어 있습니다.)"}

[배경 정보]
${background || "(별도의 배경 정보 없음)"}

[지금까지 내가 해 본 지도/대화]
${myAction || "(아직 별도의 시도 없음)"}

[요청 사항]
- 아래 항목들을 중심으로 ${toneText} 구체적으로 도와주세요.
- ${whatToDo}${christianText}

가능하면 단계별로 정리하고, 교사가 그대로 읽어 줄 수 있을 정도로 자연스러운 한국어 문장으로 작성해 주세요.
  `.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const targetGroup = document.getElementById("counsel-target-group");
  const typeGroup = document.getElementById("counsel-type-group");
  const ctxInput = document.getElementById("counsel-context");
  const bgInput = document.getElementById("counsel-background");
  const actInput = document.getElementById("counsel-my-action");

  const needScript = document.getElementById("need-script");
  const needGuide = document.getElementById("need-guide");
  const needParent = document.getElementById("need-parent");
  const needEmotion = document.getElementById("need-emotion");
  const needChristian = document.getElementById("need-christian");
  const toneSelect = document.getElementById("tone-select");

  const genBtn = document.getElementById("generate-counsel-prompt-btn");
  const copyBtn = document.getElementById("copy-counsel-prompt-btn");
  const resultP = document.getElementById("counsel-prompt-result");

  let currentTarget = "student";
  let currentType = "behavior";

  // 상담 대상 선택
  targetGroup.addEventListener("click", (e) => {
    if (!e.target.matches(".chip")) return;
    [...targetGroup.children].forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentTarget = e.target.dataset.target;
  });

  // 문제 유형 선택
  typeGroup.addEventListener("click", (e) => {
    if (!e.target.matches(".chip")) return;
    [...typeGroup.children].forEach((btn) => btn.classList.remove("active"));
    e.target.classList.add("active");
    currentType = e.target.dataset.type;
  });

  // 프롬프트 생성
  genBtn.addEventListener("click", () => {
    const context = ctxInput.value.trim();

    if (!context) {
      alert("상담 상황을 최소한 한 문장 이상 입력해 주세요.");
      return;
    }

    const prompt = buildCounselPrompt({
      target: currentTarget,
      type: currentType,
      context,
      background: bgInput.value.trim(),
      myAction: actInput.value.trim(),
      options: {
        script: needScript.checked,
        guide: needGuide.checked,
        parent: needParent.checked,
        emotion: needEmotion.checked,
      },
      tone: toneSelect.value,
      withChristian: needChristian.checked,
    });

    resultP.textContent = prompt;
  });

  // 프롬프트 복사
  copyBtn.addEventListener("click", async () => {
    const text = resultP.textContent.trim();
    if (!text) {
      alert("먼저 프롬프트를 생성해 주세요.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      alert("프롬프트가 복사되었습니다. 상담용 GPT에 붙여넣어 사용하세요.");
    } catch (e) {
      console.error(e);
      alert("복사 중 오류가 발생했습니다.");
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
