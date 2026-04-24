// V1版本基础交互 - 中英双语切换与夜间模式
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    const themeToggle = document.getElementById('themeToggle');
    const navbar = document.querySelector('.navbar');
    let currentLang = localStorage.getItem('language') || 'en';
    let darkMode = localStorage.getItem('darkMode') === 'true';

    function syncNavbarOffset() {
        if (!navbar) return;
        const height = Math.ceil(navbar.getBoundingClientRect().height);
        document.body.style.setProperty('--nav-offset', `${height + 8}px`);
    }

    const scheduleNavbarOffsetSync = () => {
        requestAnimationFrame(syncNavbarOffset);
    };

    window.addEventListener('resize', scheduleNavbarOffsetSync);
    window.addEventListener('orientationchange', scheduleNavbarOffsetSync);

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
            concept6Title: 'Angle in a Semicircle',
            concept6Text: 'An angle in a semicircle is a right angle.',
            concept7Title: 'Radius to Tangent',
            concept7Text: 'A radius to the tangent point is perpendicular to the tangent.',
            concept8Title: 'Alternate Segment Theorem',
            concept8Text: 'The angle between tangent and chord equals the opposite inscribed angle.',
            gameTitle: 'Game',
            gameText: 'Play & practice circle rules',
            quizTitle: 'Quiz',
            quizText: 'Test your circle knowledge',
            aiTitle: 'AI Chatbot',
            aiPlaceholder: 'Ask about circle geometry...',
            adTitle: 'advertisement',
            uspTitle: 'Our USP',
            usp1Title: 'Visual Learning',
            usp1Text: 'Interactive animations help visualize complex geometric relationships',
            usp2Title: 'Interactive Control',
            usp2Text: 'Play/pause animations to inspect details at your own pace',
            usp3Title: 'Real-time Data',
            usp3Text: 'See actual angle values and measurements as animations progress',
            usp4Title: 'Bilingual Support',
            usp4Text: 'Learn in English or Chinese, switch anytime',
            usp5Title: 'Dark Mode',
            usp5Text: 'Comfortable learning in any lighting condition',
            modalSelectBtn: 'Use this animation',
            navHomepage: 'Homepage',
            navQuiz: 'Quiz',
            navGame: 'Game',
            prevButton: '← Previous',
            nextButton: 'Next →',
            pauseLabel: '⏸ Pause',
            playLabel: '▶ Play',
            sendButton: 'Send',
            chatWelcome: 'Hi! Ask me about circle theorems, arcs, tangents, chords and more.',
            chatFallback: 'I can help explain circle geometry theorems. Try asking about central angle, inscribed angle, tangent or chord properties.',
            theoremDesc1: 'The central angle equals the arc it intercepts.',
            theoremDesc2: 'The inscribed angle is half of the intercepted arc.',
            theoremDesc3: 'The angle between tangent and secant is half the arc difference.',
            theoremDesc4: 'Equal chords are equidistant from the center.',
            theoremDesc5: 'Opposite angles in a cyclic quadrilateral sum to 180°.'
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
            concept6Title: '半圆内角定理',
            concept6Text: '半圆内的角为直角。',
            concept7Title: '半径与切线',
            concept7Text: '到切点的半径与切线垂直。',
            concept8Title: '交替弓形定理',
            concept8Text: '切线与弦之间的角等于对面的圆周角。',
            gameTitle: '游戏',
            gameText: '通过游戏练习圆几何规则',
            quizTitle: '测验',
            quizText: '测试你的圆几何知识',
            aiTitle: 'AI聊天机器人',
            aiPlaceholder: '询问圆几何相关问题...',
            adTitle: '广告位',
            uspTitle: '我们的核心优势',
            usp1Title: '可视化学习',
            usp1Text: '交互式动画帮助可视化复杂的几何关系',
            usp2Title: '交互式控制',
            usp2Text: '暂停/播放动画，按你的节奏查看细节',
            usp3Title: '实时数据',
            usp3Text: '在动画运行时查看实际的角度值和测量数据',
            usp4Title: '双语支持',
            usp4Text: '用英文或中文学习，随时切换',
            usp5Title: '深色模式',
            usp5Text: '在任何光照条件下舒适学习',
            modalSelectBtn: '使用此动画',
            navHomepage: '首页',
            navQuiz: '测验',
            navGame: '游戏',
            prevButton: '← 上一个',
            nextButton: '下一个 →',
            pauseLabel: '⏸ 暂停',
            playLabel: '▶ 播放',
            sendButton: '发送',
            chatWelcome: '你好！可以问我圆几何定理、弧、切线、弦等问题。',
            chatFallback: '我可以帮助解释圆几何定理。试试问中心角、圆周角、切线或弦的性质。',
            theoremDesc1: '中心角的度数等于所截弧的度数。',
            theoremDesc2: '圆周角的度数等于所截弧度数的一半。',
            theoremDesc3: '切线与割线夹角等于所截两条弧差的一半。',
            theoremDesc4: '相等的弦到圆心的距离相等。',
            theoremDesc5: '圆内接四边形的对角和为180°。'
        }
    };

    window.circleTranslations = translations;
    const complianceText = {
        en: {
            colorSafe: 'Color Safe',
            a11yToggle: 'Accessibility',
            footerContactBtn: 'Contact',
            footerPrivacyBtn: 'Privacy',
            resourceLabel: 'Explore Dynamic Geometry:',
            contactTitle: 'Contact Us',
            contactNameLabel: 'Name (optional)',
            contactNamePlaceholder: 'How should we address you?',
            contactEmailLabel: 'Email',
            contactEmailPlaceholder: 'you@example.com',
            contactMessageLabel: 'Message',
            contactMessagePlaceholder: 'Tell us what you need help with.',
            contactSubmitBtn: 'Send Message',
            contactSuccess: 'Message received. We will reply via email soon.',
            contactError: 'Please provide a valid email and message.',
            policyTitle: 'Privacy & Preference',
            policySummary: 'We only store local preferences (language, theme, accessibility, consent choices) in your browser and do not send personal data to a server.',
            optOutAdsLabel: 'Opt out of personalized ads',
            optOutAnalyticsLabel: 'Opt out of analytics cookies',
            hideAdsLabel: 'Hide ad banner',
            savePolicyBtn: 'Save Preferences',
            policySaved: 'Preferences saved on this device.'
        },
        cn: {
            colorSafe: '色盲友好',
            a11yToggle: '无障碍',
            footerContactBtn: '联系我们',
            footerPrivacyBtn: '隐私政策',
            resourceLabel: '动态几何参考：',
            contactTitle: '联系我们',
            contactNameLabel: '称呼（可选）',
            contactNamePlaceholder: '我们应如何称呼你？',
            contactEmailLabel: '邮箱',
            contactEmailPlaceholder: 'you@example.com',
            contactMessageLabel: '留言内容',
            contactMessagePlaceholder: '请告诉我们你需要的帮助。',
            contactSubmitBtn: '发送消息',
            contactSuccess: '消息已收到，我们会尽快通过邮箱回复。',
            contactError: '请填写有效邮箱和留言内容。',
            policyTitle: '隐私与偏好设置',
            policySummary: '我们仅在你的浏览器本地保存语言、主题、无障碍和同意偏好，不会上传个人数据到服务器。',
            optOutAdsLabel: '退出个性化广告',
            optOutAnalyticsLabel: '退出分析类 Cookie',
            hideAdsLabel: '隐藏广告横幅',
            savePolicyBtn: '保存偏好',
            policySaved: '偏好已保存到本设备。'
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
        const conceptItems = document.querySelectorAll('.concept-item[data-theorem-index]');
        conceptItems.forEach(card => {
            const index = Number(card.dataset.theoremIndex) + 1;
            const titleKey = `concept${index}Title`;
            const textKey = `concept${index}Text`;
            const titleEl = card.querySelector('h3');
            const textEl = card.querySelector('p');
            if (titleEl && t[titleKey]) titleEl.textContent = t[titleKey];
            if (textEl && t[textKey]) textEl.textContent = t[textKey];
        });
        const navLinks = document.querySelectorAll('.nav-menu .nav-link');
        if (navLinks.length >= 3) {
            navLinks[0].textContent = t.navHomepage;
            navLinks[1].textContent = t.navQuiz;
            navLinks[2].textContent = t.navGame;
        }
        document.querySelector('.game-card h3').textContent = t.gameTitle;
        document.querySelector('.game-card p').textContent = t.gameText;
        document.querySelector('.quiz-card h3').textContent = t.quizTitle;
        document.querySelector('.quiz-card p').textContent = t.quizText;
        document.getElementById('aiChatTitle').textContent = t.aiTitle;
        const chatInput = document.getElementById('chatInput');
        if (chatInput) chatInput.placeholder = t.aiPlaceholder;
        document.getElementById('chatSendBtn').textContent = t.sendButton;
        
        // 更新清除按钮文本
        const chatClearBtn = document.getElementById('chatClearBtn');
        if (chatClearBtn) {
            chatClearBtn.textContent = lang === 'en' ? '🗑 Clear' : '🗑 清除';
            chatClearBtn.title = lang === 'en' ? 'Clear chat history' : '清除对话记录';
        }
        
        document.querySelector('.ad-card h3').textContent = t.adTitle;
        document.querySelector('#usp-title').textContent = t.uspTitle;
        document.getElementById('prevTheorem').textContent = t.prevButton;
        document.getElementById('nextTheorem').textContent = t.nextButton;
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.textContent = theoremVisualizer && theoremVisualizer.isPlaying ? t.pauseLabel : t.playLabel;
        }
        
        // 更新USP内容
        document.querySelector('#usp1 h4').textContent = t.usp1Title;
        document.querySelector('#usp1 p').textContent = t.usp1Text;
        document.querySelector('#usp2 h4').textContent = t.usp2Title;
        document.querySelector('#usp2 p').textContent = t.usp2Text;
        document.querySelector('#usp3 h4').textContent = t.usp3Title;
        document.querySelector('#usp3 p').textContent = t.usp3Text;
        document.querySelector('#usp4 h4').textContent = t.usp4Title;
        document.querySelector('#usp4 p').textContent = t.usp4Text;
        document.querySelector('#usp5 h4').textContent = t.usp5Title;
        document.querySelector('#usp5 p').textContent = t.usp5Text;
        document.getElementById('modalSelectBtn').textContent = t.modalSelectBtn;
        localizeComplianceBlocks(lang);
        scheduleNavbarOffsetSync();
        
        // 更新定理相关文本
        if (theoremVisualizer) theoremVisualizer.updateLanguage(lang);
    }

    function localizeComplianceBlocks(lang) {
        const c = complianceText[lang] || complianceText.en;
        const mapText = [
            ['a11yToggleBtn', c.a11yToggle],
            ['colorSafeToggle', c.colorSafe],
            ['openContactModalBtn', c.footerContactBtn],
            ['openPolicyModalBtn', c.footerPrivacyBtn],
            ['resourceLabel', c.resourceLabel],
            ['contactTitle', c.contactTitle],
            ['contactNameLabel', c.contactNameLabel],
            ['contactEmailLabel', c.contactEmailLabel],
            ['contactMessageLabel', c.contactMessageLabel],
            ['contactSubmitBtn', c.contactSubmitBtn],
            ['policyTitle', c.policyTitle],
            ['policySummary', c.policySummary],
            ['optOutAdsLabel', c.optOutAdsLabel],
            ['optOutAnalyticsLabel', c.optOutAnalyticsLabel],
            ['hideAdsLabel', c.hideAdsLabel],
            ['savePolicyBtn', c.savePolicyBtn]
        ];

        mapText.forEach(([id, value]) => {
            const node = document.getElementById(id);
            if (node) node.textContent = value;
        });

        const nameInput = document.getElementById('contactName');
        const emailInput = document.getElementById('contactEmail');
        const messageInput = document.getElementById('contactMessage');
        if (nameInput) nameInput.placeholder = c.contactNamePlaceholder;
        if (emailInput) emailInput.placeholder = c.contactEmailPlaceholder;
        if (messageInput) messageInput.placeholder = c.contactMessagePlaceholder;
    }

    function setupConceptDetails() {
        const cards = document.querySelectorAll('.concept-item[data-theorem-index]');
        const modal = document.getElementById('theoremModal');
        const modalClose = document.getElementById('modalCloseBtn');
        const modalSelect = document.getElementById('modalSelectBtn');

        cards.forEach(card => {
            card.addEventListener('click', () => {
                const index = Number(card.dataset.theoremIndex);
                openTheoremModal(index);
            });
        });

        if (modalClose) {
            modalClose.addEventListener('click', closeTheoremModal);
        }

        if (modal) {
            modal.addEventListener('click', event => {
                if (event.target === modal) {
                    closeTheoremModal();
                }
            });
        }

        if (modalSelect) {
            modalSelect.addEventListener('click', () => {
                const index = Number(modalSelect.dataset.theoremIndex);
                if (!isNaN(index) && theoremVisualizer) {
                    theoremVisualizer.currentTheorem = index;
                    theoremVisualizer.animationTime = 0;
                    theoremVisualizer.updateDisplay();
                }
                closeTheoremModal();
            });
        }
    }

    function setupActionCards() {
        const cards = document.querySelectorAll('.action-card[data-target]');
        cards.forEach(card => {
            const target = card.dataset.target;
            card.addEventListener('click', () => {
                if (target === 'quiz') {
                    window.location.href = '../Quiz/quiz.html';
                } else if (target === 'game') {
                    window.location.href = '../Game/game.html';
                }
            });
            card.addEventListener('keypress', event => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    card.click();
                }
            });
        });
    }

    function initChatbot() {
        const chatInput = document.getElementById('chatInput');
        const chatSendBtn = document.getElementById('chatSendBtn');
        if (!chatInput || !chatSendBtn) return;

        // 创建清除对话按钮
        createChatClearButton();

        const sendMessage = () => {
            const message = chatInput.value.trim();
            if (!message) return;
            
            appendChatMessage('user', message);
            chatInput.value = '';
            chatInput.focus();
            chatSendBtn.disabled = true;

            // 显示typing指示器
            showTypingIndicator();

            // 延迟回复，更自然
            setTimeout(() => {
                removeTypingIndicator();
                const response = getChatbotResponse(message);
                appendChatMessage('bot', response);
                chatSendBtn.disabled = false;
            }, 600 + Math.random() * 400);
        };

        chatSendBtn.addEventListener('click', sendMessage);
        chatInput.addEventListener('keypress', event => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                if (!chatSendBtn.disabled) sendMessage();
            }
        });

        appendChatMessage('bot', translations[currentLang].chatWelcome);
    }

    function createChatClearButton() {
        if (document.getElementById('chatClearBtn')) return;
        const aiCard = document.querySelector('.ai-card');
        if (!aiCard) return;
        
        const clearBtn = document.createElement('button');
        clearBtn.id = 'chatClearBtn';
        clearBtn.className = 'chat-clear-btn';
        clearBtn.textContent = currentLang === 'en' ? '🗑 Clear' : '🗑 清除';
        clearBtn.type = 'button';
        clearBtn.title = currentLang === 'en' ? 'Clear chat history' : '清除对话记录';
        clearBtn.addEventListener('click', clearChatHistory);
        
        const chatInputRow = aiCard.querySelector('.chat-input-row');
        if (chatInputRow) {
            chatInputRow.appendChild(clearBtn);
        }
    }

    function clearChatHistory() {
        const history = document.getElementById('chatHistory');
        if (history) {
            history.innerHTML = '';
            appendChatMessage('bot', translations[currentLang].chatWelcome);
        }
    }

    function showTypingIndicator() {
        const history = document.getElementById('chatHistory');
        if (!history) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'chatTypingIndicator';
        typingDiv.className = 'chat-message bot';
        typingDiv.innerHTML = `
            <div class="message-bubble typing-bubble">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
        `;
        history.appendChild(typingDiv);
        history.scrollTop = history.scrollHeight;
    }

    function removeTypingIndicator() {
        const typing = document.getElementById('chatTypingIndicator');
        if (typing) typing.remove();
    }

    function appendChatMessage(sender, text) {
        const history = document.getElementById('chatHistory');
        if (!history) return;
        
        const message = document.createElement('div');
        message.className = `chat-message ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        
        const timestamp = document.createElement('div');
        timestamp.className = 'message-time';
        const now = new Date();
        timestamp.textContent = now.toLocaleTimeString(currentLang === 'en' ? 'en-US' : 'zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit'
        });
        
        message.appendChild(bubble);
        message.appendChild(timestamp);
        history.appendChild(message);
        history.scrollTop = history.scrollHeight;
    }

    function getChatbotResponse(text) {
        const lower = text.toLowerCase();
        const t = translations[currentLang];
        
        // 问候和闲聊
        const greetingPatterns = {
            en: [
                { regex: /^(hi|hello|hey|greetings)$/i, answer: 'Hello! 👋 How can I help you with circle geometry today?' },
                { regex: /thanks|thank you|appreciate/i, answer: 'You\'re welcome! 😊 Feel free to ask more questions about circle theorems.' },
                { regex: /how are you|how\'s it/i, answer: 'I\'m here and ready to help! 🎓 What would you like to learn about circles?' },
                { regex: /help|what can you do/i, answer: 'I can explain circle theorems like central angles, inscribed angles, tangent-secant angles, chord properties, cyclic quadrilaterals, angles in semicircles, radius to tangent, and alternate segment theorem. Just ask!' }
            ],
            cn: [
                { regex: /^(你好|嗨|你好吗|哈喽)$/i, answer: '你好！👋 有什么关于圆几何的问题吗？' },
                { regex: /谢谢|感谢|多谢/i, answer: '不客气！😊 欢迎继续提问圆几何问题。' },
                { regex: /你好吗|怎么样/i, answer: '我已准备好帮助你！🎓 想学什么关于圆的知识吗？' },
                { regex: /帮助|你能做什么/i, answer: '我可以解释圆几何定理，如中心角、圆周角、切线-割线角、弦的性质、圆内接四边形、半圆内角、半径与切线、交替弓形定理。尽管问吧！' }
            ]
        };

        // 主要定理模式
        const theoremPatterns = {
            en: [
                { regex: /central|center|中心/, answer: 'The central angle equals the measure of its intercepted arc. It is drawn from the circle center to two points on the circle. 📐' },
                { regex: /inscribed|circumference|圆周|圆周角/, answer: 'An inscribed angle measures half of its intercepted arc, because the arc is subtended by the same chord from the circle center. 🎯' },
                { regex: /tangent|secant|切线|割线/, answer: 'The tangent-secant angle is half the difference of the arcs intercepted by the secant and tangent lines. ✨' },
                { regex: /chord|arc|弦|弧/, answer: 'Equal chords subtend equal arcs and are equidistant from the center of the circle. 🔄' },
                { regex: /cyclic|quadrilateral|内接|四边形/, answer: 'Opposite angles of a cyclic quadrilateral sum to 180° because they subtend supplementary arcs. 📊' },
                { regex: /semicircle|diameter|half|90|right angle|半圆|直径/, answer: 'An angle in a semicircle is a right angle (90°), because it subtends a diameter. 📏' },
                { regex: /radius|tangent point|perpendicular|垂直/, answer: 'The radius drawn to the tangent point is perpendicular to the tangent line. This is a key property! 🎪' },
                { regex: /alternate|segment|交替|弓形/, answer: 'In the alternate segment theorem, the angle between a tangent and a chord equals the angle in the opposite segment. 🔑' }
            ],
            cn: [
                { regex: /中心角|中心/, answer: '中心角的度数等于它所截弧的度数。它由圆心连接圆上的两点形成。 📐' },
                { regex: /圆周角|圆周/, answer: '圆周角的度数等于它所截弧度数的一半，因为它所对的弧在圆心处对应的角是两倍。 🎯' },
                { regex: /切线|割线/, answer: '切线与割线所夹的角等于它们所截弧差的一半。 ✨' },
                { regex: /弦|弧/, answer: '相等的弦所对的弧相等，并且到圆心的距离也相等。 🔄' },
                { regex: /圆内接四边形|内接四边形|四边形/, answer: '圆内接四边形的对角和为180°，因为它们分别对着互补的弧。 📊' },
                { regex: /半圆|直径|直角|90/, answer: '半圆内的圆周角为直角（90°），因为它所对的弧是直径。 📏' },
                { regex: /半径|切点|垂直/, answer: '到切点的半径与切线垂直。这是一个重要的性质！ 🎪' },
                { regex: /交替|弓形/, answer: '交替弓形定理说明切线与弦之间的角等于对面弧中对应的圆周角。 🔑' }
            ]
        };

        // 先检查问候模式
        const langGreetings = greetingPatterns[currentLang] || greetingPatterns.en;
        for (const item of langGreetings) {
            if (item.regex.test(lower)) {
                return item.answer;
            }
        }

        // 然后检查定理模式
        const langTheorems = theoremPatterns[currentLang] || theoremPatterns.en;
        for (const item of langTheorems) {
            if (item.regex.test(lower)) {
                return item.answer;
            }
        }

        // 默认回复
        return t.chatFallback;
    }

    function openTheoremModal(index) {
        const modal = document.getElementById('theoremModal');
        if (!modal || !theoremVisualizer) return;
        const theorem = theoremVisualizer.theorems[index];
        if (!theorem) return;
        const text = theorem[currentLang] || theorem.en;
        document.getElementById('modalTheoremTitle').textContent = text.title;
        document.getElementById('modalTheoremBody').textContent = text.desc;
        document.getElementById('modalTheoremDetail').textContent = text.detail || '';
        const modalSelect = document.getElementById('modalSelectBtn');
        modalSelect.dataset.theoremIndex = index;
        modalSelect.textContent = translations[currentLang].modalSelectBtn;
        modal.classList.remove('hidden');
    }

    function closeTheoremModal() {
        const modal = document.getElementById('theoremModal');
        if (modal) modal.classList.add('hidden');
    }

    function applyFontScale(scale) {
        document.body.classList.remove('font-small', 'font-normal', 'font-large');
        document.body.classList.add(`font-${scale}`);
        localStorage.setItem('fontScale', scale);
    }

    function setupAccessibilityControls() {
        const a11yToggleBtn = document.getElementById('a11yToggleBtn');
        const a11yPanel = document.getElementById('a11yPanel');
        const fontDownBtn = document.getElementById('fontDownBtn');
        const fontResetBtn = document.getElementById('fontResetBtn');
        const fontUpBtn = document.getElementById('fontUpBtn');
        const colorSafeToggle = document.getElementById('colorSafeToggle');

        if (!a11yToggleBtn || !a11yPanel || !fontDownBtn || !fontResetBtn || !fontUpBtn || !colorSafeToggle) return;

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

    function setupContactForm() {
        const form = document.getElementById('contactForm');
        const status = document.getElementById('contactStatus');
        if (!form || !status) return;

        form.addEventListener('submit', event => {
            event.preventDefault();
            const email = (document.getElementById('contactEmail') || {}).value || '';
            const message = (document.getElementById('contactMessage') || {}).value || '';
            const c = complianceText[currentLang] || complianceText.en;

            if (!email.includes('@') || message.trim().length < 3) {
                status.textContent = c.contactError;
                status.style.color = '#b91c1c';
                return;
            }

            status.textContent = c.contactSuccess;
            status.style.color = '#0f766e';
            form.reset();
        });
    }

    function setupPolicyPreferences() {
        const optOutAds = document.getElementById('optOutAds');
        const optOutAnalytics = document.getElementById('optOutAnalytics');
        const hideAds = document.getElementById('hideAds');
        const savePolicyBtn = document.getElementById('savePolicyBtn');
        const policyStatus = document.getElementById('policyStatus');
        const adCard = document.querySelector('.ad-card');

        if (!optOutAds || !optOutAnalytics || !hideAds || !savePolicyBtn || !policyStatus) return;

        // 第一次打开网页时默认全不勾选
        optOutAds.checked = false;
        optOutAnalytics.checked = false;
        hideAds.checked = false;
        if (adCard) adCard.style.display = '';

        savePolicyBtn.addEventListener('click', () => {
            localStorage.setItem('optOutAds', String(optOutAds.checked));
            localStorage.setItem('optOutAnalytics', String(optOutAnalytics.checked));
            localStorage.setItem('hideAds', String(hideAds.checked));
            if (adCard) adCard.style.display = hideAds.checked ? 'none' : '';
            const c = complianceText[currentLang] || complianceText.en;
            policyStatus.textContent = c.policySaved;
        });
    }

    function setupFooterPopups() {
        const contactModal = document.getElementById('contactModal');
        const policyModal = document.getElementById('policyModal');
        const openContact = document.getElementById('openContactModalBtn');
        const openPolicy = document.getElementById('openPolicyModalBtn');
        const closeContact = document.getElementById('contactModalCloseBtn');
        const closePolicy = document.getElementById('policyModalCloseBtn');

        if (openContact && contactModal) {
            openContact.addEventListener('click', () => {
                contactModal.classList.remove('hidden');
            });
        }

        if (openPolicy && policyModal) {
            openPolicy.addEventListener('click', () => {
                policyModal.classList.remove('hidden');
            });
        }

        if (closeContact && contactModal) {
            closeContact.addEventListener('click', () => {
                contactModal.classList.add('hidden');
            });
        }

        if (closePolicy && policyModal) {
            closePolicy.addEventListener('click', () => {
                policyModal.classList.add('hidden');
            });
        }

        [contactModal, policyModal].forEach(modal => {
            if (!modal) return;
            modal.addEventListener('click', event => {
                if (event.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        });
    }

    langToggle.addEventListener('click', function() {
        updateLanguage(currentLang === 'en' ? 'cn' : 'en');
    });

    themeToggle.addEventListener('click', function() {
        applyTheme(!document.body.classList.contains('dark-mode'));
    });

    // 初始化定理可视化
    initTheoremVisualizer(currentLang);
    setupAccessibilityControls();
    setupContactForm();
    setupPolicyPreferences();
    setupFooterPopups();
    updateLanguage(currentLang);
    setupConceptDetails();
    setupActionCards();
    initChatbot();
    applyTheme(darkMode);
    scheduleNavbarOffsetSync();
    setTimeout(syncNavbarOffset, 120);
});

// ==================== 定理动画可视化代码 ====================
let theoremVisualizer = null;

function initTheoremVisualizer(lang) {
    const canvas = document.getElementById('theoremCanvas');
    if (!canvas) return;

    theoremVisualizer = new TheoremAnimator(canvas, lang);
    theoremVisualizer.init();
}

class TheoremAnimator {
    constructor(canvas, lang) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.currentTheorem = 0;
        this.language = lang;
        this.animationTime = 0;
        this.animationFrame = null;
        this.isPlaying = true;
        this.lastTimestamp = 0;
        this.dpr = window.devicePixelRatio || 1;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        
        // 设置Canvas的实际尺寸（像素）
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // 定理数据
        this.theorems = [
            {
                en: { title: 'Central Angle Theorem', desc: 'The central angle equals the arc it intercepts.', detail: 'The central angle and its intercepted arc have the same measure. This animation shows the angle at the center and the corresponding arc.' },
                cn: { title: '中心角定理', desc: '中心角的度数等于所截弧的度数。', detail: '中心角与它所截弧的度数相等。动画展示圆心角与对应弧之间的关系。' }
            },
            {
                en: { title: 'Inscribed Angle Theorem', desc: 'The inscribed angle is half of the intercepted arc.', detail: 'An angle formed by two chords at a point on the circle measures half of its intercepted arc.' },
                cn: { title: '圆周角定理', desc: '圆周角的度数是它所截弧度数的一半。', detail: '在圆上两条弦形成的角，其度数等于所截弧度数的一半。' }
            },
            {
                en: { title: 'Tangent-Secant Angle', desc: 'The angle equals half the difference of intercepted arcs.', detail: 'The angle between a tangent and a secant is half the difference of the arcs between the two secant points.' },
                cn: { title: '切线-割线角定理', desc: '切线与割线夹角等于所截两条弧差的一半。', detail: '切线与割线之间的角等于两条割线所截弧差的一半。' }
            },
            {
                en: { title: 'Chord Properties', desc: 'Equal chords are equidistant from the center.', detail: 'Equal length chords subtend equal arcs and are the same distance from the center of the circle.' },
                cn: { title: '弦的性质', desc: '相等的弦到圆心的距离相等。', detail: '相等的弦所对的弧相等，并且到圆心的距离也相等。' }
            },
            {
                en: { title: 'Cyclic Quadrilateral', desc: 'Opposite angles sum to 180°.', detail: 'In a cyclic quadrilateral, the sum of each pair of opposite angles is 180 degrees.' },
                cn: { title: '圆内接四边形', desc: '圆内接四边形的对角和为180°。', detail: '圆内接四边形的任意对角和为180度，这一动画展示了对角配对关系。' }
            },
            {
                en: { title: 'Angle in a Semicircle', desc: 'An angle in a semicircle is a right angle.', detail: 'An inscribed angle that subtends a diameter always measures 90 degrees.' },
                cn: { title: '半圆内角定理', desc: '半圆内的角为直角。', detail: '对着直径的圆周角总是90度。' }
            },
            {
                en: { title: 'Radius to Tangent', desc: 'The radius to a tangent point is perpendicular.', detail: 'A radius drawn to the point of tangency is perpendicular to the tangent line.' },
                cn: { title: '半径与切线', desc: '半径到切点是垂直的。', detail: '从圆心到切点所画的半径，与切线成直角。' }
            },
            {
                en: { title: 'Alternate Segment Theorem', desc: 'The angle between tangent and chord equals the opposite inscribed angle.', detail: 'The angle between a tangent and chord through the point of contact equals the angle in the opposite segment of the circle.' },
                cn: { title: '交替弓形定理', desc: '切线与弦之间的角等于对弧中的圆周角。', detail: '切线与经过切点的弦之间的角，等于该弦对面的圆周角。' }
            }
        ];

        this.setupEvents();
        this.updateDisplay();
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        this.canvasWidth = Math.max(rect.width, 260);
        this.canvasHeight = Math.max(250, Math.min(380, Math.round(this.canvasWidth * 0.72)));

        this.canvas.style.width = `${this.canvasWidth}px`;
        this.canvas.style.height = `${this.canvasHeight}px`;
        this.canvas.width = Math.round(this.canvasWidth * this.dpr);
        this.canvas.height = Math.round(this.canvasHeight * this.dpr);
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    }

    init() {
        this.startAnimation();
    }

    setupEvents() {
        const prevBtn = document.getElementById('prevTheorem');
        const nextBtn = document.getElementById('nextTheorem');
        const playPauseBtn = document.getElementById('playPauseBtn');

        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                this.isPlaying = !this.isPlaying;
                if (window.circleTranslations) {
                    const lang = localStorage.getItem('language') || 'en';
                    const labels = window.circleTranslations[lang] || window.circleTranslations.en;
                    playPauseBtn.textContent = this.isPlaying ? labels.pauseLabel : labels.playLabel;
                } else {
                    playPauseBtn.textContent = this.isPlaying ? '⏸ Pause' : '▶ Play';
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.currentTheorem = (this.currentTheorem - 1 + this.theorems.length) % this.theorems.length;
                this.animationTime = 0;
                this.updateDisplay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.currentTheorem = (this.currentTheorem + 1) % this.theorems.length;
                this.animationTime = 0;
                this.updateDisplay();
            });
        }
    }

    updateDisplay() {
        const theorem = this.theorems[this.currentTheorem];
        const text = theorem[this.language] || theorem.en;

        document.getElementById('theorem-title').textContent = text.title;
        document.getElementById('theorem-description').textContent = text.desc;
        document.getElementById('theorem-counter').textContent = `${this.currentTheorem + 1} / ${this.theorems.length}`;
    }

    updateLanguage(lang) {
        this.language = lang;
        this.updateDisplay();
    }

    startAnimation() {
        const animate = (timestamp) => {
            if (!this.lastTimestamp) {
                this.lastTimestamp = timestamp;
            }
            const deltaSeconds = (timestamp - this.lastTimestamp) / 1000;
            this.lastTimestamp = timestamp;

            if (this.isPlaying) {
                this.animationTime = (this.animationTime + deltaSeconds * 45) % 360;
            }
            this.draw();
            this.animationFrame = requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    draw() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        this.ctx.save();
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.fillStyle = isDarkMode ? '#0f172a' : '#f8fafc';
        this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.textBaseline = 'middle';

        const centerX = this.canvasWidth / 2;
        const centerY = this.canvasHeight / 2;
        const radius = Math.min(this.canvasWidth, this.canvasHeight) * 0.26;

        switch (this.currentTheorem) {
            case 0:
                this.drawCentralAngle(centerX, centerY, radius);
                break;
            case 1:
                this.drawInscribedAngle(centerX, centerY, radius);
                break;
            case 2:
                this.drawTangentSecant(centerX, centerY, radius);
                break;
            case 3:
                this.drawChordProperties(centerX, centerY, radius);
                break;
            case 4:
                this.drawCyclicQuadrilateral(centerX, centerY, radius);
                break;
            case 5:
                this.drawAngleInSemicircle(centerX, centerY, radius);
                break;
            case 6:
                this.drawRadiusToTangent(centerX, centerY, radius);
                break;
            case 7:
                this.drawAlternateSegment(centerX, centerY, radius);
                break;
        }
        this.ctx.restore();
    }

    drawCentralAngle(cx, cy, r) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const angle = (this.animationTime % 360) * Math.PI / 180;
        const degrees = Math.round(this.animationTime % 360);

        // 绘制圆
        this.ctx.strokeStyle = isDarkMode ? '#64748b' : '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // 绘制圆心
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#000';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 5, 0, Math.PI * 2);
        this.ctx.fill();

        // 绘制两条半径和对应的弧
        const startAngle = angle;
        const endAngle = angle + Math.PI / 2;

        // 半径1 - 蓝色
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(x1, y1);
        this.ctx.stroke();

        // 标记点
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(x1, y1, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 半径2 - 绿色
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();

        // 标记点
        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(x2, y2, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 绘制弧 - 红色加粗
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, startAngle, endAngle);
        this.ctx.stroke();

        // 标签 - 中心角
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#333';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Central Angle', cx - 35, cy + 25);

        // 显示角度数值
        this.ctx.font = 'bold 16px Arial';
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillText('90°', cx - 30, cy - 60);

        // 显示弧标签
        const midAngle = (startAngle + endAngle) / 2;
        const arcLabelX = cx + (r + 25) * Math.cos(midAngle);
        const arcLabelY = cy + (r + 25) * Math.sin(midAngle);
        this.ctx.font = 'bold 13px Arial';
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillText('Arc = 90°', arcLabelX, arcLabelY);

        // 更新信息面板
        document.getElementById('theorem-info').textContent = 'Central Angle = Arc = 90°';
    }

    drawInscribedAngle(cx, cy, r) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const angle = (this.animationTime % 360) * Math.PI / 180;

        // 绘制圆
        this.ctx.strokeStyle = isDarkMode ? '#64748b' : '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // 圆上的三个点
        const pointA = { x: cx + r, y: cy };
        const pointB = { x: cx + r * Math.cos(angle + Math.PI / 3), y: cy + r * Math.sin(angle + Math.PI / 3) };
        const pointP = { x: cx + r * Math.cos(angle - Math.PI / 2), y: cy + r * Math.sin(angle - Math.PI / 2) };

        // 绘制弦AB - 蓝色
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(pointA.x, pointA.y);
        this.ctx.lineTo(pointB.x, pointB.y);
        this.ctx.stroke();

        // 从P点到A、B的线 - 圆周角（红色）
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(pointP.x, pointP.y);
        this.ctx.lineTo(pointA.x, pointA.y);
        this.ctx.lineTo(pointB.x, pointB.y);
        this.ctx.stroke();

        // 绘制圆心到弦的中点 - 虚线辅助线
        const midAB = { x: (pointA.x + pointB.x) / 2, y: (pointA.y + pointB.y) / 2 };
        this.ctx.strokeStyle = isDarkMode ? '#94a3b8' : '#ccc';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(midAB.x, midAB.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // 绘制点
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(pointA.x, pointA.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(pointB.x, pointB.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(pointP.x, pointP.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 圆心
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#000';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // 标签
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#333';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('O (Center)', cx, cy + 15);

        // 圆周角标签
        this.ctx.fillStyle = '#ef4444';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText('45°', pointP.x - 25, pointP.y - 15);

        // 圆心角标签
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.fillText('90°', cx + 15, cy - 20);

        // 点标签
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#333';
        this.ctx.fillText('P', pointP.x + 12, pointP.y - 12);
        this.ctx.fillText('A', pointA.x + 12, pointA.y - 12);
        this.ctx.fillText('B', pointB.x + 12, pointB.y + 15);

        // 更新信息面板
        document.getElementById('theorem-info').textContent = 'Inscribed Angle (45°) = Central Angle (90°) ÷ 2';
    }

    drawTangentSecant(cx, cy, r) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const angle = (this.animationTime % 360) * Math.PI / 180;

        // 绘制圆
        this.ctx.strokeStyle = isDarkMode ? '#64748b' : '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // 外部点P
        const px = cx - r * 1.8;
        const py = cy;

        // 切点T
        const angleT = Math.acos(r / (r * 1.8));
        const touchX = cx + r * Math.cos(Math.PI - angleT);
        const touchY = cy + r * Math.sin(Math.PI - angleT);

        // 割线上的两个点
        const angleS = Math.acos(r / (r * 1.8)) + angle * Math.PI / 180;
        const secantPoint1X = cx + r * Math.cos(Math.PI - angleS - 0.3);
        const secantPoint1Y = cy + r * Math.sin(Math.PI - angleS - 0.3);
        const secantPoint2X = cx + r * Math.cos(Math.PI - angleS + 0.3);
        const secantPoint2Y = cy + r * Math.sin(Math.PI - angleS + 0.3);

        // 绘制切线 - 绿色
        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(touchX, touchY);
        this.ctx.stroke();

        // 绘制割线 - 紫色
        this.ctx.strokeStyle = '#a855f7';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(secantPoint1X, secantPoint1Y);
        this.ctx.stroke();

        // 绘制从圆心到切点的半径 - 虚线辅助
        this.ctx.strokeStyle = isDarkMode ? '#94a3b8' : '#ccc';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(touchX, touchY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // 绘制角度标记
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(px, py, 15, Math.atan2(touchY - py, touchX - px), Math.atan2(secantPoint1Y - py, secantPoint1X - px));
        this.ctx.stroke();

        // 绘制点
        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(touchX, touchY, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#a855f7';
        this.ctx.beginPath();
        this.ctx.arc(secantPoint1X, secantPoint1Y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#a855f7';
        this.ctx.beginPath();
        this.ctx.arc(secantPoint2X, secantPoint2Y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 外部点
        this.ctx.fillStyle = isDarkMode ? '#fbbf24' : '#f59e0b';
        this.ctx.beginPath();
        this.ctx.arc(px, py, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 圆心
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#000';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // 标签
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#333';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('P', px - 15, py - 15);
        this.ctx.fillText('T', touchX + 12, touchY - 12);
        this.ctx.fillText('A', secantPoint1X + 12, secantPoint1Y - 12);
        this.ctx.fillText('B', secantPoint2X + 12, secantPoint2Y + 15);

        // 角度标签
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = 'bold 13px Arial';
        this.ctx.fillText('∠APT', px + 25, py + 25);

        // 切线和割线标签
        this.ctx.font = 'bold 10px Arial';
        this.ctx.fillStyle = '#10b981';
        this.ctx.fillText('Tangent', (px + touchX) / 2 + 15, (py + touchY) / 2 - 10);

        this.ctx.fillStyle = '#a855f7';
        this.ctx.fillText('Secant', (px + secantPoint1X) / 2 - 30, (py + secantPoint1Y) / 2);

        // 更新信息面板
        document.getElementById('theorem-info').textContent = 'Tangent-Secant Angle: PT² = PA × PB';
    }

    drawChordProperties(cx, cy, r) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const angle = (this.animationTime % 360) * Math.PI / 180;
        const baseAngle = Math.PI / 4;

        // 绘制圆
        this.ctx.strokeStyle = isDarkMode ? '#64748b' : '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // 第一条弦 - 蓝色
        const chord1A = { x: cx + r * Math.cos(baseAngle), y: cy + r * Math.sin(baseAngle) };
        const chord1B = { x: cx + r * Math.cos(baseAngle + Math.PI / 2.5), y: cy + r * Math.sin(baseAngle + Math.PI / 2.5) };

        // 第二条弦（等长）- 绿色
        const angle2 = baseAngle + Math.PI * 1.5 + angle * 0.01;
        const chord2A = { x: cx + r * Math.cos(angle2), y: cy + r * Math.sin(angle2) };
        const chord2B = { x: cx + r * Math.cos(angle2 + Math.PI / 2.5), y: cy + r * Math.sin(angle2 + Math.PI / 2.5) };

        // 绘制弦 - 加粗
        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(chord1A.x, chord1A.y);
        this.ctx.lineTo(chord1B.x, chord1B.y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(chord2A.x, chord2A.y);
        this.ctx.lineTo(chord2B.x, chord2B.y);
        this.ctx.stroke();

        // 计算弦长
        const chord1Length = Math.sqrt((chord1B.x - chord1A.x) ** 2 + (chord1B.y - chord1A.y) ** 2);
        const chord2Length = Math.sqrt((chord2B.x - chord2A.x) ** 2 + (chord2B.y - chord2A.y) ** 2);

        // 绘制圆心到弦的垂直距离 - 虚线辅助
        const midChord1 = { x: (chord1A.x + chord1B.x) / 2, y: (chord1A.y + chord1B.y) / 2 };
        const midChord2 = { x: (chord2A.x + chord2B.x) / 2, y: (chord2A.y + chord2B.y) / 2 };

        // 计算垂直距离
        const dist1 = Math.sqrt((midChord1.x - cx) ** 2 + (midChord1.y - cy) ** 2);
        const dist2 = Math.sqrt((midChord2.x - cx) ** 2 + (midChord2.y - cy) ** 2);

        // 绘制垂直线
        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(midChord1.x, midChord1.y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(midChord2.x, midChord2.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // 垂直距离标记点
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.beginPath();
        this.ctx.arc(midChord1.x, midChord1.y, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(midChord2.x, midChord2.y, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // 绘制弦的端点
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.beginPath();
        this.ctx.arc(chord1A.x, chord1A.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(chord1B.x, chord1B.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(chord2A.x, chord2A.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(chord2B.x, chord2B.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        // 圆心
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#000';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // 标签 - 弦长
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Chord 1', (chord1A.x + chord1B.x) / 2, (chord1A.y + chord1B.y) / 2 - 12);

        this.ctx.fillStyle = '#10b981';
        this.ctx.fillText('Chord 2', (chord2A.x + chord2B.x) / 2, (chord2A.y + chord2B.y) / 2 + 12);

        // 距离标签
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.fillText(`d₁=${Math.round(dist1)}`, midChord1.x + 20, midChord1.y - 5);
        this.ctx.fillText(`d₂=${Math.round(dist2)}`, midChord2.x + 20, midChord2.y + 10);

        // 更新信息面板
        document.getElementById('theorem-info').textContent = `Equal Chords: Chord 1 = ${Math.round(chord1Length)} ≈ Chord 2 = ${Math.round(chord2Length)}`;
    }

    drawCyclicQuadrilateral(cx, cy, r) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const angle = (this.animationTime % 360) * Math.PI / 180;

        // 绘制圆
        this.ctx.strokeStyle = isDarkMode ? '#64748b' : '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        // 四个顶点 - 圆上均匀分布
        const quad = [
            { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), label: 'A', color: '#3b82f6' },
            { x: cx + r * Math.cos(angle + Math.PI / 2), y: cy + r * Math.sin(angle + Math.PI / 2), label: 'B', color: '#10b981' },
            { x: cx + r * Math.cos(angle + Math.PI), y: cy + r * Math.sin(angle + Math.PI), label: 'C', color: '#ef4444' },
            { x: cx + r * Math.cos(angle + 3 * Math.PI / 2), y: cy + r * Math.sin(angle + 3 * Math.PI / 2), label: 'D', color: '#a855f7' }
        ];

        // 绘制四边形
        this.ctx.strokeStyle = '#6b7280';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        quad.forEach((p, i) => {
            if (i === 0) this.ctx.moveTo(p.x, p.y);
            else this.ctx.lineTo(p.x, p.y);
        });
        this.ctx.closePath();
        this.ctx.stroke();

        // 绘制对角线 - 虚线辅助
        this.ctx.strokeStyle = isDarkMode ? '#94a3b8' : '#ccc';
        this.ctx.lineWidth = 1.5;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(quad[0].x, quad[0].y);
        this.ctx.lineTo(quad[2].x, quad[2].y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(quad[1].x, quad[1].y);
        this.ctx.lineTo(quad[3].x, quad[3].y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // 计算对角
        // 使用向量计算角度
        const calculateAngle = (p1, vertex, p2) => {
            const vec1 = { x: p1.x - vertex.x, y: p1.y - vertex.y };
            const vec2 = { x: p2.x - vertex.x, y: p2.y - vertex.y };
            
            const dot = vec1.x * vec2.x + vec1.y * vec2.y;
            const cross = vec1.x * vec2.y - vec1.y * vec2.x;
            let angle = Math.atan2(cross, dot) * 180 / Math.PI;
            if (angle < 0) angle += 360;
            return Math.round(angle);
        };

        const angleA = calculateAngle(quad[3], quad[0], quad[1]);
        const angleB = calculateAngle(quad[0], quad[1], quad[2]);
        const angleC = calculateAngle(quad[1], quad[2], quad[3]);
        const angleD = calculateAngle(quad[2], quad[3], quad[0]);

        // 绘制顶点 - 带颜色区分
        quad.forEach((p, i) => {
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // 圆心
        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#000';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        this.ctx.fill();

        // 标记对角及其角度值
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';

        // 顶点标签及角度显示
        this.ctx.fillStyle = quad[0].color;
        this.ctx.fillText('A', quad[0].x - 18, quad[0].y);
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillText(`∠A=${angleA}°`, quad[0].x - 30, quad[0].y - 20);

        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillStyle = quad[1].color;
        this.ctx.fillText('B', quad[1].x, quad[1].y - 18);
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillText(`∠B=${angleB}°`, quad[1].x + 30, quad[1].y - 15);

        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillStyle = quad[2].color;
        this.ctx.fillText('C', quad[2].x + 18, quad[2].y);
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillText(`∠C=${angleC}°`, quad[2].x + 30, quad[2].y + 20);

        this.ctx.font = 'bold 12px Arial';
        this.ctx.fillStyle = quad[3].color;
        this.ctx.fillText('D', quad[3].x, quad[3].y + 18);
        this.ctx.font = 'bold 11px Arial';
        this.ctx.fillText(`∠D=${angleD}°`, quad[3].x - 30, quad[3].y + 25);

        // 关键关系标签
        const sumOppAC = angleA + angleC;
        const sumOppBD = angleB + angleD;

        // 更新信息面板
        document.getElementById('theorem-info').textContent = `Cyclic Quadrilateral: ∠A + ∠C = ${sumOppAC}°, ∠B + ∠D = ${sumOppBD}°`;
    }

    drawAngleInSemicircle(cx, cy, r) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const angle = (this.animationTime % 360) * Math.PI / 180;
        const start = Math.PI + angle * 0.5;
        const end = 2 * Math.PI + angle * 0.5;
        const diameterA = { x: cx - r, y: cy };
        const diameterB = { x: cx + r, y: cy };
        const pointP = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };

        this.ctx.strokeStyle = isDarkMode ? '#64748b' : '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, Math.PI, 0);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(diameterA.x, diameterA.y);
        this.ctx.lineTo(diameterB.x, diameterB.y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.moveTo(diameterA.x, diameterA.y);
        this.ctx.lineTo(pointP.x, pointP.y);
        this.ctx.lineTo(diameterB.x, diameterB.y);
        this.ctx.stroke();

        this.ctx.fillStyle = '#3b82f6';
        [diameterA, diameterB].forEach(p => {
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            this.ctx.fill();
        });

        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(pointP.x, pointP.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#000';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#333';
        this.ctx.font = 'bold 13px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Diameter', cx, cy - 40);
        this.ctx.fillText('90°', cx, cy + 10);
        this.ctx.fillText('Semicircle Angle', pointP.x, pointP.y - 15);

        document.getElementById('theorem-info').textContent = 'Angle in a Semicircle = 90°';
    }

    drawRadiusToTangent(cx, cy, r) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const tangentY = cy - r * 0.7;
        const tangentX = cx + r;

        this.ctx.strokeStyle = isDarkMode ? '#64748b' : '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(tangentX, tangentY - 80);
        this.ctx.lineTo(tangentX, tangentY + 80);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.lineTo(tangentX, cy);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#fbbf24';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(tangentX, tangentY - 20);
        this.ctx.lineTo(cx, cy);
        this.ctx.stroke();

        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(tangentX, cy, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#000';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#333';
        this.ctx.font = 'bold 13px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Tangent', tangentX, tangentY - 40);
        this.ctx.fillText('Radius', cx + 50, cy - 10);
        this.ctx.fillText('90°', cx + 35, cy + 20);

        document.getElementById('theorem-info').textContent = 'Radius to Tangent is perpendicular';
    }

    drawAlternateSegment(cx, cy, r) {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const angle = (this.animationTime % 360) * Math.PI / 180;
        const pointT = { x: cx + r, y: cy };
        const chordA = { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
        const chordB = pointT;
        const chordC = { x: cx + r * Math.cos(angle + 1.2), y: cy + r * Math.sin(angle + 1.2) };

        this.ctx.strokeStyle = isDarkMode ? '#64748b' : '#333';
        this.ctx.lineWidth = 2.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#3b82f6';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(pointT.x, pointT.y);
        this.ctx.lineTo(chordA.x, chordA.y);
        this.ctx.lineTo(chordC.x, chordC.y);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#10b981';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(pointT.x, pointT.y - 80);
        this.ctx.lineTo(pointT.x + 80, pointT.y + 20);
        this.ctx.stroke();

        this.ctx.strokeStyle = '#ef4444';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        this.ctx.moveTo(chordA.x, chordA.y);
        this.ctx.lineTo(chordC.x, chordC.y);
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(chordA.x, chordA.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = '#10b981';
        this.ctx.beginPath();
        this.ctx.arc(pointT.x, pointT.y, 4, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#000';
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = isDarkMode ? '#e8ecf1' : '#333';
        this.ctx.font = 'bold 13px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Tangent', pointT.x + 40, pointT.y - 40);
        this.ctx.fillText('Chord', (chordA.x + chordC.x) / 2, (chordA.y + chordC.y) / 2 - 10);
        this.ctx.fillText('∠', chordA.x - 20, chordA.y + 20);

        document.getElementById('theorem-info').textContent = 'Alternate Segment: tangent-chord angle equals inscribed angle';
    }
}