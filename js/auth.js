class AuthController {
    constructor(gameInstance) {
        this.game = gameInstance; // A instância principal do QuimicaGame

        // Elementos da tela de login
        this.loginComponent = document.getElementById('login');
        this.loginView = document.getElementById('login-view');
        this.registerView = document.getElementById('register-view');

        // Links e Forms
        this.createAccountLink = document.getElementById('create-account-link');
        this.backToLoginLink = document.getElementById('back-to-login-link');
        this.loginForm = document.getElementById('login-form');
        this.registerForm = document.getElementById('register-form');

        // Elementos de Registro (Role/Senha)
        this.passwordContainer = document.getElementById('password-fields-container');
        this.passInput = document.getElementById('register-password');
        this.confirmPassInput = document.getElementById('register-confirm-password');
        this.roleInputs = document.querySelectorAll('input[name="user-role"]');

        // --- CREDENCIAIS MOCADAS ---
        this.MOCK_USERS = {
            TEACHER: { email: 'prof@quimica.com', pass: '123456', role: 'teacher', name: 'Prof. Silva' },
            STUDENT: { email: 'aluno@quimica.com', pass: '123456', role: 'student', name: 'João Aluno' }
        };

        this.bindEvents();
    }

    bindEvents() {
        // 1. Link: Ir para "Criar Conta"
        this.createAccountLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterView();
        });

        // 2. Link: Voltar para "Login"
        this.backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginView();
        });

        // 3. Ação: Enviar Formulário de Login
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoginSubmit();
        });

        // 4. Ação: Enviar Formulário de Registro
        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegisterSubmit();
        });

        // 5. Ação: Troca de Aluno/Professor no Registro
        if (this.roleInputs) {
            this.roleInputs.forEach(radio => {
                radio.addEventListener('change', () => {
                    this.toggleRoleFields(radio.value);
                });
            });
        }
    }

    // Lógica para esconder senha se for professor
    toggleRoleFields(role) {
        if (!this.passwordContainer) return;

        if (role === 'teacher') {
            this.passwordContainer.style.display = 'none';
            this.passInput.removeAttribute('required');
            this.confirmPassInput.removeAttribute('required');
        } else {
            this.passwordContainer.style.display = 'block';
            this.passInput.setAttribute('required', 'true');
            this.confirmPassInput.setAttribute('required', 'true');
        }
    }

    showLoginScreen() {
        console.log('AuthController: Mostrando tela de login');
        document.body.classList.add('on-login');
        this.showLoginView();
        
        gsap.fromTo(this.loginView, 
            { opacity: 0, scale: 0.9 }, 
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
        );
    }

    hideLoginScreen() {
        console.log('AuthController: Escondendo tela de login');
        
        gsap.to(this.loginComponent, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                document.body.classList.remove('on-login');
                this.loginComponent.classList.remove('active'); 
                this.loginComponent.style.opacity = 1; 
            }
        });
    }

    showLoginView() {
        gsap.to(this.registerView, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                this.registerView.classList.add('hidden');
                this.loginView.classList.remove('hidden');
                
                gsap.fromTo(this.loginView, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.4 }
                );
        }});
    }

    showRegisterView() {
        gsap.to(this.loginView, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                this.loginView.classList.add('hidden');
                this.registerView.classList.remove('hidden');
                
                gsap.fromTo(this.registerView, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.4 }
                );
        }});
    }

    // --- LOGIN COM MOCK ---
    handleLoginSubmit() {
        const emailInput = document.getElementById('login-email').value;
        const passInput = document.getElementById('login-password').value;

        let userRole = 'guest';
        let userName = 'Visitante';

        // Validação das credenciais MOCADAS
        if (emailInput === this.MOCK_USERS.TEACHER.email && passInput === this.MOCK_USERS.TEACHER.pass) {
            userRole = 'teacher';
            userName = this.MOCK_USERS.TEACHER.name;
            alert(`Bem-vindo, Professor(a) ${userName}! \nVocê terá acesso ao painel de criação de questões.`);
        } 
        else if (emailInput === this.MOCK_USERS.STUDENT.email && passInput === this.MOCK_USERS.STUDENT.pass) {
            userRole = 'student';
            userName = this.MOCK_USERS.STUDENT.name;
            alert(`Bem-vindo, Aluno(a) ${userName}! \nBons estudos.`);
        } 
        else {
            alert('Credenciais inválidas! \n\nUse:\nProf: prof@quimica.com / 123456\nAluno: aluno@quimica.com / 123456');
            return;
        }

        // Salva o usuário na instância principal do jogo
        this.game.currentUser = {
            name: userName,
            role: userRole,
            email: emailInput
        };

        this.hideLoginScreen();
        this.game.onLoginSuccess();
    }

    // --- REGISTRO ---
    handleRegisterSubmit() {
        const selectedRoleInput = document.querySelector('input[name="user-role"]:checked');
        const selectedRole = selectedRoleInput ? selectedRoleInput.value : 'student';
        const name = document.getElementById('register-name').value;

        // Se for Professor
        if (selectedRole === 'teacher') {
            alert(`Obrigado, ${name}!\n\nRecebemos sua solicitação de cadastro como Professor.\nEntraremos em contato em breve para confirmar suas credenciais.`);
            this.registerForm.reset();
            this.toggleRoleFields('student'); // Reseta visual
            this.showLoginView();
            return;
        }

        // Se for Aluno
        const pass = this.passInput.value;
        const confirmPass = this.confirmPassInput.value;

        if (pass !== confirmPass) {
            alert('As senhas não conferem!');
            return;
        }
        
        alert('Conta criada com sucesso! (Simulação)\n\nAgora faça o login com: aluno@quimica.com');
        this.showLoginView();
    }
}