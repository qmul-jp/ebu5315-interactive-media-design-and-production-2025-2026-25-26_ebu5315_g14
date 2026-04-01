// Game page script
const storedLanguage = (localStorage.getItem('language') || 'en').toLowerCase();
const gameState = {
  currentLevel: 1,
  score: 0,
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
  targetAngle: null,
  selectedAngle: null,
  tolerance: 5,
  currentLanguage: storedLanguage === 'cn' ? 'cn' : 'en'
};

function initCanvas() {
  gameState.ctx = gameState.canvas.getContext('2d');
  gameState.centerX = gameState.canvas.width / 2;
  gameState.centerY = gameState.canvas.height / 2;
  gameState.pointX = gameState.centerX;
  gameState.pointY = gameState.centerY - gameState.radius;
  generateNewLevel();
  setupCanvasEvents();
  draw();
}

function generateNewLevel() {
  const angleA = Math.random() * Math.PI * 2;
  const angleB = angleA + (Math.PI / 3 + Math.random() * Math.PI / 6);

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

  gameState.targetAngle = calculateInscribedAngle(
    getThetaFromPoint(gameState.pointX, gameState.pointY),
    gameState.pointA,
    gameState.pointB
  );

  document.getElementById('angleDisplay').textContent = (gameState.targetAngle * 180 / Math.PI).toFixed(1) + '°';
  hideFeedback();
  document.getElementById('nextBtn').style.display = 'none';
  document.getElementById('checkBtn').style.display = 'block';
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

function draw() {
  const ctx = gameState.ctx;
  const { centerX, centerY, radius, pointX, pointY, pointA, pointB } = gameState;
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
  const angleDiff = Math.abs(gameState.selectedAngle - gameState.targetAngle);
  const isCorrect = angleDiff < gameState.tolerance * Math.PI / 180;
  const feedback = document.getElementById('feedbackBox');
  if (isCorrect) {
    gameState.score++;
    feedback.textContent = '✓ Correct! Great job!';
    feedback.className = 'feedback-box show correct';
    document.getElementById('checkBtn').style.display = 'none';
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('scoreDisplay').textContent = gameState.score;
  } else {
    feedback.textContent = `✗ Not quite. Try again! (Difference: ${(angleDiff * 180 / Math.PI).toFixed(1)}°)`;
    feedback.className = 'feedback-box show wrong';
  }
}

function nextLevel() {
  gameState.currentLevel++;
  document.getElementById('levelDisplay').textContent = gameState.currentLevel;
  generateNewLevel();
  draw();
}

function restartGame() {
  gameState.currentLevel = 1;
  gameState.score = 0;
  document.getElementById('levelDisplay').textContent = '1';
  document.getElementById('scoreDisplay').textContent = '0';
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
  document.getElementById('theoremText').textContent = lang.theoremText;
  document.querySelectorAll('.card-title')[3].textContent = lang.hint;
  document.getElementById('hintText').textContent = lang.hintText;
  document.getElementById('checkBtn').textContent = lang.check;
  document.getElementById('nextBtn').textContent = lang.next;
  document.getElementById('restartBtn').textContent = lang.restart;
  document.querySelector('.canvas-title').textContent = lang.canvasTitle;
}

window.addEventListener('load', () => {
  initCanvas();
  updateLanguageDisplay();
});
