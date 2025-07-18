# QuímicaGame - Plataforma Gamificada para Ensino de Ligações Químicas

## Descrição do Projeto

O QuímicaGame é uma aplicação web responsiva desenvolvida especificamente para professores de química do ensino médio, utilizando elementos de gamificação como estratégia pedagógica para facilitar o aprendizado de conceitos químicos relacionados às ligações químicas.

## Características Principais

### 🎮 Gamificação
- Sistema de pontos e níveis
- Conquistas e badges
- Progresso visual por tópico
- Feedback imediato nas respostas

### 📱 Design Responsivo
- Interface adaptável para desktop, tablet e mobile
- Navegação intuitiva e amigável
- Design moderno e atrativo para estudantes

### 🧪 Conteúdo Educacional
- Foco específico em ligações químicas
- Três tipos de ligações: iônica, covalente e metálica
- Exercícios com diferentes níveis de dificuldade
- Animações interativas para visualização

### 🎯 Níveis de Dificuldade
- **Fácil**: Conceitos básicos e identificação
- **Médio**: Aplicação de regras e análise
- **Difícil**: Análise complexa e síntese

## Estrutura do Projeto

```
quimica-gamificada/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos da aplicação
├── js/
│   ├── app-fixed.js        # Aplicação principal (versão corrigida)
│   ├── animations.js       # Controlador de animações
│   ├── exercises.js        # Sistema de exercícios
│   └── gamification.js     # Sistema de gamificação
├── debug.html              # Página de debug para testes
└── README.md               # Esta documentação
```

## Funcionalidades Implementadas

### ✅ Navegação e Interface
- Header responsivo com navegação por abas
- Seções: Início, Animações, Exercícios, Progresso
- Transições suaves entre seções
- Design visual atrativo com gradientes e animações CSS

### ✅ Sistema de Animações
- Canvas SVG para animações de ligações químicas
- Controles de reprodução (play, pause, reset)
- Controle de velocidade da animação
- Informações educacionais contextuais
- Animação da ligação iônica (NaCl) implementada

### ✅ Sistema de Exercícios
- Seleção de níveis de dificuldade
- Banco de questões por nível
- Interface de múltipla escolha
- Sistema básico de feedback
- Integração com sistema de pontuação

### ✅ Sistema de Gamificação
- Pontuação e níveis de usuário
- Progresso por tópico (iônica, covalente, metálica)
- Persistência de dados no localStorage
- Interface de progresso visual

### ✅ Responsividade
- Layout adaptável para diferentes dispositivos
- Navegação otimizada para touch
- Elementos redimensionáveis

## Como Usar

### Para Professores

1. **Preparação da Aula**
   - Abra o arquivo `index.html` em um navegador
   - Familiarize-se com as seções disponíveis
   - Teste as animações antes da apresentação

2. **Durante a Aula**
   - Use a seção "Animações" para explicar conceitos
   - Demonstre as diferenças entre tipos de ligações
   - Utilize os controles de velocidade conforme necessário

3. **Atividades para Estudantes**
   - Direcione os alunos para a seção "Exercícios"
   - Oriente sobre os níveis de dificuldade
   - Acompanhe o progresso através da seção "Progresso"

### Para Estudantes

1. **Aprendizado**
   - Explore as animações na seção correspondente
   - Observe os conceitos-chave apresentados
   - Use os controles para revisar partes específicas

2. **Prática**
   - Acesse a seção "Exercícios"
   - Comece pelo nível "Fácil"
   - Progrida conforme sua compreensão

3. **Acompanhamento**
   - Verifique seu progresso na seção "Progresso"
   - Observe suas conquistas e pontuação
   - Tente melhorar sua taxa de acerto

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Estilos modernos, gradientes, animações e responsividade
- **JavaScript ES6+**: Lógica da aplicação, classes e módulos
- **SVG**: Animações vetoriais das ligações químicas
- **LocalStorage**: Persistência de dados do usuário

## Conceitos Químicos Abordados

### Ligação Iônica
- Transferência de elétrons
- Formação de íons (cátions e ânions)
- Atração eletrostática
- Exemplos: NaCl, MgO, CaF₂

### Ligação Covalente
- Compartilhamento de elétrons
- Formação de moléculas
- Ligações simples, duplas e triplas
- Exemplos: H₂O, CO₂, NH₃

### Ligação Metálica
- Mar de elétrons
- Condutividade elétrica
- Propriedades metálicas
- Exemplos: Fe, Cu, Al

## Status de Desenvolvimento

### ✅ Implementado
- Interface responsiva completa
- Sistema de navegação
- Animações básicas de ligação iônica
- Sistema de exercícios funcional
- Gamificação básica
- Persistência de dados

### 🔄 Em Desenvolvimento
- Animações completas para ligação covalente e metálica
- Sistema de feedback mais elaborado
- Mais questões por nível de dificuldade
- Sistema de conquistas mais detalhado

### 📋 Planejado para Futuras Versões
- Modo multiplayer para competições em sala
- Relatórios detalhados para professores
- Integração com sistemas de gestão escolar
- Conteúdo adicional (geometria molecular, polaridade)
- Versão mobile nativa

## Requisitos Técnicos

### Navegadores Suportados
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Dispositivos
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## Instalação e Execução

1. **Download dos Arquivos**
   - Baixe todos os arquivos do projeto
   - Mantenha a estrutura de pastas

2. **Execução Local**
   - Abra o arquivo `index.html` em um navegador
   - Não é necessário servidor web para funcionalidade básica

3. **Hospedagem Web** (Opcional)
   - Faça upload dos arquivos para um servidor web
   - Configure HTTPS para melhor performance

## Solução de Problemas

### Problemas Comuns

1. **Animações não funcionam**
   - Verifique se o JavaScript está habilitado
   - Teste em um navegador diferente
   - Consulte o console do navegador (F12)

2. **Progresso não é salvo**
   - Verifique se o localStorage está habilitado
   - Não use modo privado/incógnito
   - Limpe o cache se necessário

3. **Layout quebrado**
   - Verifique a conexão com arquivos CSS
   - Teste em diferentes resoluções
   - Atualize a página (Ctrl+F5)

### Debug
- Use o arquivo `debug.html` para diagnósticos
- Verifique o console do navegador para erros
- Teste funcionalidades individualmente

## Contribuição e Feedback

Este projeto foi desenvolvido como protótipo educacional. Sugestões e melhorias são bem-vindas:

- Reporte bugs encontrados
- Sugira novos recursos
- Compartilhe experiências de uso em sala de aula
- Proponha novos conteúdos químicos

## Licença

Este projeto é destinado para uso educacional. Professores e instituições de ensino podem usar, modificar e distribuir livremente para fins pedagógicos.

## Créditos

Desenvolvido como ferramenta pedagógica para o ensino de química no ensino médio, com foco em gamificação e interatividade para melhorar o engajamento dos estudantes.

---

**Versão**: 1.0.0  
**Data**: Janeiro 2025  
**Compatibilidade**: Ensino Médio - Química  
**Público-alvo**: Professores e estudantes de química

