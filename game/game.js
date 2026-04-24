// Game page script
const storedLanguage = (localStorage.getItem('language') || 'en').toLowerCase();

// 立即应用字体大小设置，避免页面加载时的字体大小不匹配
function applyInitialFontScale() {
  const savedFontScale = localStorage.getItem('fontScale') || 'normal';
  document.body.classList.remove('font-small', 'font-normal', 'font-large');
  document.body.classList.add(`font-${savedFontScale}`);
}

// 立即应用字体大小设置
applyInitialFontScale();

// 音效对象（延迟加载以提高页面加载速度）
const sounds = {
  correct: null,
  wrong: null,
  levelComplete: null,
  timeUp: null
};

// 预加载音效函数
function preloadSounds() {
  setTimeout(() => {
    sounds.correct = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3');
    sounds.wrong = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3');
    sounds.levelComplete = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-game-level-completed-2059.mp3');
    sounds.timeUp = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-failure-arcade-alert-notification-240.mp3');
  }, 1000); // 延迟1秒加载音效，不阻塞页面加载
}

// 播放音效函数
function playSound(soundName) {
  if (sounds[soundName]) {
    sounds[soundName].currentTime = 0; // 重置音效
    sounds[soundName].play().catch(e => {
      console.log('Error playing sound:', e);
    });
  }
}
const THEOREM_DEFINITIONS = {
  inscribed: {
    en: {
      text: 'Inscribed angles subtended by the same arc are equal.',
      hint: 'Drag the blue point on the circle to form the same inscribed angle. Any point on the same arc gives the same angle.'
    },
    cn: {
      text: '由同一弧所对的圆周角相等。',
      hint: '拖动蓝点以形成相同的圆周角。圆周上的同一弧的任意点给出相同的角度。'
    }
  },
  central: {
    en: {
      text: 'The central angle is twice the inscribed angle subtended by the same arc.',
      hint: 'The center angle at A and B is twice the inscribed angle. Your blue point should form an inscribed angle equal to half the central angle.'
    },
    cn: {
      text: '圆心角是同一弧所对的圆周角的两倍。',
      hint: 'A和B所对的圆心角是圆周角的两倍。蓝点形成的圆周角应等于圆心角的一半。'
    }
  },
  tangentChord: {
    en: {
      text: 'The angle between a tangent and a chord equals the inscribed angle in the opposite arc.',
      hint: 'Drag the blue point so the tangent at that point matches the inscribed arc angle formed by the fixed chord.'
    },
    cn: {
      text: '切线与弦之间的角等于对弧上的圆周角。',
      hint: '拖动蓝点，使该点处的切线角等于固定弦所对的圆周角。'
    }
  },
  cyclicQuad: {
    en: {
      text: 'Opposite angles in a cyclic quadrilateral sum to 180°.',
      hint: 'Move the blue point so the opposite angles formed with A, B and C add up to a straight angle.'
    },
    cn: {
      text: '圆内四边形的对角和为180°。',
      hint: '移动蓝点，使与A、B、C形成的对角和为直线角。'
    }
  },
  semicircle: {
    en: {
      text: 'An angle in a semicircle is always 90° when the vertex lies on the circle.',
      hint: 'A and B are diameter endpoints. Drag the blue point so the angle at that point is a right angle.'
    },
    cn: {
      text: '半圆中的角总是90°。',
      hint: 'A和B是直径端点。拖动蓝点，使该点处的角为直角。'
    }
  },
  equalChord: {
    en: {
      text: 'Equal chords subtend equal angles at the circle.',
      hint: 'Chord AB matches another equal chord CD. Match AB’s inscribed angle to the equal chord angle.'
    },
    cn: {
      text: '相等的弦所对的角相等。',
      hint: 'AB弦与另一条相等的弦CD相匹配。将AB的圆周角与相等弦的角度匹配。'
    }
  }
};

const gameState = {
  currentLevel: 1,
  score: 0,
  coins: loadCoins(),
  totalCoins: loadTotalCoins(),
  unlockedItems: loadUnlockedItems(),
  canvas: document.getElementById('gameCanvas'),
  ctx: null,
  draggingPoint: false,
  draggingPointType: null, // 'A', 'B', 'X', or null
  pointX: 0,
  pointY: 0,
  centerX: 0,
  centerY: 0,
  radius: 150,
  pointA: null,
  pointB: null,
  pointC: null,
  pointD: null,
  targetAngle: null,
  selectedAngle: null,
  tolerance: 5,
  timeLimit: 20,
  timeRemaining: 20,
  timerInterval: null,
  dragDisabled: false,
  levelActive: false,
  feedbackAnimation: null,
  currentLanguage: storedLanguage === 'cn' ? 'cn' : 'en',
  currentTheoremType: 'inscribed',
  mode: 'inscribed',
  difficulty: 'Easy',
  centralAngle: 0, // 圆心角
  inscribedAngle: 0 // 圆周角
};
// =====================
// COIN/UNLOCK/LEADERBOARD SYSTEMS
// =====================

const UNLOCKABLES = [
  { key: 'blue-neon', name: 'Blue Neon Theme', cost: 50 },
  { key: 'gold', name: 'Gold Theme', cost: 120 },
  { key: 'galaxy', name: 'Galaxy Theme', cost: 250 }
];

function loadCoins() {
  return parseInt(localStorage.getItem('coins') || '0', 10);
}
function loadTotalCoins() {
  return parseInt(localStorage.getItem('totalCoins') || '0', 10);
}
function saveCoins() {
  localStorage.setItem('coins', gameState.coins);
}
function saveTotalCoins() {
  localStorage.setItem('totalCoins', gameState.totalCoins);
}
function addCoins(amount, animate = true) {
  gameState.coins += amount;
  gameState.totalCoins += amount;
  saveCoins();
  saveTotalCoins();
  updateCoinDisplay();
  if (animate) showCoinAnimation(amount);
}

function loadUnlockedItems() {
  try {
    return JSON.parse(localStorage.getItem('unlockedItems') || '[]');
  } catch (e) { return []; }
}
function saveUnlockedItems() {
  localStorage.setItem('unlockedItems', JSON.stringify(gameState.unlockedItems));
}
function checkUnlocks() {
  let unlocked = false;
  for (const item of UNLOCKABLES) {
    if (!gameState.unlockedItems.includes(item.key) && gameState.totalCoins >= item.cost) {
      gameState.unlockedItems.push(item.key);
      saveUnlockedItems();
      showUnlockMessage(item.name);
      unlocked = true;
    }
  }
  return unlocked;
}

function showUnlockMessage(name) {
  const feedback = document.getElementById('feedbackBox');
  const prev = feedback.textContent;
  feedback.textContent = `🎉 New Reward Unlocked! (${name})`;
  feedback.className = 'feedback-box show correct';
  setTimeout(() => {
    feedback.textContent = prev;
    if (!prev) feedback.className = 'feedback-box';
  }, 2000);
}

function showCoinAnimation(amount) {
  if (!amount) return;
  let panel = document.getElementById('coinAnimPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'coinAnimPanel';
    panel.style.position = 'fixed';
    panel.style.left = '50%';
    panel.style.top = '60px';
    panel.style.transform = 'translateX(-50%)';
    panel.style.zIndex = '2000';
    panel.style.pointerEvents = 'none';
    document.body.appendChild(panel);
  }
  const anim = document.createElement('div');
  anim.textContent = (amount > 0 ? '+' : '') + amount + ' coins';
  anim.style.fontSize = '1.2rem';
  anim.style.fontWeight = 'bold';
  anim.style.color = '#f39c12';
  anim.style.background = 'rgba(255,255,255,0.95)';
  anim.style.borderRadius = '8px';
  anim.style.padding = '4px 14px';
  anim.style.margin = '4px auto';
  anim.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  anim.style.opacity = '1';
  anim.style.transition = 'all 1s cubic-bezier(.4,2,.6,1)';
  panel.appendChild(anim);
  setTimeout(() => {
    anim.style.transform = 'translateY(-40px) scale(1.2)';
    anim.style.opacity = '0';
  }, 10);
  setTimeout(() => {
    anim.remove();
  }, 1100);
}

function updateCoinDisplay() {
  let coinRow = document.getElementById('coinRow');
  const progressCard = document.querySelectorAll('.info-card')[1];
  if (!progressCard) return;
  if (!coinRow) {
    coinRow = document.createElement('div');
    coinRow.className = 'stat-row';
    coinRow.id = 'coinRow';
    coinRow.innerHTML = '<span class="stat-label">Coins:</span><span class="stat-value" id="coinDisplay">--</span>';
    progressCard.appendChild(coinRow);
  }
  const coinDisplay = document.getElementById('coinDisplay');
  if (coinDisplay) coinDisplay.textContent = gameState.coins;
}

// ========== LEADERBOARD ==========
let leaderboardVisible = false;

function loadLeaderboard() {
  try {
    return JSON.parse(localStorage.getItem('leaderboard') || '[]');
  } catch (e) { return []; }
}
function saveLeaderboard(arr) {
  localStorage.setItem('leaderboard', JSON.stringify(arr));
}
function addToLeaderboard(score, coins) {
  let arr = loadLeaderboard();
  arr.push({ score, coins, date: Date.now() });
  arr.sort((a, b) => b.score - a.score || b.coins - a.coins);
  arr = arr.slice(0, 10);
  saveLeaderboard(arr);
}

function toggleLeaderboardVisibility() {
  leaderboardVisible = !leaderboardVisible;
  const panel = document.getElementById('leaderboardPanel');
  if (panel) {
    panel.style.display = leaderboardVisible ? 'block' : 'none';
  }
  const btn = document.getElementById('leaderboardToggleBtn');
  if (btn) {
    const lang = translations[gameState.currentLanguage];
    btn.textContent = leaderboardVisible ? lang.leaderboardHideBtn : lang.leaderboardBtn;
    btn.style.background = leaderboardVisible ? '#27ae60' : '#f5f5f5';
    btn.style.color = leaderboardVisible ? '#fff' : '#333';
  }
}

function renderLeaderboard() {
  let panel = document.getElementById('leaderboardPanel');
  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'leaderboardPanel';
    panel.style.position = 'fixed';
    panel.style.left = '16px';
    panel.style.top = '16px';
    panel.style.background = 'rgba(255,255,255,0.98)';
    panel.style.border = '1px solid #eee';
    panel.style.borderRadius = '10px';
    panel.style.boxShadow = '0 2px 12px rgba(0,0,0,0.12)';
    panel.style.zIndex = '1500';
    panel.style.width = '280px';
    panel.style.maxHeight = '70vh';
    panel.style.overflow = 'auto';
    panel.style.fontFamily = 'Arial, sans-serif';
    panel.style.fontSize = '1rem';
    panel.style.pointerEvents = 'auto';
    panel.style.display = 'none';
    document.body.appendChild(panel);
  }
  const arr = loadLeaderboard();
  const lang = translations[gameState.currentLanguage];
  let html = '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #eee;">';
  html += `<span style="font-weight:bold;font-size:1.1rem;">🏆 ${lang.leaderboard}</span>`;
  html += '<button id="leaderboardCloseBtn" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:#999;">✕</button>';
  html += '</div>';
  
  if (!arr.length) {
    html += `<div style="padding:16px;text-align:center;color:#999;">${lang.noScores}</div>`;
  } else {
    html += '<ol style="margin:0;padding:12px 16px;list-style-position:inside;">';
    for (let i = 0; i < arr.length; ++i) {
      const entry = arr[i];
      html += `<li style="margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #f0f0f0;font-size:0.95rem;">Score: <b>${entry.score}</b> | Coins: <b>${entry.coins}</b></li>`;
    }
    html += '</ol>';
  }
  panel.innerHTML = html;
  
  // Add close button listener
  const closeBtn = document.getElementById('leaderboardCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', toggleLeaderboardVisibility);
  }
}

function createLeaderboardToggleButton() {
  if (document.getElementById('leaderboardToggleBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'leaderboardToggleBtn';
  const lang = translations[gameState.currentLanguage];
  btn.textContent = lang.leaderboardBtn;
  btn.style.position = 'fixed';
  btn.style.left = '16px';
  btn.style.bottom = '24px';
  btn.style.zIndex = '1000';
  btn.style.padding = '8px 14px';
  btn.style.background = '#f5f5f5';
  btn.style.border = '1px solid rgba(0,0,0,0.15)';
  btn.style.borderRadius = '8px';
  btn.style.fontSize = '0.9rem';
  btn.style.fontFamily = 'Arial, sans-serif';
  btn.style.cursor = 'pointer';
  btn.style.color = '#333';
  btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
  btn.style.transition = 'all 0.3s ease';
  btn.addEventListener('click', toggleLeaderboardVisibility);
  document.body.appendChild(btn);
}

// ========== END SYSTEMS ==========

function initCanvas() {
  // 获取设备像素比，提高高DPI屏幕上的动画清晰度
  const dpr = window.devicePixelRatio || 1;
  const rect = gameState.canvas.getBoundingClientRect();
  
  // 调整Canvas实际尺寸以匹配设备像素比
  gameState.canvas.width = rect.width * dpr;
  gameState.canvas.height = rect.height * dpr;
  
  // 获取上下文并缩放
  gameState.ctx = gameState.canvas.getContext('2d');
  gameState.ctx.scale(dpr, dpr);
  
  // 计算中心点（使用CSS像素）
  gameState.centerX = rect.width / 2;
  gameState.centerY = rect.height / 2;
  
  // 调整半径以适应新的尺寸
  gameState.radius = Math.min(gameState.centerX, gameState.centerY) * 0.7;
  
  createTimerDisplay();
  createDifficultyControl();
  generateNewLevel();
  setupCanvasEvents();
  draw();
}

function generateNewLevel() {
  applyDifficultySettings();
  gameState.currentTheoremType = selectRandomTheorem();
  gameState.mode = gameState.currentTheoremType;
  gameState.pointC = null;
  gameState.pointD = null;
  gameState.levelActive = true;
  gameState.dragDisabled = false;

  const angleA = Math.random() * Math.PI * 2;
  const difficulty = gameState.difficulty;
  const easyDelta = Math.PI / 3 + Math.random() * Math.PI / 6;
  const mediumDelta = Math.PI / 4 + Math.random() * Math.PI / 6;
  const hardDelta = Math.PI / 6 + Math.random() * Math.PI / 10;
  const delta = difficulty === 'Hard' ? hardDelta : difficulty === 'Medium' ? mediumDelta : easyDelta;

  gameState.pointA = createCirclePoint(angleA);

  if (gameState.mode === 'semicircle') {
    const angleB = angleA + Math.PI;
    gameState.pointB = createCirclePoint(angleB);
    const sampleTheta = angleA + Math.PI * (difficulty === 'Hard' ? (0.1 + Math.random() * 0.8) : 0.3 + Math.random() * 0.4);
    gameState.pointX = createCirclePoint(sampleTheta).x;
    gameState.pointY = createCirclePoint(sampleTheta).y;
    gameState.targetAngle = Math.PI / 2;
  } else if (gameState.mode === 'central') {
    const angleB = angleA + delta;
    gameState.pointB = createCirclePoint(angleB);
    const centerAngle = calculateCentralAngle(gameState.pointA, gameState.pointB);
    const sampleTheta = angleA + centerAngle / 4 + (difficulty === 'Hard' ? (Math.random() - 0.5) * centerAngle * 0.25 : 0);
    const samplePoint = createCirclePoint(sampleTheta);
    gameState.pointX = samplePoint.x;
    gameState.pointY = samplePoint.y;
    gameState.targetAngle = centerAngle / 2;
  } else if (gameState.mode === 'tangentChord') {
    const angleB = angleA + delta;
    gameState.pointB = createCirclePoint(angleB);
    const chordAngle = calculateInscribedAngle(angleA + delta / 2, gameState.pointA, gameState.pointB);
    const sampleTheta = angleA + delta / 2 + (difficulty === 'Hard' ? (Math.random() - 0.5) * delta * 0.3 : 0);
    const samplePoint = createCirclePoint(sampleTheta);
    gameState.pointX = samplePoint.x;
    gameState.pointY = samplePoint.y;
    gameState.targetAngle = chordAngle;
  } else if (gameState.mode === 'cyclicQuad') {
    const angleB = angleA + delta;
    const angleC = angleB + delta * 0.9;
    gameState.pointB = createCirclePoint(angleB);
    gameState.pointC = createCirclePoint(angleC);
    const sampleTheta = angleA + delta * 1.5 + (difficulty === 'Hard' ? (Math.random() - 0.5) * delta * 0.5 : 0);
    const samplePoint = createCirclePoint(sampleTheta);
    gameState.pointX = samplePoint.x;
    gameState.pointY = samplePoint.y;
    gameState.targetAngle = Math.PI;
  } else if (gameState.mode === 'equalChord') {
    const angleB = angleA + delta;
    gameState.pointB = createCirclePoint(angleB);
    const angleC = angleA + Math.PI / 2;
    const angleD = angleC + delta;
    gameState.pointC = createCirclePoint(angleC);
    gameState.pointD = createCirclePoint(angleD);
    const sampleTheta = angleA + delta / 2 + (difficulty === 'Hard' ? (Math.random() - 0.5) * delta * 0.7 : 0);
    const samplePoint = createCirclePoint(sampleTheta);
    gameState.pointX = samplePoint.x;
    gameState.pointY = samplePoint.y;
    gameState.targetAngle = calculateInscribedAngle(sampleTheta, gameState.pointC, gameState.pointD);
  } else {
    const angleB = angleA + delta;
    gameState.pointB = createCirclePoint(angleB);
    const sampleTheta = angleA + delta / 2 + (difficulty === 'Hard' ? (Math.random() - 0.5) * delta * 0.6 : 0);
    const samplePoint = createCirclePoint(sampleTheta);
    gameState.pointX = samplePoint.x;
    gameState.pointY = samplePoint.y;
    gameState.targetAngle = calculateInscribedAngle(sampleTheta, gameState.pointA, gameState.pointB);
  }

  document.getElementById('angleDisplay').textContent = (gameState.targetAngle * 180 / Math.PI).toFixed(1) + '°';
  gameState.feedbackAnimation = null;
  hideFeedback();
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('checkBtn').style.display = 'block';
  setTheoremTexts();
  resetTimer();
  
  // 初始化时更新角度显示
  updateAngleDisplay();
}

function getCanvasCoordinates(clientX, clientY) {
  const rect = gameState.canvas.getBoundingClientRect();
  // 由于我们已经在Canvas上下文中应用了缩放，所以直接使用CSS像素坐标
  return {
    x: clientX - rect.left,
    y: clientY - rect.top
  };
}

function getThetaFromPoint(x, y) {
  return Math.atan2(y - gameState.centerY, x - gameState.centerX);
}

function calculateInscribedAngle(theta, pointA, pointB) {
  const px = gameState.centerX + gameState.radius * Math.cos(theta);
  const py = gameState.centerY + gameState.radius * Math.sin(theta);
  const vax = pointA.x - px;
  const vay = pointA.y - py;
  const vbx = pointB.x - px;
  const vby = pointB.y - py;
  const dotProduct = vax * vbx + vay * vby;
  const magA = Math.sqrt(vax * vax + vay * vay);
  const magB = Math.sqrt(vbx * vbx + vby * vby);
  if (magA === 0 || magB === 0) return 0;
  const cosAngle = dotProduct / (magA * magA > 0 && magB * magB > 0 ? magA * magB : 1);
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  return Math.acos(clampedCos);
}

function calculateCentralAngle(pointA, pointB) {
  let diff = Math.abs(pointA.angle - pointB.angle);
  if (diff > Math.PI) diff = Math.PI * 2 - diff;
  return diff;
}

function calculateTangentAngle(theta, pointA, pointB) {
  const point = {
    x: gameState.centerX + gameState.radius * Math.cos(theta),
    y: gameState.centerY + gameState.radius * Math.sin(theta)
  };
  const chordAngle = calculateInscribedAngle(theta, pointA, pointB);
  const tangentDirection = { x: -(point.y - gameState.centerY), y: point.x - gameState.centerX };
  const chordDirection = { x: pointB.x - point.x, y: pointB.y - point.y };
  const dot = tangentDirection.x * chordDirection.x + tangentDirection.y * chordDirection.y;
  const magT = Math.hypot(tangentDirection.x, tangentDirection.y);
  const magC = Math.hypot(chordDirection.x, chordDirection.y);
  if (magT === 0 || magC === 0) return 0;
  const cosTheta = dot / (magT * magC);
  const clampedCos = Math.max(-1, Math.min(1, cosTheta));
  return Math.acos(clampedCos);
}

function calculateQuadrilateralAngles(theta, pointA, pointB, pointC) {
  const point = {
    x: gameState.centerX + gameState.radius * Math.cos(theta),
    y: gameState.centerY + gameState.radius * Math.sin(theta)
  };
  const angleABC = calculateAngle(pointA, point, pointB);
  const angleCDA = calculateAngle(pointC, point, pointA);
  return { oppositeSum: angleABC + angleCDA, angleABC, angleCDA };
}

function calculateAngle(p1, p2, p3) {
  const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
  const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (mag1 === 0 || mag2 === 0) return 0;
  const cosVal = dot / (mag1 * mag2);
  return Math.acos(Math.max(-1, Math.min(1, cosVal)));
}

function createCirclePoint(angle) {
  return {
    x: gameState.centerX + gameState.radius * Math.cos(angle),
    y: gameState.centerY + gameState.radius * Math.sin(angle),
    angle
  };
}

function selectRandomTheorem() {
  const theoremKeys = Object.keys(THEOREM_DEFINITIONS);
  return theoremKeys[Math.floor(Math.random() * theoremKeys.length)];
}

function setTheoremTexts() {
  const def = THEOREM_DEFINITIONS[gameState.currentTheoremType][gameState.currentLanguage];
  document.getElementById('theoremText').textContent = def.text;
  document.getElementById('hintText').textContent = def.hint;
}

function applyDifficultySettings() {
  const level = gameState.difficulty || 'Easy';
  if (level === 'Hard') {
    gameState.tolerance = 3;
    gameState.timeLimit = 7;
  } else if (level === 'Medium') {
    gameState.tolerance = 5;
    gameState.timeLimit = 12;
  } else {
    gameState.tolerance = 9;
    gameState.timeLimit = 20;
  }
}

function createTimerDisplay() {
  const progressCard = document.querySelectorAll('.info-card')[1];
  if (!progressCard || document.getElementById('timerDisplay')) return;
  const timerRow = document.createElement('div');
  timerRow.className = 'stat-row';
  timerRow.style.marginTop = '8px';
  timerRow.innerHTML = '<span class="stat-label">Time Remaining:</span><span class="stat-value" id="timerDisplay">--</span>';
  progressCard.appendChild(timerRow);
}

function updateTimerDisplay() {
  const timerText = document.getElementById('timerDisplay');
  if (timerText) {
    timerText.textContent = `${gameState.timeRemaining}s`;
  }
}

function createDifficultyControl() {
  if (document.getElementById('difficultyControl')) return;
  const control = document.createElement('div');
  control.id = 'difficultyControl';
  control.style.position = 'fixed';
  control.style.top = '100px';
  control.style.right = '16px';
  control.style.zIndex = '1000';
  control.style.display = 'flex';
  control.style.alignItems = 'center';
  control.style.gap = '8px';
  control.style.padding = '6px 10px';
  control.style.background = 'rgba(255,255,255,0.9)';
  control.style.border = '1px solid rgba(0,0,0,0.12)';
  control.style.borderRadius = '8px';
  control.style.fontSize = '0.9rem';
  control.style.fontFamily = 'Arial, sans-serif';
  control.style.color = '#333';
  control.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
  control.style.pointerEvents = 'auto';

  const label = document.createElement('span');
  label.textContent = 'Difficulty:';
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = gameState.difficulty || 'Easy';
  button.style.cursor = 'pointer';
  button.style.padding = '4px 10px';
  button.style.border = '1px solid rgba(0,0,0,0.15)';
  button.style.borderRadius = '6px';
  button.style.background = '#f5f5f5';
  button.style.color = '#333';
  button.addEventListener('click', () => cycleDifficulty());
  document.addEventListener('keydown', event => {
    if (event.code === 'KeyD' && !event.repeat) {
      cycleDifficulty();
    }
  });

  control.appendChild(label);
  control.appendChild(button);
  document.body.appendChild(control);
  updateDifficultyDisplay();
}

function updateDifficultyDisplay() {
  const control = document.getElementById('difficultyControl');
  if (!control) return;
  const button = control.querySelector('button');
  if (button) button.textContent = gameState.difficulty;
}

function cycleDifficulty() {
  const levels = ['Easy', 'Medium', 'Hard'];
  const currentIndex = levels.indexOf(gameState.difficulty);
  const nextIndex = (currentIndex + 1) % levels.length;
  gameState.difficulty = levels[nextIndex];
  applyDifficultySettings();
  updateDifficultyDisplay();
  resetTimer();
}

function resetTimer() {
  clearTimer();
  gameState.timeRemaining = gameState.timeLimit;
  gameState.dragDisabled = false;
  gameState.levelActive = true;
  updateTimerDisplay();
  gameState.timerInterval = window.setInterval(() => {
    if (!gameState.levelActive) return;
    gameState.timeRemaining -= 1;
    if (gameState.timeRemaining <= 0) {
      gameState.timeRemaining = 0;
      updateTimerDisplay();
      clearTimer();
      handleTimeOut();
    } else {
      updateTimerDisplay();
    }
  }, 1000);
}

function clearTimer() {
  if (gameState.timerInterval) {
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }
}

function handleTimeOut() {
  if (!gameState.levelActive) return;
  gameState.levelActive = false;
  gameState.dragDisabled = true;
  const feedback = document.getElementById('feedbackBox');
  const lang = translations[gameState.currentLanguage];
  feedback.textContent = lang.timeUp;
  feedback.className = 'feedback-box show wrong';
  document.getElementById('checkBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'block';
  playSound('timeUp'); // 播放时间到音效
  startFeedbackAnimation(false);
}

function startFeedbackAnimation(isCorrect) {
  gameState.feedbackAnimation = {
    active: true,
    symbol: isCorrect ? '✓' : '✗',
    color: isCorrect ? '#27ae60' : '#e74c3c',
    startTime: performance.now(),
    duration: 1000
  };
  requestAnimationFrame(renderFeedbackFrame);
}

function renderFeedbackFrame(timestamp) {
  if (!gameState.feedbackAnimation || !gameState.feedbackAnimation.active) return;
  const elapsed = timestamp - gameState.feedbackAnimation.startTime;
  const progress = Math.min(elapsed / gameState.feedbackAnimation.duration, 1);
  gameState.feedbackAnimation.progress = progress;
  draw();
  if (progress < 1) {
    requestAnimationFrame(renderFeedbackFrame);
  } else {
    gameState.feedbackAnimation.active = false;
    draw();
  }
}

function drawFeedbackOverlay() {
  const anim = gameState.feedbackAnimation;
  if (!anim || !anim.active) return;
  const ctx = gameState.ctx;
  const progress = anim.progress || 0;
  const alpha = 1 - progress;
  const scale = 1 + progress * 0.5;
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = anim.color;
  ctx.font = `${72 * scale}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(anim.symbol, gameState.centerX, gameState.centerY);
  ctx.restore();
}

function draw() {
  const ctx = gameState.ctx;
  const { centerX, centerY, radius, pointX, pointY, pointA, pointB, pointC, pointD, currentTheoremType } = gameState;
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, gameState.canvas.width, gameState.canvas.height);
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#999';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.stroke();
  ctx.setLineDash([]);

  if (currentTheoremType === 'central' || currentTheoremType === 'semicircle' || currentTheoremType === 'tangentChord' || currentTheoremType === 'cyclicQuad') {
    ctx.strokeStyle = '#2c3e50';
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointA.x, pointA.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (currentTheoremType === 'tangentChord') {
    const theta = getThetaFromPoint(pointX, pointY);
    const tangentStart = {
      x: pointX + (pointY - centerY) * 0.5,
      y: pointY - (pointX - centerX) * 0.5
    };
    const tangentEnd = {
      x: pointX - (pointY - centerY) * 0.5,
      y: pointY + (pointX - centerX) * 0.5
    };
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tangentStart.x, tangentStart.y);
    ctx.lineTo(tangentEnd.x, tangentEnd.y);
    ctx.stroke();
  }

  if (currentTheoremType === 'equalChord' && pointC && pointD) {
    ctx.strokeStyle = '#8e44ad';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(pointC.x, pointC.y);
    ctx.lineTo(pointD.x, pointD.y);
    ctx.stroke();
    drawPoint(pointC.x, pointC.y, '#8e44ad', 'C', 10);
    drawPoint(pointD.x, pointD.y, '#8e44ad', 'D', 10);
  }

  drawPoint(pointA.x, pointA.y, '#e74c3c', 'A', 12);
  drawPoint(pointB.x, pointB.y, '#e74c3c', 'B', 12);
  drawPoint(pointX, pointY, '#3498db', '', 10);
  if (Math.hypot(pointX - centerX, pointY - centerY) > radius - 10) {
    ctx.strokeStyle = '#27ae60';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointA.x, pointA.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pointX, pointY);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.stroke();
  }
  const theta = getThetaFromPoint(pointX, pointY);
  const angle = (theta * 180 / Math.PI + 360) % 360;
  gameState.selectedAngle = calculateModeAngle(theta);
  drawFeedbackOverlay();
  document.getElementById('positionInfo').textContent = `X: ${pointX.toFixed(0)}, Y: ${pointY.toFixed(0)} | Angle: ${angle.toFixed(1)}° | Selected: ${(gameState.selectedAngle * 180 / Math.PI).toFixed(1)}°`;
}

function calculateModeAngle(theta) {
  const { pointA, pointB, pointC, mode } = gameState;
  if (mode === 'central') {
    return calculateInscribedAngle(theta, pointA, pointB);
  }
  if (mode === 'tangentChord') {
    return calculateTangentAngle(theta, pointA, pointB);
  }
  if (mode === 'cyclicQuad') {
    const quad = calculateQuadrilateralAngles(theta, pointA, pointB, pointC);
    return quad.oppositeSum;
  }
  if (mode === 'semicircle') {
    return calculateInscribedAngle(theta, pointA, pointB);
  }
  if (mode === 'equalChord') {
    return calculateInscribedAngle(theta, pointA, pointB);
  }
  return calculateInscribedAngle(theta, pointA, pointB);
}

function drawPoint(x, y, color, label, radius) {
  const ctx = gameState.ctx;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  if (label) {
    ctx.fillStyle = '#333';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y - 25);
  }
}

function setupCanvasEvents() {
  gameState.canvas.addEventListener('mousedown', handleMouseDown);
  gameState.canvas.addEventListener('mousemove', handleMouseMove);
  gameState.canvas.addEventListener('mouseup', handleMouseUp);
  gameState.canvas.addEventListener('mouseleave', handleMouseUp);
  gameState.canvas.addEventListener('touchstart', handleTouchStart);
  gameState.canvas.addEventListener('touchmove', handleTouchMove);
  gameState.canvas.addEventListener('touchend', handleTouchEnd);
}

function handleMouseDown(e) {
  e.preventDefault();
  const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
  justifyDragStart(x, y);
}

function handleMouseMove(e) {
  if (!gameState.draggingPoint) return;
  e.preventDefault();
  const { x, y } = getCanvasCoordinates(e.clientX, e.clientY);
  constrainPointToCircle(x, y);
  draw();
}

function handleMouseUp() {
  gameState.draggingPoint = false;
  gameState.draggingPointType = null;
}

function handleTouchStart(e) {
  const touch = e.touches[0];
  const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);
  justifyDragStart(x, y);
}

function handleTouchMove(e) {
  if (!gameState.draggingPoint) return;
  e.preventDefault();
  const touch = e.touches[0];
  const { x, y } = getCanvasCoordinates(touch.clientX, touch.clientY);
  constrainPointToCircle(x, y);
  draw();
}

function handleTouchEnd() {
  gameState.draggingPoint = false;
  gameState.draggingPointType = null;
}

function justifyDragStart(x, y) {
  if (gameState.dragDisabled) return;
  
  // 检查是否点击了点A、B或X
  const distA = Math.hypot(x - gameState.pointA.x, y - gameState.pointA.y);
  const distB = Math.hypot(x - gameState.pointB.x, y - gameState.pointB.y);
  const distX = Math.hypot(x - gameState.pointX, y - gameState.pointY);
  const hitRadius = 20; // 点击判定半径
  
  if (distA < hitRadius) {
    gameState.draggingPoint = true;
    gameState.draggingPointType = 'A';
  } else if (distB < hitRadius) {
    gameState.draggingPoint = true;
    gameState.draggingPointType = 'B';
  } else if (distX < hitRadius) {
    gameState.draggingPoint = true;
    gameState.draggingPointType = 'X';
  } else {
    gameState.draggingPoint = false;
    gameState.draggingPointType = null;
  }
}

function constrainPointToCircle(x, y) {
  const dx = x - gameState.centerX;
  const dy = y - gameState.centerY;
  const dist = Math.hypot(dx, dy);
  
  // 将点约束到圆上
  const constrainedX = gameState.centerX + (dx / dist) * gameState.radius;
  const constrainedY = gameState.centerY + (dy / dist) * gameState.radius;
  
  // 根据拖动的点类型更新相应的坐标
  if (gameState.draggingPointType === 'A') {
    gameState.pointA = { x: constrainedX, y: constrainedY, angle: getThetaFromPoint(constrainedX, constrainedY) };
  } else if (gameState.draggingPointType === 'B') {
    gameState.pointB = { x: constrainedX, y: constrainedY, angle: getThetaFromPoint(constrainedX, constrainedY) };
  } else if (gameState.draggingPointType === 'X') {
    gameState.pointX = constrainedX;
    gameState.pointY = constrainedY;
  }
  
  // 更新圆心角和圆周角
  updateAngleDisplay();
}

function updateAngleDisplay() {
  const { pointA, pointB, pointX, pointY, centerX, centerY, radius } = gameState;
  
  // 计算圆心角 (central angle) - 点A和点B与圆心连线的夹角
  const centralAngle = calculateCentralAngle(pointA, pointB);
  gameState.centralAngle = centralAngle;
  
  // 计算圆周角 (inscribed angle) - 点X相对于点A和点B的角度
  const thetaX = getThetaFromPoint(pointX, pointY);
  const inscribedAngle = calculateInscribedAngle(thetaX, pointA, pointB);
  gameState.inscribedAngle = inscribedAngle;
  
  // 更新显示
  const centralDisplay = document.getElementById('centralAngleDisplay');
  const inscribedDisplay = document.getElementById('inscribedAngleDisplay');
  const verificationResult = document.getElementById('verificationResult');
  
  if (centralDisplay) {
    centralDisplay.textContent = (centralAngle * 180 / Math.PI).toFixed(1) + '°';
  }
  
  if (inscribedDisplay) {
    inscribedDisplay.textContent = (inscribedAngle * 180 / Math.PI).toFixed(1) + '°';
  }
  
  // 验证圆心角 = 2 × 圆周角
  if (verificationResult) {
    const expectedCentral = 2 * inscribedAngle;
    const diff = Math.abs(centralAngle - expectedCentral);
    const isVerified = diff < 0.1; // 允许小误差
    const lang = translations[gameState.currentLanguage];
    
    if (isVerified) {
      verificationResult.textContent = lang.verificationPass;
      verificationResult.style.color = '#27ae60';
    } else {
      verificationResult.textContent = lang.verificationFail + (expectedCentral * 180 / Math.PI).toFixed(1) + '°';
      verificationResult.style.color = '#e74c3c';
    }
  }
  
  // 同时更新位置信息
  const positionInfo = document.getElementById('positionInfo');
  if (positionInfo) {
    const angle = (thetaX * 180 / Math.PI + 360) % 360;
    gameState.selectedAngle = inscribedAngle;
    positionInfo.textContent = `X: ${pointX.toFixed(0)}, Y: ${pointY.toFixed(0)} | Angle: ${angle.toFixed(1)}° | Selected: ${(inscribedAngle * 180 / Math.PI).toFixed(1)}°`;
  }
}

function checkAnswer() {
  if (!gameState.levelActive) return;
  const { mode, selectedAngle, targetAngle, tolerance } = gameState;
  let angleDiff = 0;
  let isCorrect = false;

  if (mode === 'central') {
    angleDiff = Math.abs(selectedAngle - targetAngle);
    isCorrect = angleDiff < tolerance * Math.PI / 180;
  } else if (mode === 'tangentChord') {
    angleDiff = Math.abs(selectedAngle - targetAngle);
    isCorrect = angleDiff < tolerance * Math.PI / 180;
  } else if (mode === 'cyclicQuad') {
    angleDiff = Math.abs(selectedAngle - targetAngle);
    isCorrect = angleDiff < tolerance * Math.PI / 180;
  } else if (mode === 'semicircle') {
    angleDiff = Math.abs(selectedAngle - Math.PI / 2);
    isCorrect = angleDiff < tolerance * Math.PI / 180;
  } else {
    angleDiff = Math.abs(selectedAngle - targetAngle);
    isCorrect = angleDiff < tolerance * Math.PI / 180;
  }

  const feedback = document.getElementById('feedbackBox');
  const lang = translations[gameState.currentLanguage];
  let coinReward = 0;
  if (isCorrect) {
    gameState.levelActive = false;
    gameState.dragDisabled = true;
    clearTimer();
    gameState.score++;
    coinReward = 10;
    if (gameState.timeRemaining > Math.max(3, gameState.timeLimit * 0.5)) {
      coinReward += 5;
    }
    addCoins(coinReward);
    checkUnlocks();
    feedback.textContent = lang.correct;
    feedback.className = 'feedback-box show correct';
    document.getElementById('checkBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('scoreDisplay').textContent = gameState.score;
    playSound('correct'); // 播放正确音效
    startFeedbackAnimation(true);
  } else {
    coinReward = 2;
    addCoins(coinReward);
    checkUnlocks();
    feedback.textContent = `${lang.incorrect}${(angleDiff * 180 / Math.PI).toFixed(1)}°)`;
    feedback.className = 'feedback-box show wrong';
    playSound('wrong'); // 播放错误音效
    startFeedbackAnimation(false);
  }
}

function nextLevel() {
  gameState.currentLevel++;
  document.getElementById('levelDisplay').textContent = gameState.currentLevel;
  playSound('levelComplete'); // 播放关卡完成音效
  generateNewLevel();
  draw();
}

function restartGame() {
  // Save to leaderboard before reset
  addToLeaderboard(gameState.score, gameState.coins);
  renderLeaderboard();
  gameState.currentLevel = 1;
  gameState.score = 0;
  gameState.difficulty = 'Easy';
  updateDifficultyDisplay();
  applyDifficultySettings();
  document.getElementById('levelDisplay').textContent = '1';
  document.getElementById('scoreDisplay').textContent = '0';
  // Optionally reset coins for new run (comment out if coins are persistent)
  // gameState.coins = 0; saveCoins(); updateCoinDisplay();
  generateNewLevel();
  draw();
}

function hideFeedback() {
  const feedback = document.getElementById('feedbackBox');
  feedback.className = 'feedback-box';
  feedback.textContent = '';
}

const themeToggle = document.getElementById('themeToggle');
const isDarkMode = localStorage.getItem('darkMode') === 'true';
if (isDarkMode) {
  document.body.classList.add('dark-mode');
  const icon = themeToggle.querySelector('i');
  icon.classList.remove('fa-moon');
  icon.classList.add('fa-sun');
  themeToggle.title = '切换到日间模式';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const newMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', newMode);
  const icon = themeToggle.querySelector('i');
  icon.classList.toggle('fa-sun', newMode);
  icon.classList.toggle('fa-moon', !newMode);
  themeToggle.title = newMode ? '切换到日间模式' : '切换到夜间模式';
  
  // Update color safe button style on theme change
  const colorSafeToggle = document.getElementById('colorSafeToggle');
  if (colorSafeToggle) {
    const isColorSafe = document.body.classList.contains('color-safe');
    updateColorSafeButtonStyle(colorSafeToggle, isColorSafe, newMode);
  }
});

const langToggle = document.getElementById('langToggle');
const translations = {
  en: {
    objective: '🎯 Objective',
    objectiveText: 'Drag the blue point on the circle to form the same inscribed angle as shown. The inscribed angle is determined by the position of your point relative to points A and B.',
    progress: '📊 Progress',
    level: 'Current Level:',
    score: 'Score:',
    target: 'Target Angle:',
    theorem: '✓ Theorem',
    theoremText: 'Inscribed angles subtended by the same arc are equal.',
    hint: '💡 Hint',
    hintText: 'Look for points on the circle that form the same angle when looking at points A and B. The angle remains constant on the same arc.',
    check: '✓ Check Answer',
    next: '→ Next Level',
    restart: '↺ Restart',
    canvasTitle: 'Circle Canvas',
    positionLabel: 'Point Position:',
    timeRemaining: 'Time Remaining:',
    coins: 'Coins:',
    leaderboard: '📋 Leaderboard',
    leaderboardBtn: '📋 Show Leaderboard',
    leaderboardHideBtn: '📋 Hide Leaderboard',
    noScores: 'No scores yet.',
    timeUp: '✗ Time is up! Try the next level.',
    correct: '✓ Correct! Great job!',
    incorrect: '✗ Not quite. Try again! (Difference: ',
    difficulty: 'Difficulty:',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    accessibility: 'Accessibility',
    colorSafe: 'Color Safe',
    fontSize: 'Font Size',
    small: 'Small',
    normal: 'Normal',
    large: 'Large',
    themeDay: 'Switch to day mode',
    themeNight: 'Switch to night mode',
    langToggle: '中文',
    breadcrumb: 'Homepage',
    gameTitle: 'Inscribed Angles Game',
    navHome: 'Homepage',
    navQuiz: 'Quiz',
    navGame: 'Game',
    centralAngle: 'Central Angle',
    inscribedAngle: 'Inscribed Angle',
    verificationPass: '✓ Verified',
    verificationFail: '✗ Calc: '
  },
  cn: {
    objective: '🎯 目标',
    objectiveText: '拖动圆上的蓝点以形成相同的圆周角。圆周角由您的点相对于点A和B的位置决定。',
    progress: '📊 进度',
    level: '当前级别:',
    score: '得分:',
    target: '目标角度:',
    theorem: '✓ 定理',
    theoremText: '由同一弧所对的圆周角相等。',
    hint: '💡 提示',
    hintText: '在圆上找到形成相同角度（观察点A和B）的点。角度在同一弧上保持不变。',
    check: '✓ 检查答案',
    next: '→ 下一关',
    restart: '↺ 重新开始',
    canvasTitle: '圆形画布',
    positionLabel: '点的位置:',
    timeRemaining: '剩余时间:',
    coins: ' coins:',
    leaderboard: '📋 排行榜',
    leaderboardBtn: '📋 显示排行榜',
    leaderboardHideBtn: '📋 隐藏排行榜',
    noScores: '暂无分数。',
    timeUp: '✗ 时间到！尝试下一关。',
    correct: '✓ 正确！做得好！',
    incorrect: '✗ 不太对。再试一次！（差异：',
    difficulty: '难度:',
    easy: '简单',
    medium: '中等',
    hard: '困难',
    accessibility: '无障碍',
    colorSafe: '色盲友好',
    fontSize: '字体大小',
    small: '小',
    normal: '正常',
    large: '大',
    themeDay: '切换到日间模式',
    themeNight: '切换到夜间模式',
    langToggle: 'EN',
    breadcrumb: '首页',
    gameTitle: '圆周角游戏',
    navHome: '首页',
    navQuiz: '测试',
    navGame: '游戏',
    centralAngle: '圆心角',
    inscribedAngle: '圆周角',
    verificationPass: '✓ 验证通过',
    verificationFail: '✗ 计算: '
  }
};

langToggle.addEventListener('click', () => {
  gameState.currentLanguage = gameState.currentLanguage === 'en' ? 'cn' : 'en';
  localStorage.setItem('language', gameState.currentLanguage);
  updateLanguageDisplay();
});

function updateLanguageDisplay() {
  const lang = translations[gameState.currentLanguage];
  
  // 更新语言切换按钮
  langToggle.textContent = lang.langToggle;
  
  // 更新页面标题
  document.querySelector('.page-title').textContent = lang.gameTitle;
  
  // 更新面包屑导航
  const breadcrumb = document.querySelector('.breadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `<a href="../HomePage/index.html">${lang.breadcrumb}</a> &gt;`;
  }
  
  // 更新导航栏链接
  const navLinks = document.querySelectorAll('.nav-menu a');
  if (navLinks.length >= 3) {
    navLinks[0].textContent = lang.navHome;
    navLinks[1].textContent = lang.navQuiz;
    navLinks[2].textContent = lang.navGame;
  }
  
  // 更新目标卡片
  const infoCards = document.querySelectorAll('.info-card');
  if (infoCards.length >= 4) {
    // 目标卡片
    const objectiveCard = infoCards[0];
    const objectiveTitle = objectiveCard.querySelector('.card-title');
    const objectiveContent = objectiveCard.querySelector('.card-content');
    if (objectiveTitle) objectiveTitle.textContent = lang.objective;
    if (objectiveContent) objectiveContent.textContent = lang.objectiveText;
    
    // 进度卡片
    const progressCard = infoCards[1];
    const progressTitle = progressCard.querySelector('.card-title');
    if (progressTitle) progressTitle.textContent = lang.progress;
    
    const statLabels = progressCard.querySelectorAll('.stat-label');
    if (statLabels.length >= 3) {
      statLabels[0].textContent = lang.level;
      statLabels[1].textContent = lang.score;
      statLabels[2].textContent = lang.target;
    }
    
    // 定理卡片
    const theoremCard = infoCards[2];
    const theoremTitle = theoremCard.querySelector('.card-title');
    if (theoremTitle) theoremTitle.textContent = lang.theorem;
    
    // 提示卡片
    const hintCard = infoCards[3];
    const hintTitle = hintCard.querySelector('.card-title');
    if (hintTitle) hintTitle.textContent = lang.hint;
  }
  
  // 更新按钮文本
  document.getElementById('checkBtn').textContent = lang.check;
  document.getElementById('nextBtn').textContent = lang.next;
  document.getElementById('restartBtn').textContent = lang.restart;
  
  // 更新画布标题
  document.querySelector('.canvas-title').textContent = lang.canvasTitle;
  
  // 更新位置显示标签
  const positionDisplay = document.querySelector('.position-display');
  if (positionDisplay) {
    const positionText = positionDisplay.querySelector('strong');
    if (positionText) {
      positionText.textContent = lang.positionLabel;
    }
  }
  
  // 更新难度控制
  const difficultyControl = document.getElementById('difficultyControl');
  if (difficultyControl) {
    const difficultyLabel = difficultyControl.querySelector('span');
    if (difficultyLabel) {
      difficultyLabel.textContent = lang.difficulty + ':';
    }
    const difficultyBtn = difficultyControl.querySelector('button');
    if (difficultyBtn) {
      const currentDifficulty = gameState.difficulty;
      if (currentDifficulty === 'Easy') {
        difficultyBtn.textContent = lang.easy;
      } else if (currentDifficulty === 'Medium') {
        difficultyBtn.textContent = lang.medium;
      } else if (currentDifficulty === 'Hard') {
        difficultyBtn.textContent = lang.hard;
      }
    }
  }
  
  // 更新无障碍控制
  const a11yToggleBtn = document.getElementById('a11yToggleBtn');
  if (a11yToggleBtn) {
    a11yToggleBtn.textContent = lang.accessibility;
  }
  
  const colorSafeToggle = document.getElementById('colorSafeToggle');
  if (colorSafeToggle) {
    colorSafeToggle.textContent = lang.colorSafe;
  }
  
  // 更新主题切换按钮标题
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    const isDarkMode = document.body.classList.contains('dark-mode');
    themeToggle.title = isDarkMode ? lang.themeDay : lang.themeNight;
  }
  
  // 更新排行榜相关文本
  const leaderboardToggleBtn = document.getElementById('leaderboardToggleBtn');
  if (leaderboardToggleBtn) {
    leaderboardToggleBtn.textContent = lang.leaderboardBtn;
  }
  
  // 更新定理文本
  setTheoremTexts();
  
  // 更新角度显示区域文本
  const angleLabels = document.querySelectorAll('.angle-label');
  if (angleLabels.length >= 2) {
    angleLabels[0].textContent = lang.centralAngle + ':';
    angleLabels[1].textContent = lang.inscribedAngle + ':';
  }
  
  const verificationText = document.getElementById('verificationText');
  if (verificationText) {
    verificationText.textContent = lang.centralAngle + ' = 2 × ' + lang.inscribedAngle;
  }
  
  // 更新验证结果文本
  const verificationResult = document.getElementById('verificationResult');
  if (verificationResult && verificationResult.textContent) {
    // 检查验证结果是否包含英文或中文的计算文本
    if (verificationResult.textContent.includes('Calc:') || verificationResult.textContent.includes('计算:')) {
      // 无论当前语言是什么，都重新计算并更新验证结果
      const inscribedAngle = gameState.inscribedAngle;
      const expectedCentral = 2 * inscribedAngle;
      verificationResult.textContent = lang.verificationFail + (expectedCentral * 180 / Math.PI).toFixed(1) + '°';
    }
  }
  
  // 更新反馈框中的时间到消息
  const feedback = document.getElementById('feedbackBox');
  if (feedback && feedback.textContent) {
    // 检查反馈框是否包含时间到消息
    const enTimeUp = translations.en.timeUp;
    const cnTimeUp = translations.cn.timeUp;
    if (feedback.textContent === enTimeUp || feedback.textContent === cnTimeUp) {
      // 如果是时间到消息，更新为当前语言的版本
      feedback.textContent = lang.timeUp;
    }
  }
}

// =====================
// ACCESSIBILITY SETUP
// =====================

function setupAccessibilityControls() {
  const a11yToggleBtn = document.getElementById('a11yToggleBtn');
  const a11yPanel = document.getElementById('a11yPanel');
  const fontDownBtn = document.getElementById('fontDownBtn');
  const fontResetBtn = document.getElementById('fontResetBtn');
  const fontUpBtn = document.getElementById('fontUpBtn');
  const colorSafeToggle = document.getElementById('colorSafeToggle');

  if (!a11yToggleBtn || !a11yPanel || !fontDownBtn || !fontResetBtn || !fontUpBtn || !colorSafeToggle) {
    return;
  }

  // Load saved preferences
  const savedFontScale = localStorage.getItem('fontScale') || 'normal';
  const savedColorSafe = localStorage.getItem('colorSafe') === 'true';
  const isDarkMode = localStorage.getItem('darkMode') === 'true';

  // Apply saved settings
  applyFontScale(savedFontScale);
  if (savedColorSafe) {
    document.body.classList.add('color-safe');
    updateColorSafeButtonStyle(colorSafeToggle, true, isDarkMode);
  }

  const setPanelOpen = (open) => {
    a11yPanel.classList.toggle('open', open);
    a11yToggleBtn.setAttribute('aria-expanded', open);
  };

  a11yToggleBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    setPanelOpen(!a11yPanel.classList.contains('open'));
  });

  a11yPanel.addEventListener('click', (event) => {
    event.stopPropagation();
  });

  document.addEventListener('click', () => {
    setPanelOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Escape') {
      setPanelOpen(false);
    }
  });

  fontDownBtn.addEventListener('click', () => applyFontScale('small'));
  fontResetBtn.addEventListener('click', () => applyFontScale('normal'));
  fontUpBtn.addEventListener('click', () => applyFontScale('large'));

  colorSafeToggle.addEventListener('click', () => {
    const isColorSafe = document.body.classList.toggle('color-safe');
    localStorage.setItem('colorSafe', isColorSafe);
    const isDark = document.body.classList.contains('dark-mode');
    updateColorSafeButtonStyle(colorSafeToggle, isColorSafe, isDark);
  });
}

function updateColorSafeButtonStyle(btn, isActive, isDarkMode) {
  if (isActive) {
    if (isDarkMode) {
      btn.style.background = 'rgba(13, 110, 253, 0.4)';
      btn.style.color = '#60a5fa';
    } else {
      btn.style.background = '#27ae60';
      btn.style.color = '#fff';
    }
  } else {
    if (isDarkMode) {
      btn.style.background = '#f5f5f5';
      btn.style.color = '#333';
    } else {
      btn.style.background = '#f5f5f5';
      btn.style.color = '#333';
    }
  }
}

function applyFontScale(scale) {
  document.body.classList.remove('font-small', 'font-normal', 'font-large');
  document.body.classList.add(`font-${scale}`);
  localStorage.setItem('fontScale', scale);
}

// =====================
// INITIALIZATION
// =====================

window.addEventListener('load', () => {
  setupAccessibilityControls();
  preloadSounds(); // 预加载音效
  initCanvas();
  updateLanguageDisplay();
  updateCoinDisplay();
  renderLeaderboard();
  createLeaderboardToggleButton();
});
