"use strict";
// Classe principal do Hub Financeiro
class HubFinanceiro {
    constructor() {
        this.functions = [];
        this.isDarkMode = true;
        this.themeToggle = null;
        this.themeIcon = null;
        this.themeText = null;
        console.log('HubFinanceiro: Inicializando...');
        this.initializeTheme();
        this.initializeFunctions();
        this.setupEventListeners();
        this.setupThemeToggle();
        this.addWelcomeMessage();
        this.initializeAnimations();
        console.log('HubFinanceiro: Inicializado com sucesso!');
    }
    // Inicializa o tema
    initializeTheme() {
        // Verifica se há preferência salva no localStorage
        const savedTheme = localStorage.getItem('hub-financeiro-theme');
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
        }
        else {
            // Verifica preferência do sistema
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        this.applyTheme();
    }
    // Aplica o tema atual
    applyTheme() {
        const root = document.documentElement;
        if (this.isDarkMode) {
            root.classList.add('dark-theme');
            root.classList.remove('light-theme');
        }
        else {
            root.classList.add('light-theme');
            root.classList.remove('dark-theme');
        }
        // Salva a preferência
        localStorage.setItem('hub-financeiro-theme', this.isDarkMode ? 'dark' : 'light');
    }
    // Configura o botão de alternância de tema
    setupThemeToggle() {
        this.themeToggle = document.getElementById('themeToggle');
        this.themeIcon = document.getElementById('themeIcon');
        this.themeText = document.getElementById('themeText');
        if (this.themeToggle && this.themeIcon && this.themeText) {
            this.updateThemeToggleUI();
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }
    // Alterna entre tema claro e escuro
    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        this.applyTheme();
        this.updateThemeToggleUI();
        this.showNotification(`Tema ${this.isDarkMode ? 'escuro' : 'claro'} ativado`);
    }
    // Atualiza a interface do botão de tema
    updateThemeToggleUI() {
        if (this.themeIcon && this.themeText) {
            if (this.isDarkMode) {
                this.themeIcon.textContent = '🌙';
                this.themeText.textContent = 'Modo Escuro';
            }
            else {
                this.themeIcon.textContent = '☀️';
                this.themeText.textContent = 'Modo Claro';
            }
        }
    }
    // Inicializa animações
    initializeAnimations() {
        // Adiciona animação de entrada aos botões
        const buttons = document.querySelectorAll('.button-container');
        buttons.forEach((button, index) => {
            button.style.animationDelay = `${index * 0.1}s`;
        });
    }
    // Inicializa as 8 funções financeiras
    initializeFunctions() {
        this.functions = [
            {
                id: 'renda-fixa',
                name: 'Simulador de Renda Fixa',
                description: 'Calcule rendimento real e líquido de investimentos de renda fixa (CDB, LCI/LCA, Tesouro) com incidência de IR/IOF.',
                icon: '📊',
                action: () => this.openRendaFixa()
            },
            {
                id: 'alocacao',
                name: 'Calculadora de Alocação de Ativos',
                description: 'Capte seu perfil de investidor e receba sugestões de alocação personalizadas com questionário interativo.',
                icon: '🎯',
                action: () => this.openAlocacao()
            },
            {
                id: 'indicadores',
                name: 'Dashboard de Indicadores Econômicos',
                description: 'Monitore Selic, CDI, IPCA, Ibovespa, USD/BRL com histórico e gráficos em tempo real.',
                icon: '📈',
                action: () => this.openIndicadores()
            },
            {
                id: 'impostos-invest',
                name: 'Calculadora de Imposto sobre Investimentos',
                description: 'Calcule IR sobre investimentos, importe operações via CSV e gere relatórios detalhados.',
                icon: '📋',
                action: () => this.openImpostosInvest()
            },
            {
                id: 'fundos',
                name: 'Comparador de Fundos e ETFs',
                description: 'Pesquise e compare fundos/ETFs com métricas chave: CAGR, volatilidade, Sharpe e drawdown.',
                icon: '🏦',
                action: () => this.openFundos()
            },
            {
                id: 'quiz',
                name: 'Quiz de Educação Financeira',
                description: 'Gamificação do aprendizado financeiro com perguntas, níveis, ranking e sistema de badges.',
                icon: '🎓',
                action: () => this.openQuiz()
            },
            {
                id: 'emprestimo',
                name: 'Simulador de Empréstimos',
                description: 'Calcule parcelas, CET e impacto no orçamento com sistema Price e amortização detalhada.',
                icon: '💰',
                action: () => this.openEmprestimo()
            },
            {
                id: 'financiamento',
                name: 'Simulador de Financiamentos (SAC x PRICE)',
                description: 'Compare financiamento de imóvel/veículo entre sistemas SAC e PRICE com tabelas detalhadas.',
                icon: '🏠',
                action: () => this.openFinanciamento()
            }
        ];
    }
    // Configura os event listeners para os botões
    setupEventListeners() {
        console.log('HubFinanceiro: Configurando event listeners...');
        const buttons = document.querySelectorAll('.financial-button');
        console.log(`HubFinanceiro: Encontrados ${buttons.length} botões`);
        buttons.forEach((button, index) => {
            const container = button.closest('.button-container');
            const functionId = container?.getAttribute('data-function');
            console.log(`Botão ${index + 1}: functionId = ${functionId}`);
            if (functionId) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`HubFinanceiro: Botão clicado - ${functionId}`);
                    const func = this.functions.find(f => f.id === functionId);
                    if (func) {
                        console.log(`HubFinanceiro: Executando função - ${func.name}`);
                        this.executeFunction(func);
                    }
                    else {
                        console.error(`HubFinanceiro: Função não encontrada - ${functionId}`);
                    }
                });
                // Adiciona efeito de hover com delay
                button.addEventListener('mouseenter', () => {
                    this.addHoverEffect(button);
                });
                button.addEventListener('mouseleave', () => {
                    this.removeHoverEffect(button);
                });
            }
        });
        console.log('HubFinanceiro: Event listeners configurados!');
    }
    // Executa uma função financeira
    executeFunction(func) {
        console.log(`Executando função: ${func.name}`);
        // Adiciona feedback visual
        this.showNotification(`Abrindo ${func.name}...`);
        // Executa a ação específica
        func.action();
    }
    // Adiciona efeito de hover
    addHoverEffect(button) {
        button.style.transform = 'translateY(-10px) scale(1.05)';
        button.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    }
    // Remove efeito de hover
    removeHoverEffect(button) {
        button.style.transform = 'translateY(0) scale(1)';
    }
    // Mostra notificação
    showNotification(message) {
        // Remove notificação anterior se existir
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        // Cria nova notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        // Remove após 3 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 3000);
    }
    // Adiciona mensagem de boas-vindas
    addWelcomeMessage() {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <p>Bem-vindo ao Hub Financeiro! Passe o mouse sobre os botões para ver as descrições detalhadas.</p>
        `;
        const header = document.querySelector('header');
        if (header) {
            header.appendChild(welcomeMessage);
        }
    }
    // Funções específicas para cada módulo financeiro
    openRendaFixa() {
        // Adicionar efeito de transição suave
        this.addPageTransitionEffect();
        setTimeout(() => {
            window.location.href = 'renda-fixa.html';
        }, 200);
    }
    openAlocacao() {
        // Adicionar efeito de transição suave
        this.addPageTransitionEffect();
        setTimeout(() => {
            window.location.href = 'alocacao.html';
        }, 200);
    }
    openIndicadores() {
        // Adicionar efeito de transição suave
        this.addPageTransitionEffect();
        setTimeout(() => {
            window.location.href = 'indicadores.html';
        }, 200);
    }
    openImpostosInvest() {
        // Adicionar efeito de transição suave
        this.addPageTransitionEffect();
        setTimeout(() => {
            window.location.href = 'impostos.html';
        }, 200);
    }
    openFundos() {
        // Adicionar efeito de transição suave
        this.addPageTransitionEffect();
        setTimeout(() => {
            window.location.href = 'fundos.html';
        }, 200);
    }
    openQuiz() {
        // Adicionar efeito de transição suave
        this.addPageTransitionEffect();
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 200);
    }
    openEmprestimo() {
        // Adicionar efeito de transição suave
        this.addPageTransitionEffect();
        setTimeout(() => {
            window.location.href = 'emprestimo.html';
        }, 200);
    }
    openFinanciamento() {
        // Adicionar efeito de transição suave
        this.addPageTransitionEffect();
        setTimeout(() => {
            window.location.href = 'financiamento.html';
        }, 200);
    }
    addPageTransitionEffect() {
        // Adicionar classe de transição ao container
        const container = document.querySelector('.container');
        if (container) {
            container.classList.add('page-transition');
        }
        // Adicionar efeito de fade out
        document.body.style.transition = 'opacity 0.2s ease-out';
        document.body.style.opacity = '0.8';
    }
    showComingSoon(functionName, pageName) {
        const confirmed = confirm(`${functionName}\n\nEsta funcionalidade está em desenvolvimento.\n\nDeseja ver os detalhes técnicos?`);
        if (confirmed) {
            this.showTechnicalDetails(functionName);
        }
    }
    showTechnicalDetails(functionName) {
        let details = '';
        switch (functionName) {
            case 'Calculadora de Alocação de Ativos':
                details = '🎯 Calculadora de Alocação de Ativos\n\nFuncionalidades:\n• Questionário de perfil (10 perguntas)\n• Classificação: Conservador/Moderado/Agressivo\n• Sugestões de alocação personalizadas\n• Ajuste manual com sliders\n• Gráfico pizza interativo\n• Explicação textual da estratégia\n\nComponentes:\n• Questionnaire (10 perguntas)\n• ResultAllocation (gráfico + explicação)\n• AdjustAllocation (sliders)\n\nEndpoint: POST /api/profile/assess';
                break;
            case 'Dashboard de Indicadores Econômicos':
                details = '📈 Dashboard de Indicadores Econômicos\n\nFuncionalidades:\n• Selic, CDI, IPCA, Ibovespa, USD/BRL\n• Histórico com gráficos temporais\n• Atualização automática (cron jobs)\n• Cache em Redis\n• Múltiplas fontes de dados\n• Período seletor personalizado\n\nComponentes:\n• DashboardHome (cards + mini-gráficos)\n• IndicatorDetail (gráfico temporal)\n\nEndpoints:\n• GET /api/indicators\n• GET /api/indicators/:symbol/history';
                break;
            case 'Calculadora de Imposto sobre Investimentos':
                details = '📋 Calculadora de Imposto sobre Investimentos\n\nFuncionalidades:\n• Importação de operações via CSV\n• Cálculo de IR por ativo e regime\n• Offset de prejuízos (carry-forward)\n• Relatórios por ano e ativo\n• Exportação CSV/PDF\n• Template de importação\n\nComponentes:\n• ImportOperations (CSV upload)\n• TaxResult (resumo + relatórios)\n\nEndpoint: POST /api/tax/calculate';
                break;
            case 'Comparador de Fundos e ETFs':
                details = '🏦 Comparador de Fundos e ETFs\n\nFuncionalidades:\n• Pesquisa de fundos/ETFs\n• Comparação side-by-side\n• Métricas: CAGR, volatilidade, Sharpe, drawdown\n• Histórico de retornos\n• Benchmark comparison\n• Análise de taxas\n\nComponentes:\n• SearchFund\n• FundCard\n• CompareView (side-by-side)\n• FundDetail (histórico + métricas)\n\nEndpoints:\n• GET /api/funds\n• POST /api/funds/compare';
                break;
            case 'Quiz de Educação Financeira (CPA-20)':
                details = '🎓 Quiz de Educação Financeira (CPA-20)\n\nFuncionalidades:\n• Perguntas por tópico e nível\n• Timer por pergunta\n• Sistema de pontuação\n• Badges e gamificação\n• Ranking de usuários\n• Progresso personalizado\n\nComponentes:\n• QuizHome\n• QuestionView\n• Scoreboard\n• ProfileProgress\n\nEndpoints:\n• GET /api/quiz/questions\n• POST /api/quiz/submit\n• GET /api/quiz/leaderboard';
                break;
            case 'Simulador de Empréstimos':
                details = '💰 Simulador de Empréstimos\n\nFuncionalidades:\n• Cálculo de parcelas (Sistema Price)\n• CET (Custo Efetivo Total)\n• Tarifas: registro, originação\n• Carência e amortizações extraordinárias\n• Tabela de amortização detalhada\n• Gráfico de fluxo de caixa\n\nComponentes:\n• LoanForm (inputs)\n• LoanResult (parcela + CET + tabela)\n\nEndpoint: POST /api/loans/simulate\n\nFórmula Price: A = P * i / (1 - (1+i)^-n)';
                break;
            case 'Simulador de Financiamentos (SAC x PRICE)':
                details = '🏠 Simulador de Financiamentos (SAC x PRICE)\n\nFuncionalidades:\n• Comparação SAC vs PRICE\n• Financiamento imóvel/veículo\n• Tabelas de amortização lado a lado\n• Total pago, total juros\n• Evolução do saldo devedor\n• Gráficos comparativos\n\nComponentes:\n• FinancingForm (inputs)\n• CompareView (tabelas SAC/PRICE)\n\nEndpoint: POST /api/financing/simulate\n\nSAC: amortização constante\nPRICE: parcela fixa';
                break;
        }
        alert(details);
    }
}
// Adiciona estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);
// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando HubFinanceiro...');
    new HubFinanceiro();
});
// Fallback caso o DOM já esteja carregado
if (document.readyState === 'loading') {
    console.log('DOM ainda carregando...');
}
else {
    console.log('DOM já carregado, inicializando HubFinanceiro imediatamente...');
    new HubFinanceiro();
}
// Exporta a classe para uso em outros módulos (se necessário)
// export default HubFinanceiro;
//# sourceMappingURL=main.js.map