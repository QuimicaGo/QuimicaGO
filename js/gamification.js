// Sistema de Gamificação - QuímicaGame
class GamificationSystem {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.achievements = this.initializeAchievements();
        this.streaks = {
            current: 0,
            best: 0,
            lastAnswerDate: null
        };
        this.badges = [];
        this.challenges = this.initializeChallenges();
        this.notifications = [];
        
        this.init();
    }

    init() {
        this.loadGamificationData();
        this.setupEventListeners();
        this.checkDailyChallenges();
        this.updateAllDisplays();
    }

    initializeAchievements() {
        return [
            {
                id: 'first_steps',
                name: 'Primeiros Passos',
                description: 'Responda sua primeira questão corretamente',
                icon: '🎯',
                condition: (progress) => progress.correctAnswers >= 1,
                points: 10,
                unlocked: false,
                category: 'iniciante'
            },
            {
                id: 'ionic_novice',
                name: 'Novato Iônico',
                description: 'Complete 3 exercícios sobre ligações iônicas',
                icon: '⚡',
                condition: (progress) => progress.topicProgress.ionic >= 3,
                points: 25,
                unlocked: false,
                category: 'topico'
            },
            {
                id: 'covalent_explorer',
                name: 'Explorador Covalente',
                description: 'Complete 3 exercícios sobre ligações covalentes',
                icon: '🔗',
                condition: (progress) => progress.topicProgress.covalent >= 3,
                points: 25,
                unlocked: false,
                category: 'topico'
            },
            {
                id: 'metallic_master',
                name: 'Mestre Metálico',
                description: 'Complete todos os exercícios sobre ligações metálicas',
                icon: '🏆',
                condition: (progress) => progress.topicProgress.metallic >= 5,
                points: 50,
                unlocked: false,
                category: 'topico'
            },
            {
                id: 'perfect_streak',
                name: 'Sequência Perfeita',
                description: 'Acerte 5 questões seguidas',
                icon: '🔥',
                condition: () => this.streaks.current >= 5,
                points: 30,
                unlocked: false,
                category: 'desempenho'
            },
            {
                id: 'speed_demon',
                name: 'Velocista',
                description: 'Responda 10 questões em menos de 5 minutos',
                icon: '⚡',
                condition: () => this.checkSpeedRecord(),
                points: 40,
                unlocked: false,
                category: 'desempenho'
            },
            {
                id: 'knowledge_seeker',
                name: 'Buscador do Conhecimento',
                description: 'Complete exercícios em todos os níveis de dificuldade',
                icon: '📚',
                condition: (progress) => this.checkAllDifficultiesCompleted(progress),
                points: 60,
                unlocked: false,
                category: 'completude'
            },
            {
                id: 'chemistry_master',
                name: 'Mestre da Química',
                description: 'Alcance 90% de taxa de acerto com pelo menos 50 questões',
                icon: '👑',
                condition: (progress) => {
                    const accuracy = progress.totalAnswers > 0 ? (progress.correctAnswers / progress.totalAnswers) : 0;
                    return accuracy >= 0.9 && progress.totalAnswers >= 50;
                },
                points: 100,
                unlocked: false,
                category: 'maestria'
            },
            {
                id: 'daily_warrior',
                name: 'Guerreiro Diário',
                description: 'Complete desafios diários por 7 dias consecutivos',
                icon: '🗡️',
                condition: () => this.checkDailyStreak(),
                points: 75,
                unlocked: false,
                category: 'consistencia'
            },
            {
                id: 'animation_enthusiast',
                name: 'Entusiasta das Animações',
                description: 'Assista todas as animações disponíveis',
                icon: '🎬',
                condition: () => this.checkAllAnimationsWatched(),
                points: 20,
                unlocked: false,
                category: 'exploracao'
            }
        ];
    }

    initializeChallenges() {
        return [
            {
                id: 'daily_practice',
                name: 'Prática Diária',
                description: 'Complete 5 exercícios hoje',
                type: 'daily',
                target: 5,
                current: 0,
                points: 20,
                active: true,
                expiresAt: this.getEndOfDay()
            },
            {
                id: 'perfect_day',
                name: 'Dia Perfeito',
                description: 'Acerte todas as questões de hoje (mínimo 3)',
                type: 'daily',
                target: 3,
                current: 0,
                mistakes: 0,
                points: 30,
                active: true,
                expiresAt: this.getEndOfDay()
            },
            {
                id: 'topic_focus',
                name: 'Foco no Tópico',
                description: 'Complete 3 exercícios do mesmo tópico',
                type: 'session',
                target: 3,
                current: 0,
                currentTopic: null,
                points: 15,
                active: true,
                expiresAt: null
            }
        ];
    }

    setupEventListeners() {
        // Escutar eventos de resposta
        document.addEventListener('answerSubmitted', (event) => {
            this.handleAnswerSubmitted(event.detail);
        });

        // Escutar eventos de exercício completado
        document.addEventListener('exerciseCompleted', (event) => {
            this.handleExerciseCompleted(event.detail);
        });

        // Escutar eventos de animação assistida
        document.addEventListener('animationWatched', (event) => {
            this.handleAnimationWatched(event.detail);
        });
    }

    handleAnswerSubmitted(data) {
        const { isCorrect, topic, difficulty, timeSpent } = data;
        
        // Atualizar streak
        if (isCorrect) {
            this.streaks.current++;
            this.streaks.lastAnswerDate = new Date().toDateString();
            if (this.streaks.current > this.streaks.best) {
                this.streaks.best = this.streaks.current;
            }
        } else {
            this.streaks.current = 0;
        }

        // Atualizar desafios
        this.updateChallenges(isCorrect, topic, timeSpent);

        // Verificar conquistas
        this.checkAchievements();

        // Calcular pontos baseados na dificuldade e tempo
        const points = this.calculatePoints(isCorrect, difficulty, timeSpent);
        if (points > 0) {
            this.game.addPoints(points);
        }

        // Salvar dados
        this.saveGamificationData();
    }

    handleExerciseCompleted(data) {
        const { topic, difficulty, score } = data;
        
        // Verificar se merece badge especial
        if (score === 100) {
            this.awardBadge('perfect_score', topic, difficulty);
        }

        // Atualizar desafios
        this.updateDailyChallenges();
        
        // Verificar conquistas
        this.checkAchievements();
    }

    handleAnimationWatched(data) {
        const { animationType } = data;
        
        // Registrar animação assistida
        if (!this.watchedAnimations) {
            this.watchedAnimations = [];
        }
        
        if (!this.watchedAnimations.includes(animationType)) {
            this.watchedAnimations.push(animationType);
            this.game.addPoints(5); // Pontos por assistir animação
        }

        this.checkAchievements();
        this.saveGamificationData();
    }

    calculatePoints(isCorrect, difficulty, timeSpent) {
        if (!isCorrect) return 0;

        let basePoints = 0;
        switch (difficulty) {
            case 'easy': basePoints = 10; break;
            case 'medium': basePoints = 15; break;
            case 'hard': basePoints = 25; break;
            default: basePoints = 10;
        }

        // Bônus por velocidade (se respondeu em menos de 30 segundos)
        let speedBonus = 0;
        if (timeSpent < 30000) {
            speedBonus = Math.floor(basePoints * 0.5);
        }

        // Bônus por streak
        let streakBonus = 0;
        if (this.streaks.current >= 3) {
            streakBonus = Math.floor(basePoints * 0.3 * Math.min(this.streaks.current / 10, 1));
        }

        return basePoints + speedBonus + streakBonus;
    }

    updateChallenges(isCorrect, topic, timeSpent) {
        this.challenges.forEach(challenge => {
            if (!challenge.active) return;

            switch (challenge.id) {
                case 'daily_practice':
                    if (isCorrect) {
                        challenge.current = Math.min(challenge.current + 1, challenge.target);
                    }
                    break;

                case 'perfect_day':
                    if (isCorrect) {
                        challenge.current++;
                    } else {
                        challenge.mistakes++;
                    }
                    break;

                case 'topic_focus':
                    if (isCorrect) {
                        if (challenge.currentTopic === topic) {
                            challenge.current++;
                        } else {
                            challenge.currentTopic = topic;
                            challenge.current = 1;
                        }
                    }
                    break;
            }

            // Verificar se o desafio foi completado
            if (this.isChallengeCompleted(challenge)) {
                this.completeChallenge(challenge);
            }
        });
    }

    isChallengeCompleted(challenge) {
        switch (challenge.id) {
            case 'daily_practice':
                return challenge.current >= challenge.target;
            
            case 'perfect_day':
                return challenge.current >= challenge.target && challenge.mistakes === 0;
            
            case 'topic_focus':
                return challenge.current >= challenge.target;
            
            default:
                return false;
        }
    }

    completeChallenge(challenge) {
        if (!challenge.active) return;

        challenge.active = false;
        this.game.addPoints(challenge.points);
        
        this.showNotification({
            type: 'challenge',
            title: 'Desafio Completado!',
            message: `${challenge.name} - +${challenge.points} pontos`,
            icon: '🏆'
        });

        // Resetar desafio se for diário
        if (challenge.type === 'daily') {
            setTimeout(() => {
                this.resetDailyChallenge(challenge);
            }, 1000);
        }
    }

    checkAchievements() {
        const progress = this.game.userProgress;
        
        this.achievements.forEach(achievement => {
            if (!achievement.unlocked && achievement.condition(progress)) {
                this.unlockAchievement(achievement);
            }
        });
    }

    unlockAchievement(achievement) {
        achievement.unlocked = true;
        this.game.addPoints(achievement.points);
        
        this.showNotification({
            type: 'achievement',
            title: 'Conquista Desbloqueada!',
            message: `${achievement.name} - +${achievement.points} pontos`,
            icon: achievement.icon
        });

        // Adicionar à lista de conquistas do usuário
        if (!this.game.userProgress.achievements.includes(achievement.id)) {
            this.game.userProgress.achievements.push(achievement.id);
        }
    }

    awardBadge(type, topic, difficulty) {
        const badgeId = `${type}_${topic}_${difficulty}`;
        
        if (!this.badges.includes(badgeId)) {
            this.badges.push(badgeId);
            
            this.showNotification({
                type: 'badge',
                title: 'Novo Badge!',
                message: `${type.replace('_', ' ')} em ${topic} (${difficulty})`,
                icon: '🏅'
            });
        }
    }

    showNotification(notification) {
        this.notifications.push({
            ...notification,
            id: Date.now(),
            timestamp: new Date(),
            shown: false
        });

        this.displayNotification(notification);
    }

    displayNotification(notification) {
        const notificationElement = document.createElement('div');
        notificationElement.className = 'gamification-notification';
        notificationElement.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">${notification.icon}</div>
                <div class="notification-text">
                    <h4>${notification.title}</h4>
                    <p>${notification.message}</p>
                </div>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Adicionar estilos se não existirem
        this.addNotificationStyles();

        document.body.appendChild(notificationElement);

        // Animação de entrada
        setTimeout(() => {
            notificationElement.classList.add('show');
        }, 100);

        // Auto-remover após 5 segundos
        setTimeout(() => {
            this.removeNotification(notificationElement);
        }, 5000);

        // Evento de fechar
        notificationElement.querySelector('.notification-close').addEventListener('click', () => {
            this.removeNotification(notificationElement);
        });
    }

    removeNotification(element) {
        element.classList.add('hide');
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 300);
    }

    addNotificationStyles() {
        if (document.getElementById('gamification-styles')) return;

        const style = document.createElement('style');
        style.id = 'gamification-styles';
        style.textContent = `
            .gamification-notification {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s ease;
                max-width: 350px;
                min-width: 300px;
            }

            .gamification-notification.show {
                transform: translateX(0);
            }

            .gamification-notification.hide {
                transform: translateX(400px);
                opacity: 0;
            }

            .notification-content {
                display: flex;
                align-items: center;
                padding: 1rem;
                gap: 1rem;
            }

            .notification-icon {
                font-size: 2rem;
                flex-shrink: 0;
            }

            .notification-text h4 {
                margin: 0 0 0.25rem 0;
                font-size: 1rem;
                font-weight: 600;
            }

            .notification-text p {
                margin: 0;
                font-size: 0.9rem;
                opacity: 0.9;
            }

            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s ease;
                flex-shrink: 0;
                margin-left: auto;
            }

            .notification-close:hover {
                background: rgba(255,255,255,0.2);
            }

            .progress-ring {
                width: 60px;
                height: 60px;
                transform: rotate(-90deg);
            }

            .progress-ring-circle {
                fill: none;
                stroke: rgba(255,255,255,0.3);
                stroke-width: 4;
            }

            .progress-ring-progress {
                fill: none;
                stroke: #ffd54f;
                stroke-width: 4;
                stroke-linecap: round;
                transition: stroke-dasharray 0.3s ease;
            }

            .challenge-card {
                background: rgba(255,255,255,0.1);
                border-radius: 10px;
                padding: 1rem;
                margin-bottom: 1rem;
                backdrop-filter: blur(10px);
            }

            .challenge-card.completed {
                background: rgba(76, 175, 80, 0.2);
                border: 2px solid #4caf50;
            }

            .challenge-progress {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-top: 0.5rem;
            }

            .challenge-progress-bar {
                flex: 1;
                height: 8px;
                background: rgba(255,255,255,0.3);
                border-radius: 4px;
                overflow: hidden;
            }

            .challenge-progress-fill {
                height: 100%;
                background: #ffd54f;
                border-radius: 4px;
                transition: width 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Métodos de verificação para conquistas
    checkSpeedRecord() {
        // Implementar lógica de verificação de velocidade
        return false; // Placeholder
    }

    checkAllDifficultiesCompleted(progress) {
        return progress.completedExercises >= 15; // Assumindo 5 exercícios por dificuldade
    }

    checkDailyStreak() {
        // Implementar lógica de streak diário
        return false; // Placeholder
    }

    checkAllAnimationsWatched() {
        return this.watchedAnimations && this.watchedAnimations.length >= 3;
    }

    // Métodos de desafios diários
    checkDailyChallenges() {
        const today = new Date().toDateString();
        
        this.challenges.forEach(challenge => {
            if (challenge.type === 'daily') {
                const expiresAt = new Date(challenge.expiresAt);
                if (expiresAt < new Date()) {
                    this.resetDailyChallenge(challenge);
                }
            }
        });
    }

    resetDailyChallenge(challenge) {
        challenge.current = 0;
        challenge.mistakes = 0;
        challenge.active = true;
        challenge.expiresAt = this.getEndOfDay();
        
        if (challenge.id === 'topic_focus') {
            challenge.currentTopic = null;
        }
    }

    getEndOfDay() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    }

    updateDailyChallenges() {
        this.challenges.forEach(challenge => {
            if (challenge.type === 'daily' && challenge.active) {
                const progress = (challenge.current / challenge.target) * 100;
                this.updateChallengeDisplay(challenge.id, progress, challenge.current, challenge.target);
            }
        });
    }

    updateChallengeDisplay(challengeId, progress, current, target) {
        const challengeElement = document.getElementById(`challenge-${challengeId}`);
        if (challengeElement) {
            const progressBar = challengeElement.querySelector('.challenge-progress-fill');
            const progressText = challengeElement.querySelector('.challenge-progress-text');
            
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            
            if (progressText) {
                progressText.textContent = `${current}/${target}`;
            }
        }
    }

    // Métodos de dados
    saveGamificationData() {
        const data = {
            achievements: this.achievements,
            streaks: this.streaks,
            badges: this.badges,
            challenges: this.challenges,
            watchedAnimations: this.watchedAnimations || [],
            notifications: this.notifications
        };
        
        localStorage.setItem('quimicaGameGamification', JSON.stringify(data));
    }

    loadGamificationData() {
        const saved = localStorage.getItem('quimicaGameGamification');
        if (saved) {
            const data = JSON.parse(saved);
            
            // Mesclar dados salvos com estrutura atual
            if (data.achievements) {
                data.achievements.forEach(savedAchievement => {
                    const achievement = this.achievements.find(a => a.id === savedAchievement.id);
                    if (achievement) {
                        achievement.unlocked = savedAchievement.unlocked;
                    }
                });
            }
            
            if (data.streaks) {
                this.streaks = { ...this.streaks, ...data.streaks };
            }
            
            if (data.badges) {
                this.badges = data.badges;
            }
            
            if (data.challenges) {
                // Manter estrutura atual mas atualizar progresso
                data.challenges.forEach(savedChallenge => {
                    const challenge = this.challenges.find(c => c.id === savedChallenge.id);
                    if (challenge) {
                        challenge.current = savedChallenge.current;
                        challenge.mistakes = savedChallenge.mistakes || 0;
                        challenge.currentTopic = savedChallenge.currentTopic;
                    }
                });
            }
            
            if (data.watchedAnimations) {
                this.watchedAnimations = data.watchedAnimations;
            }
        }
    }

    updateAllDisplays() {
        this.updateAchievementsDisplay();
        this.updateChallengesDisplay();
        this.updateStreakDisplay();
    }

    updateAchievementsDisplay() {
        const achievementsGrid = document.getElementById('achievements-grid');
        if (!achievementsGrid) return;

        achievementsGrid.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : ''}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                <div class="achievement-points">+${achievement.points} pts</div>
                <div class="achievement-status">
                    ${achievement.unlocked ? 'Desbloqueado!' : 'Bloqueado'}
                </div>
            `;
            achievementsGrid.appendChild(achievementElement);
        });
    }

    updateChallengesDisplay() {
        // Implementar display de desafios se houver seção específica
    }

    updateStreakDisplay() {
        const streakElement = document.getElementById('current-streak');
        if (streakElement) {
            streakElement.textContent = this.streaks.current;
        }
        
        const bestStreakElement = document.getElementById('best-streak');
        if (bestStreakElement) {
            bestStreakElement.textContent = this.streaks.best;
        }
    }

    // Método para resetar todos os dados de gamificação
    resetGamificationData() {
        localStorage.removeItem('quimicaGameGamification');
        this.achievements.forEach(achievement => achievement.unlocked = false);
        this.streaks = { current: 0, best: 0, lastAnswerDate: null };
        this.badges = [];
        this.challenges = this.initializeChallenges();
        this.watchedAnimations = [];
        this.notifications = [];
        this.updateAllDisplays();
    }

    // Método para obter estatísticas
    getStats() {
        return {
            totalAchievements: this.achievements.length,
            unlockedAchievements: this.achievements.filter(a => a.unlocked).length,
            currentStreak: this.streaks.current,
            bestStreak: this.streaks.best,
            totalBadges: this.badges.length,
            activeChallenges: this.challenges.filter(c => c.active).length,
            completedChallenges: this.challenges.filter(c => !c.active).length
        };
    }
}

// Exportar para uso global
window.GamificationSystem = GamificationSystem;

