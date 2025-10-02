// Simulador de Renda Fixa - Hub Financeiro
// Implementação completa com cálculos de IR, IOF e compounding
class RendaFixaSimulator {
    constructor() {
        this.chart = null;
        this.currentResult = null;
        this.initializeEventListeners();
        this.setupFormValidation();
    }
    initializeEventListeners() {
        const form = document.getElementById('rendaFixaForm');
        const exportCSV = document.getElementById('exportCSV');
        const exportPDF = document.getElementById('exportPDF');
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        exportCSV.addEventListener('click', () => this.exportToCSV());
        exportPDF.addEventListener('click', () => this.exportToPDF());
        // Auto-update when form changes
        form.addEventListener('input', () => this.debounce(() => this.handleFormChange(), 500));
    }
    setupFormValidation() {
        const form = document.getElementById('rendaFixaForm');
        const inputs = form.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateInput(input));
        });
    }
    validateInput(input) {
        const value = parseFloat(input.value);
        if (input.id === 'valor' && (isNaN(value) || value <= 0)) {
            this.showInputError(input, 'Valor deve ser maior que zero');
        }
        else if (input.id === 'prazo' && (isNaN(value) || value <= 0)) {
            this.showInputError(input, 'Prazo deve ser maior que zero');
        }
        else if (input.id === 'taxa' && (isNaN(value) || value < 0)) {
            this.showInputError(input, 'Taxa não pode ser negativa');
        }
        else if (input.id === 'inflacao' && (isNaN(value) || value < 0)) {
            this.showInputError(input, 'Inflação não pode ser negativa');
        }
        else {
            this.clearError(input);
        }
    }
    showInputError(input, message) {
        this.clearError(input);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 0.25rem;';
        input.parentNode?.appendChild(errorDiv);
        input.style.borderColor = '#e74c3c';
    }
    clearError(input) {
        const existingError = input.parentNode?.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        input.style.borderColor = '#e0e0e0';
    }
    handleFormSubmit(e) {
        e.preventDefault();
        const formData = this.getFormData();
        if (this.validateFormData(formData)) {
            this.simulate(formData);
        }
    }
    handleFormChange() {
        const formData = this.getFormData();
        if (this.validateFormData(formData)) {
            this.simulate(formData);
        }
    }
    getFormData() {
        const form = document.getElementById('rendaFixaForm');
        const formData = new FormData(form);
        return {
            valor: parseFloat(formData.get('valor')) || 0,
            prazo: parseInt(formData.get('prazo')) || 0,
            prazoTipo: formData.get('prazoTipo'),
            taxa: parseFloat(formData.get('taxa')) || 0,
            taxaTipo: formData.get('taxaTipo'),
            tipoAplicacao: formData.get('tipoAplicacao'),
            compounding: formData.get('compounding'),
            inflacao: parseFloat(formData.get('inflacao')) || 0,
            incidenciaIR: formData.get('incidenciaIR') === 'on',
            incidenciaIOF: formData.get('incidenciaIOF') === 'on',
            resgateAntecipado: formData.get('resgateAntecipado') === 'on'
        };
    }
    validateFormData(data) {
        return data.valor > 0 && data.prazo > 0 && data.taxa >= 0 && data.inflacao >= 0;
    }
    simulate(input) {
        try {
            this.showLoading();
            // Converter prazo para dias
            const prazoEmDias = this.converterPrazoParaDias(input.prazo, input.prazoTipo);
            // Converter taxa para taxa diária
            const taxaDiaria = this.converterTaxaParaDiaria(input.taxa, input.taxaTipo);
            // Calcular schedule
            const schedule = this.calcularSchedule(input, prazoEmDias, taxaDiaria);
            // Calcular totais
            const totals = this.calcularTotais(input, schedule);
            this.currentResult = { schedule, totals };
            this.displayResults(this.currentResult);
            this.createChart(this.currentResult);
        }
        catch (error) {
            console.error('Erro na simulação:', error);
            this.showGeneralError('Erro ao processar simulação. Verifique os dados inseridos.');
        }
        finally {
            this.hideLoading();
        }
    }
    converterPrazoParaDias(prazo, tipo) {
        switch (tipo) {
            case 'dias': return prazo;
            case 'meses': return prazo * 30;
            case 'anos': return prazo * 365;
            default: return prazo;
        }
    }
    converterTaxaParaDiaria(taxa, tipo) {
        switch (tipo) {
            case 'aa': return Math.pow(1 + taxa / 100, 1 / 365) - 1;
            case 'am': return Math.pow(1 + taxa / 100, 1 / 30) - 1;
            default: return taxa / 100;
        }
    }
    calcularSchedule(input, prazoEmDias, taxaDiaria) {
        const schedule = [];
        const dataInicial = new Date();
        const valorInicial = input.valor;
        // Determinar frequência de capitalização
        const frequencia = this.getFrequenciaCapitalizacao(input.compounding);
        for (let dia = 0; dia <= prazoEmDias; dia += frequencia) {
            const data = new Date(dataInicial);
            data.setDate(data.getDate() + dia);
            // Calcular saldo bruto
            const saldoBruto = this.calcularSaldoBruto(valorInicial, taxaDiaria, dia, input.compounding);
            // Calcular impostos
            const ir = this.calcularIR(saldoBruto, valorInicial, dia, input);
            const iof = this.calcularIOF(saldoBruto, valorInicial, dia, input);
            const saldoLiquido = saldoBruto - ir - iof;
            schedule.push({
                data: data.toLocaleDateString('pt-BR'),
                saldoBruto: Math.round(saldoBruto * 100) / 100,
                ir: Math.round(ir * 100) / 100,
                iof: Math.round(iof * 100) / 100,
                saldoLiquido: Math.round(saldoLiquido * 100) / 100
            });
        }
        return schedule;
    }
    getFrequenciaCapitalizacao(compounding) {
        switch (compounding) {
            case 'daily': return 1;
            case 'monthly': return 30;
            case 'yearly': return 365;
            default: return 30;
        }
    }
    calcularSaldoBruto(valorInicial, taxaDiaria, dias, compounding) {
        switch (compounding) {
            case 'daily':
                return valorInicial * Math.pow(1 + taxaDiaria, dias);
            case 'monthly':
                const meses = Math.floor(dias / 30);
                const diasRestantes = dias % 30;
                return valorInicial * Math.pow(1 + taxaDiaria * 30, meses) * Math.pow(1 + taxaDiaria, diasRestantes);
            case 'yearly':
                const anos = Math.floor(dias / 365);
                const diasRestantesAno = dias % 365;
                return valorInicial * Math.pow(1 + taxaDiaria * 365, anos) * Math.pow(1 + taxaDiaria, diasRestantesAno);
            default:
                return valorInicial * Math.pow(1 + taxaDiaria, dias);
        }
    }
    calcularIR(saldoBruto, valorInicial, dias, input) {
        if (!input.incidenciaIR)
            return 0;
        // LCI/LCA são isentas de IR
        if (input.tipoAplicacao === 'LCI' || input.tipoAplicacao === 'LCA')
            return 0;
        const ganho = saldoBruto - valorInicial;
        if (ganho <= 0)
            return 0;
        // Tabela regressiva de IR
        const aliquotaIR = this.getAliquotaIR(dias);
        return ganho * aliquotaIR;
    }
    getAliquotaIR(dias) {
        if (dias <= 180)
            return 0.225; // 22,5%
        if (dias <= 360)
            return 0.20; // 20%
        if (dias <= 720)
            return 0.175; // 17,5%
        return 0.15; // 15%
    }
    calcularIOF(saldoBruto, valorInicial, dias, input) {
        if (!input.incidenciaIOF || dias > 30)
            return 0;
        const ganho = saldoBruto - valorInicial;
        if (ganho <= 0)
            return 0;
        // Tabela regressiva de IOF
        const aliquotaIOF = this.getAliquotaIOF(dias);
        return ganho * aliquotaIOF;
    }
    getAliquotaIOF(dias) {
        if (dias <= 1)
            return 0.96; // 96%
        if (dias <= 2)
            return 0.93; // 93%
        if (dias <= 3)
            return 0.90; // 90%
        if (dias <= 4)
            return 0.86; // 86%
        if (dias <= 5)
            return 0.83; // 83%
        if (dias <= 6)
            return 0.80; // 80%
        if (dias <= 7)
            return 0.76; // 76%
        if (dias <= 8)
            return 0.73; // 73%
        if (dias <= 9)
            return 0.70; // 70%
        if (dias <= 10)
            return 0.66; // 66%
        if (dias <= 11)
            return 0.63; // 63%
        if (dias <= 12)
            return 0.60; // 60%
        if (dias <= 13)
            return 0.56; // 56%
        if (dias <= 14)
            return 0.53; // 53%
        if (dias <= 15)
            return 0.50; // 50%
        if (dias <= 16)
            return 0.46; // 46%
        if (dias <= 17)
            return 0.43; // 43%
        if (dias <= 18)
            return 0.40; // 40%
        if (dias <= 19)
            return 0.36; // 36%
        if (dias <= 20)
            return 0.33; // 33%
        if (dias <= 21)
            return 0.30; // 30%
        if (dias <= 22)
            return 0.26; // 26%
        if (dias <= 23)
            return 0.23; // 23%
        if (dias <= 24)
            return 0.20; // 20%
        if (dias <= 25)
            return 0.16; // 16%
        if (dias <= 26)
            return 0.13; // 13%
        if (dias <= 27)
            return 0.10; // 10%
        if (dias <= 28)
            return 0.06; // 6%
        if (dias <= 29)
            return 0.03; // 3%
        return 0; // 0% após 30 dias
    }
    calcularTotais(input, schedule) {
        const ultimoItem = schedule[schedule.length - 1];
        const bruto = ultimoItem.saldoBruto;
        const impostoTotal = ultimoItem.ir + ultimoItem.iof;
        const liquido = ultimoItem.saldoLiquido;
        // Calcular rendimento real
        const rendimentoNominal = (liquido - input.valor) / input.valor;
        const rendimentoReal = ((1 + rendimentoNominal) / (1 + input.inflacao / 100)) - 1;
        return {
            bruto: Math.round(bruto * 100) / 100,
            impostoTotal: Math.round(impostoTotal * 100) / 100,
            liquido: Math.round(liquido * 100) / 100,
            rendimentoReal: Math.round(rendimentoReal * 10000) / 100 // Em percentual
        };
    }
    displayResults(result) {
        // Mostrar seção de resultados
        const resultsSection = document.getElementById('resultsSection');
        resultsSection.style.display = 'block';
        // Atualizar cards de resumo
        document.getElementById('valorBruto').textContent = this.formatCurrency(result.totals.bruto);
        document.getElementById('totalImpostos').textContent = this.formatCurrency(result.totals.impostoTotal);
        document.getElementById('valorLiquido').textContent = this.formatCurrency(result.totals.liquido);
        document.getElementById('rendimentoReal').textContent = `${result.totals.rendimentoReal.toFixed(2)}%`;
        // Atualizar tabela
        this.updateTable(result.schedule);
    }
    updateTable(schedule) {
        const tbody = document.getElementById('fluxoTableBody');
        tbody.innerHTML = '';
        // Mostrar apenas alguns pontos para não sobrecarregar a tabela
        const step = Math.max(1, Math.floor(schedule.length / 20));
        schedule.forEach((item, index) => {
            if (index % step === 0 || index === schedule.length - 1) {
                const row = tbody.insertRow();
                row.innerHTML = `
                    <td>${item.data}</td>
                    <td>${this.formatCurrency(item.saldoBruto)}</td>
                    <td>${this.formatCurrency(item.ir)}</td>
                    <td>${this.formatCurrency(item.iof)}</td>
                    <td>${this.formatCurrency(item.saldoLiquido)}</td>
                `;
            }
        });
    }
    createChart(result) {
        const ctx = document.getElementById('investmentChart');
        if (this.chart) {
            this.chart.destroy();
        }
        const labels = result.schedule.map(item => item.data);
        const saldoBrutoData = result.schedule.map(item => item.saldoBruto);
        const saldoLiquidoData = result.schedule.map(item => item.saldoLiquido);
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Saldo Bruto',
                        data: saldoBrutoData,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        tension: 0.4
                    },
                    {
                        label: 'Saldo Líquido',
                        data: saldoLiquidoData,
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: 'Evolução do Investimento'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        ticks: {
                            callback: function (value) {
                                return 'R$ ' + value.toLocaleString('pt-BR');
                            }
                        }
                    }
                }
            }
        });
    }
    exportToCSV() {
        if (!this.currentResult)
            return;
        const csvContent = this.generateCSV(this.currentResult);
        this.downloadFile(csvContent, 'simulacao-renda-fixa.csv', 'text/csv');
    }
    exportToPDF() {
        if (!this.currentResult)
            return;
        // Implementação básica de PDF (em produção, usar biblioteca como jsPDF)
        const pdfContent = this.generatePDF(this.currentResult);
        this.downloadFile(pdfContent, 'simulacao-renda-fixa.pdf', 'application/pdf');
    }
    generateCSV(result) {
        const headers = ['Data', 'Saldo Bruto', 'IR', 'IOF', 'Saldo Líquido'];
        const rows = result.schedule.map(item => [
            item.data,
            item.saldoBruto.toFixed(2),
            item.ir.toFixed(2),
            item.iof.toFixed(2),
            item.saldoLiquido.toFixed(2)
        ]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
    generatePDF(result) {
        // Implementação básica - em produção usar jsPDF
        return `Relatório de Simulação de Renda Fixa\n\n` +
            `Valor Bruto: ${this.formatCurrency(result.totals.bruto)}\n` +
            `Total de Impostos: ${this.formatCurrency(result.totals.impostoTotal)}\n` +
            `Valor Líquido: ${this.formatCurrency(result.totals.liquido)}\n` +
            `Rendimento Real: ${result.totals.rendimentoReal.toFixed(2)}%\n\n` +
            `Gerado em: ${new Date().toLocaleString('pt-BR')}`;
    }
    downloadFile(content, filename, mimeType) {
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
    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    showLoading() {
        const button = document.querySelector('.simulate-button');
        button.classList.add('loading');
        button.textContent = 'Calculando...';
    }
    hideLoading() {
        const button = document.querySelector('.simulate-button');
        button.classList.remove('loading');
        button.textContent = '🧮 Simular Investimento';
    }
    showGeneralError(message) {
        // Implementar notificação de erro
        console.error(message);
    }
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new RendaFixaSimulator();
});
export default RendaFixaSimulator;
//# sourceMappingURL=renda-fixa.js.map