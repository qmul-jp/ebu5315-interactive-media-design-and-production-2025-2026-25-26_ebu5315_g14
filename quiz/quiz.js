// 题库：5道关于圆的几何题目
const questions = [
  {
    question_en: "What is the radius of a circle with equation x² + y² = 25?",
    question_cn: "圆 x² + y² = 25 的半径是多少？",
    options_en: ["5", "10", "25", "50"],
    options_cn: ["5", "10", "25", "50"],
    correct: 0
  },
  {
    question_en: "Which of the following is the formula for the area of a circle?",
    question_cn: "下列哪个是圆的面积公式？",
    options_en: ["πr", "πr²", "2πr", "πd"],
    options_cn: ["πr", "πr²", "2πr", "πd"],
    correct: 1
  },
  {
    question_en: "The diameter of a circle is 12. What is its circumference?",
    question_cn: "圆的直径是12，它的周长是多少？",
    options_en: ["12π", "24π", "6π", "36π"],
    options_cn: ["12π", "24π", "6π", "36π"],
    correct: 1
  },
  {
    question_en: "In a circle, the angle subtended by a diameter at the circumference is a ______ angle.",
    question_cn: "在圆中，直径在圆周上所对的角是______角。",
    options_en: ["acute", "right", "obtuse", "reflex"],
    options_cn: ["锐角", "直角", "钝角", "优角"],
    correct: 1
  },
  {
    question_en: "What is the equation of a circle with center (3, -2) and radius 4?",
    question_cn: "圆心为(3, -2)，半径为4的圆方程是什么？",
    options_en: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
    options_cn: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
    correct: 0
  }
];

// 翻译文本
const translations = {
  en: {
    // 导航栏
    navHome: "Homepage",
    navQuiz: "Quiz",
    navGame: "Game",
    langToggle: "CN",
    // 面包屑导航
    breadcrumbHome: "homepage",
    breadcrumbCurrent: "quiz",
    // 按钮文本
    prevBtn: "Previous",
    nextBtn: "Next",
    submitBtn: "Submit",
    // 分数显示
    scorePrefix: "Score: ",
    // 结果页面
    resultsTitle: "Quiz Results",
    scoreMessageHigh: "Excellent!",
    scoreMessageMedium: "Good job!",
    scoreMessageLow: "Keep practicing!",
    scoreDescription: "You've completed the quiz. Review your answers below.",
    correctLabel: "Correct",
    incorrectLabel: "Incorrect",
    unansweredLabel: "Unanswered",
    yourAnswer: "Your answer: ",
    correctAnswer: "Correct answer: ",
    unansweredText: "Unanswered",
    restartBtn: "Restart Quiz",
    reviewBtn: "Back to Questions",
    // 主题按钮
    themeBtnDark: "🌙",
    themeBtnLight: "☀️"
  },
  cn: {
    // 导航栏
    navHome: "首页",
    navQuiz: "测试",
    navGame: "游戏",
    langToggle: "EN",
    // 面包屑导航
    breadcrumbHome: "首页",
    breadcrumbCurrent: "测试",
    // 按钮文本
    prevBtn: "上一题",
    nextBtn: "下一题",
    submitBtn: "提交",
    // 分数显示
    scorePrefix: "得分: ",
    // 结果页面
    resultsTitle: "测试结果",
    scoreMessageHigh: "优秀！",
    scoreMessageMedium: "做得不错！",
    scoreMessageLow: "继续努力！",
    scoreDescription: "您已完成测试。请查看下面的答案回顾。",
    correctLabel: "正确",
    incorrectLabel: "错误",
    unansweredLabel: "未回答",
    yourAnswer: "您的答案: ",
    correctAnswer: "正确答案: ",
    unansweredText: "未回答",
    restartBtn: "重新开始",
    reviewBtn: "返回题目",
    // 主题按钮
    themeBtnDark: "🌙",
    themeBtnLight: "☀️"
  }
};

// DOM 元素
const navHomeEl = document.getElementById('navHome');
const navQuizEl = document.getElementById('navQuiz');
const navGameEl = document.getElementById('navGame');
const breadcrumbHomeEl = document.getElementById('breadcrumbHome');
const breadcrumbCurrentEl = document.getElementById('breadcrumbCurrent');
const questionNumberEl = document.getElementById('question-number');
const scoreEl = document.getElementById('score');
const questionTextEl = document.getElementById('question-text');
const optionsContainerEl = document.getElementById('optionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const langToggle = document.getElementById('langToggle');
const themeToggle = document.getElementById('themeToggle');
const quizContainer = document.getElementById('quizContainer');
const resultsContainer = document.getElementById('resultsContainer');
const resultsTitleEl = document.getElementById('results-title');
const finalScoreValueEl = document.getElementById('finalScoreValue');
const finalScoreTotalEl = document.getElementById('finalScoreTotal');
const scoreCircleEl = document.getElementById('scoreCircle');
const scoreMessageEl = document.getElementById('scoreMessage');
const scoreDescriptionEl = document.getElementById('scoreDescription');
const correctAnswersEl = document.getElementById('correctAnswers');
const incorrectAnswersEl = document.getElementById('incorrectAnswers');
const unansweredCountEl = document.getElementById('unansweredCount');
const correctLabelEl = document.getElementById('correctLabel');
const incorrectLabelEl = document.getElementById('incorrectLabel');
const unansweredLabelEl = document.getElementById('unansweredLabel');
const questionsReviewEl = document.getElementById('questionsReview');
const restartBtn = document.getElementById('restartBtn');
const reviewBtn = document.getElementById('reviewBtn');

// 状态变量
let currentQuestion = 0;
let score = 0;
let currentLang = 'en'; // 默认语言为英文
let isDarkMode = false; // 记录当前主题模式
let isQuizCompleted = false; // 标记测试是否完成

// 用户答案记录数组
let userAnswers = new Array(questions.length).fill(null);
// 已评分的题目数组
let scoredQuestions = new Array(questions.length).fill(false);

// 初始化页面
function initQuiz() {
  renderQuestion();
  updateNavButtons();
  updateLanguageText();
  updateThemeIcon();
  calculateScore();
}

// 更新界面文本为当前语言
function updateLanguageText() {
  const t = translations[currentLang];
  
  navHomeEl.textContent = t.navHome;
  navQuizEl.textContent = t.navQuiz;
  navGameEl.textContent = t.navGame;
  langToggle.textContent = t.langToggle;
  
  breadcrumbHomeEl.textContent = t.breadcrumbHome;
  breadcrumbCurrentEl.textContent = t.breadcrumbCurrent;
  
  prevBtn.textContent = t.prevBtn;
  nextBtn.textContent = currentQuestion === questions.length - 1 ? t.submitBtn : t.nextBtn;
  
  scoreEl.textContent = t.scorePrefix + score + '/' + questions.length;
  
  const questionNumText = currentLang === 'en' 
    ? `Question ${currentQuestion + 1}/${questions.length}`
    : `问题 ${currentQuestion + 1}/${questions.length}`;
  questionNumberEl.textContent = questionNumText;
  
  renderQuestionContent();
}

// 渲染题目和选项内容
function renderQuestionContent() {
  const q = questions[currentQuestion];
  
  questionTextEl.textContent = currentLang === 'en' ? q.question_en : q.question_cn;
  
  optionsContainerEl.innerHTML = '';
  
  const options = currentLang === 'en' ? q.options_en : q.options_cn;
  
  options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = option;
    
    if (userAnswers[currentQuestion] === index) {
      btn.classList.add('selected');
      
      if (scoredQuestions[currentQuestion]) {
        if (index === q.correct) {
          btn.classList.add('correct');
        } else {
          btn.classList.add('incorrect');
        }
      }
    } else if (scoredQuestions[currentQuestion] && index === q.correct) {
      btn.classList.add('correct');
    }
    
    btn.addEventListener('click', () => selectOption(index));
    optionsContainerEl.appendChild(btn);
  });
}

// 渲染完整题目
function renderQuestion() {
  renderQuestionContent();
  
  const questionNumText = currentLang === 'en' 
    ? `Question ${currentQuestion + 1}/${questions.length}`
    : `问题 ${currentQuestion + 1}/${questions.length}`;
  questionNumberEl.textContent = questionNumText;
  
  scoreEl.textContent = translations[currentLang].scorePrefix + score + '/' + questions.length;
}

// 选择选项
function selectOption(index) {
  userAnswers[currentQuestion] = index;
  
  calculateScore();
  
  renderQuestion();
}

// 计算总分数
function calculateScore() {
  let newScore = 0;
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userAnswer = userAnswers[i];
    
    if (userAnswer !== null) {
      if (userAnswer === q.correct) {
        newScore++;
        scoredQuestions[i] = true;
      } else {
        scoredQuestions[i] = true;
      }
    }
  }
  
  score = newScore;
}

// 显示结果页面
function showResults() {
  isQuizCompleted = true;
  
  // 计算统计数据
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userAnswer = userAnswers[i];
    
    if (userAnswer === null) {
      unansweredCount++;
    } else if (userAnswer === q.correct) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }
  
  // 更新结果页面
  const t = translations[currentLang];
  resultsTitleEl.textContent = t.resultsTitle;
  finalScoreValueEl.textContent = score;
  finalScoreTotalEl.textContent = '/' + questions.length;
  
  // 根据分数设置样式
  const percentage = (score / questions.length) * 100;
  scoreCircleEl.className = 'score-circle';
  if (percentage >= 80) {
    scoreCircleEl.classList.add('score-high');
    scoreMessageEl.textContent = t.scoreMessageHigh;
  } else if (percentage >= 50) {
    scoreCircleEl.classList.add('score-medium');
    scoreMessageEl.textContent = t.scoreMessageMedium;
  } else {
    scoreCircleEl.classList.add('score-low');
    scoreMessageEl.textContent = t.scoreMessageLow;
  }
  
  scoreDescriptionEl.textContent = t.scoreDescription;
  
  // 更新统计数据
  correctAnswersEl.textContent = correctCount;
  incorrectAnswersEl.textContent = incorrectCount;
  unansweredCountEl.textContent = unansweredCount;
  correctLabelEl.textContent = t.correctLabel;
  incorrectLabelEl.textContent = t.incorrectLabel;
  unansweredLabelEl.textContent = t.unansweredLabel;
  
  // 生成答题回顾
  questionsReviewEl.innerHTML = '';
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const userAnswer = userAnswers[i];
    const isCorrect = userAnswer === q.correct;
    const isAnswered = userAnswer !== null;
    
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('question-review-item');
    
    if (!isAnswered) {
      reviewItem.classList.add('unanswered');
    } else if (isCorrect) {
      reviewItem.classList.add('correct');
    } else {
      reviewItem.classList.add('incorrect');
    }
    
    const questionNum = currentLang === 'en' ? `Question ${i + 1}` : `问题 ${i + 1}`;
    const questionText = currentLang === 'en' ? q.question_en : q.question_cn;
    const options = currentLang === 'en' ? q.options_en : q.options_cn;
    
    let answerHtml = '';
    if (!isAnswered) {
      answerHtml = `<div class="review-answer"><strong>${t.unansweredText}</strong></div>`;
    } else if (isCorrect) {
      answerHtml = `<div class="review-answer">✓ ${t.yourAnswer} ${options[userAnswer]}</div>`;
    } else {
      answerHtml = `
        <div class="review-answer review-user-answer">✗ ${t.yourAnswer} ${options[userAnswer]}</div>
        <div class="review-answer review-correct-answer">✓ ${t.correctAnswer} ${options[q.correct]}</div>
      `;
    }
    
    reviewItem.innerHTML = `
      <div class="review-question-number">${questionNum}</div>
      <div class="review-question-text">${questionText}</div>
      ${answerHtml}
    `;
    
    questionsReviewEl.appendChild(reviewItem);
  }
  
  // 更新按钮文本
  restartBtn.textContent = t.restartBtn;
  reviewBtn.textContent = t.reviewBtn;
  
  // 切换显示
  quizContainer.style.display = 'none';
  resultsContainer.style.display = 'block';
}

// 重新开始测试
function restartQuiz() {
  // 重置所有状态
  currentQuestion = 0;
  score = 0;
  userAnswers = new Array(questions.length).fill(null);
  scoredQuestions = new Array(questions.length).fill(false);
  isQuizCompleted = false;
  
  // 重置显示
  quizContainer.style.display = 'block';
  resultsContainer.style.display = 'none';
  
  // 重新初始化
  initQuiz();
}

// 返回查看题目
function backToQuestions() {
  // 切换到第一题
  currentQuestion = 0;
  
  // 重置显示
  quizContainer.style.display = 'block';
  resultsContainer.style.display = 'none';
  
  // 重新渲染题目
  renderQuestion();
  updateNavButtons();
}

// 上一题
function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
    updateNavButtons();
  }
}

// 下一题/提交
function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
    updateNavButtons();
  } else {
    // 在最后一道题，确保所有题目都已评分
    for (let i = 0; i < questions.length; i++) {
      if (userAnswers[i] !== null && !scoredQuestions[i]) {
        scoredQuestions[i] = true;
      }
    }
    showResults();
  }
}

// 更新导航按钮状态
function updateNavButtons() {
  prevBtn.disabled = currentQuestion === 0;
  const t = translations[currentLang];
  nextBtn.textContent = currentQuestion === questions.length - 1 ? t.submitBtn : t.nextBtn;
}

// 切换语言
function toggleLanguage() {
  currentLang = currentLang === 'en' ? 'cn' : 'en';
  updateLanguageText();
  
  // 如果测试已完成，也更新结果页面的语言
  if (isQuizCompleted) {
    const t = translations[currentLang];
    resultsTitleEl.textContent = t.resultsTitle;
    scoreDescriptionEl.textContent = t.scoreDescription;
    correctLabelEl.textContent = t.correctLabel;
    incorrectLabelEl.textContent = t.incorrectLabel;
    unansweredLabelEl.textContent = t.unansweredLabel;
    restartBtn.textContent = t.restartBtn;
    reviewBtn.textContent = t.reviewBtn;
    
    // 重新生成答题回顾
    questionsReviewEl.innerHTML = '';
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const userAnswer = userAnswers[i];
      const isCorrect = userAnswer === q.correct;
      const isAnswered = userAnswer !== null;
      
      const reviewItem = document.createElement('div');
      reviewItem.classList.add('question-review-item');
      
      if (!isAnswered) {
        reviewItem.classList.add('unanswered');
      } else if (isCorrect) {
        reviewItem.classList.add('correct');
      } else {
        reviewItem.classList.add('incorrect');
      }
      
      const questionNum = currentLang === 'en' ? `Question ${i + 1}` : `问题 ${i + 1}`;
      const questionText = currentLang === 'en' ? q.question_en : q.question_cn;
      const options = currentLang === 'en' ? q.options_en : q.options_cn;
      
      let answerHtml = '';
      if (!isAnswered) {
        answerHtml = `<div class="review-answer"><strong>${t.unansweredText}</strong></div>`;
      } else if (isCorrect) {
        answerHtml = `<div class="review-answer">✓ ${t.yourAnswer} ${options[userAnswer]}</div>`;
      } else {
        answerHtml = `
          <div class="review-answer review-user-answer">✗ ${t.yourAnswer} ${options[userAnswer]}</div>
          <div class="review-answer review-correct-answer">✓ ${t.correctAnswer} ${options[q.correct]}</div>
        `;
      }
      
      reviewItem.innerHTML = `
        <div class="review-question-number">${questionNum}</div>
        <div class="review-question-text">${questionText}</div>
        ${answerHtml}
      `;
      
      questionsReviewEl.appendChild(reviewItem);
    }
  }
}

// 更新主题图标
function updateThemeIcon() {
  const t = translations[currentLang];
  themeToggle.textContent = isDarkMode ? t.themeBtnLight : t.themeBtnDark;
}

// 主题切换
function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode');
  updateThemeIcon();
}

// 事件监听
langToggle.addEventListener('click', toggleLanguage);
themeToggle.addEventListener('click', toggleTheme);
prevBtn.addEventListener('click', prevQuestion);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartQuiz);
reviewBtn.addEventListener('click', backToQuestions);

// 初始化
initQuiz();