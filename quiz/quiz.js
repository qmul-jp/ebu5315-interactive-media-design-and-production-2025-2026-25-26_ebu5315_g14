// quiz.js - 完整的交互逻辑

// ==================== 分数配置 ====================
const difficultyScores = {
  easy: 1,    // 简单题每题1分
  medium: 2,  // 中等题每题2分
  hard: 3     // 困难题每题3分
};

// ==================== 题库数据 ====================
const questionBank = {
  easy: [
    {
      question_en: "What is the radius of a circle with equation x² + y² = 25?",
      question_cn: "圆 x² + y² = 25 的半径是多少？",
      options_en: ["5", "10", "25", "50"],
      options_cn: ["5", "10", "25", "50"],
      correct: 0,
      explanation_en: "The standard equation of a circle is x² + y² = r², where r is the radius. Given x² + y² = 25, we have r² = 25, so r = √25 = 5.",
      explanation_cn: "圆的标准方程为 x² + y² = r²，其中 r 是半径。由 x² + y² = 25 可得 r² = 25，因此 r = √25 = 5。"
    },
    {
      question_en: "Which of the following is the formula for the area of a circle?",
      question_cn: "下列哪个是圆的面积公式？",
      options_en: ["πr", "πr²", "2πr", "πd"],
      options_cn: ["πr", "πr²", "2πr", "πd"],
      correct: 1,
      explanation_en: "The area of a circle is given by A = πr², where r is the radius.",
      explanation_cn: "圆的面积公式为 A = πr²，其中 r 是半径。"
    },
    {
      question_en: "The diameter of a circle is 12. What is its circumference?",
      question_cn: "圆的直径是12，它的周长是多少？",
      options_en: ["12π", "24π", "6π", "36π"],
      options_cn: ["12π", "24π", "6π", "36π"],
      correct: 1,
      explanation_en: "Circumference = πd = π × 12 = 12π.",
      explanation_cn: "圆的周长 = πd = π × 12 = 12π。"
    },
    {
      question_en: "In a circle, the angle subtended by a diameter at the circumference is a ______ angle.",
      question_cn: "在圆中，直径在圆周上所对的角是______角。",
      options_en: ["acute", "right", "obtuse", "reflex"],
      options_cn: ["锐角", "直角", "钝角", "优角"],
      correct: 1,
      explanation_en: "The angle in a semicircle is always a right angle (90°).",
      explanation_cn: "半圆内的角总是直角（90°）。"
    },
    {
      question_en: "What is the equation of a circle with center (3, -2) and radius 4?",
      question_cn: "圆心为(3, -2)，半径为4的圆方程是什么？",
      options_en: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      options_cn: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      correct: 0,
      explanation_en: "Standard equation: (x-h)² + (y-k)² = r². Here h=3, k=-2, r=4, so (x-3)² + (y+2)² = 16.",
      explanation_cn: "标准方程：(x-h)² + (y-k)² = r²。这里 h=3, k=-2, r=4，所以 (x-3)² + (y+2)² = 16。"
    },
    {
      question_en: "A circle's radius is 3. What is its area?",
      question_cn: "圆的半径为3，面积是多少？",
      options_en: ["3π", "6π", "9π", "12π"],
      options_cn: ["3π", "6π", "9π", "12π"],
      correct: 2,
      explanation_en: "Area = πr² = π × 3² = 9π.",
      explanation_cn: "面积 = πr² = π × 3² = 9π。"
    },
    {
      question_en: "What is a chord?",
      question_cn: "什么是弦？",
      options_en: ["Line from center to edge", "Line through center", "Line connecting two points on circle", "Tangent line"],
      options_cn: ["从圆心到边缘的线", "穿过圆心的线", "连接圆上两点的线", "切线"],
      correct: 2,
      explanation_en: "A chord is a straight line segment whose endpoints both lie on the circle.",
      explanation_cn: "弦是连接圆上两点的直线段。"
    },
    {
      question_en: "A circle's area is 16π. What is radius?",
      question_cn: "圆的面积是16π，半径是多少？",
      options_en: ["2", "4", "8", "16"],
      options_cn: ["2", "4", "8", "16"],
      correct: 1,
      explanation_en: "Area = πr² = 16π → r² = 16 → r = 4.",
      explanation_cn: "面积 = πr² = 16π → r² = 16 → r = 4。"
    },
    {
      question_en: "How many tangents from an external point?",
      question_cn: "从圆外一点可以作多少条切线？",
      options_en: ["1", "2", "3", "4"],
      options_cn: ["1", "2", "3", "4"],
      correct: 1,
      explanation_en: "From an external point, exactly two tangents can be drawn to a circle.",
      explanation_cn: "从圆外一点可以作两条切线。"
    },
    {
      question_en: "Circumference is 20π. What is diameter?",
      question_cn: "周长是20π，直径是多少？",
      options_en: ["5", "10", "20", "40"],
      options_cn: ["5", "10", "20", "40"],
      correct: 2,
      explanation_en: "Circumference = πd = 20π → d = 20.",
      explanation_cn: "周长 = πd = 20π → d = 20。"
    }
  ],
  medium: [
    {
      question_en: "Two chords are equal if they are equidistant from the ______.",
      question_cn: "如果两条弦到______距离相等，则它们长度相等。",
      options_en: ["center", "edge", "tangent point", "diameter"],
      options_cn: ["圆心", "边缘", "切点", "直径"],
      correct: 0,
      explanation_en: "Equal chords of a circle are equidistant from the center.",
      explanation_cn: "圆的等弦到圆心的距离相等。"
    },
    {
      question_en: "The angle in a semicircle is always ______ degrees.",
      question_cn: "半圆内的角总是______度。",
      options_en: ["45", "90", "180", "360"],
      options_cn: ["45", "90", "180", "360"],
      correct: 1,
      explanation_en: "The angle in a semicircle is always 90° (right angle).",
      explanation_cn: "半圆内的角总是90°（直角）。"
    },
    {
      question_en: "A tangent to a circle is perpendicular to the ______ at the point of contact.",
      question_cn: "圆的切线在切点处垂直于______。",
      options_en: ["chord", "diameter", "radius", "arc"],
      options_cn: ["弦", "直径", "半径", "弧"],
      correct: 2,
      explanation_en: "A tangent is perpendicular to the radius at the point of contact.",
      explanation_cn: "切线在切点处垂直于半径。"
    },
    {
      question_en: "The measure of a central angle is ______ the measure of its intercepted arc.",
      question_cn: "圆心角的度数______它所对弧的度数。",
      options_en: ["half of", "equal to", "twice", "unrelated to"],
      options_cn: ["等于一半", "等于", "两倍", "无关"],
      correct: 1,
      explanation_en: "A central angle has the same measure as its intercepted arc.",
      explanation_cn: "圆心角与其所对弧的度数相等。"
    },
    {
      question_en: "An inscribed angle that intercepts a diameter is always ______.",
      question_cn: "对直径的圆周角总是______。",
      options_en: ["acute", "right", "obtuse", "straight"],
      options_cn: ["锐角", "直角", "钝角", "平角"],
      correct: 1,
      explanation_en: "An inscribed angle intercepting a diameter is always a right angle.",
      explanation_cn: "对直径的圆周角总是直角。"
    },
    {
      question_en: "Two tangents drawn from an external point to a circle are ______ in length.",
      question_cn: "从圆外一点作的两条切线长度______。",
      options_en: ["equal", "different", "parallel", "perpendicular"],
      options_cn: ["相等", "不同", "平行", "垂直"],
      correct: 0,
      explanation_en: "Tangents from an external point to a circle are equal in length.",
      explanation_cn: "从圆外一点作的两条切线长度相等。"
    },
    {
      question_en: "Angles in the same segment of a circle are ______.",
      question_cn: "同弧所对的圆周角______。",
      options_en: ["complementary", "supplementary", "equal", "unequal"],
      options_cn: ["互余", "互补", "相等", "不相等"],
      correct: 2,
      explanation_en: "Angles in the same segment (subtended by the same arc) are equal.",
      explanation_cn: "同弧所对的圆周角相等。"
    },
    {
      question_en: "The product of segments of intersecting chords is ______.",
      question_cn: "相交弦定理：两条相交弦被交点分成的两段长度乘积______。",
      options_en: ["different", "equal", "unrelated", "proportional"],
      options_cn: ["不同", "相等", "无关", "成比例"],
      correct: 1,
      explanation_en: "For intersecting chords, the products of the segments are equal.",
      explanation_cn: "相交弦定理：两条相交弦被交点分成的两段长度乘积相等。"
    },
    {
      question_en: "Angle between tangent and chord through point of contact equals angle in ______ segment.",
      question_cn: "切线和过切点的弦所夹的角等于______的圆周角。",
      options_en: ["alternate", "opposite", "same", "complementary"],
      options_cn: ["交错", "对顶", "同侧", "互补"],
      correct: 0,
      explanation_en: "The angle between a tangent and a chord equals the angle in the alternate segment.",
      explanation_cn: "切线和过切点的弦所夹的角等于交错弧上的圆周角。"
    },
    {
      question_en: "Circle with center (0,0) passes through (3,4). What is radius?",
      question_cn: "圆心在(0,0)且过点(3,4)的圆，半径是多少？",
      options_en: ["3", "4", "5", "7"],
      options_cn: ["3", "4", "5", "7"],
      correct: 2,
      explanation_en: "Radius = distance from (0,0) to (3,4) = √(3²+4²) = √(9+16) = √25 = 5.",
      explanation_cn: "半径 = 点(0,0)到(3,4)的距离 = √(3²+4²) = √(9+16) = √25 = 5。"
    }
  ],
  hard: [
    {
      question_en: "What is the equation of a circle with center (3, -2) and radius 4?",
      question_cn: "圆心为(3, -2)，半径为4的圆方程是什么？",
      options_en: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      options_cn: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      correct: 0,
      explanation_en: "Standard equation: (x-h)² + (y-k)² = r². Here h=3, k=-2, r=4, so (x-3)² + (y+2)² = 16.",
      explanation_cn: "标准方程：(x-h)² + (y-k)² = r²。这里 h=3, k=-2, r=4，所以 (x-3)² + (y+2)² = 16。"
    },
    {
      question_en: "Angle between tangents from (1,√3) to circle x²+y²=4 is?",
      question_cn: "从点(1,√3)到圆x²+y²=4的两条切线夹角是多少？",
      options_en: ["30°", "60°", "90°", "120°"],
      options_cn: ["30°", "60°", "90°", "120°"],
      correct: 1,
      explanation_en: "Distance from point to center = √(1²+√3²)=2. Radius=2, so distance = radius → point on circle. The angle between tangents is 60°.",
      explanation_cn: "点到圆心距离 = √(1²+√3²)=2。半径=2，所以点在圆上。两条切线夹角为60°。"
    },
    {
      question_en: "Radical axis of circles x²+y²-4x+6y=0 and x²+y²+2x-8y+1=0 is:",
      question_cn: "圆x²+y²-4x+6y=0和x²+y²+2x-8y+1=0的根轴是：",
      options_en: ["6x-14y+1=0", "6x+14y-1=0", "3x-7y+1=0", "3x+7y-1=0"],
      options_cn: ["6x-14y+1=0", "6x+14y-1=0", "3x-7y+1=0", "3x+7y-1=0"],
      correct: 0,
      explanation_en: "Subtract equations: (x²+y²-4x+6y) - (x²+y²+2x-8y+1)=0 → -4x+6y-2x+8y-1=0 → -6x+14y-1=0 → 6x-14y+1=0.",
      explanation_cn: "两方程相减：(x²+y²-4x+6y) - (x²+y²+2x-8y+1)=0 → -4x+6y-2x+8y-1=0 → -6x+14y-1=0 → 6x-14y+1=0。"
    },
    {
      question_en: "Common chord of circles x²+y²=16 and (x-4)²+y²=16 has length?",
      question_cn: "圆x²+y²=16和(x-4)²+y²=16的公共弦长度是多少？",
      options_en: ["4√3", "8", "8√3", "16"],
      options_cn: ["4√3", "8", "8√3", "16"],
      correct: 0,
      explanation_en: "Centers: (0,0) and (4,0), radii=4. Distance=4 → circles touch externally. Common chord length = 4√3.",
      explanation_cn: "圆心：(0,0)和(4,0)，半径=4。圆心距=4 → 两圆外切。公共弦长=4√3。"
    },
    {
      question_en: "Circle passing through (1,0), (0,1), (2,1) has center:",
      question_cn: "过点(1,0), (0,1), (2,1)的圆的圆心是：",
      options_en: ["(1,1)", "(1.5,1.5)", "(1,2)", "(0.5,0.5)"],
      options_cn: ["(1,1)", "(1.5,1.5)", "(1,2)", "(0.5,0.5)"],
      correct: 0,
      explanation_en: "Using perpendicular bisectors: center is intersection of bisectors of chords. Midpoints: (0.5,0.5) and (1,1). Center = (1,1).",
      explanation_cn: "使用中垂线法：圆心是弦中垂线的交点。中点：(0.5,0.5)和(1,1)。圆心=(1,1)。"
    }
  ]
};

// ==================== 翻译数据 ====================
const translations = {
  en: {
    logo: "CircleLab",
    navHome: "Homepage",
    navQuiz: "Quiz",
    navGame: "Game",
    a11yToggle: "Accessibility",
    colorSafe: "Color Safe",
    langToggle: "中文",
    breadcrumb: "homepage > quiz",
    diffPrompt: "Select Difficulty Level",
    diffEasy: "Easy",
    diffMedium: "Medium",
    diffHard: "Hard",
    prevBtn: "Previous",
    nextBtn: "Next",
    submitBtn: "Submit",
    scorePrefix: "Score: ",
    quizComplete: "Quiz completed! Your final score: ",
    themeDay: "Switch to night mode",
    themeNight: "Switch to day mode",
    points: "points",
    correct: "Correct!",
    incorrect: "Incorrect",
    correctAnswer: "Correct answer:",
    explanation: "Explanation:"
  },
  cn: {
    logo: "CircleLab",
    navHome: "首页",
    navQuiz: "测试",
    navGame: "游戏",
    a11yToggle: "无障碍",
    colorSafe: "色盲友好",
    langToggle: "EN",
    breadcrumb: "首页 > 测试",
    diffPrompt: "请选择难度等级",
    diffEasy: "简单",
    diffMedium: "中等",
    diffHard: "困难",
    prevBtn: "上一题",
    nextBtn: "下一题",
    submitBtn: "提交",
    scorePrefix: "得分: ",
    quizComplete: "测试完成！您的最终得分: ",
    themeDay: "切换到夜间模式",
    themeNight: "切换到日间模式",
    points: "分",
    correct: "回答正确！",
    incorrect: "回答错误",
    correctAnswer: "正确答案：",
    explanation: "解析："
  }
};

// ==================== DOM 元素 ====================
// 导航元素
const logoImg = document.getElementById('logoImg');
const navHomeEl = document.getElementById('navHome');
const navQuizEl = document.getElementById('navQuiz');
const navGameEl = document.getElementById('navGame');
const breadcrumbEl = document.getElementById('breadcrumb');
const navbarEl = document.querySelector('.navbar');
const langToggle = document.getElementById('langToggle');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');
const a11yToggleBtn = document.getElementById('a11yToggleBtn');
const a11yPanel = document.getElementById('a11yPanel');
const fontDownBtn = document.getElementById('fontDownBtn');
const fontResetBtn = document.getElementById('fontResetBtn');
const fontUpBtn = document.getElementById('fontUpBtn');
const colorSafeToggle = document.getElementById('colorSafeToggle');

// 难度选择元素
const difficultySelectorEl = document.getElementById('difficultySelector');
const diffPromptEl = document.getElementById('diffPrompt');
const diffEasyBtn = document.getElementById('diffEasy');
const diffMediumBtn = document.getElementById('diffMedium');
const diffHardBtn = document.getElementById('diffHard');

// 测验元素
const quizHeaderEl = document.getElementById('quizHeader');
const questionNumberEl = document.getElementById('question-number');
const scoreEl = document.getElementById('score');
const pointsPerQuestionEl = document.getElementById('points-per-question');
const questionTextEl = document.getElementById('question-text');
const optionsContainerEl = document.getElementById('optionsContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const navButtonsEl = document.getElementById('navButtons');

// ==================== 状态变量 ====================
let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let currentLang = localStorage.getItem('language') || 'en';
let selectedDifficulty = null;
let currentQuizSet = [];
let userAnswers = []; // 存储用户答案
let hasInitialized = false;
let showFeedback = false;
let currentFeedback = { isCorrect: false, explanation: '' };

// ==================== 初始化函数 ====================
function init() {
  if (hasInitialized) {
    return;
  }
  hasInitialized = true;

  console.log("Quiz page initializing...");
  
  // 1. 恢复语言设置
  updateLanguageText();

  // 同步固定导航条高度
  syncNavbarOffset();
  window.addEventListener('resize', scheduleNavbarOffsetSync);
  window.addEventListener('orientationchange', scheduleNavbarOffsetSync);
  
  // 2. 恢复主题设置
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    themeToggle.title = currentLang === 'en' ? translations[currentLang].themeNight : translations.cn.themeNight;
  } else {
    themeToggle.title = currentLang === 'en' ? translations[currentLang].themeDay : translations.cn.themeDay;
  }
  
  // 3. 显示难度选择器
  showDifficultySelector();
  
  // 4. 设置事件监听器
  setupEventListeners();

  // 5. 初始化无障碍功能
  setupAccessibilityControls();
  
  console.log("Quiz page initialized successfully!");
}

function syncNavbarOffset() {
  if (!navbarEl) {
    return;
  }
  const navHeight = Math.ceil(navbarEl.getBoundingClientRect().height);
  document.body.style.setProperty('--nav-offset', `${navHeight + 8}px`);
}

function scheduleNavbarOffsetSync() {
  requestAnimationFrame(syncNavbarOffset);
}

// ==================== 难度选择功能 ====================
function showDifficultySelector() {
  console.log("Showing difficulty selector");
  difficultySelectorEl.style.display = 'block';
  quizHeaderEl.style.display = 'none';
  questionTextEl.style.display = 'none';
  optionsContainerEl.style.display = 'none';
  navButtonsEl.style.display = 'none';
  
  // 重置测验状态
  currentQuizSet = [];
  currentQuestion = 0;
  score = 0;
  selectedOption = null;
  showFeedback = false;
  userAnswers = [];
  
  // 隐藏分值说明
  if (pointsPerQuestionEl) {
    pointsPerQuestionEl.style.display = 'none';
  }
  
  // 更新按钮文本
  updateNavButtons();
}

function getRandomQuestions(difficulty) {
  console.log(`Getting random questions for difficulty: ${difficulty}`);
  const allQuestions = [...questionBank[difficulty]];
  const selected = [];
  
  for (let i = 0; i < 5 && allQuestions.length > 0; i++) {
    const randomIndex = Math.floor(Math.random() * allQuestions.length);
    selected.push(allQuestions.splice(randomIndex, 1)[0]);
  }
  
  console.log(`Selected ${selected.length} questions`);
  return selected;
}

function startQuizWithDifficulty(difficulty) {
  console.log(`Starting quiz with difficulty: ${difficulty}`);
  selectedDifficulty = difficulty;
  currentQuizSet = getRandomQuestions(difficulty);
  
  if (currentQuizSet.length === 0) {
    alert(currentLang === 'en' ? 'No questions available for this difficulty.' : '此难度没有可用的题目。');
    return;
  }
  
  // 隐藏难度选择器，显示测验区域
  difficultySelectorEl.style.display = 'none';
  quizHeaderEl.style.display = 'flex';
  questionTextEl.style.display = 'block';
  optionsContainerEl.style.display = 'grid';
  navButtonsEl.style.display = 'flex';
  
  // 显示每道题的分值
  if (pointsPerQuestionEl) {
    const points = difficultyScores[difficulty];
    pointsPerQuestionEl.style.display = 'inline';
    pointsPerQuestionEl.textContent = currentLang === 'en' 
      ? `(${points} point${points > 1 ? 's' : ''} per question)` 
      : `(每题${points}分)`;
  }
  
  // 重置状态
  currentQuestion = 0;
  score = 0;
  selectedOption = null;
  showFeedback = false;
  userAnswers = new Array(currentQuizSet.length).fill(null);
  
  // 渲染第一题
  renderQuestion();
  updateNavButtons();
  updateLanguageText();
  
  console.log(`Quiz started with ${currentQuizSet.length} ${difficulty} questions`);
  console.log(`Points per question: ${difficultyScores[difficulty]}`);
}

// ==================== 语言切换功能 ====================
function updateLanguageText() {
  console.log(`Updating language text to: ${currentLang}`);
  const t = translations[currentLang];
  
  // 导航和通用文本
  navHomeEl.textContent = t.navHome;
  navQuizEl.textContent = t.navQuiz;
  navGameEl.textContent = t.navGame;
  langToggle.textContent = t.langToggle;
  if (breadcrumbEl) {
    const homeLabel = currentLang === 'en' ? 'Homepage' : '首页';
    breadcrumbEl.innerHTML = `<a href="../Homepage/index.html">${homeLabel}</a> &gt; ${t.navQuiz}`;
  }
  prevBtn.textContent = t.prevBtn;

  if (a11yToggleBtn) {
    a11yToggleBtn.textContent = t.a11yToggle;
  }

  if (colorSafeToggle) {
    colorSafeToggle.textContent = t.colorSafe;
  }
  
  // 难度选择器文本
  diffPromptEl.textContent = t.diffPrompt;
  diffEasyBtn.textContent = t.diffEasy;
  diffMediumBtn.textContent = t.diffMedium;
  diffHardBtn.textContent = t.diffHard;
  
  // 主题按钮标题
  const isDarkMode = document.body.classList.contains('dark-mode');
  themeToggle.title = isDarkMode ? t.themeNight : t.themeDay;
  
  // 如果正在进行测验，更新测验相关文本
  if (currentQuizSet.length > 0) {
    renderQuestionContent();
    const questionNumText = currentLang === 'en'
      ? `Question ${currentQuestion + 1}/${currentQuizSet.length}`
      : `问题 ${currentQuestion + 1}/${currentQuizSet.length}`;
    questionNumberEl.textContent = questionNumText;
    updateScoreDisplay();
    
    // 更新下一题按钮文本
    nextBtn.textContent = currentQuestion === currentQuizSet.length - 1 ? t.submitBtn : t.nextBtn;
    
    // 更新下一题按钮的类
    if (currentQuestion === currentQuizSet.length - 1) {
      nextBtn.classList.add('submit');
    } else {
      nextBtn.classList.remove('submit');
    }
    
    // 更新每道题的分值说明
    if (pointsPerQuestionEl) {
      const points = difficultyScores[selectedDifficulty];
      pointsPerQuestionEl.textContent = currentLang === 'en' 
        ? `(${points} point${points > 1 ? 's' : ''} per question)` 
        : `(每题${points}分)`;
    }
    
    // 更新反馈区域
    const feedbackEl = document.getElementById('feedback-area');
    if (feedbackEl) {
      const q = currentQuizSet[currentQuestion];
      if (selectedOption !== null) {
        const isCorrect = selectedOption === q.correct;
        
        if (isCorrect) {
          feedbackEl.querySelector('.feedback-correct span:first-child').textContent = 
            currentLang === 'en' ? 'Correct!' : '回答正确！';
          feedbackEl.querySelector('.points-earned').textContent = 
            `+${difficultyScores[selectedDifficulty]} ${currentLang === 'en' ? 'points' : '分'}`;
        } else {
          feedbackEl.querySelector('.feedback-incorrect .feedback-header span').textContent = 
            currentLang === 'en' ? 'Incorrect' : '回答错误';
          feedbackEl.querySelector('.correct-answer strong').textContent = 
            currentLang === 'en' ? 'Correct answer:' : '正确答案：';
          feedbackEl.querySelector('.correct-answer span').textContent = 
            currentLang === 'en' ? q.options_en[q.correct] : q.options_cn[q.correct];
          feedbackEl.querySelector('.explanation-text strong').textContent = 
            currentLang === 'en' ? 'Explanation:' : '解析：';
          feedbackEl.querySelector('.explanation-text p').textContent = 
            currentLang === 'en' ? q.explanation_en : q.explanation_cn;
        }
      }
    }
  }

  scheduleNavbarOffsetSync();
}

function toggleLanguage() {
  console.log("Toggling language");
  currentLang = currentLang === 'en' ? 'cn' : 'en';
  localStorage.setItem('language', currentLang);
  updateLanguageText();
}

// ==================== 主题切换功能 ====================
function toggleTheme() {
  console.log("Toggling theme");
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  if (isDarkMode) {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  } else {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  }
  
  themeToggle.title = isDarkMode 
    ? (currentLang === 'en' ? translations.en.themeNight : translations.cn.themeNight)
    : (currentLang === 'en' ? translations.en.themeDay : translations.cn.themeDay);
}

// ==================== 测验功能 ====================
function renderQuestionContent() {
  console.log(`Rendering question ${currentQuestion + 1}`);
  if (currentQuizSet.length === 0) return;
  
  const q = currentQuizSet[currentQuestion];
  questionTextEl.textContent = currentLang === 'en' ? q.question_en : q.question_cn;
  optionsContainerEl.innerHTML = '';
  
  const options = currentLang === 'en' ? q.options_en : q.options_cn;
  options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.classList.add('option-btn');
    btn.textContent = option;
    btn.disabled = false;
    
    if (userAnswers[currentQuestion] === index) {
      btn.classList.add('selected');
    }
    
    btn.addEventListener('click', () => selectOption(index));
    optionsContainerEl.appendChild(btn);
  });
}

function renderQuestion() {
  // 重置反馈状态
  showFeedback = false;
  selectedOption = userAnswers[currentQuestion];
  
  // 清除之前的反馈区域
  const existingFeedback = document.getElementById('feedback-area');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  // 渲染题目内容
  renderQuestionContent();
  
  // 更新题号
  const questionNumText = currentLang === 'en'
    ? `Question ${currentQuestion + 1}/${currentQuizSet.length}`
    : `问题 ${currentQuestion + 1}/${currentQuizSet.length}`;
  questionNumberEl.textContent = questionNumText;
  
  // 更新分数显示
  updateScoreDisplay();
  
  // 如果有之前的答案，显示反馈
  if (selectedOption !== null) {
    checkAnswerAndProvideFeedback();
  }
  
  // 恢复之前的选择
  if (selectedOption !== null) {
    const options = optionsContainerEl.querySelectorAll('.option-btn');
    options.forEach((btn, i) => {
      btn.disabled = false;
      if (i === selectedOption) {
        btn.classList.add('selected');
      }
    });
    
    if (showFeedback) {
      renderFeedback();
    }
  }
  
  updateNavButtons();
}

function selectOption(index) {
  console.log(`Selected option ${index} for question ${currentQuestion + 1}`);
  selectedOption = index;
  userAnswers[currentQuestion] = index;
  
  const options = optionsContainerEl.querySelectorAll('.option-btn');
  options.forEach((btn, i) => {
    btn.classList.remove('selected', 'correct', 'incorrect');
    if (i === index) {
      btn.classList.add('selected');
    }
  });
  
  // 检查答案并给出反馈
  checkAnswerAndProvideFeedback();
  calculateScore();
  
  if (currentQuestion === currentQuizSet.length - 1) {
    updateScoreDisplay();
  }
}

function checkAnswerAndProvideFeedback() {
  if (selectedOption === null) return;
  
  const q = currentQuizSet[currentQuestion];
  const isCorrect = selectedOption === q.correct;
  const options = optionsContainerEl.querySelectorAll('.option-btn');
  
  // 标记正确和错误答案
  options.forEach((btn, i) => {
    if (i === q.correct) {
      btn.classList.add('correct');
    } else if (i === selectedOption && !isCorrect) {
      btn.classList.add('incorrect');
    }
  });
  
  // 准备反馈信息
  currentFeedback = {
    isCorrect: isCorrect,
    explanation: currentLang === 'en' ? q.explanation_en : q.explanation_cn,
    correctAnswer: currentLang === 'en' ? q.options_en[q.correct] : q.options_cn[q.correct]
  };
  
  // 显示反馈区域
  showFeedback = true;
  renderFeedback();
  
  // 禁用所有选项按钮
  options.forEach(btn => {
    btn.disabled = true;
  });
  
  console.log(`Answer ${isCorrect ? 'correct' : 'incorrect'}`);
}

function renderFeedback() {
  const existingFeedback = document.getElementById('feedback-area');
  if (existingFeedback) {
    existingFeedback.remove();
  }
  
  if (!showFeedback || selectedOption === null) return;
  
  const feedbackEl = document.createElement('div');
  feedbackEl.id = 'feedback-area';
  feedbackEl.className = 'feedback-area';
  
  const t = translations[currentLang];
  const q = currentQuizSet[currentQuestion];
  const isCorrect = selectedOption === q.correct;
  
  let feedbackHTML = '';
  
  if (isCorrect) {
    feedbackHTML = `
      <div class="feedback-correct">
        <i class="fas fa-check-circle"></i>
        <span>${currentLang === 'en' ? 'Correct!' : '回答正确！'}</span>
        <span class="points-earned">+${difficultyScores[selectedDifficulty]} ${currentLang === 'en' ? 'points' : '分'}</span>
      </div>
    `;
  } else {
    feedbackHTML = `
      <div class="feedback-incorrect">
        <div class="feedback-header">
          <i class="fas fa-times-circle"></i>
          <span>${currentLang === 'en' ? 'Incorrect' : '回答错误'}</span>
        </div>
        <div class="feedback-explanation">
          <div class="correct-answer">
            <strong>${currentLang === 'en' ? 'Correct answer:' : '正确答案：'}</strong>
            <span>${currentLang === 'en' ? q.options_en[q.correct] : q.options_cn[q.correct]}</span>
          </div>
          <div class="explanation-text">
            <strong>${currentLang === 'en' ? 'Explanation:' : '解析：'}</strong>
            <p>${currentLang === 'en' ? q.explanation_en : q.explanation_cn}</p>
          </div>
        </div>
      </div>
    `;
  }
  
  feedbackEl.innerHTML = feedbackHTML;
  
  if (optionsContainerEl.nextSibling) {
    optionsContainerEl.parentNode.insertBefore(feedbackEl, optionsContainerEl.nextSibling);
  } else {
    optionsContainerEl.parentNode.appendChild(feedbackEl);
  }
}

function calculateScore() {
  let newScore = 0;
  for (let i = 0; i < currentQuizSet.length; i++) {
    if (userAnswers[i] === currentQuizSet[i].correct) {
      newScore += difficultyScores[selectedDifficulty];
    }
  }
  
  if (score !== newScore) {
    score = newScore;
    updateScoreDisplay();
  }
}

function updateScoreDisplay() {
  const t = translations[currentLang];
  const totalPossible = currentQuizSet.length * difficultyScores[selectedDifficulty];
  scoreEl.textContent = t.scorePrefix + score + '/' + totalPossible;
  console.log(`Score updated to: ${score}/${totalPossible}`);
}

function prevQuestion() {
  console.log("Going to previous question");
  if (currentQuestion > 0) {
    currentQuestion--;
    selectedOption = userAnswers[currentQuestion];
    renderQuestion();
    updateNavButtons();
  }
}

function nextQuestion() {
  console.log("Going to next question or submitting");
  if (currentQuestion < currentQuizSet.length - 1) {
    currentQuestion++;
    selectedOption = userAnswers[currentQuestion];
    renderQuestion();
    updateNavButtons();
  } else {
    // 完成测验
    calculateScore();
    const totalPossible = currentQuizSet.length * difficultyScores[selectedDifficulty];
    const finalScore = `${score}/${totalPossible}`;
    const t = translations[currentLang];
    alert(t.quizComplete + finalScore);
    
    setTimeout(() => {
      showDifficultySelector();
      updateLanguageText();
    }, 1000);
  }
}

function updateNavButtons() {
  prevBtn.disabled = currentQuestion === 0;
  const t = translations[currentLang];
  nextBtn.textContent = currentQuestion === currentQuizSet.length - 1 ? t.submitBtn : t.nextBtn;
  
  if (currentQuestion === currentQuizSet.length - 1) {
    nextBtn.classList.add('submit');
  } else {
    nextBtn.classList.remove('submit');
  }
}

// ==================== 事件监听器设置 ====================
function setupEventListeners() {
  console.log("Setting up event listeners");
  
  diffEasyBtn.addEventListener('click', () => startQuizWithDifficulty('easy'));
  diffMediumBtn.addEventListener('click', () => startQuizWithDifficulty('medium'));
  diffHardBtn.addEventListener('click', () => startQuizWithDifficulty('hard'));
  
  prevBtn.addEventListener('click', prevQuestion);
  nextBtn.addEventListener('click', nextQuestion);
  
  langToggle.addEventListener('click', toggleLanguage);
  themeToggle.addEventListener('click', toggleTheme);
  
  console.log("Event listeners set up successfully");
}

// ==================== 无障碍功能 ====================
function applyFontScale(scale) {
  document.body.classList.remove('font-small', 'font-normal', 'font-large');
  document.body.classList.add(`font-${scale}`);
  localStorage.setItem('fontScale', scale);
}

function setupAccessibilityControls() {
  if (!a11yToggleBtn || !a11yPanel || !fontDownBtn || !fontResetBtn || !fontUpBtn || !colorSafeToggle) {
    return;
  }

  const setPanelOpen = open => {
    a11yPanel.classList.toggle('open', open);
    a11yToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  a11yToggleBtn.addEventListener('click', event => {
    event.stopPropagation();
    setPanelOpen(!a11yPanel.classList.contains('open'));
  });

  a11yPanel.addEventListener('click', event => {
    event.stopPropagation();
  });

  document.addEventListener('click', () => {
    setPanelOpen(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      setPanelOpen(false);
    }
  });

  fontDownBtn.addEventListener('click', () => applyFontScale('small'));
  fontResetBtn.addEventListener('click', () => applyFontScale('normal'));
  fontUpBtn.addEventListener('click', () => applyFontScale('large'));

  colorSafeToggle.addEventListener('click', () => {
    const enabled = !document.body.classList.contains('color-safe');
    document.body.classList.toggle('color-safe', enabled);
    localStorage.setItem('colorSafeMode', enabled ? 'true' : 'false');
  });

  const storedScale = localStorage.getItem('fontScale') || 'normal';
  applyFontScale(storedScale);

  const storedColorSafe = localStorage.getItem('colorSafeMode') === 'true';
  document.body.classList.toggle('color-safe', storedColorSafe);
  setPanelOpen(false);
}

// ==================== 页面加载初始化 ====================
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded, initializing quiz...");
  try {
    init();
  } catch (error) {
    console.error("Error during initialization:", error);
    alert("初始化出错，请刷新页面重试。");
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}