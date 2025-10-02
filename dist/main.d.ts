interface FinancialFunction {
    id: string;
    name: string;
    description: string;
    icon: string;
    action: () => void;
}
declare class HubFinanceiro {
    private functions;
    private isDarkMode;
    private themeToggle;
    private themeIcon;
    private themeText;
    constructor();
    private initializeTheme;
    private applyTheme;
    private setupThemeToggle;
    private toggleTheme;
    private updateThemeToggleUI;
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