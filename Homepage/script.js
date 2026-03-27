// V1版本基础交互 - 中英双语切换（简化版）
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    let isEnglish = true;

    // 双语切换逻辑
    langToggle.addEventListener('click', function() {
        isEnglish = !isEnglish;
        updateLanguage(isEnglish);
    });

    // 夜间 / 日间模式切换逻辑
    const themeToggle = document.getElementById('themeToggle');
    let darkMode = false;

    themeToggle.addEventListener('click', function() {
        darkMode = !darkMode;
        document.body.classList.toggle('dark', darkMode);

        const icon = themeToggle.querySelector('i');
        if (darkMode) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeToggle.title = '切换到日间模式';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeToggle.title = '切换到夜间模式';
        }
    });

    // 更新页面文字
    function updateLanguage(isEn) {
        if (isEn) {
            // 英文
            langToggle.textContent = "EN/CN";
            document.title = "CircleLab - Learn Circle Geometry";
            document.querySelector('.hero h1').textContent = "CircleLab – Starter Website Template for Learning";
            document.querySelector('.hero p').textContent = "CircleLab is a starter template for students, educators, and math enthusiasts to explore circle geometry theorems through interactive lessons, visual proofs, and practice exercises.";
            document.querySelector('.concepts-card h2').textContent = "Core Circle Geometry Concepts";
            document.querySelector('.game-card h3').textContent = "Game";
            document.querySelector('.game-card p').textContent = "Play & practice circle rules";
            document.querySelector('.quiz-card h3').textContent = "Quiz";
            document.querySelector('.quiz-card p').textContent = "Test your circle knowledge";
            document.querySelector('.ai-card h3').textContent = "AI Chatbot";
            document.querySelector('.chat-input input').placeholder = "Ask about circle geometry...";
            document.querySelector('.ad-card h3').textContent = "advertisement";
            document.querySelector('.usp-card h2').textContent = "Our USP";
        } else {
            // 中文
            langToggle.textContent = "中文/英文";
            document.title = "圆几何实验室 - 学习圆几何定理";
            document.querySelector('.hero h1').textContent = "圆几何实验室 – 几何学习入门网站模板";
            document.querySelector('.hero p').textContent = "圆几何实验室是为学生、教育者和数学爱好者设计的入门模板，通过互动课程、可视化证明和练习来探索圆几何定理。";
            document.querySelector('.concepts-card h2').textContent = "核心圆几何概念";
            document.querySelector('.game-card h3').textContent = "游戏";
            document.querySelector('.game-card p').textContent = "通过游戏练习圆几何规则";
            document.querySelector('.quiz-card h3').textContent = "测验";
            document.querySelector('.quiz-card p').textContent = "测试你的圆几何知识";
            document.querySelector('.ai-card h3').textContent = "AI聊天机器人";
            document.querySelector('.chat-input input').placeholder = "询问圆几何相关问题...";
            document.querySelector('.ad-card h3').textContent = "广告位";
            document.querySelector('.usp-card h2').textContent = "我们的核心优势";
        }
    }
});