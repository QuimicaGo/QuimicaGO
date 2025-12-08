class ExerciseController {
    constructor(gameInstance) {
        this.soundCorrectAnswer = new Audio('assets/correct.mp3');
        this.soundCorrectAnswer.volume = 0.5;

        this.soundIncorrectAnswer = new Audio('assets/wrong.mp3');
        this.soundIncorrectAnswer.volume = 0.5;
        this.game = gameInstance;
        this.currentDifficulty = null;
        this.currentQuestionIndex = 0;
        this.currentQuestions = [];
        this.userAnswers = [];
        this.startTime = null;
        this.questionStartTime = null;
        this.currentScore = 0;
        this.totalQuestions = 0;
        
        // Inicializa o banco e CARREGA as customizadas
        this.questionBank = this.initializeQuestionBank();
        this.loadCustomQuestions(); 

        // Binds
        this.handleQuantityClick = this.handleQuantityClick.bind(this);
        this.handleAnswerClick = this.handleAnswerClick.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        
        // Binds do Modal
        this.openCreateModal = this.openCreateModal.bind(this);
        this.closeCreateModal = this.closeCreateModal.bind(this);
        this.handleSaveQuestion = this.handleSaveQuestion.bind(this);

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeGamification();
        this.checkTeacherMode();
    }

    // --- MODO PROFESSOR & MODAL ---
    
    checkTeacherMode() {
        const currentUser = this.game.currentUser;
        if (currentUser && currentUser.role === 'teacher') {
            this.injectTeacherTools();
        }
    }

injectTeacherTools() {
        // 1. Remove o painel antigo se ele já existir (CORREÇÃO FUNDAMENTAL)
        // Isso remove o botão "velho" que perdeu a referência
        const existingPanel = document.querySelector('.teacher-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const difficultySection = document.querySelector('.difficulty-selector');
        
        // Verifica se a seção de dificuldade existe antes de tentar inserir
        if (!difficultySection) return;

        const teacherPanel = document.createElement('div');
        teacherPanel.className = 'teacher-panel';
        teacherPanel.style.cssText = `
            background: #e3f2fd; border: 2px dashed #2196f3; padding: 15px;
            border-radius: 10px; margin-bottom: 20px; text-align: center;
        `;

        teacherPanel.innerHTML = `
            <h4 style="color: #1565c0; margin-bottom: 10px;"><i class="fas fa-chalkboard-teacher"></i> Painel do Professor</h4>
            <p style="font-size: 0.9em; margin-bottom: 10px; color: #555;">Adicione novas questões ao banco de dados.</p>
            <button id="btn-create-question" class="btn btn-primary" style="background: #2196f3;">
                <i class="fas fa-plus-circle"></i> Criar Nova Questão
            </button>
        `;

        difficultySection.insertBefore(teacherPanel, difficultySection.firstChild);
        
        // Listener para abrir o modal
        const btnCreate = document.getElementById('btn-create-question');
        if (btnCreate) {
            // Remove qualquer listener anterior por segurança (embora remover o elemento já resolva)
            btnCreate.removeEventListener('click', this.openCreateModal);
            // Adiciona o novo listener vinculado a ESTA instância do controlador
            btnCreate.addEventListener('click', this.openCreateModal);
        }
    }
    openCreateModal() {
        const modal = document.getElementById('create-question-modal');
        if(modal) {
            modal.classList.remove('hidden');
            // Configurar listeners do modal (fechar e submit)
            document.getElementById('close-modal-btn').onclick = this.closeCreateModal;
            document.getElementById('cancel-create-btn').onclick = this.closeCreateModal;
            
            // Remove listener antigo para evitar submit duplo e adiciona novo
            const form = document.getElementById('create-question-form');
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);
            newForm.addEventListener('submit', this.handleSaveQuestion);
        }
    }

    closeCreateModal() {
        const modal = document.getElementById('create-question-modal');
        if(modal) modal.classList.add('hidden');
    }

handleSaveQuestion(e) {
        e.preventDefault(); 

        // 1. Pegar os valores, INCLUINDO a nova dificuldade
        const topic = document.getElementById('new-q-topic').value;
        const difficulty = document.getElementById('new-q-difficulty').value; // NOVO CAMPO
        const text = document.getElementById('new-q-text').value;
        const correct = document.getElementById('new-q-correct').value;
        const w1 = document.getElementById('new-q-wrong1').value;
        const w2 = document.getElementById('new-q-wrong2').value;
        const w3 = document.getElementById('new-q-wrong3').value;
        const explanation = document.getElementById('new-q-explanation').value || "Sem explicação cadastrada.";

        // 2. Criar o objeto da questão
        const newQuestion = {
            id: `custom_${Date.now()}`,
            topic: topic,
            difficulty: difficulty, // IMPORTANTE: Salvar a dificuldade no objeto
            question: text,
            options: [correct, w1, w2, w3],
            correct: 0, 
            explanation: explanation,
            hint: "Revise o conteúdo sobre " + (topic === 'ionic' ? 'Ligação Iônica' : topic === 'covalent' ? 'Covalente' : 'Metálica')
        };

        // 3. Salvar na Memória (Usando a dificuldade correta)
        this.addQuestionToBank(newQuestion);

        // 4. Salvar no LocalStorage
        this.saveToLocalStorage(newQuestion);

        alert(`Questão criada com sucesso no nível ${difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Médio' : 'Difícil'}!`);
        document.getElementById('create-question-form').reset();
        this.closeCreateModal();
    }

addQuestionToBank(question) {
        // CORREÇÃO: Agora salva APENAS no nível escolhido, não em todos
        const level = question.difficulty || 'easy'; // Se não tiver definido, joga no fácil
        
        if (!this.questionBank[level]) {
            this.questionBank[level] = [];
        }
        
        this.questionBank[level].push(question);
        console.log(`Questão adicionada ao banco no nível: ${level}`);
    }

    saveToLocalStorage(question) {
        // Pega o que já tem salvo ou cria array vazio
        let savedQuestions = JSON.parse(localStorage.getItem('quimica_custom_questions')) || [];
        savedQuestions.push(question);
        localStorage.setItem('quimica_custom_questions', JSON.stringify(savedQuestions));
    }

    loadCustomQuestions() {
        const stored = localStorage.getItem('quimica_custom_questions');
        if (stored) {
            const questions = JSON.parse(stored);
            questions.forEach(q => {
                this.addQuestionToBank(q);
            });
            console.log(`Carregadas ${questions.length} questões personalizadas.`);
        }
    }
    // ------------------------------------

    initializeGamification() {
        if (window.GamificationSystem && !this.gamification) {
            this.gamification = new window.GamificationSystem(this.game);
        }
    }

    initializeQuestionBank() {
        return {
            easy: [
                {
                    id: 'easy_1',
                    topic: 'ionic',
                    question: 'Qual tipo de ligação ocorre entre um metal e um ametal?',
                    options: ['Ligação iônica', 'Ligação covalente', 'Ligação metálica', 'Ligação de hidrogênio'],
                    correct: 0,
                    explanation: 'A ligação iônica ocorre entre um metal (que perde elétrons) e um ametal (que ganha elétrons).',
                    hint: 'Pense na transferência de elétrons.'
                },
                {
                    id: 'easy_2',
                    topic: 'covalent',
                    question: 'O compartilhamento de elétrons ocorre na:',
                    options: ['Ligação covalente', 'Ligação iônica', 'Ligação metálica', 'Força de Van der Waals'],
                    correct: 0,
                    explanation: 'O compartilhamento de pares eletrônicos é a base da ligação covalente.',
                    hint: 'Ocorre geralmente entre ametais.'
                }
            ],
            medium: [
                {
                    id: 'medium_1',
                    topic: 'metallic',
                    question: 'O "mar de elétrons" é característico de qual ligação?',
                    options: ['Metálica', 'Iônica', 'Covalente', 'Dativa'],
                    correct: 0,
                    explanation: 'Na ligação metálica, os elétrons livres formam uma nuvem ou mar eletrônico.',
                    hint: 'Pense nos metais condutores.'
                }
            ],
            hard: [
                {
                    id: 'hard_1',
                    topic: 'ionic',
                    question: 'Qual a geometria do cristal de NaCl?',
                    options: ['Cúbica de face centrada', 'Hexagonal', 'Tetraédrica', 'Linear'],
                    correct: 0,
                    explanation: 'O NaCl forma uma estrutura cristalina cúbica de face centrada.',
                    hint: 'Pense em um cubo.'
                }
            ]
        };
    }

    handleQuantityClick(e) {
        const quantityBtn = e.target.closest('.quantity-btn');
        if (quantityBtn && !quantityBtn.disabled) {
            const quantity = parseInt(quantityBtn.getAttribute('data-actual-quantity'));
            this.startExercises(quantity);
        }
    }

    handleAnswerClick(e) {
        if (e.target.classList.contains('answer-option')) {
            this.selectAnswer(e.target);
        }
    }

    handleSubmitClick() {
        this.submitAnswer();
    }

    handleNextClick() {
        this.nextQuestion();
    }

    showQuantitySelector(difficulty) {
        this.currentDifficulty = difficulty;
        const questionsForLevel = this.questionBank[difficulty] || [];
        const count = questionsForLevel.length;

        const difficultyButtonsContainer = document.querySelector('.difficulty-buttons');
        const difficultyButtonsHeader = document.querySelector('#difficulty-buttons-header');
        const teacherPanel = document.querySelector('.teacher-panel');
        const quantitySelector = document.getElementById('quantity-selector');
        const exerciseContainer = document.querySelector('.exercise-container');

        const elementsToHide = [difficultyButtonsContainer, exerciseContainer, difficultyButtonsHeader];
        if (teacherPanel) elementsToHide.push(teacherPanel);

        gsap.to(elementsToHide, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                difficultyButtonsContainer.classList.add('hidden');
                exerciseContainer.classList.add('hidden');
                difficultyButtonsHeader.classList.add('hidden');
                if (teacherPanel) teacherPanel.classList.add('hidden');

                const quantityButtons = quantitySelector.querySelectorAll('.quantity-btn');
                let maxReached = false;

                quantityButtons.forEach(btn => {
                    const targetQuantity = parseInt(btn.dataset.quantity);
                    const textSpan = btn.querySelector('span');

                    if (count === 0) {
                        btn.disabled = true;
                        maxReached = true;
                    } else if (maxReached) {
                        btn.disabled = true;
                        textSpan.textContent = `${targetQuantity} Questões`;
                    } else if (count >= targetQuantity) {
                        btn.disabled = false;
                        textSpan.textContent = `${targetQuantity} Questões`;
                        btn.setAttribute('data-actual-quantity', targetQuantity);
                    } else {
                        btn.disabled = false;
                        textSpan.textContent = `Máximo (${count})`;
                        btn.setAttribute('data-actual-quantity', count);
                        maxReached = true;
                    }
                });

                const backToDifficultyButton = document.getElementById('back-to-difficulty-btn');
                const newBtn = backToDifficultyButton.cloneNode(true);
                backToDifficultyButton.parentNode.replaceChild(newBtn, backToDifficultyButton);
                
                newBtn.addEventListener('click', () => {
                    gsap.to(quantitySelector, {
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            quantitySelector.classList.add('hidden');
                            difficultyButtonsContainer.classList.remove('hidden');
                            difficultyButtonsHeader.classList.remove('hidden');
                            if (teacherPanel) teacherPanel.classList.remove('hidden');
                            
                            const elementsToShow = [difficultyButtonsContainer, difficultyButtonsHeader];
                            if (teacherPanel) elementsToShow.push(teacherPanel);
                            gsap.to(elementsToShow, { opacity: 1, duration: 0.4 });
                        }
                    });
                });

                quantitySelector.classList.remove('hidden');
                gsap.fromTo(quantitySelector, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" });
            }
        });
    }

    startExercises(quantity) {
        if (!quantity || quantity <= 0) return;
        this.totalQuestions = quantity;

        const quantitySelector = document.getElementById('quantity-selector');
        const exerciseContainer = document.querySelector('.exercise-container');
        const difficultySelectorTitle = document.querySelector('.difficulty-selector h3');

        gsap.to([quantitySelector, difficultySelectorTitle], {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                quantitySelector.classList.add('hidden');
                difficultySelectorTitle.classList.add('hidden');
                exerciseContainer.classList.remove('hidden');
                gsap.fromTo(exerciseContainer, { opacity: 0 }, { opacity: 1, duration: 0.4 });

                this.generateQuestionSet();
                this.startTime = Date.now();
                this.showQuestion();
                this.updateExerciseHeader();
            }
        });
    }

    setupEventListeners() {
        document.getElementById('submit-answer')?.addEventListener('click', this.handleSubmitClick);
        document.getElementById('next-question')?.addEventListener('click', this.handleNextClick);
        document.getElementById('quantity-selector')?.addEventListener('click', this.handleQuantityClick);
        document.addEventListener('click', this.handleAnswerClick);
    }

// 1. Garante que o método de embaralhar exista na classe
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 2. Método de Gerar Questões (Lógica Blindada)
    generateQuestionSet() {
        // Pega as questões do nível selecionado
        const questionsSource = this.questionBank[this.currentDifficulty] || [];
        
        // Copia a lista de questões para embaralhar a ordem em que aparecem
        let allQuestions = [...questionsSource];
        this.shuffleArray(allQuestions);

        // Pega apenas a quantidade necessária
        this.currentQuestions = allQuestions.slice(0, this.totalQuestions);

        // Agora processa cada questão
        this.currentQuestions.forEach(question => {
            // Passo A: Criar objetos temporários que sabem se são a resposta certa ou não
            // O índice 'question.correct' (que é 0 nas criadas pelo professor) diz quem é o verdadeiro
            let tempOptions = question.options.map((optText, index) => {
                return {
                    text: optText,
                    isOriginalCorrect: index === question.correct // Marca: "Eu sou a certa?"
                };
            });

            // Passo B: Embaralhar esses objetos
            this.shuffleArray(tempOptions);

            // Passo C: Separar de volta em texto e descobrir onde a certa foi parar
            question.shuffledOptions = tempOptions.map(obj => obj.text);
            
            // Encontra o índice da opção que tem a marca "isOriginalCorrect"
            question.shuffledCorrect = tempOptions.findIndex(obj => obj.isOriginalCorrect);
            
            // Debug para você ver no console (F12) se está funcionando
            console.log(`Questão: ${question.question}`);
            console.log(`Embaralhado: ${question.shuffledOptions.join(' | ')}`);
            console.log(`A correta (índice original ${question.correct}) foi para a posição: ${question.shuffledCorrect}`);
            console.log('---');
        });
    }
    showQuestion() {
        if (this.currentQuestions.length === 0) return;
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

        this.userAnswers.push({
            questionId: question.id,
            selectedIndex,
            isCorrect,
            timeSpent,
            topic: question.topic
        });

        if (isCorrect) {
            const points = this.calculateQuestionPoints(timeSpent);
            this.currentScore += points;
            this.soundCorrectAnswer.play();
        } else {
            this.soundIncorrectAnswer.play();
        }

        this.showFeedback(isCorrect, question);
        this.markAnswers(selectedIndex, question.shuffledCorrect);

        document.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'none');
        document.getElementById('submit-answer').style.display = 'none';
        document.getElementById('next-question').style.display = 'inline-flex';

        this.recordAnswer(isCorrect, question.topic, timeSpent);
        this.updateExerciseHeader();
    }

    markAnswers(selectedIndex, correctIndex) {
        const options = document.querySelectorAll('.answer-option');
        options.forEach((option, index) => {
            if (index === correctIndex) option.classList.add('correct');
            else if (index === selectedIndex) option.classList.add('incorrect');
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
        document.querySelectorAll('.answer-option').forEach(option => option.style.pointerEvents = 'auto');
        this.showQuestion();
    }

    finishExercises() {
        const totalTime = Date.now() - this.startTime;
        const correctAnswers = this.userAnswers.filter(answer => answer.isCorrect).length;
        const accuracy = this.totalQuestions > 0 ? (correctAnswers / this.totalQuestions) * 100 : 0;

        if (this.game.userProgress) {
            this.game.userProgress.completedExercises += this.totalQuestions;
            this.game.userProgress.correctAnswers += correctAnswers;
            this.game.userProgress.totalAnswers += this.totalQuestions;

            this.userAnswers.forEach(answer => {
                if (answer.isCorrect && this.game.userProgress.topicProgress) {
                    this.game.userProgress.topicProgress[answer.topic] = (this.game.userProgress.topicProgress[answer.topic] || 0) + 1;
                }
            });

            this.game.addPoints(this.currentScore);
            this.game.saveUserProgress();
        }

        this.showResults(correctAnswers, accuracy, totalTime);

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
                        <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="stat-info">
                            <span class="stat-value">${correctAnswers}</span>
                            <span class="stat-label">Corretas</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-times-circle"></i></div>
                        <div class="stat-info">
                            <span class="stat-value">${this.totalQuestions - correctAnswers}</span>
                            <span class="stat-label">Incorretas</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-clock"></i></div>
                        <div class="stat-info">
                            <span class="stat-value">${this.formatTime(totalTime)}</span>
                            <span class="stat-label">Tempo Total</span>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon"><i class="fas fa-star"></i></div>
                        <div class="stat-info">
                            <span class="stat-value">${this.currentScore}</span>
                            <span class="stat-label">Pontos</span>
                        </div>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="btn btn-primary" id="btn-results-retry">
                        <i class="fas fa-redo"></i> Tentar Novamente
                    </button>
                    <button class="btn btn-secondary" onclick="window.quimicaGame.showSection('home')">
                        <i class="fas fa-home"></i> Voltar ao Início
                    </button>
                </div>
                
                ${this.generateRecommendations(accuracy)}
            </div>
        `;

        const container = document.querySelector('.exercise-container');
        container.innerHTML = resultsHTML;

        document.getElementById('btn-results-retry').addEventListener('click', () => {
            if (window.quimicaGame && typeof window.quimicaGame.resetExercises === 'function') {
                window.quimicaGame.resetExercises();
            }
        });

        this.addResultsStyles();
    }

    generateRecommendations(accuracy) {
        let recommendations = '<div class="recommendations"><h4>Recomendações:</h4><ul>';
        if (accuracy < 60) {
            recommendations += '<li>Revise os conceitos básicos de ligações químicas</li>';
            recommendations += '<li>Assista às animações para melhor compreensão</li>';
        } else if (accuracy < 80) {
            recommendations += '<li>Bom trabalho! Continue praticando</li>';
            recommendations += '<li>Tente exercícios de nível médio</li>';
        } else {
            recommendations += '<li>Excelente desempenho!</li>';
            recommendations += '<li>Você está pronto para tópicos avançados</li>';
        }
        recommendations += '</ul></div>';
        return recommendations;
    }

    calculateQuestionPoints(timeSpent) {
        let basePoints = 10;
        if (this.currentDifficulty === 'medium') basePoints = 15;
        if (this.currentDifficulty === 'hard') basePoints = 25;
        
        const maxTime = 60000;
        const speedBonus = Math.max(0, (maxTime - timeSpent) / maxTime) * basePoints * 0.5;
        return Math.floor(basePoints + speedBonus);
    }

    recordAnswer(isCorrect, topic, timeSpent) {
        if(this.game && this.game.recordAnswer) this.game.recordAnswer(isCorrect);
        
        if (this.gamification) {
            document.dispatchEvent(new CustomEvent('answerSubmitted', {
                detail: { isCorrect, topic, difficulty: this.currentDifficulty, timeSpent }
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
        if(this.userAnswers.length === 0) return 'geral';
        const topicCounts = {};
        this.userAnswers.forEach(answer => topicCounts[answer.topic] = (topicCounts[answer.topic] || 0) + 1);
        return Object.keys(topicCounts).reduce((a, b) => topicCounts[a] > topicCounts[b] ? a : b);
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
    }

    addResultsStyles() {
        if (document.getElementById('exercise-results-styles')) return;
        const style = document.createElement('style');
        style.id = 'exercise-results-styles';
        style.textContent = `
            .exercise-results { text-align: center; padding: 2rem; }
            .results-header h3 { font-size: 2rem; margin-bottom: 1rem; color: #333; }
            .results-score { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1rem 2rem; border-radius: 50px; }
            .score-value { font-size: 2.5rem; font-weight: 700; display: block; }
            .results-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; margin-top: 2rem;}
            .stat-item { background: white; border-radius: 15px; padding: 1.5rem; box-shadow: 0 5px 20px rgba(0,0,0,0.1); display: flex; flex-direction: column; align-items: center; }
            .stat-icon { width: 50px; height: 50px; border-radius: 50%; background: #e0e7ff; color: #667eea; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 0.5rem;}
            .results-actions { display: flex; gap: 1rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap; }
            .recommendations { background: rgba(102, 126, 234, 0.1); border-radius: 15px; padding: 1.5rem; text-align: left; max-width: 500px; margin: 0 auto; }
        `;
        document.head.appendChild(style);
    }

    cleanup() {
        document.getElementById('quantity-selector')?.removeEventListener('click', this.handleQuantityClick);
        document.removeEventListener('click', this.handleAnswerClick);
        document.getElementById('btn-create-question')?.removeEventListener('click', this.openCreateModal);
    }
}

window.ExerciseController = ExerciseController;