// Aplicação Principal - QuímicaGame (Versão Corrigida)
class QuimicaGame {
    constructor() {
        this.currentSection = 'home';
        this.soundTransitionOut = new Audio('assets/swoosh.mp3');
        this.soundTransitionOut.volume = 0.2;

        this.soundTransitionIn = new Audio('assets/woosh.mp3');
        this.soundTransitionIn.volume = 0.2;

        this.soundCorrectAnswer = new Audio('assets/correct.mp3');
        this.soundCorrectAnswer.volume = 0.2;

        this.soundIncorrectAnswer = new Audio('assets/wrong.mp3');
        this.soundIncorrectAnswer.volume = 0.2;

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
        // Se a seção clicada já for a ativa, não faz nada
        if (this.currentSection === sectionName) {
            return;
        }

        console.log(`QuimicaGame: Transicionando para a seção ${sectionName}`);
        this.transitionToSection(sectionName);
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
            }, "-=0.2").call(() => this.soundTransitionIn.play())

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
        if (window.ExerciseController && !window.exerciseController) {
            try {
                window.exerciseController = new window.ExerciseController(this);
                console.log('QuimicaGame: ExerciseController criado');
            } catch (error) {
                console.error('QuimicaGame: Erro ao criar ExerciseController:', error);
            }
        }
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
                if (progressText) progressText.textContent = `${percentage.toFixed(0)}% completo`;
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

