// Aplicação Principal - QuímicaGame
//Esse arquivo js é o antigo, nao ta linkado no html, olhar pro app-fixed.js
class QuimicaGame {
    constructor() {
        this.currentSection = 'home';
        this.userProgress = {
            points: 0,
            level: 1,
            completedExercises: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            achievements: [],
            topicProgress: {
                ionic: 0,
                covalent: 0,
                metallic: 0
            }
        };
        
        this.init();
    }

    init() {
        this.loadUserProgress();
        this.setupEventListeners();
        this.updateUI();
        this.showSection('home');
    }

    setupEventListeners() {
        // Navegação
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                this.showSection(section);
            });
        });

        // Botões da hero section
        document.querySelectorAll('.hero-buttons .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
                this.showSection(section);
            });
        });

        // Tabs de animação
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchAnimationTab(btn.dataset.animation);
            });
        });

        // Controles de animação
        document.getElementById('play-btn')?.addEventListener('click', () => {
            this.playAnimation();
        });

        document.getElementById('pause-btn')?.addEventListener('click', () => {
            this.pauseAnimation();
        });

        document.getElementById('reset-btn')?.addEventListener('click', () => {
            this.resetAnimation();
        });

        // Slider de velocidade
        document.getElementById('speed-slider')?.addEventListener('input', (e) => {
            this.setAnimationSpeed(e.target.value);
        });

        // Seleção de dificuldade
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.selectDifficulty(btn.dataset.level);
            });
        });

        // Responsive menu toggle (para mobile)
        this.setupMobileMenu();
    }

    setupMobileMenu() {
        // Adicionar funcionalidade de menu mobile se necessário
        const header = document.querySelector('.header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        });
    }

    showSection(sectionName) {
        // Esconder todas as seções
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar a seção selecionada
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
        }

        // Atualizar navegação ativa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionName}`) {
                link.classList.add('active');
            }
        });

        // Executar ações específicas da seção
        this.onSectionChange(sectionName);
    }

    onSectionChange(sectionName) {
        switch (sectionName) {
            case 'animation':
                this.initializeAnimations();
                break;
            case 'exercises':
                this.initializeExercises();
                break;
            case 'progress':
                this.updateProgressSection();
                break;
        }
    }

    switchAnimationTab(animationType) {
        // Atualizar tabs ativas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-animation="${animationType}"]`).classList.add('active');

        // Atualizar informações da animação
        this.updateAnimationInfo(animationType);
        
        // Resetar animação
        this.resetAnimation();
    }

    updateAnimationInfo(animationType) {
        const animationData = {
            ionic: {
                title: 'Ligação Iônica',
                description: 'A ligação iônica ocorre entre um metal e um ametal, onde há transferência de elétrons do metal para o ametal, formando íons.',
                concepts: [
                    'Transferência de elétrons',
                    'Formação de íons (cátions e ânions)',
                    'Atração eletrostática',
                    'Compostos iônicos'
                ]
            },
            covalent: {
                title: 'Ligação Covalente',
                description: 'A ligação covalente ocorre entre ametais, onde há compartilhamento de pares de elétrons entre os átomos.',
                concepts: [
                    'Compartilhamento de elétrons',
                    'Formação de moléculas',
                    'Ligações simples, duplas e triplas',
                    'Polaridade molecular'
                ]
            },
            metallic: {
                title: 'Ligação Metálica',
                description: 'A ligação metálica ocorre entre átomos de metais, caracterizada por um "mar de elétrons" que se move livremente.',
                concepts: [
                    'Mar de elétrons',
                    'Condutividade elétrica',
                    'Maleabilidade e ductilidade',
                    'Brilho metálico'
                ]
            }
        };

        const data = animationData[animationType];
        document.getElementById('animation-title').textContent = data.title;
        document.getElementById('animation-description').textContent = data.description;
        
        const conceptsList = document.getElementById('key-concepts-list');
        conceptsList.innerHTML = '';
        data.concepts.forEach(concept => {
            const li = document.createElement('li');
            li.textContent = concept;
            conceptsList.appendChild(li);
        });
    }

    playAnimation() {
        // Implementação será feita no animations.js
        if (window.animationController) {
            window.animationController.play();
        }
    }

    pauseAnimation() {
        if (window.animationController) {
            window.animationController.pause();
        }
    }

    resetAnimation() {
        if (window.animationController) {
            window.animationController.reset();
        }
    }

    setAnimationSpeed(speed) {
        if (window.animationController) {
            window.animationController.setSpeed(parseFloat(speed));
        }
    }

    initializeAnimations() {
        // Será implementado no animations.js
        if (window.AnimationController) {
            window.animationController = new window.AnimationController();
        }
    }

    selectDifficulty(level) {
        // Atualizar botões de dificuldade
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-level="${level}"]`).classList.add('active');

        // Inicializar exercícios com a dificuldade selecionada
        if (window.exerciseController) {
            window.exerciseController.setDifficulty(level);
            window.exerciseController.startExercises();
        }
    }

    initializeExercises() {
        // Será implementado no exercises.js
        if (window.ExerciseController) {
            window.exerciseController = new window.ExerciseController(this);
        }
    }

    updateProgressSection() {
        // Atualizar estatísticas
        document.getElementById('total-points').textContent = this.userProgress.points;
        document.getElementById('completed-exercises').textContent = this.userProgress.completedExercises;
        
        const accuracyRate = this.userProgress.totalAnswers > 0 
            ? Math.round((this.userProgress.correctAnswers / this.userProgress.totalAnswers) * 100)
            : 0;
        document.getElementById('accuracy-rate').textContent = `${accuracyRate}%`;
        document.getElementById('achievements-count').textContent = this.userProgress.achievements.length;

        // Atualizar progresso por tópico
        this.updateTopicProgress();
        this.updateAchievements();
    }

    updateTopicProgress() {
        const topics = ['ionic', 'covalent', 'metallic'];
        const maxExercises = { ionic: 10, covalent: 10, metallic: 5 };

        topics.forEach(topic => {
            const progress = this.userProgress.topicProgress[topic];
            const max = maxExercises[topic];
            const percentage = (progress / max) * 100;

            const progressBar = document.getElementById(`${topic}-progress`);
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }

            const progressText = document.querySelector(`.topic-item:nth-child(${topics.indexOf(topic) + 1}) .progress-text`);
            if (progressText) {
                progressText.textContent = `${progress}/${max} exercícios`;
            }
        });
    }

    updateAchievements() {
        const achievements = [
            { id: 'first_correct', name: 'Primeira Resposta Correta', icon: '🎯', unlocked: this.userProgress.correctAnswers >= 1 },
            { id: 'ionic_master', name: 'Mestre das Ligações Iônicas', icon: '⚡', unlocked: this.userProgress.topicProgress.ionic >= 5 },
            { id: 'covalent_expert', name: 'Expert em Ligações Covalentes', icon: '🔗', unlocked: this.userProgress.topicProgress.covalent >= 5 },
            { id: 'perfect_score', name: 'Pontuação Perfeita', icon: '🏆', unlocked: this.userProgress.correctAnswers >= 10 && this.userProgress.totalAnswers === this.userProgress.correctAnswers },
            { id: 'persistent', name: 'Persistente', icon: '💪', unlocked: this.userProgress.completedExercises >= 20 },
            { id: 'speed_demon', name: 'Velocista', icon: '⚡', unlocked: false }, // Implementar lógica de tempo
        ];

        const achievementsGrid = document.getElementById('achievements-grid');
        achievementsGrid.innerHTML = '';

        achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <h4>${achievement.name}</h4>
                <p>${achievement.unlocked ? 'Desbloqueado!' : 'Bloqueado'}</p>
            `;
            achievementsGrid.appendChild(achievementElement);
        });
    }

    addPoints(points) {
        this.userProgress.points += points;
        this.updateLevel();
        this.updateUI();
        this.saveUserProgress();
        
        // Animação de pontos
        this.showPointsAnimation(points);
    }

    updateLevel() {
        const newLevel = Math.floor(this.userProgress.points / 100) + 1;
        if (newLevel > this.userProgress.level) {
            this.userProgress.level = newLevel;
            this.showLevelUpAnimation();
        }
    }

    showPointsAnimation(points) {
        const pointsElement = document.getElementById('user-points');
        const animation = document.createElement('div');
        animation.textContent = `+${points}`;
        animation.style.cssText = `
            position: absolute;
            color: #feca57;
            font-weight: bold;
            font-size: 1.2rem;
            pointer-events: none;
            animation: pointsFloat 2s ease-out forwards;
        `;
        
        pointsElement.parentElement.style.position = 'relative';
        pointsElement.parentElement.appendChild(animation);
        
        setTimeout(() => animation.remove(), 2000);
    }

    showLevelUpAnimation() {
        // Implementar animação de subida de nível
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 2rem;
                border-radius: 15px;
                text-align: center;
                z-index: 10000;
                box-shadow: 0 10px 40px rgba(0,0,0,0.3);
                animation: levelUpPulse 3s ease-out forwards;
            ">
                <h2>🎉 Parabéns!</h2>
                <p>Você subiu para o nível ${this.userProgress.level}!</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    updateUI() {
        // Atualizar pontos e nível no header
        document.getElementById('user-points').textContent = this.userProgress.points;
        document.querySelector('.level-badge span').textContent = `Nível ${this.userProgress.level}`;

        // Atualizar barras de progresso na home
        const progressCards = document.querySelectorAll('.progress-card');
        progressCards.forEach((card, index) => {
            const topics = ['ionic', 'covalent', 'metallic'];
            const topic = topics[index];
            const maxExercises = { ionic: 10, covalent: 10, metallic: 5 };
            
            if (topic && this.userProgress.topicProgress[topic] !== undefined) {
                const progress = this.userProgress.topicProgress[topic];
                const max = maxExercises[topic];
                const percentage = (progress / max) * 100;
                
                const progressBar = card.querySelector('.progress-fill');
                const progressText = card.querySelector('span');
                
                if (progressBar) progressBar.style.width = `${percentage}%`;
                if (progressText) progressText.textContent = `${percentage.toFixed(0)}% completo`;
            }
        });
    }

    recordAnswer(isCorrect) {
        this.userProgress.totalAnswers++;
        if (isCorrect) {
            this.userProgress.correctAnswers++;
        }
        this.saveUserProgress();
    }

    completeExercise(topic) {
        this.userProgress.completedExercises++;
        if (this.userProgress.topicProgress[topic] !== undefined) {
            this.userProgress.topicProgress[topic]++;
        }
        this.saveUserProgress();
    }

    saveUserProgress() {
        localStorage.setItem('quimicaGameProgress', JSON.stringify(this.userProgress));
    }

    loadUserProgress() {
        const saved = localStorage.getItem('quimicaGameProgress');
        if (saved) {
            this.userProgress = { ...this.userProgress, ...JSON.parse(saved) };
        }
    }

    resetProgress() {
        localStorage.removeItem('quimicaGameProgress');
        this.userProgress = {
            points: 0,
            level: 1,
            completedExercises: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            achievements: [],
            topicProgress: {
                ionic: 0,
                covalent: 0,
                metallic: 0
            }
        };
        this.updateUI();
    }
}

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes pointsFloat {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-50px);
        }
    }
    
    @keyframes levelUpPulse {
        0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
        }
        50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.1);
        }
        100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(1);
        }
    }
`;
document.head.appendChild(style);

// Função global para navegação (usada nos botões)
function showSection(sectionName) {
    if (window.quimicaGame) {
        window.quimicaGame.showSection(sectionName);
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    window.quimicaGame = new QuimicaGame();
});

