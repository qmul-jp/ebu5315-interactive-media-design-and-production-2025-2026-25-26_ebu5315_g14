// quiz.js - 完整的交互逻辑

// ==================== 题库数据 ====================
const questionBank = {
  easy: [
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
    },
    {
      question_en: "A circle's radius is 3. What is its area?",
      question_cn: "圆的半径为3，面积是多少？",
      options_en: ["3π", "6π", "9π", "12π"],
      options_cn: ["3π", "6π", "9π", "12π"],
      correct: 2
    },
    {
      question_en: "What is a chord?",
      question_cn: "什么是弦？",
      options_en: ["Line from center to edge", "Line through center", "Line connecting two points on circle", "Tangent line"],
      options_cn: ["从圆心到边缘的线", "穿过圆心的线", "连接圆上两点的线", "切线"],
      correct: 2
    },
    {
      question_en: "A circle's area is 16π. What is radius?",
      question_cn: "圆的面积是16π，半径是多少？",
      options_en: ["2", "4", "8", "16"],
      options_cn: ["2", "4", "8", "16"],
      correct: 1
    },
    {
      question_en: "How many tangents from an external point?",
      question_cn: "从圆外一点可以作多少条切线？",
      options_en: ["1", "2", "3", "4"],
      options_cn: ["1", "2", "3", "4"],
      correct: 1
    },
    {
      question_en: "Circumference is 20π. What is diameter?",
      question_cn: "周长是20π，直径是多少？",
      options_en: ["5", "10", "20", "40"],
      options_cn: ["5", "10", "20", "40"],
      correct: 2
    },
    {
      question_en: "Radius 6. What is area?",
      question_cn: "半径为6，面积是多少？",
      options_en: ["12π", "24π", "36π", "72π"],
      options_cn: ["12π", "24π", "36π", "72π"],
      correct: 2
    },
    {
      question_en: "What is π approximately equal to?",
      question_cn: "π 约等于多少？",
      options_en: ["2.14", "3.14", "3.41", "4.13"],
      options_cn: ["2.14", "3.14", "3.41", "4.13"],
      correct: 1
    },
    {
      question_en: "How many right angles are in a circle?",
      question_cn: "一个圆中有几个直角？",
      options_en: ["0", "4", "8", "Infinite"],
      options_cn: ["0", "4", "8", "无限"],
      correct: 3
    },
    {
      question_en: "What is the center of a circle?",
      question_cn: "什么是圆的圆心？",
      options_en: ["Midpoint", "Edge point", "Any point", "Center point equidistant from all points on circle"],
      options_cn: ["中点", "边缘点", "任意点", "到圆上所有点距离相等的点"],
      correct: 3
    },
    {
      question_en: "A chord of length 24 is at a distance 5 from the center. What is the radius?",
      question_cn: "一条弦长24，到圆心距离为5，求半径。",
      options_en: ["10", "12", "13", "15"],
      options_cn: ["10", "12", "13", "15"],
      correct: 2
    }
  ],
  medium: [
    {
      question_en: "Two chords are equal if they are equidistant from the ______.",
      question_cn: "如果两条弦到______距离相等，则它们长度相等。",
      options_en: ["center", "edge", "tangent point", "diameter"],
      options_cn: ["圆心", "边缘", "切点", "直径"],
      correct: 0
    },
    {
      question_en: "The angle in a semicircle is always ______ degrees.",
      question_cn: "半圆内的角总是______度。",
      options_en: ["45", "90", "180", "360"],
      options_cn: ["45", "90", "180", "360"],
      correct: 1
    },
    {
      question_en: "A tangent to a circle is perpendicular to the ______ at the point of contact.",
      question_cn: "圆的切线在切点处垂直于______。",
      options_en: ["chord", "diameter", "radius", "arc"],
      options_cn: ["弦", "直径", "半径", "弧"],
      correct: 2
    },
    {
      question_en: "The measure of a central angle is ______ the measure of its intercepted arc.",
      question_cn: "圆心角的度数______它所对弧的度数。",
      options_en: ["half of", "equal to", "twice", "unrelated to"],
      options_cn: ["等于一半", "等于", "两倍", "无关"],
      correct: 1
    },
    {
      question_en: "An inscribed angle that intercepts a diameter is always ______.",
      question_cn: "对直径的圆周角总是______。",
      options_en: ["acute", "right", "obtuse", "straight"],
      options_cn: ["锐角", "直角", "钝角", "平角"],
      correct: 1
    },
    {
      question_en: "Two tangents drawn from an external point to a circle are ______ in length.",
      question_cn: "从圆外一点作的两条切线长度______。",
      options_en: ["equal", "different", "parallel", "perpendicular"],
      options_cn: ["相等", "不同", "平行", "垂直"],
      correct: 0
    },
    {
      question_en: "Angles in the same segment of a circle are ______.",
      question_cn: "同弧所对的圆周角______。",
      options_en: ["complementary", "supplementary", "equal", "unequal"],
      options_cn: ["互余", "互补", "相等", "不相等"],
      correct: 2
    },
    {
      question_en: "The product of segments of intersecting chords is ______.",
      question_cn: "相交弦定理：两条相交弦被交点分成的两段长度乘积______。",
      options_en: ["different", "equal", "unrelated", "proportional"],
      options_cn: ["不同", "相等", "无关", "成比例"],
      correct: 1
    },
    {
      question_en: "Angle between tangent and chord through point of contact equals angle in ______ segment.",
      question_cn: "切线和过切点的弦所夹的角等于______的圆周角。",
      options_en: ["alternate", "opposite", "same", "complementary"],
      options_cn: ["交错", "对顶", "同侧", "互补"],
      correct: 0
    },
    {
      question_en: "Circle with center (0,0) passes through (3,4). What is radius?",
      question_cn: "圆心在(0,0)且过点(3,4)的圆，半径是多少？",
      options_en: ["3", "4", "5", "7"],
      options_cn: ["3", "4", "5", "7"],
      correct: 2
    },
    {
      question_en: "Angle at center is 60°. What is inscribed angle intercepting same arc?",
      question_cn: "圆心角为60°，同弧所对的圆周角是多少？",
      options_en: ["15°", "30°", "60°", "120°"],
      options_cn: ["15°", "30°", "60°", "120°"],
      correct: 1
    },
    {
      question_en: "Find the center and radius of circle: x² + y² - 6x + 4y - 12 = 0",
      question_cn: "求圆的圆心和半径：x² + y² - 6x + 4y - 12 = 0",
      options_en: ["Center (3,-2), r=5", "Center (-3,2), r=5", "Center (3,-2), r=√12", "Center (-3,2), r=√12"],
      options_cn: ["圆心(3,-2)，半径5", "圆心(-3,2)，半径5", "圆心(3,-2)，半径√12", "圆心(-3,2)，半径√12"],
      correct: 0
    },
    {
      question_en: "Two circles intersect orthogonally. If radii are 5 and 12, distance between centers?",
      question_cn: "两圆正交相交。若半径分别为5和12，圆心距是多少？",
      options_en: ["7", "13", "17", "√119"],
      options_cn: ["7", "13", "17", "√119"],
      correct: 1
    },
    {
      question_en: "From point P(1,2), tangents to circle x²+y²=25. Find tangent lengths.",
      question_cn: "从点P(1,2)到圆x²+y²=25作切线，求切线长。",
      options_en: ["√20", "√21", "√22", "√24"],
      options_cn: ["√20", "√21", "√22", "√24"],
      correct: 1
    },
    {
      question_en: "Chord of contact from (4,3) to circle x²+y²=9. Find its equation.",
      question_cn: "从点(4,3)到圆x²+y²=9的切点弦方程。",
      options_en: ["4x+3y=9", "3x+4y=9", "4x+3y=3", "x+y=7"],
      options_cn: ["4x+3y=9", "3x+4y=9", "4x+3y=3", "x+y=7"],
      correct: 0
    }
  ],
  hard: [
    {
      question_en: "What is the equation of a circle with center (3, -2) and radius 4?",
      question_cn: "圆心为(3, -2)，半径为4的圆方程是什么？",
      options_en: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      options_cn: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      correct: 0
    },
    {
      question_en: "Angle between tangents from (1,√3) to circle x²+y²=4 is?",
      question_cn: "从点(1,√3)到圆x²+y²=4的两条切线夹角是多少？",
      options_en: ["30°", "60°", "90°", "120°"],
      options_cn: ["30°", "60°", "90°", "120°"],
      correct: 1
    },
    {
      question_en: "Radical axis of circles x²+y²-4x+6y=0 and x²+y²+2x-8y+1=0 is:",
      question_cn: "圆x²+y²-4x+6y=0和x²+y²+2x-8y+1=0的根轴是：",
      options_en: ["6x-14y+1=0", "6x+14y-1=0", "3x-7y+1=0", "3x+7y-1=0"],
      options_cn: ["6x-14y+1=0", "6x+14y-1=0", "3x-7y+1=0", "3x+7y-1=0"],
      correct: 0
    },
    {
      question_en: "Common chord of circles x²+y²=16 and (x-4)²+y²=16 has length?",
      question_cn: "圆x²+y²=16和(x-4)²+y²=16的公共弦长度是多少？",
      options_en: ["4√3", "8", "8√3", "16"],
      options_cn: ["4√3", "8", "8√3", "16"],
      correct: 0
    },
    {
      question_en: "Circle passing through (1,0), (0,1), (2,1) has center:",
      question_cn: "过点(1,0), (0,1), (2,1)的圆的圆心是：",
      options_en: ["(1,1)", "(1.5,1.5)", "(1,2)", "(0.5,0.5)"],
      options_cn: ["(1,1)", "(1.5,1.5)", "(1,2)", "(0.5,0.5)"],
      correct: 0
    },
    {
      question_en: "Length of tangent from (6,8) to circle x²+y²=25 is:",
      question_cn: "从点(6,8)到圆x²+y²=25的切线长是：",
      options_en: ["5", "√75", "10", "√125"],
      options_cn: ["5", "√75", "10", "√125"],
      correct: 1
    },
    {
      question_en: "Angle between circles x²+y²=9 and x²+y²-6x+8=0 is:",
      question_cn: "圆x²+y²=9和x²+y²-6x+8=0之间的夹角是：",
      options_en: ["30°", "45°", "60°", "90°"],
      options_cn: ["30°", "45°", "60°", "90°"],
      correct: 3
    },
    {
      question_en: "Circle orthogonal to x²+y²=25 and center (5,0) has radius:",
      question_cn: "与圆x²+y²=25正交且圆心在(5,0)的圆的半径是：",
      options_en: ["5", "5√2", "10", "12"],
      options_cn: ["5", "5√2", "10", "12"],
      correct: 1
    },
    {
      question_en: "Locus of point from which tangents to x²+y²=4 have length 3 is circle with radius:",
      question_cn: "到圆x²+y²=4的切线长为3的点的轨迹是一个圆，其半径为：",
      options_en: ["√5", "√13", "√17", "√21"],
      options_cn: ["√5", "√13", "√17", "√21"],
      correct: 1
    },
    {
      question_en: "Area of quadrilateral formed by tangents from (±3,±4) to x²+y²=9 is:",
      question_cn: "从点(±3,±4)到圆x²+y²=9的四条切线所围四边形的面积是：",
      options_en: ["24", "48", "72", "96"],
      options_cn: ["24", "48", "72", "96"],
      correct: 1
    },
    {
      question_en: "If chord of x²+y²=4 is bisected at (1,1), its equation is:",
      question_cn: "如果圆x²+y²=4的一条弦在(1,1)点被平分，该弦的方程是：",
      options_en: ["x+y=2", "x-y=0", "x+y=1", "x-y=2"],
      options_cn: ["x+y=2", "x-y=0", "x+y=1", "x-y=2"],
      correct: 0
    },
    {
      question_en: "Find the equation of the circle that passes through (1,2), (3,4), and (5,0).",
      question_cn: "求过点(1,2), (3,4), (5,0)的圆的方程。",
      options_en: ["x²+y²-6x-4y+9=0", "x²+y²-6x-4y+5=0", "x²+y²-4x-6y+9=0", "x²+y²-4x-6y+5=0"],
      options_cn: ["x²+y²-6x-4y+9=0", "x²+y²-6x-4y+5=0", "x²+y²-4x-6y+9=0", "x²+y²-4x-6y+5=0"],
      correct: 1
    },
    {
      question_en: "The circle x²+y²-2x-4y+4=0 is inscribed in a square. What is the side length?",
      question_cn: "圆x²+y²-2x-4y+4=0内切于正方形，正方形的边长是多少？",
      options_en: ["2", "4", "6", "8"],
      options_cn: ["2", "4", "6", "8"],
      correct: 1
    },
    {
      question_en: "Find the radius of the circle touching both axes and the line 3x+4y=12.",
      question_cn: "求与两坐标轴和直线3x+4y=12都相切的圆的半径。",
      options_en: ["1", "2", "3", "4"],
      options_cn: ["1", "2", "3", "4"],
      correct: 1
    },
    {
      question_en: "The locus of midpoints of chords of circle x²+y²=25 that pass through (2,3) is:",
      question_cn: "圆x²+y²=25中所有过点(2,3)的弦的中点的轨迹是：",
      options_en: ["x²+y²-2x-3y=0", "x²+y²-2x-3y+13=0", "x²+y²-4x-6y=0", "x²+y²-4x-6y+13=0"],
      options_cn: ["x²+y²-2x-3y=0", "x²+y²-2x-3y+13=0", "x²+y²-4x-6y=0", "x²+y²-4x-6y+13=0"],
      correct: 0
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
    themeNight: "Switch to day mode"
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
    themeNight: "切换到日间模式"
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

// ==================== 初始化函数 ====================
function init() {
  if (hasInitialized) {
    return;
  }
  hasInitialized = true;

  console.log("Quiz page initializing...");
  
  // 1. 恢复语言设置
  updateLanguageText();

  // 同步固定导航条高度，避免内容被遮挡
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
  userAnswers = [];
  
  // 更新按钮文本
  updateNavButtons();
}

// 从题库中随机抽取5道不重复的题目
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

// 开始指定难度的测验
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
  
  // 重置状态
  currentQuestion = 0;
  score = 0;
  selectedOption = null;
  userAnswers = new Array(currentQuizSet.length).fill(null);
  
  // 渲染第一题
  renderQuestion();
  updateNavButtons();
  updateLanguageText();
  
  console.log(`Quiz started with ${currentQuizSet.length} questions`);
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
    scoreEl.textContent = t.scorePrefix + score + '/' + currentQuizSet.length;
    
    // 更新提交/下一题按钮文本
    nextBtn.textContent = currentQuestion === currentQuizSet.length - 1 ? t.submitBtn : t.nextBtn;
    
    // 更新下一题按钮的类
    if (currentQuestion === currentQuizSet.length - 1) {
      nextBtn.classList.add('submit');
    } else {
      nextBtn.classList.remove('submit');
    }
  }

  scheduleNavbarOffsetSync();
}

// 切换语言
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
// 渲染题目内容
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
    
    // 如果用户之前选择了这个选项，标记为选中
    if (userAnswers[currentQuestion] === index) {
      btn.classList.add('selected');
    }
    
    btn.addEventListener('click', () => selectOption(index));
    optionsContainerEl.appendChild(btn);
  });
}

// 渲染完整题目
function renderQuestion() {
  renderQuestionContent();
  
  // 更新题号
  const questionNumText = currentLang === 'en'
    ? `Question ${currentQuestion + 1}/${currentQuizSet.length}`
    : `问题 ${currentQuestion + 1}/${currentQuizSet.length}`;
  questionNumberEl.textContent = questionNumText;
  
  // 更新分数
  const t = translations[currentLang];
  scoreEl.textContent = t.scorePrefix + score + '/' + currentQuizSet.length;
  
  // 恢复之前的选择
  selectedOption = userAnswers[currentQuestion];
  if (selectedOption !== null) {
    const options = optionsContainerEl.querySelectorAll('.option-btn');
    options.forEach((btn, i) => {
      if (i === selectedOption) {
        btn.classList.add('selected');
      } else {
        btn.classList.remove('selected');
      }
    });
  }
}

// 选择选项
function selectOption(index) {
  console.log(`Selected option ${index} for question ${currentQuestion + 1}`);
  selectedOption = index;
  userAnswers[currentQuestion] = index;
  
  const options = optionsContainerEl.querySelectorAll('.option-btn');
  options.forEach((btn, i) => {
    if (i === index) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
  
  // 检查答案并更新分数
  calculateScore();
}

// 计算分数
function calculateScore() {
  let newScore = 0;
  for (let i = 0; i < currentQuizSet.length; i++) {
    if (userAnswers[i] === currentQuizSet[i].correct) {
      newScore++;
    }
  }
  
  if (score !== newScore) {
    score = newScore;
    const t = translations[currentLang];
    scoreEl.textContent = t.scorePrefix + score + '/' + currentQuizSet.length;
    console.log(`Score updated to: ${score}`);
  }
}

// 上一题
function prevQuestion() {
  console.log("Going to previous question");
  if (currentQuestion > 0) {
    currentQuestion--;
    selectedOption = userAnswers[currentQuestion];
    renderQuestion();
    updateNavButtons();
  }
}

// 下一题/提交
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
    const finalScore = `${score}/${currentQuizSet.length}`;
    const t = translations[currentLang];
    alert(t.quizComplete + finalScore);
    
    // 重置显示难度选择器
    setTimeout(() => {
      showDifficultySelector();
      updateLanguageText();
    }, 1000);
  }
}

// 更新导航按钮状态
function updateNavButtons() {
  prevBtn.disabled = currentQuestion === 0;
  const t = translations[currentLang];
  nextBtn.textContent = currentQuestion === currentQuizSet.length - 1 ? t.submitBtn : t.nextBtn;
  
  // 更新下一题按钮的类
  if (currentQuestion === currentQuizSet.length - 1) {
    nextBtn.classList.add('submit');
  } else {
    nextBtn.classList.remove('submit');
  }
}

// ==================== 事件监听器设置 ====================
function setupEventListeners() {
  console.log("Setting up event listeners");
  
  // 难度按钮事件
  diffEasyBtn.addEventListener('click', () => startQuizWithDifficulty('easy'));
  diffMediumBtn.addEventListener('click', () => startQuizWithDifficulty('medium'));
  diffHardBtn.addEventListener('click', () => startQuizWithDifficulty('hard'));
  
  // 测验导航按钮事件
  prevBtn.addEventListener('click', prevQuestion);
  nextBtn.addEventListener('click', nextQuestion);
  
  // 语言和主题切换事件
  langToggle.addEventListener('click', toggleLanguage);
  themeToggle.addEventListener('click', toggleTheme);
  
  console.log("Event listeners set up successfully");
}

// ==================== 页面加载初始化 ====================
// 当DOM完全加载后初始化
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM fully loaded, initializing quiz...");
  try {
    init();
  } catch (error) {
    console.error("Error during initialization:", error);
    alert("初始化出错，请刷新页面重试。");
  }
});

// 如果脚本在DOM加载后引入，也尝试初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

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