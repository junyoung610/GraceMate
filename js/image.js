function buildImagePrompt({ type, bible, topic, keyword, age, style, ratio }) {
  // 타입별 설명 문구
  const typeMap = {
    thumbnail: "설교 유튜브 썸네일 이미지",
    poster: "교회 행사 포스터 디자인",
    worksheet: "아이들이 문제를 풀 수 있는 A4 활동지용 일러스트",
    background: "예배 화면 배경 이미지",
  };

  const ageText = {
    "elementary-lower": "초등 1-2학년 어린이들에게 어울리는",
    "elementary-upper": "초등 3-4학년 어린이들에게 어울리는",
    youth: "초등 5-6학년 어린이들에게 어울리는",
  };

  const styleText = {
    cute: "귀엽고 따뜻한 컬러의 일러스트 스타일로,",
    flat: "깔끔한 플랫 디자인 그래픽 스타일로,",
    watercolor: "부드러운 수채화 느낌으로,",
    pixel: "게임 느낌의 픽셀 아트 스타일로,",
  };

  return `
  **다음 아래의 조건으로 이미지를 생성하세요**
  ---
  #조건
  **이미지 생성모델은 나노바나나를 사용하세요**
  Create a ${typeMap[type] || "Christian education image"}.

- 성경 본문: ${bible}
- 핵심 주제: ${topic}
- 대상: ${ageText[age] || ""} 기독교 교육용 이미지
- 분위기 / 스타일: ${styleText[style] || ""} 밝고 희망적인 느낌
- 추가 키워드: ${keyword || "아이들이 공감할 수 있는 표정과 장면"}
- 이미지 비율: ${ratio} 비율

텍스트는 최소화하고, 아이들이 내용을 떠올릴 수 있는 장면 중심으로 구성해 주세요.

  `.trim();
}

document.addEventListener("DOMContentLoaded", () => {
  const typeGroup = document.getElementById("image-type-group");
  const bibleInput = document.getElementById("img-bible-input");
  const topicInput = document.getElementById("img-topic-input");
  const keywordInput = document.getElementById("img-keyword-input");
  const ageSelect = document.getElementById("img-age-select");
  const styleSelect = document.getElementById("img-style-select");
  const ratioSelect = document.getElementById("img-ratio-select");
  const genBtn = document.getElementById("generate-image-prompt-btn");
  const copyBtn = document.getElementById("copy-image-prompt-btn");
  const result = document.getElementById("image-prompt-result");

  let currentType = "thumbnail";

  // 타입 버튼 클릭
  typeGroup.addEventListener("click", (e) => {
    if (e.target.matches(".chip")) {
      [...typeGroup.children].forEach((btn) => btn.classList.remove("active"));
      e.target.classList.add("active");
      currentType = e.target.dataset.type;
    }
  });

  // 프롬프트 생성
  genBtn.addEventListener("click", () => {
    const bible = bibleInput.value.trim();
    const topic = topicInput.value.trim();
    const keyword = keywordInput.value.trim();

    if (!bible || !topic) {
      alert("성경 본문과 핵심 주제를 입력해 주세요.");
      return;
    }

    const prompt = buildImagePrompt({
      type: currentType,
      bible,
      topic,
      keyword,
      age: ageSelect.value,
      style: styleSelect.value,
      ratio: ratioSelect.value,
    });

    result.textContent = prompt;
  });

  // 복사
  copyBtn.addEventListener("click", async () => {
    const text = result.textContent.trim();
    if (!text) {
      alert("먼저 프롬프트를 생성해 주세요.");
      return;
    }
    await navigator.clipboard.writeText(text);
    alert("프롬프트가 복사되었습니다. 이미지 생성기에 붙여넣어 사용하세요.");
  });
});
