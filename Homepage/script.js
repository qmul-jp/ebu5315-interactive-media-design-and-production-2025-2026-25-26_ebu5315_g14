// V1版本基础交互 - 中英双语切换与夜间模式
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    const themeToggle = document.getElementById('themeToggle');
    let currentLang = localStorage.getItem('language') || 'en';
    let darkMode = localStorage.getItem('darkMode') === 'true';

    const translations = {
        en: {
            title: 'CircleLab - Learn Circle Geometry',
            langToggle: '中文',
            breadcrumb: 'Homepage',
            heroTitle: 'CircleLab – Starter Website Template for Learning',
            heroText: 'CircleLab is a starter template for students, educators, and math enthusiasts to explore circle geometry theorems through interactive lessons, visual proofs, and practice exercises.',
            conceptsTitle: 'Core Circle Geometry Concepts',
            concept1Title: 'Central Angle Theorem',
            concept1Text: 'The central angle measure equals its intercepted arc measure.',
            concept2Title: 'Inscribed Angle Theorem',
            concept2Text: 'An inscribed angle measures half of the arc it intercepts.',
            concept3Title: 'Tangent-Secant Angle',
            concept3Text: 'The angle between a tangent and secant equals half the difference of arcs.',
            concept4Title: 'Chord Properties',
            concept4Text: 'Equal chords subtend equal arcs and lie the same distance from the center.',
            concept5Title: 'Cyclic Quadrilateral',
            concept5Text: 'Opposite angles of a cyclic quadrilateral add up to 180°.',
            gameTitle: 'Game',
            gameText: 'Play & practice circle rules',
            quizTitle: 'Quiz',
            quizText: 'Test your circle knowledge',
            aiTitle: 'AI Chatbot',
            aiPlaceholder: 'Ask about circle geometry...',
            adTitle: 'advertisement',
            uspTitle: 'Our USP'
        },
        cn: {
            title: '圆几何实验室 - 学习圆几何定理',
            langToggle: 'EN',
            breadcrumb: '首页',
            heroTitle: '圆几何实验室 – 几何学习入门网站模板',
            heroText: '圆几何实验室是为学生、教育者和数学爱好者设计的入门模板，通过互动课程、可视化证明和练习来探索圆几何定理。',
            conceptsTitle: '核心圆几何概念',
            concept1Title: '中心角定理',
            concept1Text: '中心角的度数等于它所截弧的度数。',
            concept2Title: '圆周角定理',
            concept2Text: '圆周角的度数是它所截弧度数的一半。',
            concept3Title: '切线-割线角定理',
            concept3Text: '切线与割线夹角等于所截两条弧差的一半。',
            concept4Title: '弦的性质',
            concept4Text: '相等的弦所对的弧相等，且到圆心的距离相等。',
            concept5Title: '圆内接四边形',
            concept5Text: '圆内接四边形的对角相加等于180°。',
            gameTitle: '游戏',
            gameText: '通过游戏练习圆几何规则',
            quizTitle: '测验',
            quizText: '测试你的圆几何知识',
            aiTitle: 'AI聊天机器人',
            aiPlaceholder: '询问圆几何相关问题...',
            adTitle: '广告位',
            uspTitle: '我们的核心优势'
        }
    };

    function applyTheme(enableDark) {
        document.body.classList.toggle('dark-mode', enableDark);
        localStorage.setItem('darkMode', enableDark);

        const icon = themeToggle.querySelector('i');
        if (enableDark) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            themeToggle.title = '切换到日间模式';
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            themeToggle.title = '切换到夜间模式';
        }
    }

    function updateLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('language', lang);
        const t = translations[lang];

        langToggle.textContent = t.langToggle;
        document.title = t.title;
        document.querySelector('.breadcrumb').innerHTML = `<a href="index.html">${t.breadcrumb}</a> &gt;`;
        document.querySelector('.hero h1').textContent = t.heroTitle;
        document.querySelector('.hero p').textContent = t.heroText;
        document.querySelector('.concepts-card h2').textContent = t.conceptsTitle;
        document.getElementById('concept1').querySelector('h3').textContent = t.concept1Title;
        document.getElementById('concept1').querySelector('p').textContent = t.concept1Text;
        document.getElementById('concept2').querySelector('h3').textContent = t.concept2Title;
        document.getElementById('concept2').querySelector('p').textContent = t.concept2Text;
        document.getElementById('concept3').querySelector('h3').textContent = t.concept3Title;
        document.getElementById('concept3').querySelector('p').textContent = t.concept3Text;
        document.getElementById('concept4').querySelector('h3').textContent = t.concept4Title;
        document.getElementById('concept4').querySelector('p').textContent = t.concept4Text;
        document.getElementById('concept5').querySelector('h3').textContent = t.concept5Title;
        document.getElementById('concept5').querySelector('p').textContent = t.concept5Text;
        document.querySelector('.game-card h3').textContent = t.gameTitle;
        document.querySelector('.game-card p').textContent = t.gameText;
        document.querySelector('.quiz-card h3').textContent = t.quizTitle;
        document.querySelector('.quiz-card p').textContent = t.quizText;
        document.querySelector('.ai-card h3').textContent = t.aiTitle;
        document.querySelector('.chat-input input').placeholder = t.aiPlaceholder;
        document.querySelector('.ad-card h3').textContent = t.adTitle;
        document.querySelector('.usp-card h2').textContent = t.uspTitle;
    }

    langToggle.addEventListener('click', function() {
        updateLanguage(currentLang === 'en' ? 'cn' : 'en');
    });

    themeToggle.addEventListener('click', function() {
        applyTheme(!document.body.classList.contains('dark-mode'));
    });

    updateLanguage(currentLang);
    applyTheme(darkMode);
});