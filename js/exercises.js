// Sistema de Exercícios - QuímicaGame
class ExerciseController {
    constructor(gameInstance) {
        this.game = gameInstance; 
        this.currentDifficulty = 'easy';
        this.currentQuestionIndex = 0;
        this.currentQuestions = [];
        this.userAnswers = [];
        this.startTime = null;
        this.questionStartTime = null;
        this.totalQuestions = 5;
        this.currentScore = 0;
        
        this.questionBank = this.initializeQuestionBank();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeGamification();
    }

    initializeGamification() {
        if (window.GamificationSystem && !this.gamification) {
            this.gamification = new window.GamificationSystem(this.game);
        }
    }

    setupEventListeners() {
        // O controller agora gerencia seus próprios cliques
        document.getElementById('submit-answer')?.addEventListener('click', () => this.submitAnswer());
        document.getElementById('next-question')?.addEventListener('click', () => this.nextQuestion());
        document.getElementById('answer-options')?.addEventListener('click', (e) => {
            if (e.target.classList.contains('answer-option')) {
                this.selectAnswer(e.target);
            }
        });
    }

    initializeQuestionBank() {
        return {
            easy: [
                {
                    id: 'easy_1',
                    topic: 'ionic',
                    question: 'Qual tipo de ligação ocorre entre um metal e um ametal?',
                    options: [
                        'Ligação iônica',
                        'Ligação covalente',
                        'Ligação metálica',
                        'Ligação de hidrogênio'
                    ],
                    correct: 0,
                    explanation: 'A ligação iônica ocorre entre um metal (que perde elétrons) e um ametal (que ganha elétrons), formando íons que se atraem eletrostaticamente.',
                    hint: 'Pense na transferência de elétrons entre átomos com diferentes eletronegatividades.'
                },
                {
                    id: 'easy_2',
                    topic: 'ionic',
                    question: 'No composto NaCl, qual é o tipo de ligação presente?',
                    options: [
                        'Covalente',
                        'Iônica',
                        'Metálica',
                        'Dipolo-dipolo'
                    ],
                    correct: 1,
                    explanation: 'O NaCl é formado pela ligação entre o metal sódio (Na) e o ametal cloro (Cl), caracterizando uma ligação iônica.',
                    hint: 'O sódio é um metal e o cloro é um ametal.'
                },
                {
                    id: 'easy_3',
                    topic: 'covalent',
                    question: 'A ligação covalente é caracterizada por:',
                    options: [
                        'Transferência de elétrons',
                        'Compartilhamento de elétrons',
                        'Mar de elétrons',
                        'Atração eletrostática'
                    ],
                    correct: 1,
                    explanation: 'Na ligação covalente, os átomos compartilham pares de elétrons para atingir a estabilidade eletrônica.',
                    hint: 'Pense no que acontece quando dois ametais se ligam.'
                },
                {
                    id: 'easy_4',
                    topic: 'covalent',
                    question: 'Qual molécula apresenta ligação covalente?',
                    options: [
                        'NaCl',
                        'H₂O',
                        'CaO',
                        'MgF₂'
                    ],
                    correct: 1,
                    explanation: 'A água (H₂O) é formada por ligações covalentes entre o oxigênio e os átomos de hidrogênio.',
                    hint: 'Procure a molécula formada apenas por ametais.'
                },
                {
                    id: 'easy_5',
                    topic: 'metallic',
                    question: 'A ligação metálica é caracterizada por:',
                    options: [
                        'Compartilhamento de elétrons',
                        'Transferência de elétrons',
                        'Mar de elétrons',
                        'Pontes de hidrogênio'
                    ],
                    correct: 2,
                    explanation: 'Na ligação metálica, os elétrons de valência formam um "mar de elétrons" que se move livremente entre os cátions metálicos.',
                    hint: 'Pense na mobilidade dos elétrons nos metais.'
                },
                {
                    id: 'easy_6',
                    topic: 'metallic',
                    question: 'Qual propriedade é característica dos metais devido à ligação metálica?',
                    options: [
                        'Fragilidade',
                        'Condutividade elétrica',
                        'Baixo ponto de fusão',
                        'Transparência'
                    ],
                    correct: 1,
                    explanation: 'A condutividade elétrica dos metais é resultado do movimento livre dos elétrons no "mar de elétrons".',
                    hint: 'Pense em uma propriedade que permite o uso de metais em fios elétricos.'
                }
            ],
            medium: [
                {
                    id: 'medium_1',
                    topic: 'ionic',
                    question: 'Considerando a formação do MgO, quantos elétrons o magnésio transfere para o oxigênio?',
                    options: [
                        '1 elétron',
                        '2 elétrons',
                        '3 elétrons',
                        '4 elétrons'
                    ],
                    correct: 1,
                    explanation: 'O magnésio (Mg) tem 2 elétrons na camada de valência e os transfere para o oxigênio, formando Mg²⁺ e O²⁻.',
                    hint: 'Verifique a configuração eletrônica do magnésio e sua tendência de formar íons.'
                },
                {
                    id: 'medium_2',
                    topic: 'ionic',
                    question: 'Qual composto apresenta maior caráter iônico?',
                    options: [
                        'HCl',
                        'NaCl',
                        'CCl₄',
                        'NH₃'
                    ],
                    correct: 1,
                    explanation: 'O NaCl apresenta maior caráter iônico devido à grande diferença de eletronegatividade entre Na e Cl.',
                    hint: 'Compare as diferenças de eletronegatividade entre os elementos.'
                },
                {
                    id: 'medium_3',
                    topic: 'covalent',
                    question: 'Na molécula de CO₂, quantas ligações covalentes existem?',
                    options: [
                        '2 ligações',
                        '3 ligações',
                        '4 ligações',
                        '6 ligações'
                    ],
                    correct: 2,
                    explanation: 'O CO₂ possui duas ligações duplas (C=O), totalizando 4 ligações covalentes.',
                    hint: 'Desenhe a estrutura de Lewis do CO₂ e conte as ligações.'
                },
                {
                    id: 'medium_4',
                    topic: 'covalent',
                    question: 'Qual molécula é polar?',
                    options: [
                        'CO₂',
                        'H₂O',
                        'CH₄',
                        'BF₃'
                    ],
                    correct: 1,
                    explanation: 'A água (H₂O) é polar devido à geometria angular e à diferença de eletronegatividade entre O e H.',
                    hint: 'Considere a geometria molecular e a distribuição de cargas.'
                },
                {
                    id: 'medium_5',
                    topic: 'metallic',
                    question: 'Por que os metais são maleáveis?',
                    options: [
                        'Devido às ligações covalentes direcionais',
                        'Devido ao mar de elétrons que permite deslizamento',
                        'Devido às forças intermoleculares fracas',
                        'Devido à estrutura molecular'
                    ],
                    correct: 1,
                    explanation: 'A maleabilidade dos metais resulta do "mar de elétrons" que permite o deslizamento das camadas de átomos sem quebrar as ligações.',
                    hint: 'Pense na flexibilidade da ligação metálica.'
                },
                {
                    id: 'medium_6',
                    topic: 'covalent',
                    question: 'Qual é a geometria molecular do NH₃?',
                    options: [
                        'Linear',
                        'Trigonal plana',
                        'Piramidal',
                        'Tetraédrica'
                    ],
                    correct: 2,
                    explanation: 'O NH₃ tem geometria piramidal devido aos três pares ligantes e um par isolado no nitrogênio.',
                    hint: 'Use a teoria VSEPR considerando pares ligantes e isolados.'
                }
            ],
            hard: [
                {
                    id: 'hard_1',
                    topic: 'ionic',
                    question: 'Qual fator NÃO influencia a energia reticular de um composto iônico?',
                    options: [
                        'Carga dos íons',
                        'Tamanho dos íons',
                        'Massa molar do composto',
                        'Distância entre os íons'
                    ],
                    correct: 2,
                    explanation: 'A energia reticular depende das cargas e tamanhos dos íons (Lei de Coulomb), mas não da massa molar do composto.',
                    hint: 'Pense na equação de Coulomb e nos fatores que afetam a atração eletrostática.'
                },
                {
                    id: 'hard_2',
                    topic: 'covalent',
                    question: 'No íon SO₄²⁻, qual é a hibridização do enxofre?',
                    options: [
                        'sp',
                        'sp²',
                        'sp³',
                        'sp³d'
                    ],
                    correct: 2,
                    explanation: 'No SO₄²⁻, o enxofre forma 4 ligações sigma, resultando em hibridização sp³ e geometria tetraédrica.',
                    hint: 'Conte o número de domínios eletrônicos ao redor do átomo central.'
                },
                {
                    id: 'hard_3',
                    topic: 'covalent',
                    question: 'Qual molécula apresenta ressonância?',
                    options: [
                        'CH₄',
                        'H₂O',
                        'O₃',
                        'NH₃'
                    ],
                    correct: 2,
                    explanation: 'O ozônio (O₃) apresenta ressonância, com estruturas canônicas que diferem apenas na posição dos elétrons.',
                    hint: 'Procure uma molécula onde os elétrons podem ser distribuídos de diferentes formas.'
                },
                {
                    id: 'hard_4',
                    topic: 'metallic',
                    question: 'Qual teoria explica melhor a condutividade elétrica dos metais?',
                    options: [
                        'Teoria do octeto',
                        'Teoria das bandas',
                        'Teoria VSEPR',
                        'Teoria ácido-base'
                    ],
                    correct: 1,
                    explanation: 'A teoria das bandas explica a condutividade através da sobreposição de orbitais atômicos formando bandas de valência e condução.',
                    hint: 'Pense na teoria que explica a estrutura eletrônica dos sólidos.'
                },
                {
                    id: 'hard_5',
                    topic: 'ionic',
                    question: 'Qual composto tem maior ponto de fusão?',
                    options: [
                        'NaCl',
                        'MgO',
                        'CaF₂',
                        'KBr'
                    ],
                    correct: 1,
                    explanation: 'O MgO tem maior ponto de fusão devido às cargas +2 e -2 dos íons, resultando em maior energia reticular.',
                    hint: 'Compare as cargas dos íons e use a Lei de Coulomb.'
                },
                {
                    id: 'hard_6',
                    topic: 'covalent',
                    question: 'Qual afirmação sobre forças intermoleculares está INCORRETA?',
                    options: [
                        'Pontes de H são mais fortes que forças de London',
                        'Moléculas polares apresentam forças dipolo-dipolo',
                        'Forças de London existem em todas as moléculas',
                        'Pontes de H só ocorrem com F, O e N'
                    ],
                    correct: 3,
                    explanation: 'Pontes de hidrogênio podem ocorrer com outros elementos além de F, O e N, embora sejam mais comuns com estes.',
                    hint: 'Pense nos requisitos para formação de pontes de hidrogênio.'
                }
            ]
        };
    }

    setDifficulty(difficulty) {
        this.currentDifficulty = difficulty;
        this.currentQuestionIndex = 0;
        this.currentScore = 0;
        this.userAnswers = [];
    }
getOriginalExerciseHTML() {
    return `
        <h2>Exercícios Gamificados</h2>

        <div class="difficulty-selector">
            <h3>Escolha o Nível de Dificuldade:</h3>
            <div class="difficulty-buttons">
                <button class="difficulty-btn easy active" data-level="easy">
                    <i class="fas fa-seedling"></i>
                    <span>Fácil</span>
                    <small>Conceitos básicos</small>
                </button>
                <button class="difficulty-btn medium" data-level="medium">
                    <i class="fas fa-fire"></i>
                    <span>Médio</span>
                    <small>Aplicação de regras</small>
                </button>
                <button class="difficulty-btn hard" data-level="hard">
                    <i class="fas fa-crown"></i>
                    <span>Difícil</span>
                    <small>Análise complexa</small>
                </button>
            </div>
        </div>

        <div class="exercise-container">
            <div class="exercise-header">
                <div class="exercise-progress">
                    <span>Questão <span id="current-question">1</span> de <span
                            id="total-questions">5</span></span>
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
                    <h3 id="question-text">Carregando questão...</h3>
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
        </div>
    `;
}
    startExercises() {
        // Reseta o container caso o usuário esteja jogando de novo
        document.querySelector('#exercises .container').innerHTML = this.getOriginalExerciseHTML();
        
        this.currentQuestionIndex = 0;
        this.currentScore = 0;
        this.userAnswers = [];
        this.generateQuestionSet();
        this.startTime = Date.now();
        this.showQuestion();
        this.updateExerciseHeader();
        // Garante que os listeners sejam reatribuídos após o reset do HTML
        this.setupEventListeners();
    }

    generateQuestionSet() {
        const questions = this.questionBank[this.currentDifficulty];
        
        // Embaralhar questões e selecionar um subconjunto
        const shuffled = [...questions].sort(() => Math.random() - 0.5);
        this.currentQuestions = shuffled.slice(0, this.totalQuestions);
        
        // Embaralhar opções de cada questão
        this.currentQuestions.forEach(question => {
            const correctAnswer = question.options[question.correct];
            const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
            question.shuffledOptions = shuffledOptions;
            question.shuffledCorrect = shuffledOptions.indexOf(correctAnswer);
        });
    }

   showQuestion() {
        if (this.currentQuestionIndex >= this.currentQuestions.length) {
            this.finishExercises();
            return;
        }
        const question = this.currentQuestions[this.currentQuestionIndex];
        this.questionStartTime = Date.now();
        
        document.getElementById('question-text').textContent = question.question;
        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = '';
        
        question.shuffledOptions.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option';
            optionElement.dataset.index = index;
            optionElement.textContent = option;
            optionsContainer.appendChild(optionElement);
        });
        
        document.getElementById('submit-answer').style.display = 'inline-flex';
        document.getElementById('submit-answer').disabled = true;
        document.getElementById('next-question').style.display = 'none';
        document.getElementById('feedback-container').style.display = 'none';
        this.updateExerciseHeader();
    }

    selectAnswer(optionElement) {
        document.querySelectorAll('.answer-option').forEach(option => option.classList.remove('selected'));
        optionElement.classList.add('selected');
        document.getElementById('submit-answer').disabled = false;
    }

    submitAnswer() {
        const selectedOption = document.querySelector('.answer-option.selected');
        if (!selectedOption) return;
        
        const selectedIndex = parseInt(selectedOption.dataset.index);
        const question = this.currentQuestions[this.currentQuestionIndex];
        const isCorrect = selectedIndex === question.shuffledCorrect;
        const timeSpent = Date.now() - this.questionStartTime;

        // A LÓGICA DOS SONS ESTÁ AQUI
        if (isCorrect) {
            this.game.soundCorrectAnswer.play();
        } else {
            this.game.soundIncorrectAnswer.play();
        }
        
        this.userAnswers.push({
            questionId: question.id, selectedIndex, isCorrect, timeSpent, topic: question.topic
        });
        
        if (isCorrect) {
            const points = this.calculateQuestionPoints(timeSpent);
            this.currentScore += points;
        }
        
        this.showFeedback(isCorrect, question);
        this.markAnswers(selectedIndex, question.shuffledCorrect);
        
        document.querySelectorAll('.answer-option').forEach(option => {
            option.style.pointerEvents = 'none';
        });
        
        document.getElementById('submit-answer').style.display = 'none';
        document.getElementById('next-question').style.display = 'inline-flex';
        
        // Usa o método do cérebro para registrar a resposta no progresso geral
        this.game.recordAnswer(isCorrect); 
        this.updateExerciseHeader();
    }

    markAnswers(selectedIndex, correctIndex) {
        const options = document.querySelectorAll('.answer-option');
        
        options.forEach((option, index) => {
            if (index === correctIndex) {
                option.classList.add('correct');
            } else if (index === selectedIndex && selectedIndex !== correctIndex) {
                option.classList.add('incorrect');
            }
        });
    }

    showFeedback(isCorrect, question) {
        const feedbackContainer = document.getElementById('feedback-container');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackTitle = document.getElementById('feedback-title');
        const feedbackText = document.getElementById('feedback-text');
        
        if (isCorrect) {
            feedbackIcon.className = 'fas fa-check-circle';
            feedbackIcon.parentElement.className = 'feedback-icon correct';
            feedbackTitle.textContent = 'Correto!';
            feedbackText.textContent = question.explanation;
        } else {
            feedbackIcon.className = 'fas fa-times-circle';
            feedbackIcon.parentElement.className = 'feedback-icon incorrect';
            feedbackTitle.textContent = 'Incorreto';
            feedbackText.textContent = `${question.explanation} Dica: ${question.hint}`;
        }
        
        feedbackContainer.style.display = 'block';
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        // Reabilitar seleção
        document.querySelectorAll('.answer-option').forEach(option => {
            option.style.pointerEvents = 'auto';
        });
        
        this.showQuestion();
    }

    finishExercises() {
        const totalTime = Date.now() - this.startTime;
        const correctAnswers = this.userAnswers.filter(answer => answer.isCorrect).length;
        const accuracy = (correctAnswers / this.totalQuestions) * 100;
        
        // Atualizar progresso do jogo
        this.game.userProgress.completedExercises += this.totalQuestions;
        this.game.userProgress.correctAnswers += correctAnswers;
        this.game.userProgress.totalAnswers += this.totalQuestions;
        
        // Atualizar progresso por tópico
        this.userAnswers.forEach(answer => {
            if (answer.isCorrect && this.game.userProgress.topicProgress[answer.topic] !== undefined) {
                this.game.userProgress.topicProgress[answer.topic]++;
            }
        });
        
        // Adicionar pontos finais
        this.game.addPoints(this.currentScore);
        
        // Salvar progresso
        this.game.saveUserProgress();
        
        // Mostrar resultados
        this.showResults(correctAnswers, accuracy, totalTime);
        
        // Notificar sistema de gamificação
        if (this.gamification) {
            document.dispatchEvent(new CustomEvent('exerciseCompleted', {
                detail: {
                    topic: this.getMostFrequentTopic(),
                    difficulty: this.currentDifficulty,
                    score: accuracy,
                    totalTime
                }
            }));
        }
    }

    showResults(correctAnswers, accuracy, totalTime) {
        const resultsHTML = `
            <div class="exercise-results">
                <div class="results-header">
                    <h3>Exercício Concluído!</h3>
                    <div class="results-score">
                        <span class="score-value">${accuracy.toFixed(0)}%</span>
                        <span class="score-label">Precisão</span>
                    </div>
                </div>
                
                <div class="results-stats">
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">${correctAnswers}</span>
                            <span class="stat-label">Corretas</span>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-times-circle"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">${this.totalQuestions - correctAnswers}</span>
                            <span class="stat-label">Incorretas</span>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">${this.formatTime(totalTime)}</span>
                            <span class="stat-label">Tempo Total</span>
                        </div>
                    </div>
                    
                    <div class="stat-item">
                        <div class="stat-icon">
                            <i class="fas fa-star"></i>
                        </div>
                        <div class="stat-info">
                            <span class="stat-value">${this.currentScore}</span>
                            <span class="stat-label">Pontos</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" onclick="window.quimicaGame.resetExercises()"
                        <i class="fas fa-redo"></i>
                        Tentar Novamente
                    </button>
                    <button class="btn btn-secondary" onclick="window.quimicaGame.showSection('home')">
                        <i class="fas fa-home"></i>
                        Voltar ao Início
                    </button>
                </div>
                
                ${this.generateRecommendations(accuracy)}
            </div>
        `;
        
        document.querySelector('.exercise-container').innerHTML = resultsHTML;
        
        // Adicionar estilos para os resultados
        this.addResultsStyles();
    }
    

    generateRecommendations(accuracy) {
        let recommendations = '<div class="recommendations"><h4>Recomendações:</h4><ul>';
        
        if (accuracy < 60) {
            recommendations += '<li>Revise os conceitos básicos de ligações químicas</li>';
            recommendations += '<li>Assista às animações para melhor compreensão</li>';
            recommendations += '<li>Pratique com exercícios do nível fácil</li>';
        } else if (accuracy < 80) {
            recommendations += '<li>Bom trabalho! Continue praticando</li>';
            recommendations += '<li>Tente exercícios de nível médio para mais desafio</li>';
            recommendations += '<li>Foque nos tópicos com mais erros</li>';
        } else {
            recommendations += '<li>Excelente desempenho!</li>';
            recommendations += '<li>Tente exercícios de nível difícil</li>';
            recommendations += '<li>Você está pronto para tópicos avançados</li>';
        }
        
        recommendations += '</ul></div>';
        return recommendations;
    }

    calculateQuestionPoints(timeSpent) {
        let basePoints = 0;
        switch (this.currentDifficulty) {
            case 'easy': basePoints = 10; break;
            case 'medium': basePoints = 15; break;
            case 'hard': basePoints = 25; break;
        }
        
        // Bônus por velocidade (máximo 50% extra)
        const maxTime = 60000; // 1 minuto
        const speedBonus = Math.max(0, (maxTime - timeSpent) / maxTime) * basePoints * 0.5;
        
        return Math.floor(basePoints + speedBonus);
    }

    recordAnswer(isCorrect, topic, timeSpent) {
        // Registrar no jogo principal
        this.game.recordAnswer(isCorrect);
        
        // Disparar evento para gamificação
        if (this.gamification) {
            document.dispatchEvent(new CustomEvent('answerSubmitted', {
                detail: {
                    isCorrect,
                    topic,
                    difficulty: this.currentDifficulty,
                    timeSpent
                }
            }));
        }
    }

    updateExerciseHeader() {
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.totalQuestions;
        document.getElementById('current-score').textContent = this.currentScore;
        
        const progress = ((this.currentQuestionIndex + 1) / this.totalQuestions) * 100;
        document.getElementById('exercise-progress').style.width = `${progress}%`;
    }

    getMostFrequentTopic() {
        const topicCounts = {};
        this.userAnswers.forEach(answer => {
            topicCounts[answer.topic] = (topicCounts[answer.topic] || 0) + 1;
        });
        
        return Object.keys(topicCounts).reduce((a, b) => 
            topicCounts[a] > topicCounts[b] ? a : b
        );
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        if (minutes > 0) {
            return `${minutes}m ${remainingSeconds}s`;
        }
        return `${remainingSeconds}s`;
    }

    addResultsStyles() {
        if (document.getElementById('exercise-results-styles')) return;

        const style = document.createElement('style');
        style.id = 'exercise-results-styles';
        style.textContent = `
            .exercise-results {
                text-align: center;
                padding: 2rem;
            }

            .results-header {
                margin-bottom: 2rem;
            }

            .results-header h3 {
                font-size: 2rem;
                margin-bottom: 1rem;
                color: #333;
            }

            .results-score {
                display: inline-block;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
            }

            .score-value {
                font-size: 2.5rem;
                font-weight: 700;
                display: block;
            }

            .score-label {
                font-size: 1rem;
                opacity: 0.9;
            }

            .results-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .stat-item {
                background: white;
                border-radius: 15px;
                padding: 1.5rem;
                box-shadow: 0 5px 20px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
            }

            .stat-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
            }

            .stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #333;
            }

            .stat-label {
                font-size: 0.9rem;
                color: #666;
            }

            .results-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 2rem;
                flex-wrap: wrap;
            }

            .recommendations {
                background: rgba(102, 126, 234, 0.1);
                border-radius: 15px;
                padding: 1.5rem;
                text-align: left;
                max-width: 500px;
                margin: 0 auto;
            }

            .recommendations h4 {
                color: #333;
                margin-bottom: 1rem;
                text-align: center;
            }

            .recommendations ul {
                list-style: none;
                padding: 0;
            }

            .recommendations li {
                padding: 0.5rem 0;
                position: relative;
                padding-left: 1.5rem;
            }

            .recommendations li::before {
                content: "💡";
                position: absolute;
                left: 0;
            }

            @media (max-width: 768px) {
                .results-stats {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .results-actions {
                    flex-direction: column;
                    align-items: center;
                }
                
                .results-actions .btn {
                    width: 200px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Método para obter estatísticas detalhadas
    getDetailedStats() {
        const topicStats = {};
        const difficultyStats = {};
        
        this.userAnswers.forEach(answer => {
            // Estatísticas por tópico
            if (!topicStats[answer.topic]) {
                topicStats[answer.topic] = { correct: 0, total: 0, avgTime: 0 };
            }
            topicStats[answer.topic].total++;
            if (answer.isCorrect) {
                topicStats[answer.topic].correct++;
            }
            topicStats[answer.topic].avgTime += answer.timeSpent;
        });
        
        // Calcular médias
        Object.keys(topicStats).forEach(topic => {
            topicStats[topic].avgTime /= topicStats[topic].total;
            topicStats[topic].accuracy = (topicStats[topic].correct / topicStats[topic].total) * 100;
        });
        
        return {
            topicStats,
            difficultyStats,
            totalQuestions: this.userAnswers.length,
            totalCorrect: this.userAnswers.filter(a => a.isCorrect).length,
            averageTime: this.userAnswers.reduce((sum, a) => sum + a.timeSpent, 0) / this.userAnswers.length
        };
    }
}

// Exportar para uso global
window.ExerciseController = ExerciseController;

