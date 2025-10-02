// Calculadora de Alocação de Ativos - Hub Financeiro
// Implementação completa com questionário, scoring e ajuste manual

// Declaração global para Chart.js
declare const Chart: any;

interface Question {
    id: number;
    question: string;
    description: string;
    options: QuestionOption[];
}

interface QuestionOption {
    id: string;
    text: string;
    description: string;
    score: number;
}

interface QuestionnaireAnswer {
    questionId: number;
    optionId: string;
    score: number;
}

interface InvestorProfile {
    type: 'Conservador' | 'Moderado' | 'Agressivo';
    score: number;
    description: string;
    icon: string;
}

interface AssetAllocation {
    class: string;
    pct: number;
    color: string;
    description: string;
}

interface AllocationResult {
    profile: InvestorProfile;
    allocation: AssetAllocation[];
    rationale: string;
}

class AssetAllocationCalculator {
    private currentQuestion: number = 0;
    private answers: QuestionnaireAnswer[] = [];
    private chart: any = null;
    private suggestedAllocation: AssetAllocation[] = [];
    private currentAllocation: AssetAllocation[] = [];

    private questions: Question[] = [
        {
            id: 1,
            question: "Qual é o seu objetivo principal com os investimentos?",
            description: "Considere seus objetivos de longo prazo",
            options: [
                { id: "a", text: "Preservar o capital e ter renda estável", description: "Foco em segurança e rendimentos previsíveis", score: 10 },
                { id: "b", text: "Crescer o patrimônio moderadamente", description: "Equilíbrio entre crescimento e segurança", score: 30 },
                { id: "c", text: "Maximizar o crescimento do patrimônio", description: "Aceita maior risco para maiores retornos", score: 50 },
                { id: "d", text: "Acelerar o crescimento com alta volatilidade", description: "Busca retornos agressivos e especulativos", score: 70 }
            ]
        },
        {
            id: 2,
            question: "Qual é o seu horizonte de investimento?",
            description: "Em quanto tempo você pretende usar este dinheiro?",
            options: [
                { id: "a", text: "Menos de 1 ano", description: "Curto prazo - liquidez é prioridade", score: 10 },
                { id: "b", text: "1 a 3 anos", description: "Médio prazo - equilíbrio entre risco e retorno", score: 25 },
                { id: "c", text: "3 a 10 anos", description: "Longo prazo - pode assumir mais risco", score: 45 },
                { id: "d", text: "Mais de 10 anos", description: "Muito longo prazo - pode ser mais agressivo", score: 65 }
            ]
        },
        {
            id: 3,
            question: "Como você reagiria a uma queda de 20% no valor dos seus investimentos?",
            description: "Considere sua tolerância emocional ao risco",
            options: [
                { id: "a", text: "Venderia tudo imediatamente", description: "Baixa tolerância ao risco", score: 5 },
                { id: "b", text: "Venderia parte dos investimentos", description: "Tolerância moderada ao risco", score: 20 },
                { id: "c", text: "Manteria os investimentos", description: "Boa tolerância ao risco", score: 40 },
                { id: "d", text: "Aumentaria os investimentos", description: "Alta tolerância ao risco", score: 60 }
            ]
        },
        {
            id: 4,
            question: "Qual é a sua experiência com investimentos?",
            description: "Considere seu conhecimento e experiência prática",
            options: [
                { id: "a", text: "Iniciante - pouco conhecimento", description: "Prefere investimentos mais simples", score: 15 },
                { id: "b", text: "Intermediário - conhecimento básico", description: "Conhece diferentes tipos de investimentos", score: 30 },
                { id: "c", text: "Avançado - bom conhecimento", description: "Entende riscos e oportunidades", score: 50 },
                { id: "d", text: "Expert - conhecimento profundo", description: "Pode lidar com investimentos complexos", score: 70 }
            ]
        },
        {
            id: 5,
            question: "Qual percentual da sua renda você pode investir mensalmente?",
            description: "Considere sua capacidade de poupança",
            options: [
                { id: "a", text: "Até 5% da renda", description: "Capacidade limitada de investimento", score: 20 },
                { id: "b", text: "5% a 15% da renda", description: "Capacidade moderada de investimento", score: 35 },
                { id: "c", text: "15% a 30% da renda", description: "Boa capacidade de investimento", score: 50 },
                { id: "d", text: "Mais de 30% da renda", description: "Alta capacidade de investimento", score: 65 }
            ]
        },
        {
            id: 6,
            question: "Qual é a sua situação financeira atual?",
            description: "Considere sua estabilidade financeira",
            options: [
                { id: "a", text: "Endividado ou sem reserva de emergência", description: "Prioridade em segurança e liquidez", score: 10 },
                { id: "b", text: "Reserva de emergência básica", description: "Pode assumir riscos moderados", score: 30 },
                { id: "c", text: "Boa reserva de emergência", description: "Pode diversificar mais os investimentos", score: 50 },
                { id: "d", text: "Reserva robusta e estabilidade financeira", description: "Pode assumir riscos maiores", score: 70 }
            ]
        },
        {
            id: 7,
            question: "Como você prefere acompanhar seus investimentos?",
            description: "Considere sua disponibilidade e interesse",
            options: [
                { id: "a", text: "Investimentos automáticos, sem acompanhamento", description: "Prefere simplicidade e automação", score: 15 },
                { id: "b", text: "Acompanhamento mensal", description: "Interesse moderado em acompanhar", score: 30 },
                { id: "c", text: "Acompanhamento semanal", description: "Bom interesse em acompanhar", score: 50 },
                { id: "d", text: "Acompanhamento diário", description: "Alto interesse e disponibilidade", score: 70 }
            ]
        },
        {
            id: 8,
            question: "Qual é a sua idade?",
            description: "Considere seu tempo até a aposentadoria",
            options: [
                { id: "a", text: "Menos de 30 anos", description: "Muito tempo para recuperar perdas", score: 60 },
                { id: "b", text: "30 a 45 anos", description: "Tempo suficiente para assumir riscos", score: 50 },
                { id: "c", text: "45 a 60 anos", description: "Tempo moderado para investimentos", score: 35 },
                { id: "d", text: "Mais de 60 anos", description: "Prioridade em preservar capital", score: 20 }
            ]
        },
        {
            id: 9,
            question: "Qual é o seu conhecimento sobre diferentes tipos de investimentos?",
            description: "Considere seu entendimento sobre produtos financeiros",
            options: [
                { id: "a", text: "Conheço apenas poupança e CDB", description: "Conhecimento básico", score: 15 },
                { id: "b", text: "Conheço renda fixa e alguns fundos", description: "Conhecimento intermediário", score: 30 },
                { id: "c", text: "Conheço ações, fundos e ETFs", description: "Bom conhecimento", score: 50 },
                { id: "d", text: "Conheço derivativos e investimentos complexos", description: "Conhecimento avançado", score: 70 }
            ]
        },
        {
            id: 10,
            question: "Qual é a sua expectativa de retorno anual?",
            description: "Considere retornos realistas para diferentes perfis",
            options: [
                { id: "a", text: "Acima da inflação (4-6% ao ano)", description: "Expectativa conservadora", score: 15 },
                { id: "b", text: "6-10% ao ano", description: "Expectativa moderada", score: 35 },
                { id: "c", text: "10-15% ao ano", description: "Expectativa otimista", score: 55 },
                { id: "d", text: "Mais de 15% ao ano", description: "Expectativa agressiva", score: 75 }
            ]
        }
    ];

    private allocationPresets: { [key: string]: AssetAllocation[] } = {
        'Conservador': [
            { class: 'Renda Fixa', pct: 80, color: '#3498db', description: 'CDB, LCI, LCA, Tesouro Direto' },
            { class: 'Fundos Conservadores', pct: 15, color: '#2ecc71', description: 'Fundos DI, Multimercado Conservador' },
            { class: 'Ações', pct: 5, color: '#e74c3c', description: 'Ações de empresas sólidas, ETFs' }
        ],
        'Moderado': [
            { class: 'Renda Fixa', pct: 50, color: '#3498db', description: 'CDB, LCI, LCA, Tesouro Direto' },
            { class: 'Fundos', pct: 30, color: '#2ecc71', description: 'Fundos Multimercado, Ações' },
            { class: 'Ações', pct: 20, color: '#e74c3c', description: 'Ações individuais, ETFs, FIIs' }
        ],
        'Agressivo': [
            { class: 'Renda Fixa', pct: 20, color: '#3498db', description: 'Tesouro Direto, CDB de curto prazo' },
            { class: 'Fundos', pct: 30, color: '#2ecc71', description: 'Fundos de Ações, Multimercado' },
            { class: 'Ações', pct: 50, color: '#e74c3c', description: 'Ações individuais, ETFs, FIIs, Small Caps' }
        ]
    };

    private rationales: { [key: string]: string } = {
        'Conservador': `Perfil Conservador: Você prioriza a segurança e preservação do capital. Esta alocação é ideal para quem tem baixa tolerância ao risco, horizonte de investimento curto ou está próximo da aposentadoria. A maior parte (80%) está em renda fixa, garantindo estabilidade e liquidez. Os 15% em fundos conservadores oferecem diversificação com baixo risco, enquanto os 5% em ações permitem participação no crescimento do mercado sem exposição excessiva.`,
        
        'Moderado': `Perfil Moderado: Você busca equilíbrio entre crescimento e segurança. Esta alocação oferece diversificação adequada para quem tem horizonte de médio a longo prazo e tolerância moderada ao risco. Os 50% em renda fixa garantem estabilidade, os 30% em fundos oferecem diversificação e gestão profissional, e os 20% em ações permitem participação no crescimento do mercado. Ideal para quem está construindo patrimônio de forma consistente.`,
        
        'Agressivo': `Perfil Agressivo: Você busca maximizar o crescimento do patrimônio e tem alta tolerância ao risco. Esta alocação é ideal para investidores jovens, com horizonte de longo prazo e conhecimento avançado. Os 20% em renda fixa mantêm liquidez e estabilidade, os 30% em fundos oferecem diversificação com gestão profissional, e os 50% em ações maximizam o potencial de crescimento. Requer acompanhamento constante e capacidade de lidar com volatilidade.`
    };

    constructor() {
        console.log('AssetAllocationCalculator: Constructor called');
        this.initializeEventListeners();
        this.loadQuestion();
        console.log('AssetAllocationCalculator: Initialization complete');
    }

    private initializeEventListeners(): void {
        // Event listeners serão adicionados dinamicamente
    }

    private loadQuestion(): void {
        console.log('AssetAllocationCalculator: Loading question', this.currentQuestion);
        const question = this.questions[this.currentQuestion];
        const container = document.getElementById('questionContainer');
        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        console.log('AssetAllocationCalculator: DOM elements found:', {
            container: !!container,
            progressFill: !!progressFill,
            progressText: !!progressText,
            question: question
        });

        if (!container || !progressFill || !progressText) {
            console.error('AssetAllocationCalculator: Required DOM elements not found');
            return;
        }

        // Atualizar progresso
        const progress = ((this.currentQuestion + 1) / this.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Pergunta ${this.currentQuestion + 1} de ${this.questions.length}`;

        // Carregar pergunta
        container.innerHTML = `
            <div class="question">
                <h3>${question.question}</h3>
                <p>${question.description}</p>
                <div class="options-container">
                    ${question.options.map(option => `
                        <div class="option" data-option-id="${option.id}" onclick="selectOption('${option.id}')">
                            <div class="option-text">${option.text}</div>
                            <div class="option-description">${option.description}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        // Atualizar botões de navegação
        this.updateNavigationButtons();
    }

    private updateNavigationButtons(): void {
        const prevButton = document.getElementById('prevButton') as HTMLButtonElement;
        const nextButton = document.getElementById('nextButton') as HTMLButtonElement;
        const finishButton = document.getElementById('finishButton') as HTMLButtonElement;

        if (!prevButton || !nextButton || !finishButton) return;

        // Botão anterior
        prevButton.disabled = this.currentQuestion === 0;

        // Botão próxima/finalizar
        const hasAnswer = this.answers.some(answer => answer.questionId === this.questions[this.currentQuestion].id);
        
        if (this.currentQuestion === this.questions.length - 1) {
            nextButton.style.display = 'none';
            finishButton.style.display = 'inline-block';
            finishButton.disabled = !hasAnswer;
        } else {
            nextButton.style.display = 'inline-block';
            finishButton.style.display = 'none';
            nextButton.disabled = !hasAnswer;
        }
    }

    public selectOption(optionId: string): void {
        const question = this.questions[this.currentQuestion];
        const option = question.options.find(opt => opt.id === optionId);
        
        if (!option) return;

        // Remover seleção anterior
        document.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
        
        // Adicionar nova seleção
        const selectedElement = document.querySelector(`[data-option-id="${optionId}"]`);
        if (selectedElement) {
            selectedElement.classList.add('selected');
        }

        // Salvar resposta
        const existingAnswerIndex = this.answers.findIndex(answer => answer.questionId === question.id);
        const answer: QuestionnaireAnswer = {
            questionId: question.id,
            optionId: optionId,
            score: option.score
        };

        if (existingAnswerIndex >= 0) {
            this.answers[existingAnswerIndex] = answer;
        } else {
            this.answers.push(answer);
        }

        // Atualizar botões
        this.updateNavigationButtons();
    }

    public nextQuestion(): void {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.loadQuestion();
        }
    }

    public previousQuestion(): void {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.loadQuestion();
        }
    }

    public finishQuestionnaire(): void {
        if (this.answers.length !== this.questions.length) {
            alert('Por favor, responda todas as perguntas antes de finalizar.');
            return;
        }

        this.calculateProfile();
        this.showResults();
    }

    private calculateProfile(): InvestorProfile {
        const totalScore = this.answers.reduce((sum, answer) => sum + answer.score, 0);
        const averageScore = totalScore / this.answers.length;

        let profile: InvestorProfile;

        if (averageScore < 35) {
            profile = {
                type: 'Conservador',
                score: averageScore,
                description: 'Prioriza segurança e preservação do capital',
                icon: '🛡️'
            };
        } else if (averageScore < 65) {
            profile = {
                type: 'Moderado',
                score: averageScore,
                description: 'Busca equilíbrio entre crescimento e segurança',
                icon: '⚖️'
            };
        } else {
            profile = {
                type: 'Agressivo',
                score: averageScore,
                description: 'Busca maximizar o crescimento do patrimônio',
                icon: '🚀'
            };
        }

        return profile;
    }

    private showResults(): void {
        const profile = this.calculateProfile();
        const allocation = this.allocationPresets[profile.type];
        const rationale = this.rationales[profile.type];

        this.suggestedAllocation = [...allocation];
        this.currentAllocation = [...allocation];

        // Esconder questionário e mostrar resultados
        const questionnaireSection = document.getElementById('questionnaireSection');
        const resultsSection = document.getElementById('resultsSection');

        if (questionnaireSection && resultsSection) {
            questionnaireSection.style.display = 'none';
            resultsSection.style.display = 'block';
        }

        // Atualizar informações do perfil
        this.updateProfileInfo(profile);
        
        // Atualizar alocação
        this.updateAllocationDetails(allocation);
        
        // Atualizar justificativa
        this.updateRationale(rationale);
        
        // Criar gráfico
        this.createAllocationChart(allocation);
        
        // Criar sliders
        this.createAllocationSliders(allocation);
    }

    private updateProfileInfo(profile: InvestorProfile): void {
        const profileIcon = document.getElementById('profileIcon');
        const profileName = document.getElementById('profileName');
        const profileDescription = document.getElementById('profileDescription');

        if (profileIcon) profileIcon.textContent = profile.icon;
        if (profileName) profileName.textContent = profile.type;
        if (profileDescription) profileDescription.textContent = profile.description;
    }

    private updateAllocationDetails(allocation: AssetAllocation[]): void {
        const container = document.getElementById('allocationDetails');
        if (!container) return;

        container.innerHTML = allocation.map(item => `
            <div class="allocation-item">
                <span class="allocation-class">${item.class}</span>
                <span class="allocation-percentage">${item.pct}%</span>
            </div>
        `).join('');
    }

    private updateRationale(rationale: string): void {
        const container = document.getElementById('rationaleContent');
        if (container) {
            container.textContent = rationale;
        }
    }

    private createAllocationChart(allocation: AssetAllocation[]): void {
        const ctx = document.getElementById('allocationChart') as HTMLCanvasElement;
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: allocation.map(item => item.class),
                datasets: [{
                    data: allocation.map(item => item.pct),
                    backgroundColor: allocation.map(item => item.color),
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                                const item = allocation[context.dataIndex];
                                return `${item.class}: ${item.pct}% - ${item.description}`;
                            }
                        }
                    }
                }
            }
        });
    }

    private createAllocationSliders(allocation: AssetAllocation[]): void {
        const container = document.getElementById('slidersContainer');
        if (!container) return;

        container.innerHTML = allocation.map((item, index) => `
            <div class="slider-group">
                <div class="slider-label">
                    <span class="slider-name">${item.class}</span>
                    <span class="slider-value" id="sliderValue${index}">${item.pct}%</span>
                </div>
                <input type="range" class="slider" id="slider${index}" 
                       min="0" max="100" value="${item.pct}" 
                       oninput="updateAllocation(${index}, this.value)">
            </div>
        `).join('');

        this.updateTotalValidation();
    }

    public updateAllocation(index: number, value: string): void {
        const newValue = parseInt(value);
        this.currentAllocation[index].pct = newValue;

        // Atualizar display do valor
        const valueElement = document.getElementById(`sliderValue${index}`);
        if (valueElement) {
            valueElement.textContent = `${newValue}%`;
        }

        // Atualizar gráfico
        this.updateChart();
        
        // Atualizar validação do total
        this.updateTotalValidation();
    }

    private updateChart(): void {
        if (!this.chart) return;

        this.chart.data.datasets[0].data = this.currentAllocation.map(item => item.pct);
        this.chart.update();
    }

    private updateTotalValidation(): void {
        const total = this.currentAllocation.reduce((sum, item) => sum + item.pct, 0);
        const totalElement = document.getElementById('totalPercentage');
        const messageElement = document.getElementById('validationMessage');

        if (totalElement && messageElement) {
            totalElement.textContent = `${total}%`;
            
            if (total === 100) {
                totalElement.className = 'total-percentage';
                messageElement.textContent = '✅ Alocação válida';
                messageElement.className = 'validation-message valid';
            } else {
                totalElement.className = 'total-percentage invalid';
                messageElement.textContent = `⚠️ Total deve ser 100% (diferença: ${100 - total}%)`;
                messageElement.className = 'validation-message invalid';
            }
        }
    }

    public resetToSuggested(): void {
        this.currentAllocation = [...this.suggestedAllocation];
        
        // Atualizar sliders
        this.currentAllocation.forEach((item, index) => {
            const slider = document.getElementById(`slider${index}`) as HTMLInputElement;
            const valueElement = document.getElementById(`sliderValue${index}`);
            
            if (slider) slider.value = item.pct.toString();
            if (valueElement) valueElement.textContent = `${item.pct}%`;
        });

        this.updateChart();
        this.updateTotalValidation();
    }

    public saveAllocation(): void {
        const total = this.currentAllocation.reduce((sum, item) => sum + item.pct, 0);
        
        if (total !== 100) {
            alert('A soma dos percentuais deve ser exatamente 100%.');
            return;
        }

        // Simular salvamento
        const allocationData = {
            profile: this.calculateProfile(),
            allocation: this.currentAllocation,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('savedAllocation', JSON.stringify(allocationData));
        
        alert('Alocação salva com sucesso!');
    }

    public restartQuestionnaire(): void {
        this.currentQuestion = 0;
        this.answers = [];
        
        const questionnaireSection = document.getElementById('questionnaireSection');
        const resultsSection = document.getElementById('resultsSection');

        if (questionnaireSection && resultsSection) {
            questionnaireSection.style.display = 'block';
            resultsSection.style.display = 'none';
        }

        this.loadQuestion();
    }

    public exportResults(): void {
        const profile = this.calculateProfile();
        const results = {
            profile: profile,
            allocation: this.currentAllocation,
            answers: this.answers,
            timestamp: new Date().toISOString()
        };

        const csvContent = this.generateCSV(results);
        this.downloadFile(csvContent, 'perfil-investidor.csv', 'text/csv');
    }

    private generateCSV(results: any): string {
        const headers = ['Perfil', 'Score', 'Classe de Ativo', 'Percentual', 'Descrição'];
        const rows = [
            [results.profile.type, results.profile.score.toFixed(1), '', '', ''],
            ...results.allocation.map((item: AssetAllocation) => ['', '', item.class, item.pct, item.description])
        ];
        
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    private downloadFile(content: string, filename: string, mimeType: string): void {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

// Funções globais para uso no HTML
let calculator: AssetAllocationCalculator;

function selectOption(optionId: string): void {
    calculator.selectOption(optionId);
}

function nextQuestion(): void {
    calculator.nextQuestion();
}

function previousQuestion(): void {
    calculator.previousQuestion();
}

function finishQuestionnaire(): void {
    calculator.finishQuestionnaire();
}

function updateAllocation(index: number, value: string): void {
    calculator.updateAllocation(index, value);
}

function resetToSuggested(): void {
    calculator.resetToSuggested();
}

function saveAllocation(): void {
    calculator.saveAllocation();
}

function restartQuestionnaire(): void {
    calculator.restartQuestionnaire();
}

function exportResults(): void {
    calculator.exportResults();
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    calculator = new AssetAllocationCalculator();
});

export default AssetAllocationCalculator;
