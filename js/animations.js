// Controlador de Animações - Ligações Químicas
class AnimationController {
    constructor() {
        this.canvas = document.getElementById('animation-canvas');
        this.currentAnimation = 'ionic';
        this.isPlaying = false;
        this.isPaused = false;
        this.speed = 1;
        this.animationFrame = null;
        this.currentStep = 0;
        this.totalSteps = 0;
        this.stepDuration = 2000; // 2 segundos por step
        this.lastStepTime = 0;
        
        this.init();
    }

    init() {
        this.createSVGCanvas();
        this.setupAnimations();
        this.loadAnimation('ionic');
    }

    createSVGCanvas() {
        this.canvas.innerHTML = `
            <svg id="animation-svg" width="100%" height="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <!-- Gradientes para átomos -->
                    <radialGradient id="sodiumGradient" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" style="stop-color:#ff8a80"/>
                        <stop offset="100%" style="stop-color:#d32f2f"/>
                    </radialGradient>
                    <radialGradient id="chlorineGradient" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" style="stop-color:#81c784"/>
                        <stop offset="100%" style="stop-color:#388e3c"/>
                    </radialGradient>
                    <radialGradient id="hydrogenGradient" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" style="stop-color:#e1f5fe"/>
                        <stop offset="100%" style="stop-color:#0277bd"/>
                    </radialGradient>
                    <radialGradient id="oxygenGradient" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" style="stop-color:#ffcdd2"/>
                        <stop offset="100%" style="stop-color:#c62828"/>
                    </radialGradient>
                    <radialGradient id="carbonGradient" cx="50%" cy="30%" r="70%">
                        <stop offset="0%" style="stop-color:#424242"/>
                        <stop offset="100%" style="stop-color:#212121"/>
                    </radialGradient>
                    
                    <!-- Filtros para efeitos -->
                    <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    
                    <!-- Padrão para elétrons -->
                    <pattern id="electronPattern" patternUnits="userSpaceOnUse" width="4" height="4">
                        <circle cx="2" cy="2" r="1" fill="#ffd54f"/>
                    </pattern>
                </defs>
                
                <!-- Área de animação -->
                <g id="animation-group">
                    <!-- Conteúdo será inserido aqui -->
                </g>
                
                <!-- Informações da animação -->
                <g id="info-group">
                    <rect x="10" y="10" width="200" height="80" rx="10" fill="rgba(255,255,255,0.9)" stroke="#667eea" stroke-width="2"/>
                    <text id="step-info" x="20" y="35" font-family="Poppins" font-size="14" font-weight="600" fill="#333">
                        Passo 1: Átomos iniciais
                    </text>
                    <text id="step-description" x="20" y="55" font-family="Poppins" font-size="12" fill="#666">
                        Sódio e Cloro se aproximam
                    </text>
                    <text id="step-counter" x="20" y="75" font-family="Poppins" font-size="10" fill="#999">
                        1 / 4
                    </text>
                </g>
            </svg>
        `;
        
        this.svg = document.getElementById('animation-svg');
        this.animationGroup = document.getElementById('animation-group');
        this.infoGroup = document.getElementById('info-group');
    }

    setupAnimations() {
        this.animations = {
            ionic: {
                title: 'Formação da Ligação Iônica (NaCl)',
                steps: [
                    {
                        title: 'Passo 1: Átomos iniciais',
                        description: 'Sódio (Na) e Cloro (Cl) se aproximam',
                        duration: 2000,
                        action: () => this.drawIonicStep1()
                    },
                    {
                        title: 'Passo 2: Transferência de elétron',
                        description: 'Elétron do Na se move para o Cl',
                        duration: 3000,
                        action: () => this.drawIonicStep2()
                    },
                    {
                        title: 'Passo 3: Formação de íons',
                        description: 'Na⁺ e Cl⁻ são formados',
                        duration: 2000,
                        action: () => this.drawIonicStep3()
                    },
                    {
                        title: 'Passo 4: Atração eletrostática',
                        description: 'Íons se atraem formando NaCl',
                        duration: 2000,
                        action: () => this.drawIonicStep4()
                    }
                ]
            },
            covalent: {
                title: 'Formação da Ligação Covalente (H₂O)',
                steps: [
                    {
                        title: 'Passo 1: Átomos separados',
                        description: 'Oxigênio e dois Hidrogênios',
                        duration: 2000,
                        action: () => this.drawCovalentStep1()
                    },
                    {
                        title: 'Passo 2: Aproximação',
                        description: 'Átomos se aproximam',
                        duration: 2000,
                        action: () => this.drawCovalentStep2()
                    },
                    {
                        title: 'Passo 3: Compartilhamento',
                        description: 'Elétrons são compartilhados',
                        duration: 3000,
                        action: () => this.drawCovalentStep3()
                    },
                    {
                        title: 'Passo 4: Molécula formada',
                        description: 'H₂O é formada',
                        duration: 2000,
                        action: () => this.drawCovalentStep4()
                    }
                ]
            },
            metallic: {
                title: 'Ligação Metálica',
                steps: [
                    {
                        title: 'Passo 1: Átomos metálicos',
                        description: 'Átomos de metal organizados',
                        duration: 2000,
                        action: () => this.drawMetallicStep1()
                    },
                    {
                        title: 'Passo 2: Liberação de elétrons',
                        description: 'Elétrons se deslocam',
                        duration: 3000,
                        action: () => this.drawMetallicStep2()
                    },
                    {
                        title: 'Passo 3: Mar de elétrons',
                        description: 'Elétrons livres se movem',
                        duration: 3000,
                        action: () => this.drawMetallicStep3()
                    },
                    {
                        title: 'Passo 4: Estrutura metálica',
                        description: 'Ligação metálica completa',
                        duration: 2000,
                        action: () => this.drawMetallicStep4()
                    }
                ]
            }
        };
    }

    loadAnimation(type) {
        this.currentAnimation = type;
        this.currentStep = 0;
        this.totalSteps = this.animations[type].steps.length;
        this.reset();
    }

    play() {
        if (this.isPaused) {
            this.isPaused = false;
            this.isPlaying = true;
            this.continueAnimation();
        } else {
            this.isPlaying = true;
            this.isPaused = false;
            this.startAnimation();
        }
        
        this.updatePlayButton();
    }

    pause() {
        this.isPaused = true;
        this.isPlaying = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.updatePlayButton();
    }

    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        this.currentStep = 0;
        this.lastStepTime = 0;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        
        this.clearCanvas();
        this.executeCurrentStep();
        this.updateInfo();
        this.updatePlayButton();
    }

    setSpeed(speed) {
        this.speed = speed;
    }

    startAnimation() {
        this.lastStepTime = performance.now();
        this.animate();
    }

    continueAnimation() {
        this.lastStepTime = performance.now();
        this.animate();
    }

    animate() {
        if (!this.isPlaying || this.isPaused) return;

        const currentTime = performance.now();
        const elapsed = currentTime - this.lastStepTime;
        const stepDuration = this.stepDuration / this.speed;

        if (elapsed >= stepDuration) {
            this.nextStep();
            this.lastStepTime = currentTime;
        }

        if (this.isPlaying && !this.isPaused) {
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }

    nextStep() {
        if (this.currentStep < this.totalSteps - 1) {
            this.currentStep++;
            this.executeCurrentStep();
            this.updateInfo();
        } else {
            // Animação completa
            this.isPlaying = false;
            this.updatePlayButton();
        }
    }

    executeCurrentStep() {
        const animation = this.animations[this.currentAnimation];
        const step = animation.steps[this.currentStep];
        
        if (step && step.action) {
            step.action();
        }
    }

    updateInfo() {
        const animation = this.animations[this.currentAnimation];
        const step = animation.steps[this.currentStep];
        
        document.getElementById('step-info').textContent = step.title;
        document.getElementById('step-description').textContent = step.description;
        document.getElementById('step-counter').textContent = `${this.currentStep + 1} / ${this.totalSteps}`;
    }

    updatePlayButton() {
        const playBtn = document.getElementById('play-btn');
        const pauseBtn = document.getElementById('pause-btn');
        
        if (this.isPlaying) {
            playBtn.style.display = 'none';
            pauseBtn.style.display = 'inline-flex';
        } else {
            playBtn.style.display = 'inline-flex';
            pauseBtn.style.display = 'none';
        }
    }

    clearCanvas() {
        this.animationGroup.innerHTML = '';
    }

    // Animações da Ligação Iônica
    drawIonicStep1() {
        this.clearCanvas();
        
        // Átomo de Sódio
        const sodium = this.createAtom(200, 200, 40, 'sodiumGradient', 'Na', '#fff');
        this.addElectronShells(sodium, 200, 200, [2, 8, 1]);
        
        // Átomo de Cloro
        const chlorine = this.createAtom(600, 200, 45, 'chlorineGradient', 'Cl', '#fff');
        this.addElectronShells(chlorine, 600, 200, [2, 8, 7]);
        
        this.animationGroup.appendChild(sodium);
        this.animationGroup.appendChild(chlorine);
    }

    drawIonicStep2() {
        this.clearCanvas();
        
        // Átomos mais próximos
        const sodium = this.createAtom(300, 200, 40, 'sodiumGradient', 'Na', '#fff');
        this.addElectronShells(sodium, 300, 200, [2, 8, 1]);
        
        const chlorine = this.createAtom(500, 200, 45, 'chlorineGradient', 'Cl', '#fff');
        this.addElectronShells(chlorine, 500, 200, [2, 8, 7]);
        
        // Elétron em movimento
        const electron = this.createMovingElectron(340, 200, 460, 200);
        
        this.animationGroup.appendChild(sodium);
        this.animationGroup.appendChild(chlorine);
        this.animationGroup.appendChild(electron);
    }

    drawIonicStep3() {
        this.clearCanvas();
        
        // Íon Na+ (menor, sem elétron externo)
        const sodium = this.createAtom(300, 200, 35, 'sodiumGradient', 'Na⁺', '#fff');
        this.addElectronShells(sodium, 300, 200, [2, 8]);
        sodium.setAttribute('filter', 'url(#glow)');
        
        // Íon Cl- (maior, com elétron extra)
        const chlorine = this.createAtom(500, 200, 50, 'chlorineGradient', 'Cl⁻', '#fff');
        this.addElectronShells(chlorine, 500, 200, [2, 8, 8]);
        chlorine.setAttribute('filter', 'url(#glow)');
        
        this.animationGroup.appendChild(sodium);
        this.animationGroup.appendChild(chlorine);
    }

    drawIonicStep4() {
        this.clearCanvas();
        
        // Íons mais próximos com atração
        const sodium = this.createAtom(350, 200, 35, 'sodiumGradient', 'Na⁺', '#fff');
        this.addElectronShells(sodium, 350, 200, [2, 8]);
        
        const chlorine = this.createAtom(450, 200, 50, 'chlorineGradient', 'Cl⁻', '#fff');
        this.addElectronShells(chlorine, 450, 200, [2, 8, 8]);
        
        // Linha de atração
        const attraction = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        attraction.setAttribute('x1', '385');
        attraction.setAttribute('y1', '200');
        attraction.setAttribute('x2', '415');
        attraction.setAttribute('y2', '200');
        attraction.setAttribute('stroke', '#667eea');
        attraction.setAttribute('stroke-width', '3');
        attraction.setAttribute('stroke-dasharray', '5,5');
        attraction.setAttribute('opacity', '0.8');
        
        // Animação da linha
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'stroke-dashoffset');
        animate.setAttribute('values', '0;10;0');
        animate.setAttribute('dur', '1s');
        animate.setAttribute('repeatCount', 'indefinite');
        attraction.appendChild(animate);
        
        // Label do composto
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '400');
        label.setAttribute('y', '150');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-family', 'Poppins');
        label.setAttribute('font-size', '18');
        label.setAttribute('font-weight', '600');
        label.setAttribute('fill', '#333');
        label.textContent = 'NaCl';
        
        this.animationGroup.appendChild(attraction);
        this.animationGroup.appendChild(sodium);
        this.animationGroup.appendChild(chlorine);
        this.animationGroup.appendChild(label);
    }

    // Animações da Ligação Covalente
    drawCovalentStep1() {
        this.clearCanvas();
        
        // Átomo de Oxigênio
        const oxygen = this.createAtom(400, 200, 45, 'oxygenGradient', 'O', '#fff');
        this.addElectronShells(oxygen, 400, 200, [2, 6]);
        
        // Átomos de Hidrogênio
        const hydrogen1 = this.createAtom(250, 150, 25, 'hydrogenGradient', 'H', '#333');
        this.addElectronShells(hydrogen1, 250, 150, [1]);
        
        const hydrogen2 = this.createAtom(250, 250, 25, 'hydrogenGradient', 'H', '#333');
        this.addElectronShells(hydrogen2, 250, 250, [1]);
        
        this.animationGroup.appendChild(oxygen);
        this.animationGroup.appendChild(hydrogen1);
        this.animationGroup.appendChild(hydrogen2);
    }

    drawCovalentStep2() {
        this.clearCanvas();
        
        // Átomos se aproximando
        const oxygen = this.createAtom(400, 200, 45, 'oxygenGradient', 'O', '#fff');
        this.addElectronShells(oxygen, 400, 200, [2, 6]);
        
        const hydrogen1 = this.createAtom(320, 160, 25, 'hydrogenGradient', 'H', '#333');
        this.addElectronShells(hydrogen1, 320, 160, [1]);
        
        const hydrogen2 = this.createAtom(320, 240, 25, 'hydrogenGradient', 'H', '#333');
        this.addElectronShells(hydrogen2, 320, 240, [1]);
        
        this.animationGroup.appendChild(oxygen);
        this.animationGroup.appendChild(hydrogen1);
        this.animationGroup.appendChild(hydrogen2);
    }

    drawCovalentStep3() {
        this.clearCanvas();
        
        // Átomos ligados com elétrons compartilhados
        const oxygen = this.createAtom(400, 200, 45, 'oxygenGradient', 'O', '#fff');
        const hydrogen1 = this.createAtom(340, 170, 25, 'hydrogenGradient', 'H', '#333');
        const hydrogen2 = this.createAtom(340, 230, 25, 'hydrogenGradient', 'H', '#333');
        
        // Ligações covalentes (pares de elétrons compartilhados)
        const bond1 = this.createCovalentBond(365, 185, 375, 195);
        const bond2 = this.createCovalentBond(365, 215, 375, 205);
        
        this.animationGroup.appendChild(bond1);
        this.animationGroup.appendChild(bond2);
        this.animationGroup.appendChild(oxygen);
        this.animationGroup.appendChild(hydrogen1);
        this.animationGroup.appendChild(hydrogen2);
    }

    drawCovalentStep4() {
        this.clearCanvas();
        
        // Molécula de água completa
        const oxygen = this.createAtom(400, 200, 45, 'oxygenGradient', 'O', '#fff');
        const hydrogen1 = this.createAtom(340, 170, 25, 'hydrogenGradient', 'H', '#333');
        const hydrogen2 = this.createAtom(340, 230, 25, 'hydrogenGradient', 'H', '#333');
        
        // Ligações mais definidas
        const bond1 = this.createCovalentBond(365, 185, 375, 195, true);
        const bond2 = this.createCovalentBond(365, 215, 375, 205, true);
        
        // Label da molécula
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '400');
        label.setAttribute('y', '150');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-family', 'Poppins');
        label.setAttribute('font-size', '18');
        label.setAttribute('font-weight', '600');
        label.setAttribute('fill', '#333');
        label.textContent = 'H₂O';
        
        this.animationGroup.appendChild(bond1);
        this.animationGroup.appendChild(bond2);
        this.animationGroup.appendChild(oxygen);
        this.animationGroup.appendChild(hydrogen1);
        this.animationGroup.appendChild(hydrogen2);
        this.animationGroup.appendChild(label);
    }

    // Animações da Ligação Metálica
    drawMetallicStep1() {
        this.clearCanvas();
        
        // Grade de átomos metálicos
        const positions = [
            [300, 150], [400, 150], [500, 150],
            [300, 200], [400, 200], [500, 200],
            [300, 250], [400, 250], [500, 250]
        ];
        
        positions.forEach(([x, y]) => {
            const metal = this.createAtom(x, y, 30, 'sodiumGradient', 'M', '#fff');
            this.addElectronShells(metal, x, y, [2, 8, 2]);
            this.animationGroup.appendChild(metal);
        });
    }

    drawMetallicStep2() {
        this.clearCanvas();
        
        // Átomos metálicos com elétrons se liberando
        const positions = [
            [300, 150], [400, 150], [500, 150],
            [300, 200], [400, 200], [500, 200],
            [300, 250], [400, 250], [500, 250]
        ];
        
        positions.forEach(([x, y]) => {
            const metal = this.createAtom(x, y, 30, 'sodiumGradient', 'M⁺', '#fff');
            this.addElectronShells(metal, x, y, [2, 8]);
            this.animationGroup.appendChild(metal);
        });
        
        // Elétrons livres
        this.addFreeElectrons();
    }

    drawMetallicStep3() {
        this.clearCanvas();
        
        // Cátions metálicos
        const positions = [
            [300, 150], [400, 150], [500, 150],
            [300, 200], [400, 200], [500, 200],
            [300, 250], [400, 250], [500, 250]
        ];
        
        positions.forEach(([x, y]) => {
            const metal = this.createAtom(x, y, 30, 'sodiumGradient', 'M⁺', '#fff');
            this.animationGroup.appendChild(metal);
        });
        
        // Mar de elétrons animado
        this.addElectronSea();
    }

    drawMetallicStep4() {
        this.clearCanvas();
        
        // Estrutura metálica final
        const positions = [
            [300, 150], [400, 150], [500, 150],
            [300, 200], [400, 200], [500, 200],
            [300, 250], [400, 250], [500, 250]
        ];
        
        positions.forEach(([x, y]) => {
            const metal = this.createAtom(x, y, 30, 'sodiumGradient', 'M⁺', '#fff');
            metal.setAttribute('filter', 'url(#glow)');
            this.animationGroup.appendChild(metal);
        });
        
        // Mar de elétrons com movimento
        this.addElectronSea(true);
        
        // Label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', '400');
        label.setAttribute('y', '120');
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-family', 'Poppins');
        label.setAttribute('font-size', '16');
        label.setAttribute('font-weight', '600');
        label.setAttribute('fill', '#333');
        label.textContent = 'Ligação Metálica';
        
        this.animationGroup.appendChild(label);
    }

    // Métodos auxiliares
    createAtom(x, y, radius, gradient, symbol, textColor) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', radius);
        circle.setAttribute('fill', `url(#${gradient})`);
        circle.setAttribute('stroke', '#fff');
        circle.setAttribute('stroke-width', '2');
        
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', x);
        text.setAttribute('y', y + 5);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-family', 'Poppins');
        text.setAttribute('font-size', '14');
        text.setAttribute('font-weight', '600');
        text.setAttribute('fill', textColor);
        text.textContent = symbol;
        
        group.appendChild(circle);
        group.appendChild(text);
        
        return group;
    }

    addElectronShells(atomGroup, x, y, electrons) {
        const shellRadii = [15, 25, 35, 45];
        
        electrons.forEach((count, shellIndex) => {
            if (count === 0) return;
            
            const radius = shellRadii[shellIndex];
            const angleStep = (2 * Math.PI) / count;
            
            for (let i = 0; i < count; i++) {
                const angle = i * angleStep;
                const electronX = x + radius * Math.cos(angle);
                const electronY = y + radius * Math.sin(angle);
                
                const electron = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                electron.setAttribute('cx', electronX);
                electron.setAttribute('cy', electronY);
                electron.setAttribute('r', '3');
                electron.setAttribute('fill', '#ffd54f');
                electron.setAttribute('stroke', '#f57f17');
                electron.setAttribute('stroke-width', '1');
                
                atomGroup.appendChild(electron);
            }
        });
    }

    createMovingElectron(x1, y1, x2, y2) {
        const electron = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        electron.setAttribute('cx', x1);
        electron.setAttribute('cy', y1);
        electron.setAttribute('r', '4');
        electron.setAttribute('fill', '#ffd54f');
        electron.setAttribute('stroke', '#f57f17');
        electron.setAttribute('stroke-width', '2');
        electron.setAttribute('filter', 'url(#glow)');
        
        const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animateX.setAttribute('attributeName', 'cx');
        animateX.setAttribute('values', `${x1};${x2};${x2}`);
        animateX.setAttribute('dur', '2s');
        animateX.setAttribute('repeatCount', 'indefinite');
        
        const animateY = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animateY.setAttribute('attributeName', 'cy');
        animateY.setAttribute('values', `${y1};${y2};${y2}`);
        animateY.setAttribute('dur', '2s');
        animateY.setAttribute('repeatCount', 'indefinite');
        
        electron.appendChild(animateX);
        electron.appendChild(animateY);
        
        return electron;
    }

    createCovalentBond(x1, y1, x2, y2, final = false) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        
        // Par de elétrons compartilhados
        const electron1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        electron1.setAttribute('cx', x1);
        electron1.setAttribute('cy', y1);
        electron1.setAttribute('r', '3');
        electron1.setAttribute('fill', '#ffd54f');
        
        const electron2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        electron2.setAttribute('cx', x2);
        electron2.setAttribute('cy', y2);
        electron2.setAttribute('r', '3');
        electron2.setAttribute('fill', '#ffd54f');
        
        if (final) {
            // Linha de ligação
            const bond = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            bond.setAttribute('x1', x1);
            bond.setAttribute('y1', y1);
            bond.setAttribute('x2', x2);
            bond.setAttribute('y2', y2);
            bond.setAttribute('stroke', '#667eea');
            bond.setAttribute('stroke-width', '3');
            bond.setAttribute('opacity', '0.6');
            
            group.appendChild(bond);
        }
        
        group.appendChild(electron1);
        group.appendChild(electron2);
        
        return group;
    }

    addFreeElectrons() {
        const electronPositions = [
            [320, 130], [380, 140], [450, 135],
            [270, 180], [350, 190], [430, 185], [520, 180],
            [310, 230], [370, 240], [460, 235]
        ];
        
        electronPositions.forEach(([x, y]) => {
            const electron = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            electron.setAttribute('cx', x);
            electron.setAttribute('cy', y);
            electron.setAttribute('r', '3');
            electron.setAttribute('fill', '#ffd54f');
            electron.setAttribute('opacity', '0.8');
            
            // Movimento aleatório
            const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
            animateX.setAttribute('attributeName', 'transform');
            animateX.setAttribute('type', 'translate');
            animateX.setAttribute('values', '0,0; 10,5; -5,10; 0,0');
            animateX.setAttribute('dur', '3s');
            animateX.setAttribute('repeatCount', 'indefinite');
            
            electron.appendChild(animateX);
            this.animationGroup.appendChild(electron);
        });
    }

    addElectronSea(animated = false) {
        // Fundo do mar de elétrons
        const sea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        sea.setAttribute('x', '280');
        sea.setAttribute('y', '130');
        sea.setAttribute('width', '240');
        sea.setAttribute('height', '140');
        sea.setAttribute('fill', 'rgba(255, 213, 79, 0.2)');
        sea.setAttribute('rx', '10');
        
        if (animated) {
            const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
            animate.setAttribute('attributeName', 'opacity');
            animate.setAttribute('values', '0.2;0.4;0.2');
            animate.setAttribute('dur', '2s');
            animate.setAttribute('repeatCount', 'indefinite');
            sea.appendChild(animate);
        }
        
        this.animationGroup.appendChild(sea);
        
        // Elétrons em movimento
        for (let i = 0; i < 15; i++) {
            const electron = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            electron.setAttribute('cx', 280 + Math.random() * 240);
            electron.setAttribute('cy', 130 + Math.random() * 140);
            electron.setAttribute('r', '2');
            electron.setAttribute('fill', '#ffd54f');
            electron.setAttribute('opacity', '0.7');
            
            if (animated) {
                const animateX = document.createElementNS('http://www.w3.org/2000/svg', 'animateTransform');
                animateX.setAttribute('attributeName', 'transform');
                animateX.setAttribute('type', 'translate');
                animateX.setAttribute('values', `0,0; ${Math.random() * 20 - 10},${Math.random() * 20 - 10}; 0,0`);
                animateX.setAttribute('dur', `${2 + Math.random() * 2}s`);
                animateX.setAttribute('repeatCount', 'indefinite');
                electron.appendChild(animateX);
            }
            
            this.animationGroup.appendChild(electron);
        }
    }
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar a criação do canvas antes de inicializar
    setTimeout(() => {
        if (document.getElementById('animation-canvas')) {
            window.AnimationController = AnimationController;
        }
    }, 100);
});

