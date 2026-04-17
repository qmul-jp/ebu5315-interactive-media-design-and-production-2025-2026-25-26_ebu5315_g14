// Game page script
const storedLanguage = (localStorage.getItem('language') || 'en').toLowerCase();
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
  difficulty: 'Easy'
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
    btn.textContent = leaderboardVisible ? '📋 隐藏排行榜' : '📋 显示排行榜';
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
  let html = '<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #eee;">';
  html += '<span style="font-weight:bold;font-size:1.1rem;">🏆 Leaderboard</span>';
  html += '<button id="leaderboardCloseBtn" style="background:none;border:none;font-size:1.2rem;cursor:pointer;color:#999;">✕</button>';
  html += '</div>';
  
  if (!arr.length) {
    html += '<div style="padding:16px;text-align:center;color:#999;">No scores yet.</div>';
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
  btn.textContent = '📋 显示排行榜';
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
  gameState.ctx = gameState.canvas.getContext('2d');
  gameState.centerX = gameState.canvas.width / 2;
  gameState.centerY = gameState.canvas.height / 2;
  createTimerDisplay();
  createDifficultyControl();
  generateNewLevel();
  setupCanvasEvents();
  draw();
}

function generateNewLevel() {
  applyDifficultySettings();
  gameState.currentTheoremType = selectRandomTheorem();
  gameState.pointC = null;
  gameState.pointD = null;
  gameState.levelActive = true;
  gameState.dragDisabled = false;

  const angleA = Math.random() * Math.PI * 2;
  let angleB;
  let sampleTheta;
  const difficulty = gameState.difficulty;

  const easyDelta = Math.PI / 3 + Math.random() * Math.PI / 6;
  const mediumDelta = Math.PI / 4 + Math.random() * Math.PI / 6;
  const hardDelta = Math.PI / 6 + Math.random() * Math.PI / 10;
  const delta = difficulty === 'Hard' ? hardDelta : difficulty === 'Medium' ? mediumDelta : easyDelta;

  if (gameState.currentTheoremType === 'semicircle') {
    angleB = angleA + Math.PI;
    sampleTheta = angleA + Math.PI * (difficulty === 'Hard' ? (0.15 + Math.random() * 0.7) : 0.35 + Math.random() * 0.3);
  } else if (gameState.currentTheoremType === 'equalChord') {
    angleB = angleA + delta;
    const angleC = angleA + Math.PI / 2;
    const angleD = angleC + delta;
    gameState.pointC = {
      x: gameState.centerX + gameState.radius * Math.cos(angleC),
      y: gameState.centerY + gameState.radius * Math.sin(angleC),
      angle: angleC
    };
    gameState.pointD = {
      x: gameState.centerX + gameState.radius * Math.cos(angleD),
      y: gameState.centerY + gameState.radius * Math.sin(angleD),
      angle: angleD
    };
    sampleTheta = angleA + delta / 2 + (difficulty === 'Hard' ? (Math.random() - 0.5) * delta * 0.7 : 0);
  } else {
    angleB = angleA + delta;
    sampleTheta = angleA + delta / 2 + (difficulty === 'Hard' ? (Math.random() - 0.5) * delta * 0.6 : 0);
  }

  gameState.pointA = {
    x: gameState.centerX + gameState.radius * Math.cos(angleA),
    y: gameState.centerY + gameState.radius * Math.sin(angleA),
    angle: angleA
  };

  gameState.pointB = {
    x: gameState.centerX + gameState.radius * Math.cos(angleB),
    y: gameState.centerY + gameState.radius * Math.sin(angleB),
    angle: angleB
  };

  gameState.pointX = gameState.centerX + gameState.radius * Math.cos(sampleTheta);
  gameState.pointY = gameState.centerY + gameState.radius * Math.sin(sampleTheta);

  if (gameState.currentTheoremType === 'semicircle') {
    gameState.targetAngle = Math.PI / 2;
  } else if (gameState.currentTheoremType === 'central') {
    gameState.targetAngle = calculateCentralAngle(gameState.pointA, gameState.pointB) / 2;
  } else if (gameState.currentTheoremType === 'equalChord') {
    gameState.targetAngle = calculateInscribedAngle(sampleTheta, gameState.pointC, gameState.pointD);
  } else {
    gameState.targetAngle = calculateInscribedAngle(sampleTheta, gameState.pointA, gameState.pointB);
  }

  document.getElementById('angleDisplay').textContent = (gameState.targetAngle * 180 / Math.PI).toFixed(1) + '°';
  gameState.feedbackAnimation = null;
  hideFeedback();
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('checkBtn').style.display = 'block';
  setTheoremTexts();
  resetTimer();
}

function getCanvasCoordinates(clientX, clientY) {
  const rect = gameState.canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (gameState.canvas.width / rect.width),
    y: (clientY - rect.top) * (gameState.canvas.height / rect.height)
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
  const cosAngle = dotProduct / (magA * magB);
  const clampedCos = Math.max(-1, Math.min(1, cosAngle));
  return Math.acos(clampedCos);
}

function selectRandomTheorem() {
  const theoremKeys = Object.keys(THEOREM_DEFINITIONS);
  return theoremKeys[Math.floor(Math.random() * theoremKeys.length)];
}

function calculateCentralAngle(pointA, pointB) {
  let diff = Math.abs(pointA.angle - pointB.angle);
  if (diff > Math.PI) diff = Math.PI * 2 - diff;
  return diff;
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
  feedback.textContent = '✗ Time is up! Try the next level.';
  feedback.className = 'feedback-box show wrong';
  document.getElementById('checkBtn').style.display = 'none';
  document.getElementById('nextBtn').style.display = 'block';
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

  if (currentTheoremType === 'central') {
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
  gameState.selectedAngle = calculateInscribedAngle(theta, pointA, pointB);
  drawFeedbackOverlay();
  document.getElementById('positionInfo').textContent = `X: ${pointX.toFixed(0)}, Y: ${pointY.toFixed(0)} | Angle: ${angle.toFixed(1)}° | Selected: ${(gameState.selectedAngle * 180 / Math.PI).toFixed(1)}°`;
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
}

function justifyDragStart(x, y) {
  if (gameState.dragDisabled) return;
  const dist = Math.hypot(x - gameState.pointX, y - gameState.pointY);
  if (dist < 25) {
    gameState.draggingPoint = true;
  }
}

function constrainPointToCircle(x, y) {
  const dx = x - gameState.centerX;
  const dy = y - gameState.centerY;
  const dist = Math.hypot(dx, dy);
  if (dist > gameState.radius) {
    gameState.pointX = gameState.centerX + (dx / dist) * gameState.radius;
    gameState.pointY = gameState.centerY + (dy / dist) * gameState.radius;
  } else {
    gameState.pointX = x;
    gameState.pointY = y;
  }
}

function checkAnswer() {
  if (!gameState.levelActive) return;
  const angleDiff = Math.abs(gameState.selectedAngle - gameState.targetAngle);
  const isCorrect = angleDiff < gameState.tolerance * Math.PI / 180;
  const feedback = document.getElementById('feedbackBox');
  let coinReward = 0;
  if (isCorrect) {
    gameState.levelActive = false;
    gameState.dragDisabled = true;
    clearTimer();
    gameState.score++;
    // Coin logic
    coinReward = 10;
    // Fast answer bonus (optional):
    if (gameState.timeRemaining > Math.max(3, gameState.timeLimit * 0.5)) {
      coinReward += 5;
    }
    addCoins(coinReward);
    checkUnlocks();
    feedback.textContent = '✓ Correct! Great job!';
    feedback.className = 'feedback-box show correct';
    document.getElementById('checkBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('scoreDisplay').textContent = gameState.score;
    startFeedbackAnimation(true);
  } else {
    coinReward = 2;
    addCoins(coinReward);
    checkUnlocks();
    feedback.textContent = `✗ Not quite. Try again! (Difference: ${(angleDiff * 180 / Math.PI).toFixed(1)}°)`;
    feedback.className = 'feedback-box show wrong';
    startFeedbackAnimation(false);
  }
}

function nextLevel() {
  gameState.currentLevel++;
  document.getElementById('levelDisplay').textContent = gameState.currentLevel;
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
    positionLabel: 'Point Position:'
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
    positionLabel: '点的位置:'
  }
};

langToggle.addEventListener('click', () => {
  gameState.currentLanguage = gameState.currentLanguage === 'en' ? 'cn' : 'en';
  localStorage.setItem('language', gameState.currentLanguage);
  updateLanguageDisplay();
});

function updateLanguageDisplay() {
  const lang = translations[gameState.currentLanguage];
  langToggle.textContent = gameState.currentLanguage === 'en' ? '中文' : 'EN';
  document.querySelectorAll('.card-title')[0].textContent = lang.objective;
  document.querySelectorAll('.card-content')[0].textContent = lang.objectiveText;
  document.querySelectorAll('.card-title')[1].textContent = lang.progress;
  document.querySelectorAll('.stat-label')[0].textContent = lang.level;
  document.querySelectorAll('.stat-label')[1].textContent = lang.score;
  document.querySelectorAll('.stat-label')[2].textContent = lang.target;
  document.querySelectorAll('.card-title')[2].textContent = lang.theorem;
  document.querySelectorAll('.card-title')[3].textContent = lang.hint;
  document.getElementById('checkBtn').textContent = lang.check;
  document.getElementById('nextBtn').textContent = lang.next;
  document.getElementById('restartBtn').textContent = lang.restart;
  document.querySelector('.canvas-title').textContent = lang.canvasTitle;
  setTheoremTexts();
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
  initCanvas();
  updateLanguageDisplay();
  updateCoinDisplay();
  renderLeaderboard();
  createLeaderboardToggleButton();
});
