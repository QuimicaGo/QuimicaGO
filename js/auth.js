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

        this.bindEvents();
    }

    // Vincula todos os eventos SÓ de login
    bindEvents() {
        // --- 1. Link: Ir para "Criar Conta" ---
        this.createAccountLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showRegisterView();
        });

        // --- 2. Link: Voltar para "Login" ---
        this.backToLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            this.showLoginView();
        });

        // --- 3. Ação: Enviar Formulário de Login ---
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoginSubmit();
        });

        // --- 4. Ação: Enviar Formulário de Registro ---
        this.registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegisterSubmit();
        });
    }

    // Mostra a tela de login (o componente todo)
    showLoginScreen() {
        console.log('AuthController: Mostrando tela de login');
        document.body.classList.add('on-login');
        this.showLoginView(); // Mostra o card de login
        
        // Animação de entrada
        gsap.fromTo(this.loginView, 
            { opacity: 0, scale: 0.9 }, 
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
        );
    }

    // Esconde a tela de login (o componente todo)
    hideLoginScreen() {
        console.log('AuthController: Escondendo tela de login');
        
        gsap.to(this.loginComponent, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                document.body.classList.remove('on-login');
                this.loginComponent.classList.remove('active'); // Desliga o <section>
                this.loginComponent.style.opacity = 1; // Reseta para a próxima vez
            }
        });
    }

    // --- Lógica interna de troca de cards ---

    showLoginView() {
        // Anima a saída da tela de registro (se estiver visível)
        gsap.to(this.registerView, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                this.registerView.classList.add('hidden'); // Esconde
                this.loginView.classList.remove('hidden'); // Mostra
                
                // Anima a entrada da tela de login
                gsap.fromTo(this.loginView, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.4 }
                );
        }});
    }

    showRegisterView() {
        // Anima a saída da tela de login
        gsap.to(this.loginView, { 
            opacity: 0, 
            duration: 0.3, 
            onComplete: () => {
                this.loginView.classList.add('hidden'); // Esconde
                this.registerView.classList.remove('hidden'); // Mostra
                
                // Anima a entrada da tela de registro
                gsap.fromTo(this.registerView, 
                    { opacity: 0, y: 20 }, 
                    { opacity: 1, y: 0, duration: 0.4 }
                );
        }});
    }

    // --- Lógica de Submissão ---

    handleLoginSubmit() {
        console.log('AuthController: Tentando login...');
        // Aqui iria a sua lógica de Firebase, etc.
        // Vamos simular um sucesso:
        
        console.log('Login FAKE com sucesso!');
        
        // 1. Esconde a si mesmo (o componente de login)
        this.hideLoginScreen();
        
        // 2. Avisa o QuimicaGame que o login foi feito
        this.game.onLoginSuccess();
    }

    handleRegisterSubmit() {
        console.log('AuthController: Tentando registrar...');
        // 1. Validar se senhas são iguais
        const pass = this.registerForm.querySelector('#register-password').value;
        const confirmPass = this.registerForm.querySelector('#register-confirm-password').value;

        if (pass !== confirmPass) {
            alert('As senhas não conferem!');
            return;
        }
        
        // 2. Aqui iria a lógica de criar conta no Firebase
        // 3. Se der certo, avisamos e voltamos pro login
        alert('Conta criada com sucesso! (de mentira)\n\nAgora faça o login.');
        this.showLoginView();
    }
}