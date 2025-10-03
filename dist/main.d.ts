interface FinancialFunction {
    id: string;
    name: string;
    description: string;
    icon: string;
    action: () => void;
}
declare class HubFinanceiro {
    private functions;
    constructor();
    private initializeTheme;
    private initializeAnimations;
    private initializeFunctions;
    private setupEventListeners;
    private executeFunction;
    private addHoverEffect;
    private removeHoverEffect;
    private showNotification;
    private addWelcomeMessage;
    private openRendaFixa;
    private openAlocacao;
    private openIndicadores;
    private openImpostosInvest;
    private openFundos;
    private openQuiz;
    private openEmprestimo;
    private openFinanciamento;
    private addPageTransitionEffect;
    private showComingSoon;
    private showTechnicalDetails;
}
declare const style: HTMLStyleElement;
//# sourceMappingURL=main.d.ts.map