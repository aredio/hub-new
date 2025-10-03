"use strict";
// Hub Financeiro - Aplicação de funções financeiras
// Classe principal do Hub Financeiro
class HubFinanceiro {
    constructor() {
        this.functions = [];
        console.log('HubFinanceiro: Inicializando...');
        this.initializeTheme();
        this.initializeFunctions();
        this.setupEventListeners();
        this.addWelcomeMessage();
        this.initializeAnimations();
        console.log('HubFinanceiro: Inicializado com sucesso!');
    }
    // Inicializa o tema (apenas modo escuro)
    initializeTheme() {
        // Define apenas o tema escuro como padrão
        const root = document.documentElement;
        root.classList.add('dark-theme');
        root.classList.remove('light-theme');
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
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/></svg>',
                action: () => this.openRendaFixa()
            },
            {
                id: 'alocacao',
                name: 'Calculadora de Alocação de Ativos',
                description: 'Capte seu perfil de investidor e receba sugestões de alocação personalizadas com questionário interativo.',
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
                action: () => this.openAlocacao()
            },
            {
                id: 'indicadores',
                name: 'Dashboard de Indicadores Econômicos',
                description: 'Monitore Selic, CDI, IPCA, Ibovespa, USD/BRL com histórico e gráficos em tempo real.',
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>',
                action: () => this.openIndicadores()
            },
            {
                id: 'impostos-invest',
                name: 'Calculadora de Imposto sobre Investimentos',
                description: 'Calcule IR sobre investimentos, importe operações via CSV e gere relatórios detalhados.',
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>',
                action: () => this.openImpostosInvest()
            },
            {
                id: 'fundos',
                name: 'Comparador de Fundos e ETFs',
                description: 'Pesquise e compare fundos/ETFs com métricas chave: CAGR, volatilidade, Sharpe e drawdown.',
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
                action: () => this.openFundos()
            },
            {
                id: 'quiz',
                name: 'Quiz de Educação Financeira',
                description: 'Gamificação do aprendizado financeiro com perguntas, níveis, ranking e sistema de badges.',
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>',
                action: () => this.openQuiz()
            },
            {
                id: 'emprestimo',
                name: 'Simulador de Empréstimos',
                description: 'Calcule parcelas, CET e impacto no orçamento com sistema Price e amortização detalhada.',
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>',
                action: () => this.openEmprestimo()
            },
            {
                id: 'financiamento',
                name: 'Simulador de Financiamentos (SAC x PRICE)',
                description: 'Compare financiamento de imóvel/veículo entre sistemas SAC e PRICE com tabelas detalhadas.',
                icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>',
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