// quiz.js - 增强版：集成AI动态难度调整与智能避重算法

// ==================== 分数配置 ====================
const difficultyScores = {
  easy: 1,    // 简单题每题1分
  medium: 2,  // 中等题每题2分
  hard: 3     // 困难题每题3分
};

// ==================== AI 增强配置 ====================
const aiConfig = {
  // 难度调整参数 (基于简化IRT模型)
  initialAbility: 0.0,          // 用户初始能力估计 (Logit尺度，0为平均难度)
  abilityChangePerCorrect: 0.3,   // 每答对一题，能力估计增加值
  abilityChangePerIncorrect: -0.4,// 每答错一题，能力估计减少值
  difficultyTolerance: 1.2,       // 能力与题目难度的匹配容差 (越大，选题范围越宽)

  // 避重算法参数
  exposureDecayFactor: 0.85,      // 曝光权重衰减因子 (0-1，越小“遗忘”越快)
  recentQuestionWindow: 8,        // 近期题目窗口大小，避免窗口内题目重复
  selectionTemperature: 0.4,      // 选择随机性参数 (0为完全按分数贪婪选择，越大越随机)

  // 难度自适应阈值
  abilityThresholdForMedium: 0.8,  // 能力值高于此，下次测验建议Medium
  abilityThresholdForHard: 1.5,    // 能力值高于此，下次测验建议Hard
  abilityThresholdForEasy: -0.5    // 能力值低于此，下次测验建议Easy
};

// ==================== 题库数据 (增强版，含ID与难度值) ====================
const questionBank = {
  easy: [
    {
      id: 'easy_1',
      difficulty: -1.5,
      question_en: "What is the radius of a circle with equation x² + y² = 25?",
      question_cn: "圆 x² + y² = 25 的半径是多少？",
      options_en: ["5", "10", "25", "50"],
      options_cn: ["5", "10", "25", "50"],
      correct: 0,
      explanation_en: "The standard equation of a circle is x² + y² = r², where r is the radius. Given x² + y² = 25, we have r² = 25, so r = √25 = 5.",
      explanation_cn: "圆的标准方程为 x² + y² = r²，其中 r 是半径。由 x² + y² = 25 可得 r² = 25，因此 r = √25 = 5。"
    },
    {
      id: 'easy_2',
      difficulty: -1.2,
      question_en: "Which of the following is the formula for the area of a circle?",
      question_cn: "下列哪个是圆的面积公式？",
      options_en: ["πr", "πr²", "2πr", "πd"],
      options_cn: ["πr", "πr²", "2πr", "πd"],
      correct: 1,
      explanation_en: "The area of a circle is given by A = πr², where r is the radius.",
      explanation_cn: "圆的面积公式为 A = πr²，其中 r 是半径。"
    },
    {
      id: 'easy_3',
      difficulty: -1.0,
      question_en: "The diameter of a circle is 12. What is its circumference?",
      question_cn: "圆的直径是12，它的周长是多少？",
      options_en: ["12π", "24π", "6π", "36π"],
      options_cn: ["12π", "24π", "6π", "36π"],
      correct: 1,
      explanation_en: "Circumference = πd = π × 12 = 12π.",
      explanation_cn: "圆的周长 = πd = π × 12 = 12π。"
    },
    {
      id: 'easy_4',
      difficulty: -0.9,
      question_en: "In a circle, the angle subtended by a diameter at the circumference is a ______ angle.",
      question_cn: "在圆中，直径在圆周上所对的角是______角。",
      options_en: ["acute", "right", "obtuse", "reflex"],
      options_cn: ["锐角", "直角", "钝角", "优角"],
      correct: 1,
      explanation_en: "The angle in a semicircle is always a right angle (90°).",
      explanation_cn: "半圆内的角总是直角（90°）。"
    },
    {
      id: 'easy_5',
      difficulty: -0.7,
      question_en: "What is the equation of a circle with center (3, -2) and radius 4?",
      question_cn: "圆心为(3, -2)，半径为4的圆方程是什么？",
      options_en: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      options_cn: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      correct: 0,
      explanation_en: "Standard equation: (x-h)² + (y-k)² = r². Here h=3, k=-2, r=4, so (x-3)² + (y+2)² = 16.",
      explanation_cn: "标准方程：(x-h)² + (y-k)² = r²。这里 h=3, k=-2, r=4，所以 (x-3)² + (y+2)² = 16。"
    },
    {
      id: 'easy_6',
      difficulty: -0.5,
      question_en: "A circle's radius is 3. What is its area?",
      question_cn: "圆的半径为3，面积是多少？",
      options_en: ["3π", "6π", "9π", "12π"],
      options_cn: ["3π", "6π", "9π", "12π"],
      correct: 2,
      explanation_en: "Area = πr² = π × 3² = 9π.",
      explanation_cn: "面积 = πr² = π × 3² = 9π。"
    },
    {
      id: 'easy_7',
      difficulty: -0.8,
      question_en: "What is a chord?",
      question_cn: "什么是弦？",
      options_en: ["Line from center to edge", "Line through center", "Line connecting two points on circle", "Tangent line"],
      options_cn: ["从圆心到边缘的线", "穿过圆心的线", "连接圆上两点的线", "切线"],
      correct: 2,
      explanation_en: "A chord is a straight line segment whose endpoints both lie on the circle.",
      explanation_cn: "弦是连接圆上两点的直线段。"
    },
    {
      id: 'easy_8',
      difficulty: -0.6,
      question_en: "A circle's area is 16π. What is radius?",
      question_cn: "圆的面积是16π，半径是多少？",
      options_en: ["2", "4", "8", "16"],
      options_cn: ["2", "4", "8", "16"],
      correct: 1,
      explanation_en: "Area = πr² = 16π → r² = 16 → r = 4.",
      explanation_cn: "面积 = πr² = 16π → r² = 16 → r = 4。"
    },
    {
      id: 'easy_9',
      difficulty: -0.4,
      question_en: "How many tangents from an external point?",
      question_cn: "从圆外一点可以作多少条切线？",
      options_en: ["1", "2", "3", "4"],
      options_cn: ["1", "2", "3", "4"],
      correct: 1,
      explanation_en: "From an external point, exactly two tangents can be drawn to a circle.",
      explanation_cn: "从圆外一点可以作两条切线。"
    },
    {
      id: 'easy_10',
      difficulty: -0.3,
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
      id: 'medium_1',
      difficulty: 0.0,
      question_en: "Two chords are equal if they are equidistant from the ______.",
      question_cn: "如果两条弦到______距离相等，则它们长度相等。",
      options_en: ["center", "edge", "tangent point", "diameter"],
      options_cn: ["圆心", "边缘", "切点", "直径"],
      correct: 0,
      explanation_en: "Equal chords of a circle are equidistant from the center.",
      explanation_cn: "圆的等弦到圆心的距离相等。"
    },
    {
      id: 'medium_2',
      difficulty: 0.2,
      question_en: "The angle in a semicircle is always ______ degrees.",
      question_cn: "半圆内的角总是______度。",
      options_en: ["45", "90", "180", "360"],
      options_cn: ["45", "90", "180", "360"],
      correct: 1,
      explanation_en: "The angle in a semicircle is always 90° (right angle).",
      explanation_cn: "半圆内的角总是90°（直角）。"
    },
    {
      id: 'medium_3',
      difficulty: 0.4,
      question_en: "A tangent to a circle is perpendicular to the ______ at the point of contact.",
      question_cn: "圆的切线在切点处垂直于______。",
      options_en: ["chord", "diameter", "radius", "arc"],
      options_cn: ["弦", "直径", "半径", "弧"],
      correct: 2,
      explanation_en: "A tangent is perpendicular to the radius at the point of contact.",
      explanation_cn: "切线在切点处垂直于半径。"
    },
    {
      id: 'medium_4',
      difficulty: 0.5,
      question_en: "The measure of a central angle is ______ the measure of its intercepted arc.",
      question_cn: "圆心角的度数______它所对弧的度数。",
      options_en: ["half of", "equal to", "twice", "unrelated to"],
      options_cn: ["等于一半", "等于", "两倍", "无关"],
      correct: 1,
      explanation_en: "A central angle has the same measure as its intercepted arc.",
      explanation_cn: "圆心角与其所对弧的度数相等。"
    },
    {
      id: 'medium_5',
      difficulty: 0.6,
      question_en: "An inscribed angle that intercepts a diameter is always ______.",
      question_cn: "对直径的圆周角总是______。",
      options_en: ["acute", "right", "obtuse", "straight"],
      options_cn: ["锐角", "直角", "钝角", "平角"],
      correct: 1,
      explanation_en: "An inscribed angle intercepting a diameter is always a right angle.",
      explanation_cn: "对直径的圆周角总是直角。"
    },
    {
      id: 'medium_6',
      difficulty: 0.3,
      question_en: "Two tangents drawn from an external point to a circle are ______ in length.",
      question_cn: "从圆外一点作的两条切线长度______。",
      options_en: ["equal", "different", "parallel", "perpendicular"],
      options_cn: ["相等", "不同", "平行", "垂直"],
      correct: 0,
      explanation_en: "Tangents from an external point to a circle are equal in length.",
      explanation_cn: "从圆外一点作的两条切线长度相等。"
    },
    {
      id: 'medium_7',
      difficulty: 0.7,
      question_en: "Angles in the same segment of a circle are ______.",
      question_cn: "同弧所对的圆周角______。",
      options_en: ["complementary", "supplementary", "equal", "unequal"],
      options_cn: ["互余", "互补", "相等", "不相等"],
      correct: 2,
      explanation_en: "Angles in the same segment (subtended by the same arc) are equal.",
      explanation_cn: "同弧所对的圆周角相等。"
    },
    {
      id: 'medium_8',
      difficulty: 0.8,
      question_en: "The product of segments of intersecting chords is ______.",
      question_cn: "相交弦定理：两条相交弦被交点分成的两段长度乘积______。",
      options_en: ["different", "equal", "unrelated", "proportional"],
      options_cn: ["不同", "相等", "无关", "成比例"],
      correct: 1,
      explanation_en: "For intersecting chords, the products of the segments are equal.",
      explanation_cn: "相交弦定理：两条相交弦被交点分成的两段长度乘积相等。"
    },
    {
      id: 'medium_9',
      difficulty: 1.0,
      question_en: "Angle between tangent and chord through point of contact equals angle in ______ segment.",
      question_cn: "切线和过切点的弦所夹的角等于______的圆周角。",
      options_en: ["alternate", "opposite", "same", "complementary"],
      options_cn: ["交错", "对顶", "同侧", "互补"],
      correct: 0,
      explanation_en: "The angle between a tangent and a chord equals the angle in the alternate segment.",
      explanation_cn: "切线和过切点的弦所夹的角等于交错弧上的圆周角。"
    },
    {
      id: 'medium_10',
      difficulty: 0.9,
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
      id: 'hard_1',
      difficulty: 1.2,
      question_en: "What is the equation of a circle with center (3, -2) and radius 4?",
      question_cn: "圆心为(3, -2)，半径为4的圆方程是什么？",
      options_en: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      options_cn: ["(x-3)² + (y+2)² = 16", "(x+3)² + (y-2)² = 16", "(x-3)² + (y-2)² = 16", "(x+3)² + (y+2)² = 16"],
      correct: 0,
      explanation_en: "Standard equation: (x-h)² + (y-k)² = r². Here h=3, k=-2, r=4, so (x-3)² + (y+2)² = 16.",
      explanation_cn: "标准方程：(x-h)² + (y-k)² = r²。这里 h=3, k=-2, r=4，所以 (x-3)² + (y+2)² = 16。"
    },
    {
      id: 'hard_2',
      difficulty: 1.6,
      question_en: "Angle between tangents from (1,√3) to circle x²+y²=4 is?",
      question_cn: "从点(1,√3)到圆x²+y²=4的两条切线夹角是多少？",
      options_en: ["30°", "60°", "90°", "120°"],
      options_cn: ["30°", "60°", "90°", "120°"],
      correct: 1,
      explanation_en: "Distance from point to center = √(1²+√3²)=2. Radius=2, so distance = radius → point on circle. The angle between tangents is 60°.",
      explanation_cn: "点到圆心距离 = √(1²+√3²)=2。半径=2，所以点在圆上。两条切线夹角为60°。"
    },
    {
      id: 'hard_3',
      difficulty: 1.8,
      question_en: "Radical axis of circles x²+y²-4x+6y=0 and x²+y²+2x-8y+1=0 is:",
      question_cn: "圆x²+y²-4x+6y=0和x²+y²+2x-8y+1=0的根轴是：",
      options_en: ["6x-14y+1=0", "6x+14y-1=0", "3x-7y+1=0", "3x+7y-1=0"],
      options_cn: ["6x-14y+1=0", "6x+14y-1=0", "3x-7y+1=0", "3x+7y-1=0"],
      correct: 0,
      explanation_en: "Subtract equations: (x²+y²-4x+6y) - (x²+y²+2x-8y+1)=0 → -4x+6y-2x+8y-1=0 → -6x+14y-1=0 → 6x-14y+1=0.",
      explanation_cn: "两方程相减：(x²+y²-4x+6y) - (x²+y²+2x-8y+1)=0 → -4x+6y-2x+8y-1=0 → -6x+14y-1=0 → 6x-14y+1=0。"
    },
    {
      id: 'hard_4',
      difficulty: 2.0,
      question_en: "Common chord of circles x²+y²=16 and (x-4)²+y²=16 has length?",
      question_cn: "圆x²+y²=16和(x-4)²+y²=16的公共弦长度是多少？",
      options_en: ["4√3", "8", "8√3", "16"],
      options_cn: ["4√3", "8", "8√3", "16"],
      correct: 0,
      explanation_en: "Centers: (0,0) and (4,0), radii=4. Distance=4 → circles touch externally. Common chord length = 4√3.",
      explanation_cn: "圆心：(0,0)和(4,0)，半径=4。圆心距=4 → 两圆外切。公共弦长=4√3。"
    },
    {
      id: 'hard_5',
      difficulty: 2.2,
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
    explanation: "Explanation:",
    aiSuggestion: "AI Suggestion: Based on your performance, try ",
    // 页面标题
    pageTitle: "Circle Geometry Quiz",
    pageSubtitle: "Choose a difficulty and test your understanding with instant feedback.",
    // 隐私政策相关
    privacy: "Privacy",
    policyTitle: "Privacy & Preference",
    policySummary: "We only store local preferences (language, theme, accessibility, consent choices) in your browser and do not send personal data to a server.",
    optOutAds: "Opt out of personalized ads",
    optOutAnalytics: "Opt out of analytics cookies",
    hideAds: "Hide ad banner",
    savePreferences: "Save Preferences",
    preferencesSaved: "Preferences saved!"
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
    explanation: "解析：",
    aiSuggestion: "AI建议：根据您的表现，下次试试",
    // 页面标题
    pageTitle: "圆几何测试",
    pageSubtitle: "选择难度并通过即时反馈测试您的理解。",
    // 隐私政策相关
    privacy: "隐私",
    policyTitle: "隐私与偏好设置",
    policySummary: "我们仅在您的浏览器中存储本地偏好设置（语言、主题、无障碍、同意选择），不会将个人数据发送到服务器。",
    optOutAds: "选择退出个性化广告",
    optOutAnalytics: "选择退出分析Cookie",
    hideAds: "隐藏广告横幅",
    savePreferences: "保存偏好设置",
    preferencesSaved: "偏好设置已保存！"
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
let userAnswers = [];
let hasInitialized = false;
let showFeedback = false;
let currentFeedback = { isCorrect: false, explanation: '' };

// ==================== AI 状态变量 ====================
let userAbility = aiConfig.initialAbility;
let questionExposure = {};
let recentQuestionIds = [];
let userPerformanceLog = [];

// ==================== AI 核心功能 ====================

/**
 * AI智能选题算法
 * 1. 根据用户能力匹配题目难度
 * 2. 避免近期重复和过度曝光
 * @param {string} baseDifficulty - 基准难度 ('easy', 'medium', 'hard')
 * @param {number} count - 需要选择的题目数量
 * @returns {Array} 选中的题目数组
 */
function getAISelectedQuestions(baseDifficulty, count = 5) {
  console.log(`🤖 AI selecting ${count} ${baseDifficulty} questions. User ability: ${userAbility.toFixed(2)}`);

  const allQuestions = questionBank[baseDifficulty];
  if (allQuestions.length === 0) {
    console.error(`No questions found for difficulty: ${baseDifficulty}`);
    return [];
  }

  // 计算每道题的综合选择得分
  const candidateScores = allQuestions.map(q => {
    // 1. 难度匹配度得分 (核心：能力与难度越接近，得分越高)
    const difficultyDiff = Math.abs(q.difficulty - userAbility);
    const matchScore = Math.exp(-Math.pow(difficultyDiff, 2) / (2 * Math.pow(aiConfig.difficultyTolerance, 2)));

    // 2. 曝光惩罚 (曝光次数越多，得分惩罚越大)
    const exposure = questionExposure[q.id] || 0.1; // 避免除零
    const exposurePenalty = 1.0 + Math.log(1 + exposure);

    // 3. 近期重复惩罚 (如果最近出现过，大幅降低得分)
    const isRecent = recentQuestionIds.includes(q.id);
    const recencyPenalty = isRecent ? 0.1 : 1.0;

    // 4. 加入随机性，增加多样性
    const randomNoise = (Math.random() - 0.5) * 2 * aiConfig.selectionTemperature;

    // 综合得分 = 匹配度 * 近期惩罚 / 曝光惩罚 + 随机噪声
    const totalScore = (matchScore * recencyPenalty / exposurePenalty) + randomNoise;

    return {
      question: q,
      score: totalScore,
      difficultyDiff: difficultyDiff,
      exposure: exposure,
      isRecent: isRecent
    };
  });

  // 按得分降序排序
  candidateScores.sort((a, b) => b.score - a.score);

  // 选择前N道题
  const selected = candidateScores.slice(0, count).map(item => {
    console.log(`  ➤ Selected: ${item.question.id} (score: ${item.score.toFixed(3)}, diff: ${item.question.difficulty}, recent: ${item.isRecent})`);
    return item.question;
  });

  // 更新系统状态
  updateAISystemState(selected);

  return selected;
}

/**
 * 更新AI系统状态（曝光记录、近期记录、能力衰减）
 * @param {Array} selectedQuestions - 本轮选中的题目
 */
function updateAISystemState(selectedQuestions) {
  // 1. 更新曝光计数
  selectedQuestions.forEach(q => {
    questionExposure[q.id] = (questionExposure[q.id] || 0) + 1;
  });

  // 2. 更新近期题目列表
  selectedQuestions.forEach(q => {
    if (!recentQuestionIds.includes(q.id)) {
      recentQuestionIds.push(q.id);
    }
  });
  // 保持列表长度
  if (recentQuestionIds.length > aiConfig.recentQuestionWindow) {
    recentQuestionIds = recentQuestionIds.slice(-aiConfig.recentQuestionWindow);
  }

  // 3. 曝光衰减（模拟遗忘机制）
  Object.keys(questionExposure).forEach(qId => {
    questionExposure[qId] *= aiConfig.exposureDecayFactor;
    if (questionExposure[qId] < 0.05) {
      delete questionExposure[qId]; // 清理接近零的值
    }
  });

  // 4. 保存状态到本地存储
  saveAIState();
}

/**
 * 根据答题结果更新用户能力估计
 * @param {boolean} isCorrect - 是否答对
 * @param {Object} question - 题目对象
 */
function updateUserAbility(isCorrect, question) {
  const oldAbility = userAbility;

  // 基础调整：答对增加能力，答错降低能力
  if (isCorrect) {
    userAbility += aiConfig.abilityChangePerCorrect;
  } else {
    userAbility += aiConfig.abilityChangePerIncorrect;
  }

  // 精细调整：基于题目难度进行校准
  // 如果答对了难题，能力提升更多；答错了简单题，能力下降更多
  const difficultyBias = (question.difficulty - oldAbility) * 0.15;
  userAbility += difficultyBias;

  // 记录表现日志
  userPerformanceLog.push({
    qId: question.id,
    correct: isCorrect,
    difficulty: question.difficulty,
    abilityBefore: oldAbility,
    abilityAfter: userAbility,
    timestamp: Date.now()
  });

  // 限制能力值在合理范围内
  userAbility = Math.max(-3, Math.min(3, userAbility));

  console.log(`📈 User ability updated: ${oldAbility.toFixed(2)} → ${userAbility.toFixed(2)} (${isCorrect ? 'Correct' : 'Incorrect'}, Q-diff: ${question.difficulty})`);

  // 保存状态
  saveAIState();
}

/**
 * 获取AI推荐的下次难度
 * @returns {string} 推荐的难度级别
 */
function getAIRecommendedDifficulty() {
  if (userAbility >= aiConfig.abilityThresholdForHard) {
    return 'hard';
  } else if (userAbility >= aiConfig.abilityThresholdForMedium) {
    return 'medium';
  } else {
    return 'easy';
  }
}

/**
 * 在测验完成时显示AI建议
 */
function showAIDifficultySuggestion() {
  const recommendedDiff = getAIRecommendedDifficulty();
  const t = translations[currentLang];
  const diffMap = {
    easy: currentLang === 'en' ? 'Easy' : '简单',
    medium: currentLang === 'en' ? 'Medium' : '中等',
    hard: currentLang === 'en' ? 'Hard' : '困难'
  };

  console.log(`💡 AI Recommendation: Next try "${recommendedDiff}" (ability: ${userAbility.toFixed(2)})`);

  // 仅在推荐难度与当前选择不同时显示建议
  if (recommendedDiff !== selectedDifficulty) {
    const suggestionText = `${t.aiSuggestion}${diffMap[recommendedDiff]}`;
    
    // 可以优雅地显示在完成提示中，这里我们修改完成提示
    return suggestionText;
  }
  return '';
}

/**
 * 保存AI状态到本地存储
 */
function saveAIState() {
  try {
    localStorage.setItem('circleLab_userAbility', userAbility.toString());
    localStorage.setItem('circleLab_questionExposure', JSON.stringify(questionExposure));
    localStorage.setItem('circleLab_recentQuestionIds', JSON.stringify(recentQuestionIds));
    localStorage.setItem('circleLab_userPerformanceLog', JSON.stringify(userPerformanceLog.slice(-50))); // 只保存最近50条
  } catch (e) {
    console.warn("Failed to save AI state to localStorage:", e);
  }
}

/**
 * 从本地存储加载AI状态
 */
function loadAIState() {
  try {
    const savedAbility = localStorage.getItem('circleLab_userAbility');
    if (savedAbility) userAbility = parseFloat(savedAbility);

    const savedExposure = localStorage.getItem('circleLab_questionExposure');
    if (savedExposure) questionExposure = JSON.parse(savedExposure);

    const savedRecent = localStorage.getItem('circleLab_recentQuestionIds');
    if (savedRecent) recentQuestionIds = JSON.parse(savedRecent);

    const savedLog = localStorage.getItem('circleLab_userPerformanceLog');
    if (savedLog) userPerformanceLog = JSON.parse(savedLog);

    console.log(`🔄 Loaded AI state: ability=${userAbility.toFixed(2)}, recentQ=${recentQuestionIds.length}, exposureKeys=${Object.keys(questionExposure).length}`);
  } catch (e) {
    console.warn("Failed to load AI state from localStorage:", e);
    // 初始化默认状态
    userAbility = aiConfig.initialAbility;
    questionExposure = {};
    recentQuestionIds = [];
    userPerformanceLog = [];
  }
}

// ==================== 初始化函数 ====================
function init() {
  if (hasInitialized) {
    return;
  }
  hasInitialized = true;

  console.log("Quiz page initializing with AI enhancements...");
  
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
  
  // 3. 加载AI状态
  loadAIState();
  
  // 4. 显示难度选择器
  showDifficultySelector();
  
  // 5. 设置事件监听器
  setupEventListeners();

  // 6. 初始化无障碍功能
  setupAccessibilityControls();
  
  console.log("✅ AI-enhanced quiz page initialized successfully!");
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
  
  // 隐藏反馈区域
  const feedbackEl = document.getElementById('feedback-area');
  if (feedbackEl) {
    feedbackEl.style.display = 'none';
  }
  
  // 重置当前测验状态
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

function startQuizWithDifficulty(difficulty) {
  console.log(`🚀 Starting AI-powered quiz with difficulty: ${difficulty}`);
  selectedDifficulty = difficulty;
  
  // 使用AI算法选择题目
  currentQuizSet = getAISelectedQuestions(difficulty);
  
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
  
  // 重置当前测验状态
  currentQuestion = 0;
  score = 0;
  selectedOption = null;
  showFeedback = false;
  userAnswers = new Array(currentQuizSet.length).fill(null);
  
  // 渲染第一题
  renderQuestion();
  updateNavButtons();
  updateLanguageText();
  
  console.log(`📊 Quiz started with ${currentQuizSet.length} AI-selected ${difficulty} questions`);
  console.log(`🎯 Current user ability: ${userAbility.toFixed(2)}`);
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
    breadcrumbEl.innerHTML = `<a href="../HomePage/index.html">${t.breadcrumb}</a> &gt;`;
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
  
  // 页面标题和副标题
  const pageTitle = document.querySelector('.hero h1');
  const pageSubtitle = document.querySelector('.hero p');
  
  if (pageTitle) {
    pageTitle.textContent = t.pageTitle;
  }
  
  if (pageSubtitle) {
    pageSubtitle.textContent = t.pageSubtitle;
  }
  
  // 隐私政策相关文本
  const openPolicyModalBtn = document.getElementById('openPolicyModalBtn');
  const policyTitle = document.getElementById('policyTitle');
  const policySummary = document.getElementById('policySummary');
  const optOutAdsLabel = document.getElementById('optOutAdsLabel');
  const optOutAnalyticsLabel = document.getElementById('optOutAnalyticsLabel');
  const hideAdsLabel = document.getElementById('hideAdsLabel');
  const savePolicyBtn = document.getElementById('savePolicyBtn');
  
  if (openPolicyModalBtn) {
    openPolicyModalBtn.textContent = t.privacy;
  }
  
  if (policyTitle) {
    policyTitle.textContent = t.policyTitle;
  }
  
  if (policySummary) {
    policySummary.textContent = t.policySummary;
  }
  
  if (optOutAdsLabel) {
    optOutAdsLabel.textContent = t.optOutAds;
  }
  
  if (optOutAnalyticsLabel) {
    optOutAnalyticsLabel.textContent = t.optOutAnalytics;
  }
  
  if (hideAdsLabel) {
    hideAdsLabel.textContent = t.hideAds;
  }
  
  if (savePolicyBtn) {
    savePolicyBtn.textContent = t.savePreferences;
  }
  
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
  
  // 更新用户能力估计 (AI核心功能)
  updateUserAbility(isCorrect, q);
  
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
  
  console.log(`✅ Answer ${isCorrect ? 'correct' : 'incorrect'}`);
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
    if (confirm(currentLang === 'en' ? 'Are you sure you want to submit the quiz?' : '确定要提交测验吗？')) {
      calculateScore();
      const totalPossible = currentQuizSet.length * difficultyScores[selectedDifficulty];
      const finalScore = `${score}/${totalPossible}`;
      const t = translations[currentLang];
      
      // 获取AI建议
      const aiSuggestion = showAIDifficultySuggestion();
      const completionMessage = aiSuggestion 
        ? `${t.quizComplete}${finalScore}\n\n${aiSuggestion}`
        : `${t.quizComplete}${finalScore}`;
      
      alert(completionMessage);
      
      setTimeout(() => {
        showDifficultySelector();
        updateLanguageText();
      }, 1000);
    }
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
  
  // 隐私政策弹框事件监听器
  const openPolicyModalBtn = document.getElementById('openPolicyModalBtn');
  const policyModal = document.getElementById('policyModal');
  const policyModalCloseBtn = document.getElementById('policyModalCloseBtn');
  const savePolicyBtn = document.getElementById('savePolicyBtn');
  
  if (openPolicyModalBtn && policyModal) {
    openPolicyModalBtn.addEventListener('click', () => policyModal.classList.remove('hidden'));
  }
  
  if (policyModalCloseBtn && policyModal) {
    policyModalCloseBtn.addEventListener('click', () => policyModal.classList.add('hidden'));
  }
  
  if (savePolicyBtn) {
    savePolicyBtn.addEventListener('click', function() {
      const statusEl = document.getElementById('policyStatus');
      if (statusEl) {
        const t = translations[currentLang];
        statusEl.textContent = t.preferencesSaved;
        setTimeout(() => {
          if (policyModal) policyModal.classList.add('hidden');
          if (statusEl) statusEl.textContent = '';
        }, 1000);
      }
    });
  }
  
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
  console.log("DOM fully loaded, initializing AI-enhanced quiz...");
  try {
    init();
  } catch (error) {
    console.error("Error during initialization:", error);
    alert("初始化出错，请刷新页面重试。");
  }
});