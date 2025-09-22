// Aplicação Principal - QuímicaGame (Versão Corrigida)
class QuimicaGame {
    constructor() {
        this.currentSection = 'home';
        this.soundTransitionOut = new Audio('assets/swoosh.mp3');
        this.soundTransitionIn = new Audio('assets/woosh.mp3');
        this.soundCorrectAnswer = new Audio('assets/correct.mp3');
        this.soundIncorrectAnswer = new Audio('assets/wrong.mp3');
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

        console.log('QuimicaGame: Construtor chamado');
        this.init();
    }

    init() {
        console.log('QuimicaGame: Inicializando...');
        this.loadUserProgress();
        this.setupEventListeners();
        this.updateUI();
        this.showSection('home');
        console.log('QuimicaGame: Inicialização completa');
    }

    setupEventListeners() {
        console.log('QuimicaGame: Configurando event listeners...');

        // Aguardar DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEvents();
            });
        } else {
            this.bindEvents();
        }
    }

    bindEvents() {
        console.log('QuimicaGame: Vinculando eventos...');

        // Navegação
        const navLinks = document.querySelectorAll('.nav-link');
        console.log(`QuimicaGame: Encontrados ${navLinks.length} links de navegação`);

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('href').substring(1);
                console.log(`QuimicaGame: Navegando para ${section}`);
                this.showSection(section);
            });
        });

        // Botões da hero section
        const heroButtons = document.querySelectorAll('.hero-buttons .btn');
        console.log(`QuimicaGame: Encontrados ${heroButtons.length} botões hero`);

        heroButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const onclickAttr = btn.getAttribute('onclick');
                if (onclickAttr) {
                    const match = onclickAttr.match(/'([^']+)'/);
                    if (match) {
                        const section = match[1];
                        console.log(`QuimicaGame: Botão hero clicado - navegando para ${section}`);
                        this.showSection(section);
                    }
                }
            });
        });

        // Tabs de animação
        const tabBtns = document.querySelectorAll('.tab-btn');
        console.log(`QuimicaGame: Encontrados ${tabBtns.length} botões de tab`);

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const animationType = btn.dataset.animation;
                console.log(`QuimicaGame: Tab clicado - ${animationType}`);
                this.switchAnimationTab(animationType);
            });
        });

        // Controles de animação
        this.setupAnimationControls();

        // Seleção de dificuldade
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        console.log(`QuimicaGame: Encontrados ${difficultyBtns.length} botões de dificuldade`);

        difficultyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const level = btn.dataset.level;
                console.log(`QuimicaGame: Dificuldade selecionada - ${level}`);
                this.selectDifficulty(level);
            });
        });

       }

    setupAnimationControls() {
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        const resetBtn = document.getElementById('reset-btn');
        const speedSlider = document.getElementById('speed-slider');

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                console.log('QuimicaGame: Play button clicado');
                this.playAnimation();
            });
        }

        if (pauseBtn) {
            pauseBtn.addEventListener('click', () => {
                console.log('QuimicaGame: Pause button clicado');
                this.pauseAnimation();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                console.log('QuimicaGame: Reset button clicado');
                this.resetAnimation();
            });
        }

        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                console.log(`QuimicaGame: Velocidade alterada para ${e.target.value}`);
                this.setAnimationSpeed(e.target.value);
            });
        }
    }



    showSection(sectionName) {
        console.log(`QuimicaGame: Mostrando seção ${sectionName}`);

        // Esconder todas as seções
        const sections = document.querySelectorAll('.section');
        sections.forEach(section => {
            section.classList.remove('active');
        });

        // Mostrar a seção selecionada
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = sectionName;
            console.log(`QuimicaGame: Seção ${sectionName} ativada`);
        } else {
            console.error(`QuimicaGame: Seção ${sectionName} não encontrada`);
        }

        // Atualizar navegação ativa
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionName}`) {
                link.classList.add('active');
            }
        });

        // Executar ações específicas da seção
        this.onSectionChange(sectionName);
    }

    onSectionChange(sectionName) {
        console.log(`QuimicaGame: Mudança para seção ${sectionName}`);

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
    // Em js/app-fixed.js na classe QuimicaGame

    transitionToSection(sectionName) {
        const oldSection = document.getElementById(this.currentSection);
        const newSection = document.getElementById(sectionName);
        const transitionOverlay = document.getElementById('transition-overlay');
        const transitionLogo = transitionOverlay.querySelector('.transition-logo i');

        if (!newSection || newSection.isAnimating) {
            return;
        }

        // Prevenimos múltiplos cliques durante a transição
        oldSection.isAnimating = true;
        newSection.isAnimating = true;

        const tl = gsap.timeline({
            onComplete: () => {
                // Ao final, liberamos as seções para novas animações
                oldSection.isAnimating = false;
                newSection.isAnimating = false;
            }
        });

        // **FASE 1: Saída da Seção Antiga e Entrada do Overlay**
        tl.call(() => this.soundTransitionOut.play())
            .to(oldSection, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.in"
            })
            .set(oldSection, { // Esconde a seção antiga via CSS após a animação
                className: "section"
            })
            .set(transitionOverlay, {
                opacity: 1,
                visibility: 'visible'
            })
            // SOLUÇÃO P/ LOGO: Usando .fromTo() para garantir que a animação SEMPRE ocorra
            .fromTo(transitionLogo, {
                scale: 0,
                rotate: -270,
                opacity: 0,
            }, {
                scale: 1,
                rotate: 0,
                opacity: 1,
                duration: 0.4,
                ease: "back.out(1.7)"
            });

        // **FASE 2: Preparação da Nova Seção (ocorre "por trás das cortinas")**
        tl.call(() => {
            // Preparamos a nova seção para ser animada
            // A tornamos 'active' (display: block) mas a mantemos invisível (opacity: 0)
            newSection.className = "section active";
            gsap.set(newSection, { opacity: 0 });

            this.currentSection = sectionName;
            // Atualiza a navegação
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionName}`) {
                    link.classList.add('active');
                }
            });
            this.onSectionChange(sectionName);
        });

        // **FASE 3: Saída do Overlay e Entrada da Seção Nova**
        tl.to(transitionLogo, {
            scale: 3,
            opacity: 0,
            duration: 0.3,
            ease: "power1.in",
            delay: 0.2 // lOGO DELAY
        })
            .to(transitionOverlay, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    gsap.set(transitionOverlay, { visibility: 'hidden' });
                }
            }, "-=0.2")
            .call(() => this.soundTransitionIn.play())

            // opacidade da seção INTEIRA
            .to(newSection, {
                opacity: 1,
                duration: 0.4,
                ease: "power2.out"
            })
            .from(newSection.querySelectorAll('h2, .hero-content, .progress-card, .stat-card, .difficulty-selector'), {
                opacity: 0,
                y: 30,
                duration: 0.3,
                stagger: 0.07,
                ease: "power2.out"
            }, "<"); // O "<" garante que a animação dos filhos comece JUNTO com a do pai
    }

    switchAnimationTab(animationType) {
        console.log(`QuimicaGame: Mudando para animação ${animationType}`);

        // Atualizar tabs ativas
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeTab = document.querySelector(`[data-animation="${animationType}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

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
        if (!data) return;

        const titleElement = document.getElementById('animation-title');
        const descElement = document.getElementById('animation-description');
        const conceptsList = document.getElementById('key-concepts-list');

        if (titleElement) titleElement.textContent = data.title;
        if (descElement) descElement.textContent = data.description;

        if (conceptsList) {
            conceptsList.innerHTML = '';
            data.concepts.forEach(concept => {
                const li = document.createElement('li');
                li.textContent = concept;
                conceptsList.appendChild(li);
            });
        }
    }

    playAnimation() {
        console.log('QuimicaGame: Iniciando animação');
        if (window.animationController) {
            window.animationController.play();
        } else {
            console.warn('QuimicaGame: AnimationController não disponível');
        }
    }

    pauseAnimation() {
        console.log('QuimicaGame: Pausando animação');
        if (window.animationController) {
            window.animationController.pause();
        }
    }

    resetAnimation() {
        console.log('QuimicaGame: Resetando animação');
        if (window.animationController) {
            window.animationController.reset();
        }
    }

    setAnimationSpeed(speed) {
        console.log(`QuimicaGame: Definindo velocidade ${speed}`);
        if (window.animationController) {
            window.animationController.setSpeed(parseFloat(speed));
        }
    }

    initializeAnimations() {
        console.log('QuimicaGame: Inicializando animações');
        if (window.AnimationController && !window.animationController) {
            try {
                window.animationController = new window.AnimationController();
                console.log('QuimicaGame: AnimationController criado');
            } catch (error) {
                console.error('QuimicaGame: Erro ao criar AnimationController:', error);
            }
        }
    }

    selectDifficulty(level) {
        console.log(`QuimicaGame: Selecionando dificuldade ${level}`);

        // Atualizar botões de dificuldade
        const difficultyBtns = document.querySelectorAll('.difficulty-btn');
        difficultyBtns.forEach(btn => {
            btn.classList.remove('active');
        });

        const activeBtn = document.querySelector(`[data-level="${level}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Inicializar exercícios com a dificuldade selecionada
        if (window.exerciseController) {
            window.exerciseController.setDifficulty(level);
            window.exerciseController.startExercises();
        } else {
            console.warn('QuimicaGame: ExerciseController não disponível');
        }
    }

    initializeExercises() {
        console.log('QuimicaGame: Inicializando exercícios');
        if (window.ExerciseController ) {
            try {
                window.exerciseController = new window.ExerciseController(this);
                console.log('QuimicaGame: ExerciseController criado');
            } catch (error) {
                console.error('QuimicaGame: Erro ao criar ExerciseController:', error);
            }
        }
    }

    resetExercises(){
        console.log('Quimica Game: Reiniciando exercícios');
        const exerciseContainer = document.querySelector('.exercise-container');
        if (!exerciseContainer) {
            console.error('Quimica Game: Erro ao resetar container de exercícios, não foi encontrado.');
            return;
        }

        let originalExerciseHTML; //Isso aqui ta simplesmente pegando toda essa parte do index html. Talvez seja interesse no futuro refatorar, ja que se mudar la nao vai mudar aqui automaticamente e vice versa.
        originalExerciseHTML = `  
        <div class="exercise-header">
            <div class="exercise-progress">
                <span>Questão <span id="current-question">1</span> de <span id="total-questions">5</span></span>
                <div class="progress-bar">
                    <div class="progress-fill" id="exercise-progress"></div>
                </div>
            </div>
            <div class="exercise-score">
                <i class="fas fa-star"></i>
                <span id="current-score">0</span> pontos
            </div>
        </div>

        <div class="question-container">
            <div class="question">
                <h3 id="question-text">Escolha uma dificuldade para começar.</h3>
                <div class="question-image" id="question-image" style="display: none;">
                    </div>
            </div>

            <div class="answers">
                <div class="answer-options" id="answer-options">
                    </div>
            </div>

            <div class="question-actions">
                <button id="submit-answer" class="btn btn-primary" disabled>
                    Confirmar Resposta
                </button>
                <button id="next-question" class="btn btn-secondary" style="display: none;">
                    Próxima Questão
                </button>
            </div>
        </div>

        <div class="feedback-container" id="feedback-container" style="display: none;">
            <div class="feedback-content">
                <div class="feedback-icon">
                    <i id="feedback-icon"></i>
                </div>
                <h4 id="feedback-title"></h4>
                <p id="feedback-text"></p>
            </div>
        </div>
    `;

        exerciseContainer.innerHTML = originalExerciseHTML;
        this.initializeExercises();
    }

    // Métodos de exercícios simplificados para teste
    selectAnswer(optionElement) {
        console.log('QuimicaGame: Selecionando resposta');

        // Remover seleção anterior
        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => {
            option.classList.remove('selected');
        });

        // Selecionar nova opção
        optionElement.classList.add('selected');

        // Habilitar botão de confirmar
        const submitBtn = document.getElementById('submit-answer');
        if (submitBtn) {
            submitBtn.disabled = false;
        }
    }

    submitAnswer() {
        console.log('QuimicaGame: Submetendo resposta');

        const selectedOption = document.querySelector('.answer-option.selected');
        if (!selectedOption) {
            console.warn('QuimicaGame: Nenhuma resposta selecionada');
            return;
        }

        // Simular feedback básico
        const feedbackContainer = document.getElementById('feedback-container');
        if (feedbackContainer) {
            feedbackContainer.style.display = 'block';
            feedbackContainer.innerHTML = `
                <div class="feedback-content">
                    <div class="feedback-icon correct">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h4>Resposta registrada!</h4>
                    <p>Sistema de exercícios em desenvolvimento.</p>
                </div>
            `;
        }

        // Mostrar botão de próxima questão
        const nextBtn = document.getElementById('next-question');
        const submitBtn = document.getElementById('submit-answer');

        if (nextBtn) nextBtn.style.display = 'inline-flex';
        if (submitBtn) submitBtn.style.display = 'none';
    }

    nextQuestion() {
        console.log('QuimicaGame: Próxima questão');

        // Resetar interface
        const feedbackContainer = document.getElementById('feedback-container');
        const nextBtn = document.getElementById('next-question');
        const submitBtn = document.getElementById('submit-answer');

        if (feedbackContainer) feedbackContainer.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        if (submitBtn) {
            submitBtn.style.display = 'inline-flex';
            submitBtn.disabled = true;
        }

        // Limpar seleções
        const options = document.querySelectorAll('.answer-option');
        options.forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
    }

    updateProgressSection() {
        console.log('QuimicaGame: Atualizando seção de progresso');

        // Atualizar estatísticas básicas
        const elements = {
            'total-points': this.userProgress.points,
            'completed-exercises': this.userProgress.completedExercises,
            'achievements-count': this.userProgress.achievements.length
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });

        // Calcular taxa de acerto
        const accuracyRate = this.userProgress.totalAnswers > 0
            ? Math.round((this.userProgress.correctAnswers / this.userProgress.totalAnswers) * 100)
            : 0;

        const accuracyElement = document.getElementById('accuracy-rate');
        if (accuracyElement) {
            accuracyElement.textContent = `${accuracyRate}%`;
        }

        this.updateTopicProgress();
    }

    getTopicProgressPercentage(topic) {
        const maxExercises = { ionic: 10, covalent: 10, metallic: 5 };
        const progress = this.userProgress.topicProgress[topic] || 0;
        const max = maxExercises[topic] || 1;
        const percentage = (progress / max) * 100;

        return Math.max(0, Math.min(percentage, 100));
    }

    updateTopicProgress() {
        const topics = ['ionic', 'covalent', 'metallic'];
        const maxExercises = { ionic: 10, covalent: 10, metallic: 5 };

        topics.forEach(topic => {
            const progress = this.userProgress.topicProgress[topic];
            const max = maxExercises[topic];
            const percentage = this.getTopicProgressPercentage(topic);
            
            const progressBar = document.getElementById(`${topic}-progress`);
            if (progressBar) {
                progressBar.style.width = `${percentage}%`;
            }
        });
    }

    updateUI() {
        console.log('QuimicaGame: Atualizando UI');

        // Atualizar pontos e nível no header
        const pointsElement = document.getElementById('user-points');
        const levelElement = document.querySelector('.level-badge span');

        if (pointsElement) {
            pointsElement.textContent = this.userProgress.points;
        }

        if (levelElement) {
            levelElement.textContent = `Nível ${this.userProgress.level}`;
        }

        // Atualizar barras de progresso na home
        this.updateHomeProgress();
    }

    updateHomeProgress() {
        const progressCards = document.querySelectorAll('.progress-card');
        const topics = ['ionic', 'covalent', 'metallic'];
        const maxExercises = { ionic: 10, covalent: 10, metallic: 5 };

        progressCards.forEach((card, index) => {
            const topic = topics[index];
            if (topic && this.userProgress.topicProgress[topic] !== undefined) {
                const progress = this.userProgress.topicProgress[topic];
                const max = maxExercises[topic];
                const percentage = (progress / max) * 100;

                const progressBar = card.querySelector('.progress-fill');
                const progressText = card.querySelector('span');

                if (progressBar) progressBar.style.width = `${percentage}%`;
                if (progressText) progressText.textContent = `${Math.round(percentage)}% completo`;
            }
        });
    }

    addPoints(points) {
        console.log(`QuimicaGame: Adicionando ${points} pontos`);
        this.userProgress.points += points;
        this.updateLevel();
        this.updateUI();
        this.saveUserProgress();
    }

    updateLevel() {
        const newLevel = Math.floor(this.userProgress.points / 100) + 1;
        if (newLevel > this.userProgress.level) {
            this.userProgress.level = newLevel;
            console.log(`QuimicaGame: Subiu para nível ${newLevel}`);
        }
    }

    recordAnswer(isCorrect) {
        console.log(`QuimicaGame: Registrando resposta ${isCorrect ? 'correta' : 'incorreta'}`);
        this.userProgress.totalAnswers++;
        if (isCorrect) {
            this.userProgress.correctAnswers++;
        }
        this.saveUserProgress();
    }

    saveUserProgress() {
        try {
            localStorage.setItem('quimicaGameProgress', JSON.stringify(this.userProgress));
            console.log('QuimicaGame: Progresso salvo');
        } catch (error) {
            console.error('QuimicaGame: Erro ao salvar progresso:', error);
        }
    }

    loadUserProgress() {
        try {
            const saved = localStorage.getItem('quimicaGameProgress');
            if (saved) {
                const loadedProgress = JSON.parse(saved);
                this.userProgress = { ...this.userProgress, ...loadedProgress };
                console.log('QuimicaGame: Progresso carregado');
            }
        } catch (error) {
            console.error('QuimicaGame: Erro ao carregar progresso:', error);
        }
    }
}

// Função global para navegação (compatibilidade)
function showSection(sectionName) {
    console.log(`Global showSection chamada: ${sectionName}`);
    if (window.quimicaGame) {
        window.quimicaGame.showSection(sectionName);
    } else {
        console.error('QuimicaGame não está disponível globalmente');
    }
}

// Inicialização mais robusta
function initializeQuimicaGame() {
    console.log('Inicializando QuímicaGame...');
    try {
        window.quimicaGame = new QuimicaGame();
        console.log('QuímicaGame inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar QuímicaGame:', error);
    }
}

// Múltiplas estratégias de inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeQuimicaGame);
} else {
    // DOM já carregado
    initializeQuimicaGame();
}

// Fallback para garantir inicialização
window.addEventListener('load', () => {
    if (!window.quimicaGame) {
        console.log('Fallback: Inicializando QuímicaGame no window.load');
        initializeQuimicaGame();
    }
});

